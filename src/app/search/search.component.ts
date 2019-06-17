import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ToastrService } from '../toast.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  products:any;
  searchQuery:string;
  API:string=environment.apiURLImg;
  showNotFound=false;
  image:SafeStyle=[];
  showNextP:boolean=false;
  showPrvP:boolean=false;
  page:number;
  pageNumbers:any;
  paginationNumbers:any=[];
  constructor(private route: ActivatedRoute,private product: ProductService, private fb:FormBuilder, private toast:ToastrService, private sanitizer: DomSanitizer, private router:Router) { }
 ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchQuery= this.route.snapshot.params['search'];
      this.page= this.route.snapshot.params['page'];
      this.searchProducts(this.searchQuery);
      jQuery(document).ready(function(){
        jQuery([document.documentElement, document.body]).animate({
          scrollTop: jQuery('#search-title').offset().top
        }, 1000);
      })
    })
  }
  searchProducts(query){
    this.searchQuery=query;
    this.product.searchProductByName(query,this.page).subscribe(
      result=>{
        this.products=result['fish'];
        this.pageNumbers=parseInt(result['pagesCount']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
        //working on the images to use like background
         this.products.forEach((data, index)=>{
            if (data.imagePrimary && data.imagePrimary !='') {
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
            }
            else if(data.images && data.images.length>0){
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
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
        console.log(error)
      }
    )
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
    this.router.navigate([`/search/${this.searchQuery}/${this.page}`]);
  }
  goTo(page){
    this.paginationNumbers=[];
    this.router.navigate([`/search/${this.searchQuery}/${page}`]);
  }
  previousPage(){
    this.paginationNumbers=[];
    if(this.page>1){
      this.page--;
      this.router.navigate([`/search/${this.searchQuery}/${this.page}`]);
    }
    else{
      this.router.navigate([`/search/${this.searchQuery}/${this.page}`]);
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
}
