import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

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
  };
  logo:any;
  storeEndpoint:any = "api/store/user/";
  heroEndpoint:any = 'api/store/hero/';
  buttonText:string;
  new:boolean = false;
  fileToUpload: any = [];
  base:string="http://138.68.19.227:7000";
  hero:any;
  fileHero:any = [];
  heroSlider:SafeStyle;
  password:any = "";
  repassword:string;
  showChangeP:boolean=false;
  currentPassword:string;
  email:string;
  constructor(private sanitizer: DomSanitizer,private auth: AuthenticationService,private toast:ToastrService, public productService: ProductService) { }

  ngOnInit() {
    if(this.auth.isLogged()){
      this.loggedIn = true;
      this.getPersonalData();
    }
  }


  getPersonalData(){
    this.info = this.auth.getLoginData();
    console.log(this.info);
    this.getStoreData();
  }

  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.info['id']).subscribe(result =>{
      let res:any = result;
      if(typeof res !== 'undefined' && res.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        console.log(this.store);
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.store.heroImage})`);
        this.buttonText = "Update";
      }else{
        this.buttonText = "Create";
        this.new = true;
      }
     

    })
  }

  onSubmit(){
    console.log("To send", this.info);
    this.productService.updateData('user/'+this.info.id, this.info).subscribe(result => {
        console.log("Resultado", result);
        this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error =>{
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    });
  }

  storeSubmit(){
    if(this.store.name!="" && this.store.description != "" && this.store.location != ""){
      if(this.new){
        this.createStore();
      }else{
        this.updateStore();
      }

    }else{
      this.toast.error("Your store needs a description and location", "Error",{positionClass:"toast-top-right"} );

    }  
  }

  updateStore(){
    let storeToUpdate = {
      name:this.store.name,
      description: this.store.description,
      location: this.store.location
    }

    this.productService.updateData('store/'+this.store.id, storeToUpdate).subscribe(result=>{
      if(this.fileHero.length > 0){
        this.uploadHero();
      }
      if(this.fileToUpload.length>0){
        this.uploadLogo();
      }
      else{
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
        if(this.fileHero.length > 0){
          this.uploadHero();
        }else{
          this.toast.success("Your store has been created successfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

      })
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log("Files", files);
  }

  handleFileHero(files: FileList){
    this.fileHero = files;
    console.log("Files", files);

  }
  updatePassword(){
    
      if(this.repassword == this.password){
        this.productService.updatePassword(this.info.email,this.currentPassword,this.password).subscribe(
          result=>{
            this.toast.success('Password has been changed successfully!', "Error",{positionClass:"toast-top-right"} );
            this.currentPassword='';
            this.password="";
            this.repassword='';
            this.showChangeP=false;
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
  showChangePassword(){
    this.showChangeP=true
  }
  uploadHero(){
    this.productService.uploadFile(this.heroEndpoint+this.store.id, "hero", this.fileHero).subscribe(result => {
      this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
      this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }
  uploadLogo(){
    this.productService.uploadFile('api/store/logo/'+this.store.id, "logo", this.fileToUpload).subscribe(result => {
      this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
      this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }

}
