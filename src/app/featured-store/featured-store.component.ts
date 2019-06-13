import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from '../toast.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-featured-store',
  templateUrl: './featured-store.component.html',
  styleUrls: ['./featured-store.component.scss']
})
export class FeaturedStoreComponent implements OnInit {
  products:any;
  API:string=environment.apiURLImg;
  showNotFound=false;
  showLoading:boolean=true;
  image:SafeStyle=[];
  heroSlider:SafeStyle;
  owner:any;
  id:any;
  constructor(private route: ActivatedRoute,private product: ProductService, private toast:ToastrService, private sanitizer: DomSanitizer) {
	this.route.params.subscribe(params => {
	      this.id=(this.route.snapshot.params['id']);
	    })
    }

  ngOnInit() {
  	 this.product.getData('store/'+this.id).subscribe(
      result=>{
        this.products=result;
        console.log(this.products);
        this.owner=result['owner'];
        if(this.products.heroImage && this.products.heroImage!=''){
        	this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${this.products['heroImage']})`);
        }
        else{
        	this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(../../assets/hero_slide.jpg)`);
        }
        //working on the images to use like background
        this.products.fish.forEach((data, index)=>{
            if (data.imagePrimary && data.imagePrimary !='') {
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
            }
            else if(data.images && data.images.length>0){
              let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${src})`)
            }
            else{
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
            }
         });
        this.showLoading=false;
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
   return str.split(/\s+/).slice(0,20).join(" ");
  }
}
