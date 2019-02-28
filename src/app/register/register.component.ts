import { Component, OnInit, HostListener } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {AuthenticationService} from '../services/authentication.service';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router,ActivatedRoute } from '@angular/router';
import {IsLoginService} from '../core/login/is-login.service';
import { environment } from '../../environments/environment';
import { PasswordValidation } from '../password';
import { CountriesService } from '../services/countries.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
buyerForm: FormGroup;
sellerForm:FormGroup;
buyerShow:boolean=true;
sellerShow:boolean=false;
showConfirmation=true;
email:string;
showEmailVerification:boolean=false;
file:any=[];
userID:any;
storeID:any;
image:any;
regex:string='(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
sub:any;
countries:any = [];
registerVal; 
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
 TradeBrandName:FormControl;
TradeLicenseNumber:FormControl;
FoodSafetyCertificateNumber:FormControl;
CorporateBankAccountNumber:FormControl;
CurrencyofTrade:FormControl;
ContactNumber:FormControl;
ProductsInterestedSelling:FormControl;
companyType: FormControl;
  constructor(private fb:FormBuilder, private auth: AuthenticationService, 
    private router:Router, private toast:ToastrService,  private isLoggedSr: IsLoginService, 
    private product:ProductService,private route:ActivatedRoute,
    private countryService: CountriesService,
    ) {
    this.redirectHome();
    this.sub=this.route.queryParams.subscribe(params=>{
      if(!params['register']){
        this.showBuyer();
      }
      else{
        (params['register'] == 'seller') ? this.showSeller() :  this.showBuyer();
      }
      
      

    })
  }



  ngOnInit() {
    // this.RegisterBuyerForm();
    this.createFormControls();
    this.RegisterBuyerForm();
    this.RegistersellerForm();
    this.getCountries();


  }
   ngOnDestroy() {
    this.sub.unsubscribe();
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
  showBuyer(){
    this.buyerShow=true;
    this.sellerShow=false;
    this.registerVal = '2';
  }

  showSeller(){
    this.buyerShow=false;
    this.sellerShow=true;
    this.RegistersellerForm();
    this.registerVal = '1';

  }
  redirectHome(){
     if(this.auth.isLogged()){ 
      this.router.navigate(["/home"])
    }  
  }


  createFormControls(){ 
    this.firstName = new FormControl('', [Validators.required]);
    this.lastName = new FormControl('',[Validators.required]);
    this.location = new FormControl('', [Validators.required]);
    this.emailForm = new FormControl('',[Validators.required]);
    this.password = new FormControl('',[Validators.required, Validators.pattern(this.regex)]);
    this.rePassword = new FormControl('',[Validators.required]);
    this.tel = new FormControl('',[Validators.required]);
    this.Address = new FormControl('',[Validators.required]);
    this.City = new FormControl('',[Validators.required]);
    this.TypeBusiness = new FormControl('',[Validators.required]);
    this.companyName = new FormControl('',[Validators.required]);
    this.tcs = new FormControl('', [Validators.requiredTrue]);
    this.TradeBrandName= new FormControl('', [Validators.required]);
    this.TradeLicenseNumber= new FormControl('', [Validators.required]);
    this.FoodSafetyCertificateNumber= new FormControl('', [Validators.required]);
    this.CorporateBankAccountNumber= new FormControl('', [Validators.required]);
    this.CurrencyofTrade= new FormControl('', [Validators.required]);
    this.ContactNumber= new FormControl('', [Validators.required]);
    this.ProductsInterestedSelling= new FormControl('', [Validators.required]);
    this.companyType = new FormControl('', [Validators.required]);


  }

 

  RegisterBuyerForm(){
    this.buyerForm = new FormGroup({
      firstName:this.firstName,
      lastName:this.lastName,
      location:this.location,
      email:this.emailForm,
      password:this.password,
      rePassword:this.rePassword,
      tel:this.tel,
      Address:this.Address,
      City:this.City,
      TypeBusiness:this.TypeBusiness,
      companyName:this.companyName,
      tcs:this.tcs


    },{
      updateOn: 'submit'
    });


  }


  RegistersellerForm(){
    this.sellerForm = new FormGroup({
      firstName:this.firstName,
      lastName:this.lastName,
      location:this.location,
      email:this.emailForm,
      password:this.password,
      rePassword:this.rePassword,
      tel:this.tel,
      Address:this.Address,
      City:this.City,
      companyName:this.companyName,
      tcs:this.tcs,
      TradeBrandName:this.TradeBrandName,
      TradeLicenseNumber:this.TradeLicenseNumber,
      FoodSafetyCertificateNumber:this.FoodSafetyCertificateNumber,
      CorporateBankAccountNumber:this.CorporateBankAccountNumber,
      CurrencyofTrade:this.CurrencyofTrade,
      ContactNumber:this.ContactNumber,
      ProductsInterestedSelling: this.ProductsInterestedSelling,
      companyType: this.companyType


    },{
      updateOn: 'submit'
    });


  }


  registerBuyer(){
  
      if(this.buyerForm.valid){
        console.log("Valid");
        this.verifyMatch();
        console.log(this.buyerForm.value);
      }else{
        console.log("Invalid");
        this.validateAllFormFields(this.buyerForm);
      }
     
    
  }


  registerSeller(){
       if(this.sellerForm.valid){
         (this.sellerForm.get('password').value != this.sellerForm.get('rePassword').value ) ? this.sellerForm.get('rePassword').setErrors( {MatchPassword: true} ) : this.submitRegistrationSeller();
       }else{
         this.validateAllFormFields(this.sellerForm);
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


verifyMatch(){
  let password = this.buyerForm.get('password').value; // to get value in input tag
       let confirmPassword = this.buyerForm.get('rePassword').value; // to get value in input tag
        if(password != confirmPassword) {
            // console.log('false');
            this.buyerForm.get('rePassword').setErrors( {MatchPassword: true} )
        } else {
           this.submitRegistrationBuyer()
        }
}
  submitRegistrationBuyer(){
      let dataExtra={
      "country": this.buyerForm.get('location').value,
      "tel": this.buyerForm.get('tel').value,
      "Address":this.buyerForm.get('Address').value,
      "City":this.buyerForm.get('City').value,
      "companyName": this.buyerForm.get('companyName').value,
      "typeBusiness":this.buyerForm.get('TypeBusiness').value
      }
      this.auth.register(this.buyerForm.value, 2, dataExtra).subscribe(
        result=>{
          this.email=this.buyerForm.get('email').value;
          this.showConfirmation=false;
        },
        error=>{
          console.log(error);
          this.showError(error.error);
        }
      )
    
  }


  createStore(){
    let store={
      "name": this.sellerForm.get('companyName').value,
      "owner":this.userID,
      "description":""
    }
    this.product.saveData('api/store/',store).subscribe(
      result=>{
        this.storeID=result[0].id;
        //update store with full data, api is working in this way
        let storeFullData={
          "companyName":this.sellerForm.get('companyName').value,
          "companyType": this.sellerForm.get('companyType').value,
          "location": this.sellerForm.get('location').value,
          "Address":this.sellerForm.get('Address').value,
          "City":this.sellerForm.get('City').value,
          "ContactNumber": this.sellerForm.get('ContactNumber').value,
          "CorporateBankAccountNumber": this.sellerForm.get('CorporateBankAccountNumber').value,
          "CurrencyofTrade": this.sellerForm.get('CurrencyofTrade').value,
          "FoodSafetyCertificateNumber": this.sellerForm.get('FoodSafetyCertificateNumber').value,
          "ProductsInterestedSelling": this.sellerForm.get('ProductsInterestedSelling').value,
          "TradeBrandName": this.sellerForm.get('TradeBrandName').value,
          "TradeLicenseNumber": this.sellerForm.get('TradeLicenseNumber').value
        }
        console.log(this.storeID)
        this.product.updateData('store/'+this.storeID, storeFullData).subscribe(
          result=>{
            this.showConfirmation=false;
          },
          error=>{
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
      }
    )
  }


  submitRegistrationSeller(){
      let dataExtra={
      "tel": this.sellerForm.get('tel').value,
      'country' : this.sellerForm.get('location').value,
      'Address' : this.sellerForm.get('Address').value,
      'City' : this.sellerForm.get('City').value,
      'companyName' : this.sellerForm.get('companyName').value,
      'companyType' : this.sellerForm.get('companyType').value,
      'licenseNumber' : this.sellerForm.get('TradeLicenseNumber').value,
      'iso' : this.sellerForm.get('FoodSafetyCertificateNumber').value,
      'iban' : this.sellerForm.get('CorporateBankAccountNumber').value,
      'productsIntered' : this.sellerForm.get('ProductsInterestedSelling').value,
      'contactNumber' : this.sellerForm.get('ContactNumber').value,
      'currencyTrade' : this.sellerForm.get('CurrencyofTrade').value,
      'trade' : this.sellerForm.get('TradeBrandName').value 
      }

        this.auth.register(this.sellerForm.value, 1, dataExtra).subscribe(res => {
          console.log("Res", res);
          this.email=this.sellerForm.get('email').value;
          this.userID=res['id']
         
          this.createStore();
          // this.showConfirmation=false;

        }, error =>{
          this.showError(error.error)

        })
    
      
      // save new seller
      // this.auth.register(this.sellerForm.value, 1, dataExtra).subscribe(
      //   result=>{
      //     this.email=this.sellerForm.get('email').value;
      //     this.userID=result['id']
      //     //save licence
      //     if(this.file.length>0){
      //       this.uploadFile(this.userID)
      //     }
      //     //save store just name and owner
      //     let store={
      //       "name": this.sellerForm.get('companyName').value,
      //       "owner":this.userID,
      //       "description":""
      //     }
      //     this.product.saveData('api/store/',store).subscribe(
      //       result=>{
      //         this.storeID=result[0].id;
      //         //update store with full data, api is working in this way
      //         let storeFullData={
      //           "companyName":this.sellerForm.get('companyName').value,
      //           "companyType": this.sellerForm.get('companyType').value,
      //           "location": this.sellerForm.get('location').value,
      //           "Address":this.sellerForm.get('Address').value,
      //           "City":this.sellerForm.get('City').value,
      //           "ContactNumber": this.sellerForm.get('ContactNumber').value,
      //           "CorporateBankAccountNumber": this.sellerForm.get('CorporateBankAccountNumber').value,
      //           "CurrencyofTrade": this.sellerForm.get('CurrencyofTrade').value,
      //           "FoodSafetyCertificateNumber": this.sellerForm.get('FoodSafetyCertificateNumber').value,
      //           "ProductsInterestedSelling": this.sellerForm.get('ProductsInterestedSelling').value,
      //           "TradeBrandName": this.sellerForm.get('TradeBrandName').value,
      //           "TradeLicenseNumber": this.sellerForm.get('TradeLicenseNumber').value
      //         }
      //         console.log(this.storeID)
      //         this.product.updateData('store/'+this.storeID, storeFullData).subscribe(
      //           result=>{
      //             this.showConfirmation=false;
      //           },
      //           error=>{
      //             this.showError(error.error)
      //             //if store has error. delete user and store
      //             this.product.deleteData('user/'+this.userID).subscribe(
      //               result=>{console.log(result)},e=>{console.log(e)})
      //             this.product.deleteData('store/'+this.storeID).subscribe(
      //               result=>{console.log(result)},e=>{console.log(e)})
      //             console.log(error)
      //           }
      //         )
      //       },
      //       error=>{
      //         this.showError(error.error)
      //         console.log(error)
      //       }
      //     )
      //   },
      //   error=>{
      //     console.log(error);
      //     this.showError(error.error);
      //   }
      // )
   
  }
  showForm(value){
    if(value==1){
      this.RegistersellerForm();
      this.sellerShow=true;
      this.buyerShow=false;
    }
    else{
      this.buyerShow=true;
      this.sellerShow=false;
    }
  }
  upload(file:FileList){
    this.file=file
  }
  verifyEmail(email){
    this.auth.getData(`user?where={"email":{"like":"${email}"}}`).subscribe(
      result=>{
        //if return data it means that email is already used
        if(result && result['length']>0){
          this.showEmailVerification=true
        }
        else{
          this.showEmailVerification=false
        }
      },e=>{this.showEmailVerification=false}
    )
  }
  uploadFile(id){
      if(this.file.length>0){
        this.product.uploadFile('api/user/license/'+id, "license", this.file).subscribe(result => {
          this.toast.success("Your Licence has been upload successfully!",'Well Done',{positionClass:"toast-top-right"})
        }, error => {
          this.toast.error("Something wrong happened, please try again", "Error",{positionClass:"toast-top-right"} );
        })
      }
  }
  showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
   showSuccess(s){
    this.toast.success(s,'Well Done',{positionClass:"toast-top-right"})
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.buyerForm.patchValue({
        logoCompany: myReader.result
      });
    }
    myReader.readAsDataURL(file);
  }
}
