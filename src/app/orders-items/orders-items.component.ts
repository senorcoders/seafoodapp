import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-orders-items',
  templateUrl: './orders-items.component.html',
  styleUrls: ['./orders-items.component.scss']
})
export class OrdersItemsComponent implements OnInit {
	shoppingCartId:any;
	products:any;
	showLoading:boolean=true;
	showData:boolean=false;
	images=[];
	API="http://138.68.19.227:7000";
  reviewForm:FormGroup;
  showForm:boolean=false;
  user:any;
  Stars=[];
  count:number=0;
  constructor(private productService:ProductService, private router:ActivatedRoute,private auth:AuthenticationService,
    private fb:FormBuilder, private toast: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
  	this.router.params.subscribe(params => {
      this.shoppingCartId= this.router.snapshot.params['id'];
      this.getItems();
    })
    this.user=this.auth.getLoginData();
  }
  getItems(){
    this.productService.getData(`api/items/${this.shoppingCartId}`).subscribe(
    	result => {
    		this.products=result;
    		this.showLoading=false;
    		this.showData=true
    		this.getImages();
      		console.log(result)
    	},
    	e=>{console.log(e)}
    )
  }
  getImages(){
  	this.products.forEach((data, index)=>{
  		if(data.fish.imagePrimary && data.fish.imagePrimary!=''){
  			 this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.imagePrimary})`)
  		}
  		else if(data.fish.images && data.fish.images!=''){
  			this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.images[0].src})`)
  		}
  		else{
  			this.images[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
  		}
  	})
  }
  ShowReviewForm(store){
    this.showForm=true;
    for(let i=0; i<=4; i++){
      this.Stars[i]=i+1;
    }
    this.reviewForm=this.fb.group({
      buyer:[this.user.id],
      store:[store],
      comment:['', Validators.required],
      status:["pending"],
      stars:[this.count]
    })
  }
  sendReview(){
    this.productService.saveData('reviewsstore',this.reviewForm.value).subscribe(
      result=>{
        this.toast.success('Your comment will be check by the admin','Well Done',{positionClass:"toast-top-right"})
        this.reviewForm.reset();
        this.count=0;
        this.closeForm()
      },
      e=>{
        console.log(e)
        this.toast.error('Something wrong happened, Please try again','Error',{positionClass:"toast-top-right"})
      }
    )
  }
  closeForm(){
    this.showForm=false
  }
  getstar(i){
    this.count=i;
    this.reviewForm.get('stars').setValue(this.count)
  }
}
