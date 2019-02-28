import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { IsLoginService } from '../core/login/is-login.service';
import { environment } from '../../environments/environment';
import { PasswordValidation } from '../password';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  buyerForm: FormGroup;
  sellerForm: FormGroup;
  buyerShow: boolean = true;
  sellerShow: boolean = false;
  showConfirmation = true;
  email: string;
  showEmailVerification: boolean = false;
  file: any = [];
  userID: any;
  storeID: any;
  image: any;
  regex: string = '(?=.*)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9_]).{8,20}$';
  sub: any;
  countries = environment.countries
  registerVal;
  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router, private toast: ToastrService, private isLoggedSr: IsLoginService, private product: ProductService, private route: ActivatedRoute) {
    this.redirectHome();
    this.sub = this.route.queryParams.subscribe(params => {
      if (!params['register']) {
        this.showBuyer();
      }
      else {
        (params['register'] == 'seller') ? this.showSeller() : this.showBuyer();
      }



    })
  }



  ngOnInit() {
    // this.RegisterBuyerForm();
    this.RegisterBuyerForm();
    this.RegistersellerForm();


  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  showBuyer() {
    this.buyerShow = true;
    this.sellerShow = false;
    this.registerVal = '2';
  }

  showSeller() {
    this.buyerShow = false;
    this.sellerShow = true;
    this.RegistersellerForm();
    this.registerVal = '1';

  }
  redirectHome() {
    if (this.auth.isLogged()) {
      this.router.navigate(["/home"])
    }
  }
  RegisterBuyerForm() {
    this.buyerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      location: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.regex)]],
      rePassword: ['', Validators.required],
      tel: ['', [Validators.required]],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      TypeBusiness: ['', Validators.required],
      companyName: ['', Validators.required],
      tcs: ['', Validators.requiredTrue]
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }
  RegistersellerForm() {
    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.pattern(this.regex)]],
      rePassword: ['', Validators.required],
      tel: ['', [Validators.required]],
      location: ['', Validators.required],
      Address: ['', Validators.required],
      City: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      tcs: ['', Validators.requiredTrue],
      TradeBrandName: ['', Validators.required],
      TradeLicenseNumber: ['', Validators.required],
      FoodSafetyCertificateNumber: ['', Validators.required],
      CorporateBankAccountNumber: ['', Validators.required],
      swiftCode: ['', Validators.nullValidator],
      CurrencyofTrade: ['', Validators.required],
      ContactNumber: ['', Validators.required],
      ProductsInterestedSelling: ['', Validators.required],
    }, {
        validator: PasswordValidation.MatchPassword
      })
  }
  register() {
    if (this.sellerShow) {
      if (this.sellerForm.valid) {
        this.submitRegistrationSeller();
      } else {
        this.validateAllFormFields(this.sellerForm);
      }
    }
    else {
      if (this.buyerForm.valid) {
        console.log("Valid");
        this.submitRegistrationBuyer();
        console.log(this.buyerForm.value);
      } else {
        console.log("Invalid");
        this.validateAllFormFields(this.buyerForm);
      }

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

  submitRegistrationBuyer() {
    let dataExtra = {
      "country": this.buyerForm.get('location').value,
      "tel": this.buyerForm.get('tel').value,
      "Address": this.buyerForm.get('Address').value,
      "City": this.buyerForm.get('City').value,
      "companyName": this.buyerForm.get('companyName').value,
      "typeBusiness": this.buyerForm.get('TypeBusiness').value
    }
    this.auth.register(this.buyerForm.value, 2, dataExtra).subscribe(
      result => {
        this.email = this.buyerForm.get('email').value;
        this.showConfirmation = false;
      },
      error => {
        console.log(error);
        this.showError(error.error);
      }
    )

  }


  createStore() {
    let store = {
      "name": this.sellerForm.get('companyName').value,
      "owner": this.userID,
      "description": ""
    }
    this.product.saveData('api/store/', store).subscribe(
      result => {
        this.storeID = result[0].id;
        //update store with full data, api is working in this way
        let storeFullData = {
          "companyName": this.sellerForm.get('companyName').value,
          "companyType": this.sellerForm.get('companyType').value,
          "location": this.sellerForm.get('location').value,
          "Address": this.sellerForm.get('Address').value,
          "City": this.sellerForm.get('City').value,
          "ContactNumber": this.sellerForm.get('ContactNumber').value,
          "CorporateBankAccountNumber": this.sellerForm.get('CorporateBankAccountNumber').value,
          "CurrencyofTrade": this.sellerForm.get('CurrencyofTrade').value,
          "FoodSafetyCertificateNumber": this.sellerForm.get('FoodSafetyCertificateNumber').value,
          "ProductsInterestedSelling": this.sellerForm.get('ProductsInterestedSelling').value,
          "TradeBrandName": this.sellerForm.get('TradeBrandName').value,
          "TradeLicenseNumber": this.sellerForm.get('TradeLicenseNumber').value
        }
        console.log(this.storeID)
        this.product.updateData('store/' + this.storeID, storeFullData).subscribe(
          result => {
            this.showConfirmation = false;
          },
          error => {
            this.showError(error.error)
            //if store has error. delete user and store
            this.product.deleteData('user/' + this.userID).subscribe(
              result => { console.log(result) }, e => { console.log(e) })
            this.product.deleteData('store/' + this.storeID).subscribe(
              result => { console.log(result) }, e => { console.log(e) })
            console.log(error)
          }
        )
      },
      error => {
        this.showError(error.error)
        console.log(error)
      }
    )
  }


  submitRegistrationSeller() {
    let dataExtra = {
      "tel": this.sellerForm.get('tel').value,
      'country': this.sellerForm.get('location').value,
      'Address': this.sellerForm.get('Address').value,
      'City': this.sellerForm.get('City').value,
      'companyName': this.sellerForm.get('companyName').value,
      'companyType': this.sellerForm.get('companyType').value,
      'licenseNumber': this.sellerForm.get('TradeLicenseNumber').value,
      'iso': this.sellerForm.get('FoodSafetyCertificateNumber').value,
      "swiftCode": this.sellerForm.get('swiftCode').value,
      'iban': this.sellerForm.get('CorporateBankAccountNumber').value,
      'productsIntered': this.sellerForm.get('ProductsInterestedSelling').value,
      'contactNumber': this.sellerForm.get('ContactNumber').value,
      'currencyTrade': this.sellerForm.get('CurrencyofTrade').value,
      'trade': this.sellerForm.get('TradeBrandName').value
    };
    console.log(dataExtra);
    // this.auth.register(this.sellerForm.value, 1, dataExtra).subscribe(res => {
    //   console.log("Res", res);
    //   this.email = this.sellerForm.get('email').value;
    //   this.userID = res['id']

    //   this.createStore();
    //   // this.showConfirmation=false;

    // }, error => {
    //   this.showError(error.error)

    // });


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
  showForm(value) {
    if (value == 1) {
      this.RegistersellerForm();
      this.sellerShow = true;
      this.buyerShow = false;
    }
    else {
      this.buyerShow = true;
      this.sellerShow = false;
    }
  }
  upload(file: FileList) {
    this.file = file
  }
  verifyEmail(email) {
    this.auth.getData(`user?where={"email":{"like":"${email}"}}`).subscribe(
      result => {
        //if return data it means that email is already used
        if (result && result['length'] > 0) {
          this.showEmailVerification = true
        }
        else {
          this.showEmailVerification = false
        }
      }, e => { this.showEmailVerification = false }
    )
  }
  uploadFile(id) {
    if (this.file.length > 0) {
      this.product.uploadFile('api/user/license/' + id, "license", this.file).subscribe(result => {
        this.toast.success("Your Licence has been upload successfully!", 'Well Done', { positionClass: "toast-top-right" })
      }, error => {
        this.toast.error("Something wrong happened, please try again", "Error", { positionClass: "toast-top-right" });
      })
    }
  }
  showError(e) {
    this.toast.error(e, 'Error', { positionClass: "toast-top-right" })
  }
  showSuccess(s) {
    this.toast.success(s, 'Well Done', { positionClass: "toast-top-right" })
  }

  changeListener($event): void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.buyerForm.patchValue({
        logoCompany: myReader.result
      });
    }
    myReader.readAsDataURL(file);
  }
}
