import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
	products:any;
	showLoading:boolean=true;
	prvPage =0;
  prvPageS=1;
	showPrvP:boolean= false;
	showNextP:boolean=false;
  showPrvPS:boolean= false;
  showNextPS:boolean=false;
	showNotFound=false;
	image:SafeStyle=[];
	searchForm:FormGroup;
  searchPage=1;
  query;
	API:string="https://apiseafood.senorcoders.com";
  constructor(private productService:ProductService, private toast:ToastrService, private sanitizer: DomSanitizer, private fb:FormBuilder) { }

  ngOnInit() {
  	this.getProducts(12,0)
  	this.searchForm=this.fb.group({
  		search:['',Validators.required]
  	})
  }
  getProducts(cant,page){
  	let data={
  		pageNumber:page,
  		numberProduct: cant
  	}
  	this.productService.listProduct(data).subscribe(
  		result=>{
  			this.products=result;
  			this.showLoading=false;
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
	        this.nextProductsExist(1)
  		},
  		e=>{
  			this.showLoading=true;
  			this.showError('Something wrong happened, Please Reload the Page')
  			console.log(e)
  		}
  	)
  }
  nextProductsExist(val){
    //if it's the pagination is for all product
    if(val==1){
      if(this.products.length>=12){
        this.showNextP=true;
      }
      else{
        this.showNextP=false;
      }
    }
    //if pagination is for the search
    else{
      if(this.products.length>=12){
        this.showNextPS=true;
      }
      else{
        this.showNextPS=false;
      }
    }
  }
  previousProductExist(val){
    //if it's the pagination is for all product
    if(val==1){
      if(this.prvPage>0){
        this.showPrvP=true;
      }
      else{
        this.showPrvP=false
      }
    }
    //if pagination is for the search
    else{
      if(this.prvPageS>1){
        this.showPrvPS=true;
      }
      else{
        this.showPrvPS=false
      }
    }
  }
  nextPage(){
    this.prvPage=this.prvPage+1;
    this.showLoading=true;
    let data={
  		pageNumber:this.prvPage,
  		numberProduct: 12
  	}
    this.productService.listProduct(data).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist(1);
        this.previousProductExist(1)
        this.showLoading=false
      },
      error=>{
        console.log(error)
      }
    )
  }
previousPage(){
    this.prvPage=this.prvPage-1;
    this.showLoading=true;
    let data={
  		pageNumber:this.prvPage,
  		numberProduct: 12
  	}
    this.productService.listProduct(data).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist(1)
        this.previousProductExist(1);
        this.showLoading=false;
      },
      error=>{
        console.log(error)
      }
    )
}
nextPageSearch(){
    this.prvPageS=this.prvPageS+1;
    this.showLoading=true;
    this.productService.searchProductByName(this.query,this.prvPageS).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist(2);
        this.previousProductExist(2)
        this.showLoading=false
      },
      error=>{
        console.log(error)
      }
    )
  }
previousPageSearch(){
    this.prvPageS=this.prvPageS-1;
    this.showLoading=true;
    this.productService.searchProductByName(this.query,this.prvPageS).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist(2)
        this.previousProductExist(2);
        this.showLoading=false;
      },
      error=>{
        console.log(error)
      }
    )
}
deleteProduct(id, index){
  this.productService.deleteData('api/fish/'+id).subscribe(result =>{
    this.deleteNode(index);
    this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}
searchProducts(query,number){
  this.showNextP=false;
  this.showPrvP=false;
	this.showLoading=true;
  this.query=query;
	this.products=[];
  if(this.searchPage>1){
    this.searchPage++;
  }
	this.productService.searchProductByName(query,this.searchPage).subscribe(
      result=>{
        this.searchPage+=1;
        this.products=result;
        this.showLoading=false;
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
        this.nextProductsExist(2)
        this.previousProductExist(2);
      },
      error=>{
        console.log(error)
      }
    )
}
deleteNode(i){
  this.products.splice(i, 1);
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
   showSuccess(e){
    this.toast.success(e,'Well Done',{positionClass:"toast-top-right"})
  }
   showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
}
