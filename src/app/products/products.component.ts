import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
declare var jQuery:any;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
	products:any;
	showLoading:boolean=true;
	showPrvP:boolean= false;
	showNextP:boolean=false;
  showPrvPS:boolean= false;
  showNextPS:boolean=false;
	showNotFound=false;
	image:SafeStyle=[];
	searchForm:FormGroup;
  searchPage=1;
  search:any;
  page:any;
  paginationNumbers:any=[];
  pageNumbers:any;
	API:string=environment.apiURLImg;
  paginationSearch:boolean=false;
  constructor(private route: ActivatedRoute,private productService:ProductService, private toast:ToastrService, private sanitizer: DomSanitizer, private fb:FormBuilder, private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.page=this.route.snapshot.params['page'];
      this.search=params['query'];
      //if pagination is for all products
      if(this.search=='all'){
        this.paginationNumbers=[];
        this.paginationSearch=false;
        this.getProducts(12,this.page)
      }
      //if paginations if for the search value
      else{
        this.paginationSearch=true;
        this.Search(this.search, this.page);
      }
      jQuery(document).ready(function(){
        jQuery([document.documentElement, document.body]).animate({
          scrollTop: jQuery('#search').offset().top
        }, 1000);
      })
    });
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
  			this.products=result['productos'];
        //add paginations numbers
        this.pageNumbers=parseInt(result['pagesNumber']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
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
	        this.nextProductsExist(1);
          this.previousProductExist(1)
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
      if(this.page<this.pageNumbers){
        this.showNextP=true;
      }else{
        this.showNextP=false;
      }
    }
    //if pagination is for the search
    else{
      if(this.page<this.pageNumbers){
        this.showNextPS=true;
      }else{
        this.showNextPS=false;
      }
    }
  }
  previousProductExist(val){
    //if it's the pagination is for all product
    if(val==1){
      if(this.page>1){
        this.showPrvP=true;
      }else{
        this.showPrvP=false;
      }
    }
    //if pagination is for the search
    else{
      if(this.page>1){
        this.showPrvPS=true;
      }else{
        this.showPrvPS=false;
      }
    }
  }
   goTo(page,option){
    this.paginationNumbers=[];
    //go to number page if it for all products
    if(option==1){
      this.router.navigate([`/products/all/${page}`]);
    }
    //go to number page if it for the search
    else{
      this.router.navigate([`/products/${this.search}/${page}`]);
    }
  }
  nextPage(){
    this.paginationNumbers=[];
    this.page++;
    this.router.navigate([`/products/all/${this.page}`]);
  }
  previousPage(){
    this.paginationNumbers=[];
      if(this.page>1){
        this.page--;
        this.router.navigate([`/products/all/${this.page}`]);
      }
      else{
        this.router.navigate([`/products/all/${this.page}`]);
      }
  }
nextPageSearch(){
  this.paginationNumbers=[];
  this.page++;
  this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
previousPageSearch(){
  this.paginationNumbers=[];
  if(this.page>1){
    this.page--;
    this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
  else{
    this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
}
deleteProduct(id, index){
  this.productService.deleteData('api/fish/'+id).subscribe(result =>{
    this.deleteNode(index);
    this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}
Search(query, page){
this.productService.searchProductByName(query,page).subscribe(
  result=>{
        this.searchPage+=1;
        this.products=result['fish'];
        this.pageNumbers=parseInt(result['pagesCount']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
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
searchProducts(query){
  this.paginationNumbers=[];
  this.router.navigate([`/products/${query}/1`]);
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
