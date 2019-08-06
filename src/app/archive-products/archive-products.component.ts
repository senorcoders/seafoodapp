import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../services/product.service';
import { ToastrService } from '../toast.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-archive-products',
  templateUrl: './archive-products.component.html',
  styleUrls: ['./archive-products.component.scss']
})
export class ArchiveProductsComponent implements OnInit {
  category:string;
  products:any;
  API:string=environment.apiURLImg;
  showPrvP:boolean= false;
  showNextP:boolean=false;
  showNotFound=false;
  store:any=[];
  image:SafeStyle=[];
  page:any;
  pageNumbers:any;
  paginationNumbers:any=[];
  categoryImage:any;
  constructor(private route: ActivatedRoute, private product:ProductService, private toast:ToastrService, private sanitizer: DomSanitizer, private router:Router) { }
 ngOnInit() {
    this.route.params.subscribe(params => {
      this.category= this.route.snapshot.params['category'];
      this.page= this.route.snapshot.params['page'];
      this.getCatBanner();
      jQuery(document).ready(function(){
        jQuery([document.documentElement, document.body]).animate({
          scrollTop: jQuery('#search-title').offset().top
        }, 1000);
      });
      this.product.getProdutsByCategory(this.category,this.page).subscribe(
      result=>{
        this.products=result['fish'];
        this.pageNumbers=parseInt(result['pagesNumber']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
        //working on the images to use like background
         this.products.forEach((data, index)=>{
            if (data.imagePrimary && data.imagePrimary !='') {
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
            }
            else if(data.images && data.images.length>0){
              let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${src})`)
            }
            else{
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
            }
         });
        if(this.products.length==0){
          this.showNotFound=true;
        }
        else{
          this.showNotFound=false;
        }
        this.nextProductsExist();
        this.previousProductExist();
      },
      error=>{
        this.showError(error.error);
        console.log(error)
      }
    )
    });
  }
 showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  nextProductsExist(){
    if(this.page<this.pageNumbers){
      this.showNextP=true;
    }else{
      this.showNextP=false;
    }
  }
  previousProductExist(){
    if(this.page>1){
      this.showPrvP=true;
    }else{
      this.showPrvP=false;
    }
  }
  nextPage(){
    this.paginationNumbers=[];
    this.page++;
    this.router.navigate([`/fish-type/${this.category}/${this.page}`]);
  }
  goTo(page){
    this.paginationNumbers=[];
    this.router.navigate([`/fish-type/${this.category}/${page}`]);
  }
  previousPage(){
    this.paginationNumbers=[];
    if(this.page>1){
      this.page--;
      this.router.navigate([`/fish-type/${this.category}/${this.page}`]);
    }
    else{
      this.router.navigate([`/fish-type/${this.category}/${this.page}`]);
    }
  }
 smallDesc(str) {
     if(str.length>20){
        let text=str.split(/\s+/).slice(0,20).join(" ")
        return text+'...' 
    }
    else{
      return str
    }
  }


  getCatBanner(){
    this.product.getData(`fishtype?where=%7B"name":"${this.category}"%7D`).subscribe(result =>{
      //console.log("category", result);
      if(result[0].images != null){
        let src = result['images'][0].src ? result['images'][0].src : result['images'][0];
        this.categoryImage = this.API + src;
      }else{
        this.categoryImage = "../../assets/search-bg.jpg";
      }
    })
  }
}
