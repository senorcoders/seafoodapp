import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { FormGroup, FormControl, Form, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { AuthenticationService } from '../services/authentication.service';
import { CountriesService } from '../services/countries.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-reviewcart',
  templateUrl: './reviewcart.component.html',
  styleUrls: ['./reviewcart.component.scss']
})
export class ReviewcartComponent implements OnInit {
 
  shoppingCartId: any;
  checked:boolean = true;
  addressForm: FormGroup;
  sFirstName: FormControl;
  sLastName: FormControl;
  sCompany: FormControl;
  sAddress: FormControl;
  sCity: FormControl;
  sCountry: FormControl; 
  bFirstName: FormControl;
  bLastName: FormControl;
  bCompany: FormControl;
  bAddress: FormControl;
  bCity: FormControl;
  bCountry: FormControl;
  info: any;
  countries:any = [];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private toast:ToastrService,
    private auth: AuthenticationService,
    private countryService: CountriesService,
    private httpH: ProductService
  ) { }

 async ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
    });
    this.getPersonalData();
    this.createFormControls();
    this.RegisterAddressForm();
    await this.getCountries();
    this.setValues();

  }

  getPersonalData() {
    this.info = this.auth.getLoginData();
    console.log("Info", this.info);
  }

  async getCountries() {
    await new Promise((resolve, reject) => {
      this.countryService.getCountries().subscribe(
        result => {
          console.log("Countries", result);
          this.countries = result;
          resolve();
        },
        error => {
          console.log(error);
          reject();
        }
      );
    })
  }
  createFormControls(){ 
    this.sFirstName = new FormControl('', [Validators.required]); 
    this.sLastName = new FormControl('', [Validators.required]); 
    this.sCompany = new FormControl('', [Validators.required]); 
    this.sAddress = new FormControl('', [Validators.required]); 
    this.sCity = new FormControl('', [Validators.required]); 
    this.sCountry = new FormControl('', [Validators.required]); 
    this.bFirstName = new FormControl('', [Validators.required]); 
    this.bLastName = new FormControl('', [Validators.required]); 
    this.bCompany = new FormControl('', [Validators.required]); 
    this.bAddress = new FormControl('', [Validators.required]); 
    this.bCity = new FormControl('', [Validators.required]); 
    this.bCountry = new FormControl('', [Validators.required]); 

  }


   //Initializar for group for first step wizard form
   RegisterAddressForm(){
    this.addressForm = new FormGroup({
      sFirstName:this.sFirstName,
      sLastName:this.sLastName,
      sCompany:this.sCompany,
      sAddress:this.sAddress,
      sCity:this.sCity,
      sCountry:this.sCountry,
      bFirstName:this.bFirstName,
      bLastName:this.bLastName,
      bCompany:this.bCompany,
      bAddress:this.bAddress,
      bCity:this.sCity,
      bCountry:this.sCountry
      

    },{
      updateOn: 'submit'
    });
  }

  setValues(){
    this.addressForm.controls['sFirstName'].setValue(this.info.firstName);
    this.addressForm.controls['sLastName'].setValue(this.info.lastName);
    this.addressForm.controls['sCompany'].setValue(this.info.dataExtra['companyName']);
    this.addressForm.controls['sAddress'].setValue(this.info.dataExtra['Address']);
    this.addressForm.controls['sCity'].setValue(this.info.dataExtra['City']);
    this.addressForm.controls['sCountry'].setValue(this.info.dataExtra['country']); 
    this.addressForm.controls['bFirstName'].setValue(this.info.firstName);
    this.addressForm.controls['bLastName'].setValue(this.info.lastName);
    this.addressForm.controls['bCompany'].setValue(this.info.dataExtra['companyName']);
    this.addressForm.controls['bAddress'].setValue(this.info.dataExtra['Address']);
    this.addressForm.controls['bCity'].setValue(this.info.dataExtra['City']);
    this.addressForm.controls['bCountry'].setValue(this.info.dataExtra['country']);

  }

  validateForm(){
    console.log(this.addressForm.value);
  if(this.addressForm.valid){
    console.log("Valido");
    this.sendDatatoAPI();
  }else{
    console.log("Invalido");
    this.validateAllFormFields(this.addressForm);
    this.showError("Please fix all required fields");
    this.scrollToError();
  }
  }



   //custom validation for each form field on DOM
   validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  //Show message error function
showError(e){
  this.toast.error(e,'Error',{positionClass:"toast-top-right"})
}

scrollToError(): void {
 let that:any = this;
setTimeout(function(){
  const firstElementWithError = document.querySelector('.is-invalid');
  console.log("HTMLElement", firstElementWithError);
  this.scrollTo(firstElementWithError);
 }, 500);


}

scrollTo(el: Element): void {
  if(el) { 
    console.log("el", el);
   el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

sendDatatoAPI(){
  let data:any =  {
    "shippingAddress": {
      "country": this.addressForm.get('sCountry').value,
      "firstName": this.addressForm.get('sFirstName').value,
      "lastName": this.addressForm.get('sLastName').value,
      "company": this.addressForm.get('sCompany').value,
      "address": this.addressForm.get('sAddress').value,
      "city": this.addressForm.get('sCity').value,

    },
    "billingAddress": {
      "country": this.addressForm.get('bCountry').value,
      "firstName": this.addressForm.get('bFirstName').value,
      "lastName": this.addressForm.get('bLastName').value,
      "company": this.addressForm.get('bCompany').value,
      "address": this.addressForm.get('bAddress').value,
      "city": this.addressForm.get('bCity').value,
    }
  };
  this.httpH.updateData(`shoppingcart/${this.shoppingCartId}`, data).subscribe(res=>{
      console.log("Address in API", res);
      this.goToNextPage();
  }, error =>{
    this.showError("An error occurred");

  })
}
  goToNextPage(){
        this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

  }

  back(){
    this._location.back();
  }

}
