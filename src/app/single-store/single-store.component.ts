import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-single-store',
  templateUrl: './single-store.component.html',
  styleUrls: ['./single-store.component.scss']
})
export class SingleStoreComponent implements OnInit {
  storeID:any;
  storeEndpoint:any = "store/";
  store:any = {
    name:"",
    description: "",
    location: "",
  };  
  hero:any;
  logo:any;
  base:string=environment.apiURLImg;
  products:any = [];
  empty:boolean = false;
  form:any = {
    name: '',
    email: '',
    message: ''
  }
  formEndpoint:any = 'api/contact-form/';
  userID:any;
  averageReview:any=0;
  comments:any;
  reviews:any;
  Stars=[];
  firstComments:any=[];
  showMore:boolean=false;
  showLess:boolean=false;
  productImage:any=[];
  constructor(private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.storeID= this.route.snapshot.params['id'];
    this.getPersonalData();
    this.getReview()
  }

  getPersonalData(){
    this.getStoreData();
  }
  getReview(){
    this.productService.getData(`reviewsstore?where={"store":"${this.storeID}"}`).subscribe(
      result=>{
        this.reviews=result;
        this.getFirstComments();
        this.calcStars();
      },
      e=>{
        console.log(e)
      }
    )
  }
  getFirstComments(){
    this.firstComments=[]
    this.reviews.forEach((data,index)=>{
      if(index<=2){
        this.firstComments[index]=data;
      }
    })
    if(this.reviews.length>3){
      this.showMore=true
      this.showLess=false
    }
    else{
      this.showMore=false
      this.showLess=false
    }
  }
  getAllComments(){
    this.showMore=false;
    this.showLess=true;
    this.firstComments=this.reviews
  }
  calcStars(){
    this.reviews.forEach((data)=>{
      this.averageReview+=data.stars
    })
    this.averageReview/=this.reviews.length
  }
  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.storeID).subscribe(result =>{
      if(result && result!=''){
        if(result['logo'] && result['logo']!=''){
          this.logo = this.base+result['logo'];
        }
        else{
          this.logo="../../assets/seafood-souq-seller-logo-default.png"
        }
        if(result['heroImage'] && result['heroImage']!=''){
          this.hero = this.base+result['heroImage'];
        }
        else{
          this.hero="../../assets/hero_slide.jpg";
        }
        this.store.name = result['name'];
        this.store.description = result['description'];
        this.store.location = result['location'];
        this.userID=result['owner']
        this.products=result['fishs'];
        this.products.forEach((data,index)=>{
          if(data.imagePrimary && data.imagePrimary !=''){
            this.productImage[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`)
          }
          else if(data.images && data.images.length>0){
              this.productImage[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.images[0].src})`)
          }
          else{
            this.productImage[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
          }
        })  
      }else{
        this.empty = true;
      }
    })
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

  sendMail(){
    if(this.form.name != '' && this.form.email != '' && this.form.message != ''){
      this.productService.saveData(this.formEndpoint + this.userID, this.form).subscribe(result => {
        this.toast.success("Submit successfully!",'Well Done',{positionClass:"toast-top-right"})

      }, error => {
        this.toast.error("Error sending email!", "Error",{positionClass:"toast-top-right"} );

      })
    }else{
      this.toast.error("All fields are required!", "Error",{positionClass:"toast-top-right"} );

    }
  }
   getDates(value){
      let date=new Date(value)
      let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months[date.getMonth()] +' '+date.getDate()+', '+date.getFullYear()
  }

}
