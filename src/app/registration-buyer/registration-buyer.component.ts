import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { CountriesService } from '../services/countries.service';
import { ToastrService } from '../toast.service';
import { Router } from '@angular/router';
declare var jQuery:any;
declare var window:any;
@Component({
  selector: 'app-registration-buyer',
  templateUrl: './registration-buyer.component.html',
  styleUrls: ['./registration-buyer.component.scss']
})
export class RegistrationBuyerComponent implements OnInit {
  buyerForm: FormGroup;
  firstName:FormControl;
  lastName:FormControl;
  location:FormControl;
  emailForm:FormControl;
  password:FormControl;
  rePassword:FormControl;
  tel:FormControl;
  Address:FormControl;
  City:FormControl;
  TypeBusiness:FormControl;
  companyName:FormControl;
  tcs:FormControl;
  vat:FormControl;
  regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  showEmailVerification:boolean=false;
  buyerPhoneValid: boolean = false;
isvalid:boolean = false;
countries:any = [];
showConfirmation=true;
email:string;
isValid:boolean = false;
btnText:any = 'register to buy';
productsInterestedinBuying:FormControl;
additionalItems: FormControl;

  constructor(private auth: AuthenticationService, 
    private countryService: CountriesService, private toast:ToastrService,
    private router:Router) {
      jQuery(document).ready(function () {
        jQuery('.js-example-basic-single').select2();
        jQuery('select').selectpicker();

      });
     }
 
  ngOnInit() {
    this.createFormControls();
    this.RegisterBuyerForm();
    this.getCountries();

    var that = this;

    // jQuery('.countries').select2();

    //Initializar county code component for tel field
    jQuery(document).ready(function(){

      var input = document.querySelector("#phone");
      var iti = window.intlTelInput(input, {
        initialCountry: "AE"});

      var handleChange = function() {
        var text = (iti.isValidNumber()) ?  iti.getNumber() : "Please enter a number below";
        console.log("text", text);
        if(iti.isValidNumber()){
          that.buyerPhoneValid = false;

          that.buyerForm.controls['tel'].setValue(text);

        }else{
          that.buyerPhoneValid = true;
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
    this.Address = new FormControl('',[Validators.required]);
    this.City = new FormControl('',[Validators.required]);
    this.TypeBusiness = new FormControl('',[Validators.required]);
    this.companyName = new FormControl('',[Validators.required]);
    this.tcs = new FormControl('', [Validators.requiredTrue]);
    this.vat = new FormControl('', [Validators.required]);
    this.productsInterestedinBuying = new FormControl('', [Validators.required]);
    this.additionalItems = new FormControl('', [Validators.required]);
  }

  //Initializar for group for first step wizard form
  RegisterBuyerForm(){
    this.buyerForm = new FormGroup({
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.emailForm,
      password:this.password,
      rePassword:this.rePassword,
      tel:this.tel,
      tcs:this.tcs,
      Address:this.Address,
      City:this.City,
      TypeBusiness:this.TypeBusiness,
      companyName:this.companyName,
      location:this.location,
      vat: this.vat,
      productsInterestedinBuying: this.productsInterestedinBuying,
      additionalItems: this.additionalItems

    },{
      updateOn: 'submit'
    });

    this.buyerForm.controls['location'].setValue('AE');



  }


 

  //Verify if email is already taken in the app database
  verifyEmail(email){
    this.auth.getData(`api/user/email/${email}/`).subscribe(
      result=>{
        //if return data it means that email is already used
        if(result['message']==true){
          this.showEmailVerification=true;
          this.buyerForm.get('email').setErrors( {'incorrect': true} )

        }
        else{
          this.showEmailVerification=false
        }
      },e=>{this.showEmailVerification=false}
    )
  }

  //Validate if phone number has the correct format
  validateBuyerPhone(){
    console.log("Validating", this.buyerPhoneValid, this.buyerForm.get('tel').value);
    if(this.buyerPhoneValid == true){
      jQuery('#phone').val('');
    }
  }



  //verify if passwords match
  verifyMatch(){
    let password = this.buyerForm.get('password').value; // to get value in input tag
         let confirmPassword = this.buyerForm.get('rePassword').value; // to get value in input tag
          if(password != confirmPassword) {
              // console.log('false');
              this.buyerForm.get('rePassword').setErrors( {MatchPassword: true} )
          } else{
           this.registerBuyer();
          }
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

  //Handle validation to check if all fields are valid
  registerBuyer(){
    
        this.isValid = true;
        this.btnText = 'Loading...'
        this.submitRegistrationBuyer();
    
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

  //Send Data to API
  submitRegistrationBuyer(){

      this.auth.getData(`api/user/email/${this.buyerForm.get('email').value}/`).subscribe(
        result=>{
          //if return data it means that email is already used
          if(result['message']==true){
            this.showEmailVerification=true;
            this.buyerForm.get('email').setErrors( {'incorrect': true} )
            this.showError( 'This email is already taken' );
            this.isValid = false;
            this.btnText = 'register to buy'
          }
          else{
            this.showEmailVerification=false
            this.regiterBuyer()
          }
        },e=>{
          this.showEmailVerification=false
          this.regiterBuyer();
        }
      )

      
       
  
    
  
}

regiterBuyer() {
  let dataExtra={
    "country": this.buyerForm.get('location').value,
    "tel": this.buyerForm.get('tel').value,
    "Address":this.buyerForm.get('Address').value,
    "City":this.buyerForm.get('City').value,
    "companyName": this.buyerForm.get('companyName').value,
    "typeBusiness":this.buyerForm.get('TypeBusiness').value,
    "vat": this.buyerForm.get('vat').value,
    "productsInterestedinBuying": this.buyerForm.get('productsInterestedinBuying').value,
    "additionalItems": this.buyerForm.get('additionalItems').value
    }
    
  this.auth.register(this.buyerForm.value, 2, dataExtra).subscribe(
    result=>{
      console.log("Resgistro", result);
      this.email=this.buyerForm.get('email').value;
      this.showConfirmation=false;
      this.router.navigate(['/register-verification']);

      this.isValid = false;
      this.btnText = 'register to buy'
    },
    error=>{
      console.log(error);
      this.showError(error.error);
      this.isValid = false;
      this.btnText = 'register to buy'
    }
  )
}


//Show message error function
showError(e){
  this.toast.error(e,'Error',{positionClass:"toast-top-right"})
}
 
submitStep1(){
  console.log(this.buyerForm.value);
  if(this.buyerForm.valid){
    console.log("Valido");
    this.verifyMatch();
  }else{
    console.log("Invalido");
    this.validateAllFormFields(this.buyerForm);
    this.showError("Please fix all required fields");
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
}
