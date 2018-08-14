import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  products:any;
  searchQuery:string;
  API:string="https://apiseafood.senorcoders.com";
  showNotFound=false;
  image:SafeStyle=[];
  constructor(private route: ActivatedRoute,private product: ProductService, private fb:FormBuilder, private toast:ToastrService, private sanitizer: DomSanitizer) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.searchQuery= this.route.snapshot.params['search'];
      this.searchProducts(this.searchQuery);
    })
    jQuery(document).ready(function(){
      jQuery([document.documentElement, document.body]).animate({
        scrollTop: jQuery('#search-title').offset().top
      }, 1000);
    })
  }
  searchProducts(query){
    this.searchQuery=query;
    this.product.searchProductByName(query).subscribe(
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
      },
      error=>{
        console.log(error)
      }
    )
  }
   showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
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
