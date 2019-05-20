import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { ProductService } from '../services/product.service';
import { ToastrService } from '../toast.service';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { CountriesService } from '../services/countries.service';
declare var jQuery:any;

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {
  info:any;
  buyerForm: FormGroup;
  buyerFirstName: FormControl; 
  buyerLastName: FormControl;
  buyerEmail: FormControl;
  buyerPhoneNumber: FormControl;
  buyerCompanyName: FormControl;
  buyerTypeBusiness: FormControl;
  buyerCountry: FormControl;
  buyerAddress: FormControl;
  buyerCity: FormControl;
  countries:any =[];
  password:FormControl;
  currentPassword:FormControl;
  sellerForm: FormGroup;
  sellerFirstName: FormControl;
  sellerLastName: FormControl;
  sellerEmail: FormControl;
  sellerPhoneNumber: FormControl;
  sellerCompanyName: FormControl;
  sellerTrade: FormControl;
  sellerCompanyType: FormControl;
  sellerCountry: FormControl;
  sellerAddress: FormControl;
  sellerCity: FormControl;
  sellerLicenceNumber: FormControl;
  sellerISO: FormControl;
  sellerIBAN: FormControl;
  SellerProductsIntered: FormControl;
  sellerContactNumber: FormControl;
  sellerCurrencyTrade: FormControl;
  storeEndpoint:any = "api/store/user/";
  store:any;
  sellerStoreDescription: FormControl;
  base:string=environment.apiURLImg;
  logo:any;
  hero:any;
  fileToUpload: any = [];
  fileHero:any = [];
  heroEndpoint:any = 'api/store/hero/';
  logoEndpoint:any = 'api/store/logo/';
  regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  public loading = false;
  rePassword: FormControl;
  passwordForm: FormGroup;




  constructor(private auth: AuthenticationService, private rest: ProductService, 
    private toast:ToastrService, public ngProgress: NgProgress, private router:Router,
    private countryService: CountriesService) {
      jQuery(document).ready(function () {
      jQuery('.js-example-basic-single').select2();
    });

  }

  
   async ngOnInit() {

    this.createFormControls();  
    this.createBuyerForm();
    this.createSellerForm();
    this.createPasswordForm();
    this.getCountries();
   this.getPersonalData();
    console.log(this.info.role);
    if(this.info['role'] == 1){
      await this.getStoreData();
      this.setSellerValues();

    }
    this.setValues();
   

  }
   getPersonalData(){
      this.info = this.auth.getLoginData();
      console.log(this.info);
      return this.info;   
    // this.getStoreData();
  }

  createFormControls(){
    this.buyerFirstName = new FormControl('', [Validators.required]);
    this.buyerLastName = new FormControl('',[Validators.required]);
    this.buyerEmail = new FormControl('', [Validators.email, Validators.required]);
    this.buyerPhoneNumber = new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9 ]{1,4}[)]{0,1}[-\s\./0-9 ]*$')]);
    this.buyerCompanyName = new FormControl('',[Validators.required]);
    this.buyerTypeBusiness = new FormControl('',[Validators.required]);
    this.buyerCountry = new FormControl('',[Validators.required]);
    this.buyerAddress = new FormControl('',[Validators.required]);
    this.buyerCity = new FormControl('',[Validators.required]);
    this.sellerFirstName = new FormControl('', [Validators.required]);
    this.sellerLastName = new FormControl('',[Validators.required]);
    this.sellerEmail = new FormControl('', [Validators.email, Validators.required]);
    this.sellerPhoneNumber = new FormControl('', [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9 ]{1,4}[)]{0,1}[-\s\./0-9 ]*$')]);
    this.sellerCompanyName = new FormControl('', [Validators.required]);
    this.sellerTrade = new FormControl('', [Validators.required]);
    this.sellerCompanyType = new FormControl('', [Validators.required]);
    this.sellerCountry = new FormControl('', [Validators.required]);
    this.sellerAddress = new FormControl('', [Validators.required]);
    this.sellerCity = new FormControl('', [Validators.required]);
    this.sellerLicenceNumber = new FormControl('', [Validators.required]);
    this.sellerISO = new FormControl('', [Validators.required]);
    this.sellerIBAN = new FormControl('', [Validators.required]);
    this.SellerProductsIntered = new FormControl('', [Validators.required]);
    this.sellerContactNumber = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
    this.sellerCurrencyTrade = new FormControl('', [Validators.required]);
    this.sellerStoreDescription= new FormControl('', [Validators.nullValidator]);
    this.password = new FormControl('',[Validators.required, Validators.pattern(this.regex)]);
    this.rePassword = new FormControl('',[Validators.required]);
    this.currentPassword = new FormControl('',[Validators.required]);
  }

  createBuyerForm(){
    this.buyerForm = new FormGroup({
      firstName: this.buyerFirstName,
      lastName: this.buyerLastName,
      email: this.buyerEmail,
      country: this.buyerCountry,
      address: this.buyerAddress,
      city: this.buyerCity,
      telephone: this.buyerPhoneNumber,
      companyName: this.buyerCompanyName,
      typeBusiness: this.buyerTypeBusiness


  }, {
    updateOn: 'submit'
  });

  }

  createSellerForm(){
    this.sellerForm = new FormGroup({
      firstName: this.sellerFirstName,
      lastName: this.sellerLastName,
      email: this.sellerEmail,
      country: this.sellerCountry,
      address: this.sellerAddress,
      city: this.sellerCity,
      telephone: this.sellerPhoneNumber,
      companyName: this.sellerCompanyName,
      trade: this.sellerTrade,
      companyType: this.sellerCompanyType,
      licenseNumber: this.sellerLicenceNumber,
      iso: this.sellerISO,
      iban: this.sellerIBAN,
      productsIntered: this.SellerProductsIntered,
      contactNumber: this.sellerContactNumber,
      currencyTrade: this.sellerCurrencyTrade,
       storeDescription: this.sellerStoreDescription
     }, {
    updateOn: 'submit'
  });
  }

  createPasswordForm(){
    this.passwordForm = new FormGroup({
      password:this.password,
      rePassword:this.rePassword,
      currentPassword: this.currentPassword
    }, {
      updateOn: 'submit'
    })
  }

  setValues(){
    this.buyerForm.controls['firstName'].setValue(this.info.firstName);
    this.buyerForm.controls['lastName'].setValue(this.info.lastName);
    this.buyerForm.controls['email'].setValue(this.info.email);
    this.buyerForm.controls['address'].setValue(this.info.dataExtra['Address']);
    this.buyerForm.controls['city'].setValue(this.info.dataExtra['City']);
    this.buyerForm.controls['telephone'].setValue(this.info.dataExtra['tel']);
    this.buyerForm.controls['companyName'].setValue(this.info.dataExtra['companyName']);
    this.buyerForm.controls['typeBusiness'].setValue(this.info.dataExtra['typeBusiness']); 
    this.buyerForm.controls['country'].setValue('AE');

  }

  setSellerValues(){
    this.sellerForm.controls['firstName'].setValue(this.info.firstName);
    this.sellerForm.controls['lastName'].setValue(this.info.lastName);
    this.sellerForm.controls['email'].setValue(this.info.email);
    this.sellerForm.controls['country'].setValue(this.store[0].location);
    this.sellerForm.controls['address'].setValue(this.store[0].Address);
    this.sellerForm.controls['city'].setValue(this.store[0].City);
    this.sellerForm.controls['telephone'].setValue(this.info.dataExtra['tel']);
    this.sellerForm.controls['companyName'].setValue(this.store[0].name);
    this.sellerForm.controls['companyType'].setValue(this.info.dataExtra['companyType']);
    this.sellerForm.controls['licenseNumber'].setValue(this.info.dataExtra['licenseNumber']);
    this.sellerForm.controls['iso'].setValue(this.info.dataExtra['iso']);
    this.sellerForm.controls['iban'].setValue(this.info.dataExtra['iban']);
    this.sellerForm.controls['productsIntered'].setValue(this.info.dataExtra['productsIntered']);
    this.sellerForm.controls['contactNumber'].setValue(this.info.dataExtra['contactNumber']);
    this.sellerForm.controls['currencyTrade'].setValue(this.info.dataExtra['currencyTrade']);
    this.sellerForm.controls['trade'].setValue(this.info.dataExtra['trade']);
    this.sellerForm.controls['storeDescription'].setValue(this.store[0].description);
  }

  updateBuyer(){
    if(this.buyerForm.valid){
      console.log("Valido");
      this.info.firstName = this.buyerForm.get('firstName').value;
      this.info.lastName = this.buyerForm.get('lastName').value;
      this.info.email = this.buyerForm.get('email').value;
      this.info.dataExtra['country'] = this.buyerForm.get('country').value;
      this.info.dataExtra['Address'] = this.buyerForm.get('address').value;
      this.info.dataExtra['City'] = this.buyerForm.get('city').value;
      this.info.dataExtra['tel'] = this.buyerForm.get('telephone').value;
      this.info.dataExtra['companyName'] = this.buyerForm.get('companyName').value;
      this.info.dataExtra['typeBusiness'] = this.buyerForm.get('typeBusiness').value;
      console.log(this.info);
      this.updateAccount(this.info);
    }else{
      this.validateAllFormFields(this.buyerForm);
      this.scrollToError();
    }
  }

  scrollTo(el: Element): void {
    if(el) { 
      console.log("el", el);
     el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
 }
 
 scrollToError(): void {
   let that:any = this;
  setTimeout(function(){
    const firstElementWithError = document.querySelector('.is-invalid');
    console.log("HTMLElement", firstElementWithError);
    that.scrollTo(firstElementWithError);
   }, 500);

 
 }
  updateSeller(){
    if(this.sellerForm.valid){
      console.log("Valido");
      this.info.firstName = this.sellerForm.get('firstName').value;
      this.info.lastName = this.sellerForm.get('lastName').value;
      this.info.email = this.sellerForm.get('email').value;
      this.info.dataExtra['country'] = this.sellerForm.get('country').value;
      this.info.dataExtra['Address'] = this.sellerForm.get('address').value;
      this.info.dataExtra['City'] = this.sellerForm.get('city').value;
      this.info.dataExtra['tel'] = this.sellerForm.get('telephone').value;
      this.info.dataExtra['companyName'] = this.sellerForm.get('companyName').value;
      this.info.dataExtra['companyType'] = this.sellerForm.get('companyType').value;
      this.info.dataExtra['licenseNumber'] = this.sellerForm.get('licenseNumber').value;
      this.info.dataExtra['iso'] = this.sellerForm.get('iso').value;
      this.info.dataExtra['iban'] = this.sellerForm.get('iban').value;
      this.info.dataExtra['productsIntered'] = this.sellerForm.get('productsIntered').value;
      this.info.dataExtra['contactNumber'] = this.sellerForm.get('contactNumber').value;
      this.info.dataExtra['currencyTrade'] = this.sellerForm.get('currencyTrade').value;
      this.info.dataExtra['trade'] = this.sellerForm.get('trade').value;
      this.loading = true;
      this.ngProgress.start();
      this.updateAccount(this.info);
    }else{
      this.validateAllFormFields(this.sellerForm);
      this.scrollToError();
    }
  }


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

  updateAccount(data){
    this.rest.updateData('user/'+this.info.id, data).subscribe(res =>{
      console.log(res);
      this.auth.setLoginData(this.info);
      if(this.info.role == 1){
        this.updateStore();
      }else{
        this.loading = false;
        this.ngProgress.done();
        this.toast.success("Your account information has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        
      }

    },  error =>{
      this.loading = false;
        this.ngProgress.done();
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    })
  }

  handleSubmit(){
    jQuery('#submit-btn').trigger('click');
  }

  updatePassword(){
   console.log(this.passwordForm.value);
    if(this.passwordForm.valid){
      console.log("Formulario Valido");
      this.verifyMatch();
    }else{
      console.log("FOrmulario invalido");
      this.validateAllFormFields(this.passwordForm);
    }
   
}
verifyMatch(){
  let password = this.passwordForm.get('password').value; // to get value in input tag
       let confirmPassword = this.passwordForm.get('rePassword').value; // to get value in input tag
        if(password != confirmPassword) {
            // console.log('false');
            this.passwordForm.get('rePassword').setErrors( {MatchPassword: true} )
        } else{
         this.handleRequest();
        }
}

handleRequest(){
      this.rest.updatePassword(this.info.email,this.currentPassword.value,this.password.value).subscribe(
        result=>{
          this.toast.success('Password has been changed successfully!', "Error",{positionClass:"toast-top-right"} );
        
        },error=>{
          console.log(error)
          this.toast.error('Something wrong happened. Maybe your current password is not the correct one', "Error",{positionClass:"toast-top-right"} );
        }
      )
    
}

async getStoreData(){
  await new Promise((resolve, reject) => {
    this.rest.getData(this.storeEndpoint+this.info['id']).subscribe(result =>{
      this.store = result;
      this.logo = result[0].logo;
      this.hero = result[0].heroImage;
      console.log("Store", this.store[0]);
      resolve();
     
    }, error => {
      console.error(error);
      reject();
    })
  })
 
}


updateStore(){
  
  let storeFullData={
    "companyName":this.sellerForm.get('companyName').value,
    "companyType": this.sellerForm.get('companyType').value,
    "location": this.sellerForm.get('country').value,
    "Address":this.sellerForm.get('address').value,
    "City":this.sellerForm.get('city').value,
    "ContactNumber": this.sellerForm.get('contactNumber').value,
    "CorporateBankAccountNumber": this.sellerForm.get('iban').value,
    "CurrencyofTrade": this.sellerForm.get('currencyTrade').value,
    "FoodSafetyCertificateNumber": this.sellerForm.get('iso').value,
    "ProductsInterestedSelling": this.sellerForm.get('productsIntered').value,
    "TradeBrandName": this.sellerForm.get('trade').value,
    "TradeLicenseNumber": this.sellerForm.get('licenseNumber').value,
    "description": this.sellerForm.get('storeDescription').value
  }
  this.rest.updateData('store/'+this.store[0].id, storeFullData).subscribe(
    async result=>{

      if(this.fileHero.length > 0 || this.fileToUpload.length>0){
        (this.fileHero.length > 0) ? await this.uploadFile(this.store[0].id, this.heroEndpoint, this.fileHero, 'hero') : null;
        (this.fileToUpload.length > 0) ? await this.uploadFile(this.store[0].id, this.logoEndpoint, this.fileToUpload, 'logo') : null;
        this.loading = false;
        this.ngProgress.done();
        this.toast.success("Your account and store information has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.router.navigate(['/recent-purchases']);

      }else{
        this.loading = false;
        this.ngProgress.done();
        this.toast.success("Your account and store information has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.router.navigate(['/recent-purchases']);

      }

      console.log("Update Store", result);

    },
    error=>{
      this.loading = false;
      this.ngProgress.done();
      console.log(error)
    }
  )
}

handleFileInput(files: FileList) {
  this.fileToUpload = files;
  this.readFile(files, '#logo');
  
}
handleFileHero(files: FileList){
  this.fileHero = files;
  this.readFile(files, '#hero');

}

  async uploadFile(id, endpoint, file, from){

  await new Promise((resolve, reject) => {
  this.rest.uploadFile(endpoint+id, from, file).subscribe(result => {
    console.log("File", result);
    resolve();
  }, error => {
    console.log("File Error", error);
    reject();
  })
});
}


readFile(files, id){
  if (files[0]) {
    var reader = new FileReader();

    reader.onload = (e: Event) => {
      jQuery(id).attr('src', reader.result);
    }

    reader.readAsDataURL(files[0]);
  }
}

getCountries() {
  this.countryService.getCountries().subscribe(
    result => {
      this.countries = result;
    },
    error => {
      console.log(error);
    }
  );
}
}
