import { Component, OnInit } from '@angular/core';
import {ProductService} from'../services/product.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../core/cart/cart.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
import { environment } from '../../environments/environment';
import {IsLoginService} from '../core/login/is-login.service';
import { TitleService } from '../title.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:any=[];
  API:string=environment.apiURLImg;
  role:any;
  showLoading:boolean=true;
  featuredSellers:any;
  showError:boolean=false;
  error:string;
  logos=[];
  featuredProducts:any;
  images=[];
  featuredTypesImages=[];
  loadProduct:boolean=true;
  featuredtypes:any;
  fishTypeMenu:any;
  fishTypeMenuImages=[];
  fishTypeMenuImagesChild=[];
  isLoggedIn:boolean = false;
  constructor(private isLoggedSr: IsLoginService, private product:ProductService, 
    private auth: AuthenticationService, private sanitizer:DomSanitizer, 
    private cart:CartService,private router:Router,
    private titleS: TitleService) {
      this.titleS.setTitle('Seafoodsouq');

  }

  
  ngOnInit() {

    this.getLoginStatus();
  //  this.getFeaturedSeller();
  //  this.getFeaturedProducts();
  //  this.getFeaturedTypes();
  //  this.getFishTypeMenu();
   this.isLoggedSr.role.subscribe((role:number)=>{
      this.role=role
    })
  }

  getLoginStatus(){
   let login = this.auth.getLoginData();
   if(login != null){
     this.isLoggedIn = true;
   }
  }
  getFeaturedProducts(){ 
    this.product.getData('featuredproducts').subscribe(
      result=>{
        this.featuredProducts=result;
        this.getImages();
      },
      error=>{
        console.log(error);
        this.showError=true;
        this.error="No Product found"
      }
    )
  }
  getFeaturedSeller(){
    this.product.getData('featuredseller').subscribe(
      result=>{
        this.featuredSellers=result;
        this.getLogos();
      },
      error=>{
        console.log(error);
        this.showError=true;
        this.error="No Seller found"
      }
    )
  }
  getImages(){
    let val=this.featuredProducts.length;
    this.featuredProducts.forEach((data, index)=>{
      this.product.getProductDetail(data.id).subscribe(result => {
        this.products[index]=result;
        if(result['imagePrimary'] && result['imagePrimary']!=''){
          this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${result['imagePrimary']})`)
        }
        else if(result['images'] && result['images'].length>0){
          this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${result['images'][0].src})`)
        }
        else{
          this.images[index]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default-img-product.jpg)")
        }
        if (val-1==index) {
          this.loadProduct=false
        }
      },error=>{
        console.log(error)
      })
    })
  }
  getShortDesc(data){  
    if(data.length>20){
        let text=data.split(/\s+/).slice(0,20).join(" ")
        return text+'...' 
    }
    else{
      return data
    }
  }
  getLogos(){
    this.featuredSellers.forEach((data, index)=>{
      this.product.getData('store/'+data.id).subscribe(
        result=>{
          if(result['logo'] && result['logo']!=''){
            this.logos[index]=this.API+result['logo'];
          }
          else{
            this.logos[index]="../../assets/seafood-souq-seller-logo-default.png";
          }
        },
        error=>{
          console.log(error)
        }
      )
    })
  }
  getFishTypeMenu(){
    // this.product.getData('featuredtypes-menu').subscribe(
    //   result=>{
    //     this.fishTypeMenu=result['featureds'];
    //     this.fishTypeMenu.forEach((data,index)=>{
    //       // if(data.childsTypes.length>0){
    //       //   let j=this.fishTypeMenuImagesChild.length;
    //       //   data.childsTypes.forEach((child, i)=>{
    //       //     //console.log(child.child.images[0].src)
    //       //     if(child.child.images && child.child.images.length>0){
    //       //       this.fishTypeMenuImagesChild[j]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${child.child.images[0].src})`)
    //       //     }
    //       //     else{
    //       //       this.fishTypeMenuImagesChild[j]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default.jpg)")
    //       //     }
    //       //     j++;
    //       //     //console.log(this.fishTypeMenuImagesChild[i])
    //       //   })
    //       // }
    //       //else{
    //         if(data.images && data.images.length>0){
    //           this.fishTypeMenuImages[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
    //         }
    //         else{
    //           this.fishTypeMenuImages[index]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/Logo-1.png)")
    //         }
    //       //}
    //     })
    //   },
    //   e=>{
    //    console.log(e)
    //   }
    // )
  }
  getFeaturedTypes(){
    this.product.getData('featuredtypes/').subscribe(
      result=>{
        console.log("res", result);
        if(result.hasOwnProperty('featureds')){
          this.featuredtypes=result['featureds'];
          this.featuredtypes.forEach((data, index)=>{
            if(data.images && data.images.length>0){
              this.featuredTypesImages[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
            }
            else{
              this.featuredTypesImages[index]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default.jpg)")
            }
          })
          jQuery(document).ready(function(){
            jQuery('#featuredtype2').appendTo('#featured1')
          jQuery('#featured2').remove();
          })
        }
        
      },
      error=>{
        console.log(error)
      }
    )
  }
  register(page){
    this.router.navigate(['/register'],{ queryParams: { register: page } })
  }
}
