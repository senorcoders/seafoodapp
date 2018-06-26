import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';

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
  base:string="https://apiseafood.senorcoders.com";
  products:any = [];
  empty:boolean = false;
  form:any = {
    name: '',
    email: '',
    message: ''
  }
  formEndpoint:any = 'api/contact-form/';
  userID:any;


  constructor(private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService) { }

  ngOnInit() {
    this.storeID= this.route.snapshot.params['id'];
    this.getPersonalData();
  }

  getPersonalData(){
    this.getStoreData();
  }

  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.storeID).subscribe(result =>{
      if(result && result!=''){
        if(result['logo'] && result['logo']!=''){
          this.logo = this.base+result['logo'];
        }
        else{
          this.logo="../../assets/seafood-souq-seller-logo-default.jpg"
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
        this.userID=result['owner'].id
        this.products=result['fish'];  
      }else{
        console.log("No tiene storre");
        this.empty = true;
      }
    })
  }
  smallDesc(str) {
    return str.split(/\s+/).slice(0,20).join(" ");
  }

  sendMail(){
    console.log(this.form);
    if(this.form.name != '' && this.form.email != '' && this.form.message != ''){
      this.productService.saveData(this.formEndpoint + this.userID, this.form).subscribe(result => {
          console.log(result);
          this.toast.success("Submit successfully!",'Well Done',{positionClass:"toast-top-right"})

      }, error => {
        this.toast.error("Error sending email!", "Error",{positionClass:"toast-top-right"} );

      })
    }else{
      this.toast.error("All fields are required!", "Error",{positionClass:"toast-top-right"} );

    }
  }

}
