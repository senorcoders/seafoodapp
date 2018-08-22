import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;
@Component({
  selector: 'app-archive-products',
  templateUrl: './archive-products.component.html',
  styleUrls: ['./archive-products.component.scss']
})
export class ArchiveProductsComponent implements OnInit {
  category:string;
  products:any;
  API:string="https://apiseafood.senorcoders.com";
  prvPage =0;
  showPrvP:boolean= false;
  showNextP:boolean=false;
  showNotFound=false;
  store:any=[];
  image:SafeStyle=[];
  constructor(private route: ActivatedRoute, private product:ProductService, private toast:ToastrService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category= this.route.snapshot.params['category'];
      this.product.getProdutsByCategory(this.category,0).subscribe(
      result=>{
        this.products=result;
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
        this.nextProductsExist()
      },
      error=>{
        this.showError(error.error);
        console.log(error)
      }
    )
    });
    jQuery(document).ready(function(){
      jQuery([document.documentElement, document.body]).animate({
        scrollTop: jQuery('#search-title').offset().top
      }, 1000);
      jQuery('.fish-type-menu .nav-link').click(function(e){
        jQuery('html, body').animate({
          scrollTop: jQuery("#search-title").offset().top
        }, 2000);
      
      })
    })
  }
 showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  nextProductsExist(){
    if(this.products.length>=12){
      this.showNextP=true;
    }
    else{
      this.showNextP=false;
    }
  }
  previousProductExist(){
    if(this.prvPage>0){
      this.showPrvP=true;
    }
    else{
      this.showPrvP=false
    }
  }
  nextPage(){
    this.prvPage=this.prvPage+1;
    this.product.getProdutsByCategory(this.category, this.prvPage).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist();
        this.previousProductExist()
      },
      error=>{
        console.log(error)
      }
    )
  }
previousPage(){
    this.prvPage=this.prvPage-1;
    this.product.getProdutsByCategory(this.category, this.prvPage).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist()
        this.previousProductExist();
      },
      error=>{
        console.log(error)
      }
    )
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
