import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormGroup, FormControl, FormControlName, Validators } from '@angular/forms';
import { environment } from '../../environments/environment.prod';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

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
  countries=environment.countries;
  password:any = "";
  repassword:string;
  currentPassword:string;
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



  constructor(private auth: AuthenticationService, private rest: ProductService, private toast:ToastrService) { }

   ngOnInit() {
    this.createFormControls();
    this.createBuyerForm();
    this.createSellerForm();
    this.getPersonalData();
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
    this.buyerPhoneNumber = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
    this.buyerCompanyName = new FormControl('',[Validators.required]);
    this.buyerTypeBusiness = new FormControl('',[Validators.required]);
    this.buyerCountry = new FormControl('',[Validators.required]);
    this.buyerAddress = new FormControl('',[Validators.required]);
    this.buyerCity = new FormControl('',[Validators.required]);
    this.sellerFirstName = new FormControl('', [Validators.required]);
    this.sellerLastName = new FormControl('',[Validators.required]);
    this.sellerEmail = new FormControl('', [Validators.email, Validators.required]);
    this.sellerPhoneNumber = new FormControl('', [Validators.required, Validators.pattern('[0-9]+')]);
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
      currencyTrade: this.sellerCurrencyTrade
     }, {
    updateOn: 'submit'
  });
  }

  setValues(){
    this.buyerForm.controls['firstName'].setValue(this.info.firstName);
    this.buyerForm.controls['lastName'].setValue(this.info.lastName);
    this.buyerForm.controls['email'].setValue(this.info.email);
    this.buyerForm.controls['country'].setValue(this.info.dataExtra['country']);
    this.buyerForm.controls['address'].setValue(this.info.dataExtra['Address']);
    this.buyerForm.controls['city'].setValue(this.info.dataExtra['City']);
    this.buyerForm.controls['telephone'].setValue(this.info.dataExtra['tel']);
    this.buyerForm.controls['companyName'].setValue(this.info.dataExtra['companyName']);
    this.buyerForm.controls['typeBusiness'].setValue(this.info.dataExtra['typeBusiness']);
    this.sellerForm.controls['firstName'].setValue(this.info.firstName);
    this.sellerForm.controls['lastName'].setValue(this.info.lastName);
    this.sellerForm.controls['email'].setValue(this.info.email);
    this.sellerForm.controls['country'].setValue(this.info.dataExtra['country']);
    this.sellerForm.controls['address'].setValue(this.info.dataExtra['Address']);
    this.sellerForm.controls['city'].setValue(this.info.dataExtra['City']);
    this.sellerForm.controls['telephone'].setValue(this.info.dataExtra['tel']);
    this.sellerForm.controls['companyName'].setValue(this.info.dataExtra['companyName']);
    this.sellerForm.controls['companyType'].setValue(this.info.dataExtra['companyType']);
    this.sellerForm.controls['licenseNumber'].setValue(this.info.dataExtra['licenseNumber']);
    this.sellerForm.controls['iso'].setValue(this.info.dataExtra['iso']);
    this.sellerForm.controls['iban'].setValue(this.info.dataExtra['iban']);
    this.sellerForm.controls['productsIntered'].setValue(this.info.dataExtra['productsIntered']);
    this.sellerForm.controls['contactNumber'].setValue(this.info.dataExtra['contactNumber']);
    this.sellerForm.controls['currencyTrade'].setValue(this.info.dataExtra['currencyTrade']);
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
    }
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
  
      this.updateAccount(this.info);
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

  updateAccount(data){
    this.rest.updateData('user/'+this.info.id, data).subscribe(res =>{
      console.log(res);
      this.auth.setLoginData(this.info);
      this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})

    },  error =>{
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    })
  }


  updatePassword(){
    
    if(this.repassword == this.password){
      this.rest.updatePassword(this.info.email,this.currentPassword,this.password).subscribe(
        result=>{
          this.toast.success('Password has been changed successfully!', "Error",{positionClass:"toast-top-right"} );
          this.currentPassword='';
          this.password="";
          this.repassword='';
        },error=>{
          console.log(error)
          this.toast.error('Something wrong happened. Maybe your current password is not the correct one', "Error",{positionClass:"toast-top-right"} );
        }
      )
    }
    else{
      this.toast.error('Password and Repeat password not matched', "Error",{positionClass:"toast-top-right"} );
    }
}
}
