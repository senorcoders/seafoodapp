import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedIn:boolean = false;
  info:any;
  store:any = {
    name:"",
    description: "",
    location: "",
    type:"",
    productType:"",
    email:"",
    Address:"",
    City:"",
    zipCode:""
  };
  logo:any;
  storeEndpoint:any = "api/store/user/";
  heroEndpoint:any = 'api/store/hero/';
  buttonText:string;
  new:boolean = false;
  fileToUpload: any = [];
  base:string=environment.apiURLImg;
  hero:any;
  fileHero:any = [];
  heroSlider:SafeStyle;
  password:any = "";
  repassword:string;
  currentPassword:string;
  email:string;
  countries=environment.countries;
  fileSfs:any=[];
  showLoading:boolean=false;
  salesImg:any;
  tradeImg:any;
  importImg:any;
  HsImg:any;
  logoCompany:any = "";
  updateForm: FormGroup; 
  buyerFirstName: FormControl;
  buyerLastName: FormControl;
  buyerEmail : FormControl;
  buyerCountry: FormControl;
  buyerAddress: FormControl;
  buyerCity: FormControl;
  buyerZipcode: FormControl;
  buyerTelephone: FormControl;
  buyerDesignation: FormControl;
  buyerCompanyName: FormControl;
  buyerDeliveryAddress: FormControl;
  buyerCompanyEmail: FormControl;
  buyerCompanyTelephone: FormControl;
  buyerBankingInfo: FormControl;
  buyerLogoCompany: FormControl;
  sellerBankName: any;
  sellerBankBranch: any;
  sellerBankAddress: any;

  constructor(private sanitizer: DomSanitizer,private auth: AuthenticationService,private toast:ToastrService, public productService: ProductService) { }

  ngOnInit() {
    if(this.auth.isLogged()){
      this.loggedIn = true;
      this.getPersonalData();
      this.createFormControls();
      this.createForm();
      this.setValues();
    }
  }

  createFormControls(){
    this.buyerFirstName = new FormControl('', [Validators.required]);
    this.buyerLastName = new FormControl('',[Validators.required]);
    this.buyerEmail = new FormControl('', [Validators.email, Validators.required]);
    this.buyerCountry = new FormControl('',[Validators.required]);
    this.buyerAddress = new FormControl('',[Validators.required]);
    this.buyerCity = new FormControl('',[Validators.required]);
    this.buyerZipcode = new FormControl('',[Validators.required]);
    this.buyerTelephone = new FormControl('',[Validators.required, Validators.pattern('[0-9]+')]);
    this.buyerDesignation = new FormControl('',[Validators.required]);
    this.buyerCompanyName = new FormControl('',[Validators.required]);
    this.buyerDeliveryAddress = new FormControl('',[Validators.required]);
    this.buyerCompanyEmail = new FormControl('', [Validators.email, Validators.required]);
    this.buyerCompanyTelephone = new FormControl('',[Validators.required, Validators.pattern('[0-9]+')]);
    this.buyerBankingInfo = new FormControl(['']);
    this.buyerLogoCompany = new FormControl([null]);
  }

  createForm(){
    this.updateForm = new FormGroup({
        firstName: this.buyerFirstName,
        lastName: this.buyerLastName,
        email: this.buyerEmail,
        country: this.buyerCountry,
        address: this.buyerAddress,
        city: this.buyerCity,
        zipcode: this.buyerZipcode,
        telephone: this.buyerTelephone,
        designation: this.buyerDesignation,
        companyName: this.buyerCompanyName,
        deliveryAddress: this.buyerDeliveryAddress,
        companyEmail: this.buyerCompanyEmail,
        companyTelephone: this.buyerCompanyTelephone,
        bankingInfo: this.buyerBankingInfo,
        logoCompany: this.buyerLogoCompany


    }, {
      updateOn: 'submit'
    });
  }

  setValues(){
    this.updateForm.controls['firstName'].setValue(this.info.firstName);
    this.updateForm.controls['lastName'].setValue(this.info.lastName);
    this.updateForm.controls['email'].setValue(this.info.email);
    this.updateForm.controls['country'].setValue(this.info.dataExtra['country']);
    this.updateForm.controls['address'].setValue(this.info.dataExtra['Address']);
    this.updateForm.controls['city'].setValue(this.info.dataExtra['City']);
    this.updateForm.controls['zipcode'].setValue(this.info.dataExtra['zipCode']);
    this.updateForm.controls['telephone'].setValue(this.info.dataExtra['tel']);
    this.updateForm.controls['designation'].setValue(this.info.dataExtra['designation']);
    this.updateForm.controls['companyName'].setValue(this.info.dataExtra['companyName']);
    this.updateForm.controls['deliveryAddress'].setValue(this.info.dataExtra['deliveryAddress']);
    this.updateForm.controls['companyEmail'].setValue(this.info.dataExtra['companyEmail']);
    this.updateForm.controls['companyTelephone'].setValue(this.info.dataExtra['companyTel']);
    this.updateForm.controls['bankingInfo'].setValue(this.info.dataExtra['fullBakingInfo']);
  }
  getPersonalData(){
    this.info = this.auth.getLoginData();
    console.log("Info", this.info);
    this.getStoreData();
  }
  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.info['id']).subscribe(result =>{
      let res:any = result;
      console.log(result);
      if(typeof res !== 'undefined' && res.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.store.heroImage})`);
        this.buttonText = "Update";
        this.new = false;
        this.HsImg=result[0]['SFS_HSCode'];
        this.importImg=result[0]['SFS_ImportCode'];
        this.salesImg=result[0]['SFS_SalesOrderForm'];
        this.tradeImg=result[0]['SFS_TradeLicense']
      }else{
        this.buttonText = "Create";
        this.new = true;
      }
    })
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

  onSubmit(){
    if(this.updateForm.valid){
      console.log("Valido");

      this.info.firstName = this.updateForm.get('firstName').value;
      this.info.lastName = this.updateForm.get('lastName').value;
      this.info.email = this.updateForm.get('email').value;
      this.info.dataExtra['country'] = this.updateForm.get('country').value;
      this.info.dataExtra['Address'] = this.updateForm.get('address').value;
      this.info.dataExtra['City'] = this.updateForm.get('city').value;
      this.info.dataExtra['zipCode'] = this.updateForm.get('zipcode').value;
      this.info.dataExtra['tel'] = this.updateForm.get('telephone').value;
      this.info.dataExtra['designation'] = this.updateForm.get('designation').value;
      this.info.dataExtra['companyName'] = this.updateForm.get('companyName').value;
      this.info.dataExtra['deliveryAddress'] = this.updateForm.get('deliveryAddress').value;
      this.info.dataExtra['companyEmail'] = this.updateForm.get('companyEmail').value;
      this.info.dataExtra['companyTel'] = this.updateForm.get('companyTelephone').value;
      this.info.dataExtra['fullBakingInfo'] = this.updateForm.get('bankingInfo').value;
      this.info.bankName = this.sellerBankName;
      this.info.bankBranch = this.sellerBankBranch;
      this.info.bankAddress = this.sellerBankAddress;
      this.updateAccount();
    }else{
      this.validateAllFormFields(this.updateForm);
    }
   
  }


  updateAccount(){
    
    console.log(this.info);
     this.productService.updateData('user/'+this.info.id, this.info).subscribe(result => {
       this.auth.setLoginData(this.info);
        if(this.logoCompany != ""){
          this.saveLogoImage();
        }else{
          this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        }

    }, error =>{
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    });
  }

  saveLogoImage(){
    this.productService.updateData('api/user-logo-company', {"id": this.info.id, "logoCompany": this.logoCompany})
      .subscribe(res => {
        this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})

      })
  }
  storeSubmit(){
    if(this.store.name!="" && this.store.description != "" && this.store.location != ""){
      if(this.new){
        if(this.fileSfs && this.fileSfs.length>0){
          this.createStore();
        }
        else{
          this.toast.error("Please fill all the required fields", "Error",{positionClass:"toast-top-right"} )
        }
      }else{
        this.updateStore();
      }

    }else{
      this.toast.error("Please fill all the required fields", "Error",{positionClass:"toast-top-right"} );

    }  
  }
  updateStore(){
    let storeToUpdate = {
      name:this.store.name,
      description: this.store.description,
      location: this.store.location,
      type:this.store.type,
      productType:this.store.productType,
      email:this.store.email,
      Address:this.store.Address,
      City:this.store.City,
      zipCode:this.store.zipCode
    }

    this.productService.updateData('store/'+this.store.id, storeToUpdate).subscribe(result=>{
      //update sfs files
      if(this.fileSfs && this.fileSfs.length>0){
        if(this.fileSfs[0] && this.fileSfs[0].length>0){
          this.updateSfs(result['id'],'SFS_SalesOrderForm',0)
        }
        if(this.fileSfs[1] && this.fileSfs[1].length>0){
          this.updateSfs(result['id'],'SFS_TradeLicense',1)
        }
        if(this.fileSfs[2] && this.fileSfs[2].length>0){
          this.updateSfs(result['id'],'SFS_ImportCode',2)
        }
         if(this.fileSfs[3] && this.fileSfs[3].length>0){
          this.updateSfs(result['id'],'SFS_HSCode',3)
        }
      }
      if(this.fileHero.length > 0 || this.fileToUpload.length>0){
        this.updateFile(this.store.id);
      }else{
        this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})

      }

    }) 
  }
  createStore(){
    let myStore = {
      owner: this.info['id'],
      name:this.store.name,
      description: this.store.description,
      location: this.store.location
    }
      this.productService.postStoreForm(myStore, this.fileToUpload).subscribe(result => {
        this.uploadSfsImages(result['id']);
        if(this.fileHero.length > 0 || this.fileToUpload.length>0){
          this.uploadHero(result[0]['id']);
        }else{
          this.toast.success("Your store has been created successfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

      })
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
  }
  handleFileHero(files: FileList){
    this.fileHero = files;
  }
  handleFileSfs(files: FileList,i){
    this.fileSfs[i] = files;
    console.log(this.fileSfs)
  }
  updatePassword(){
    
      if(this.repassword == this.password){
        this.productService.updatePassword(this.info.email,this.currentPassword,this.password).subscribe(
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
  uploadHero(id){
    this.productService.uploadFile(this.heroEndpoint+id, "hero", this.fileHero).subscribe(result => {
      this.toast.success("Your store has been created successfully!",'Well Done',{positionClass:"toast-top-right"})
      this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
      this.getStoreData();
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }
  updateFile(id){
    if(this.fileToUpload.length>0){
      this.productService.uploadFile('api/store/logo/'+id, "logo", this.fileToUpload).subscribe(result => {
        this.toast.success("Your store's logo has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData();
      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );
      })
    }
    if(this.fileHero.length > 0){
      this.productService.uploadFile(this.heroEndpoint+id, "hero", this.fileHero).subscribe(result => {
        this.toast.success("Your store's hero has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData();
      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

      })
    }
  }
  updateSfs(id,file,index){
    this.showLoading=true
    this.productService.updateFile('image/store/sfs/'+file+'/'+id, this.fileSfs[index]).subscribe(result => {
      this.toast.success(file+" file uploaded",'Well Done',{positionClass:"toast-top-right"})
      this.getStoreData();
      this.showLoading=false
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }
  uploadSfsImages(id){
    this.showLoading=true
    this.productService.sfsFiles('api/store/sfs/'+id, "sfs", this.fileSfs).subscribe(result => {
      this.toast.success("Sfs files uploaded",'Well Done',{positionClass:"toast-top-right"})
      this.getStoreData();
      this.showLoading=false
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }

  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
    
        this.logoCompany = myReader.result
      
    }
    myReader.readAsDataURL(file);
  }
}
