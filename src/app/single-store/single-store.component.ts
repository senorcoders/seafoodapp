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
  userID:any;
  storeEndpoint:any = "api/store/user/";
  store:any = {
    name:"",
    description: "",
    location: "",
  };  
  hero:any;
  logo:any;
  base:string="http://138.68.19.227:7000";
  products:any = [];
  empty:boolean = false;
  form:any = {
    name: '',
    email: '',
    message: ''
  }
  formEndpoint:any = 'api/contact-form/';



  constructor(private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService) { }

  ngOnInit() {
    this.userID= this.route.snapshot.params['id'];
    this.getPersonalData();
  }

  getPersonalData(){
    this.getStoreData();
  }

  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.userID).subscribe(result =>{
      let res:any = result;
      if(typeof res !== 'undefined' && res.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        console.log(this.store);
        this.getProducts();

       
      }else{
        console.log("No tiene storre");
        this.empty = true;
      }
     

    })
  }

  getProducts(){
    this.productService.getData('store/' + this.store.id).subscribe(result => {
      console.log("Res", result);
      this.products = result['fish'];
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
