import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CountriesService } from '../services/countries.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
declare var jQuery:any;
declare var window:any;
@Component({
  selector: 'app-registration-seller',
  templateUrl: './registration-seller.component.html',
  styleUrls: ['./registration-seller.component.scss']
})
export class RegistrationSellerComponent implements OnInit {
  sellerForm: FormGroup;
  firstName:FormControl;
  lastName:FormControl;
  location:FormControl;
  emailForm:FormControl;
  password:FormControl;
  rePassword:FormControl;
  tel:FormControl;
  tcs: FormControl;
  regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  countries:any = [];
  buyerSellerValid: boolean = false;
  showEmailVerification:boolean=false;
  step1:boolean = true;
  step2:boolean = false;
  step3:boolean = false;
  step4:boolean = false;
  companyName: FormControl;
  TradeBrandName: FormControl;
  companyType: FormControl;
  Address: FormControl;
  City: FormControl;
  ProductsInterestedSelling: FormControl;
  companyForm:FormGroup;
  ContactNumber: FormControl;
  bankForm: FormGroup;
  TradeLicenseNumber: FormControl;
  FoodSafetyCertificateNumber: FormControl;
  CorporateBankAccountNumber: FormControl;
  swiftCode: FormControl;
  CurrencyofTrade: FormControl;
  legalForm: FormGroup;
  email: any;
  userID: any;
  showConfirmation=true;
  storeID:any;
  isValid:boolean = false;
btnText:any = 'Finish';




  constructor(private countryService: CountriesService,
              private auth: AuthenticationService,
              private toast:ToastrService,
              private product:ProductService) { }

  ngOnInit() {
    this.createFormControls();
    this.RegisterSellerForm();
    this.registerCompanyForm();
    this.registerBankForm();
    this.registerlegalForm();
    this.getCountries();
    this.setValues();
    var that = this;


    //Initializar county code component for tel field
    jQuery(document).ready(function(){

      var input = document.querySelector("#phone");
      var iti = window.intlTelInput(input);

      var handleChange = function() {
        var text = (iti.isValidNumber()) ?  iti.getNumber() : "Please enter a number below";
        console.log("text", text);
        if(iti.isValidNumber()){
          that.buyerSellerValid = false;

          that.sellerForm.controls['tel'].setValue(text);

        }else{
          that.buyerSellerValid = true;
        }

      };
      
      // listen to "keyup", but also "change" to update when the user selects a country
      input.addEventListener('change', handleChange);
      input.addEventListener('keyup', handleChange);
  
     
    }); 
  }


  //Create control for each form field
  createFormControls(){ 
    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('',[Validators.required]);
    this.location = new FormControl('', [Validators.required]);
    this.emailForm = new FormControl('',[Validators.required, Validators.email]);
    this.password = new FormControl('',[Validators.required, Validators.pattern(this.regex)]);
    this.rePassword = new FormControl('',[Validators.required]);
    this.tel = new FormControl('',[Validators.required]);
    this.tcs = new FormControl('', [Validators.requiredTrue]);
    this.companyName = new FormControl('',[Validators.required]);
    this.TradeBrandName= new FormControl('', [Validators.required]);
    this.companyType = new FormControl('', [Validators.required]);
    this.location = new FormControl('', [Validators.required]);
    this.Address = new FormControl('',[Validators.required]);
    this.City = new FormControl('',[Validators.required]);
    this.ProductsInterestedSelling= new FormControl('', [Validators.required]);
    this.ContactNumber= new FormControl('', [Validators.required]);
    this.TradeLicenseNumber= new FormControl('', [Validators.required]);
    this.FoodSafetyCertificateNumber= new FormControl('', [Validators.required]);
    this.CorporateBankAccountNumber= new FormControl('', [Validators.required]);
    this.swiftCode = new FormControl('', [Validators.nullValidator]);
    this.CurrencyofTrade= new FormControl('', [Validators.required]);

  }

  //Initializar for group for first step wizard form
  RegisterSellerForm(){
    this.sellerForm = new FormGroup({
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.emailForm,
      password:this.password,
      rePassword:this.rePassword,
      tel:this.tel,
      tcs:this.tcs

    },{
      updateOn: 'submit'
    });
  }

  registerCompanyForm(){
    this.companyForm = new FormGroup({
      location:this.location,
      Address:this.Address,
      City:this.City,
      companyName:this.companyName,
      TradeBrandName:this.TradeBrandName,
      companyType: this.companyType,
      ContactNumber:this.ContactNumber,
      ProductsInterestedSelling: this.ProductsInterestedSelling


    },{
      updateOn: 'submit'
    });
  }



  registerBankForm(){
    this.bankForm = new FormGroup({
      FoodSafetyCertificateNumber:this.FoodSafetyCertificateNumber,
      TradeLicenseNumber:this.TradeLicenseNumber
    },{
      updateOn: 'submit'
    })
  }

  registerlegalForm(){
    this.legalForm = new FormGroup({
      CorporateBankAccountNumber:this.CorporateBankAccountNumber,
      swiftCode:this.swiftCode,
      CurrencyofTrade:this.CurrencyofTrade
    },{
      updateOn: 'submit'
    })
  }

  //PREset USD option
  setValues(){
    this.legalForm.controls['CurrencyofTrade'].setValue('USD');

  }
    //Get list of countries from the API
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

     //Validate if phone number has the correct format
  validateSellerPhone(){
    console.log("Validating", this.buyerSellerValid, this.sellerForm.get('tel').value);
    if(this.buyerSellerValid == true){
      jQuery('#phone').val('');
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

    //Verify if email is already taken in the app database
    verifyEmail(email){
      this.auth.getData(`api/user/email/${email}/`).subscribe(
        result=>{
          console.log("Email", result['message']);
          //if return data it means that email is already used
          if(result['message']==true){
            this.showEmailVerification=true;
            this.sellerForm.get('email').setErrors( {'incorrect': true} )
  
          }
          else{
            this.showEmailVerification=false
          }
        },e=>{this.showEmailVerification=false}
      )
    }


  

  //Validate step 1 FORM
  submitStep1(){
    console.log(this.sellerForm.value);
    if(this.sellerForm.valid){
      (this.sellerForm.get('password').value != this.sellerForm.get('rePassword').value ) ? this.sellerForm.get('rePassword').setErrors( {MatchPassword: true} ) : this.next();
    }else{
      console.log("Invalid");
      this.validateAllFormFields(this.sellerForm);
    }
  }

  next(){
    this.step1 = false;
    this.step2 = true;
  }


    //Validate step 2 FORM
  submitStep2(){
    console.log(this.companyForm.value);
    if(this.companyForm.valid){
      console.log("Valido");
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    }else{
      console.log("Invalid");
      this.validateAllFormFields(this.companyForm);
    }
  }

    //Validate step 3 FORM
  submitStep3(){
    console.log(this.bankForm.value);
    if(this.bankForm.valid){
      console.log("Valido");
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
    }else{
      console.log("Invalid");
      this.validateAllFormFields(this.bankForm);
    }
  }
    //Validate step 4 FORM
  register(){
    console.log(this.legalForm.value);
    if(this.legalForm.valid){
      console.log("Valido");
      this.isValid = true;
      this.btnText = 'Loading...'
      this.submitRegistrationSeller();
      
    }else{
      console.log("Invalid");
      this.validateAllFormFields(this.legalForm);
    }
  }

  //Send User data to API
  submitRegistrationSeller(){
    let dataExtra={
    "tel": this.sellerForm.get('tel').value,
    'country' : this.companyForm.get('location').value,
    'Address' : this.companyForm.get('Address').value,
    'City' : this.companyForm.get('City').value,
    'companyName' : this.companyForm.get('companyName').value,
    'companyType' : this.companyForm.get('companyType').value,
    'licenseNumber' : this.bankForm.get('TradeLicenseNumber').value,
    'iso' : this.bankForm.get('FoodSafetyCertificateNumber').value,
    'iban' : this.legalForm.get('CorporateBankAccountNumber').value,
    'swiftCode' : this.legalForm.get('swiftCode').value,
    'productsIntered' : this.companyForm.get('ProductsInterestedSelling').value,
    'contactNumber' : this.companyForm.get('ContactNumber').value,
    'currencyTrade' : this.legalForm.get('CurrencyofTrade').value,
    'trade' : this.companyForm.get('TradeBrandName').value 
    }

      this.auth.register(this.sellerForm.value, 1, dataExtra).subscribe(res => {
        console.log("Res", res);
        this.email=this.sellerForm.get('email').value;
        this.userID=res['id']
       
        this.createStore();

      }, error =>{
        this.isValid = false;
        this.btnText = 'Finish'
        this.showError(error.error)

      })
}

//Show error
showError(e){
  this.toast.error(e,'Error',{positionClass:"toast-top-right"})
}


//Create store on the Database
createStore(){
  let store={
    "name": this.companyForm.get('companyName').value,
    "owner":this.userID,
    "description":""
  }
  this.product.saveData('api/store/',store).subscribe(
    result=>{
      this.storeID=result[0].id;
      //update store with full data, api is working in this way
      let storeFullData={
        "companyName":this.companyForm.get('companyName').value,
        "companyType": this.companyForm.get('companyType').value,
        "location": this.companyForm.get('location').value,
        "Address":this.companyForm.get('Address').value,
        "City":this.companyForm.get('City').value,
        "ContactNumber": this.companyForm.get('ContactNumber').value,
        "CorporateBankAccountNumber": this.legalForm.get('CorporateBankAccountNumber').value,
        "CurrencyofTrade": this.legalForm.get('CurrencyofTrade').value,
        "FoodSafetyCertificateNumber": this.bankForm.get('FoodSafetyCertificateNumber').value,
        "ProductsInterestedSelling": this.companyForm.get('ProductsInterestedSelling').value,
        "TradeBrandName": this.companyForm.get('TradeBrandName').value,
        "TradeLicenseNumber": this.bankForm.get('TradeLicenseNumber').value
      }
      console.log(this.storeID)
      this.product.updateData('store/'+this.storeID, storeFullData).subscribe(
        result=>{
          console.log("REesult", result);
          this.showConfirmation=false;
          this.isValid = false;
          this.btnText = 'Finish'
        },
        error=>{
          this.isValid = false;
          this.btnText = 'Finish'
          this.showError(error.error)
          //if store has error. delete user and store
          this.product.deleteData('user/'+this.userID).subscribe(
            result=>{console.log(result)},e=>{console.log(e)})
          this.product.deleteData('store/'+this.storeID).subscribe(
            result=>{console.log(result)},e=>{console.log(e)})
          console.log(error)
        }
      )
    },
    error=>{
      this.showError(error.error)
      console.log(error)
      this.isValid = false;
      this.btnText = 'Finish'
    }
  )
}
}
