import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedIn:boolean = false;
  info:any;
  store:any = {
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



  constructor(private auth: AuthenticationService,private toast:ToastrService, public productService: ProductService) { }

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
      if(typeof result !== 'undefined' && result.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        console.log(this.store);
        this.buttonText = "Update";
      }else{
        this.buttonText = "Create";
        this.new = true;
      }
     

    })
  }

  onSubmit(){
    this.productService.updateData('user/'+this.info.id, this.info).subscribe(result => {
        console.log("Resultado", result);
        this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error =>{
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    });
  }

  storeSubmit(){
    if(this.store.description != "" && this.store.location != ""){
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
      description: this.store.description,
      location: this.store.location
    }

    this.productService.updateData('store/'+this.store.id, storeToUpdate).subscribe(result=>{
      if(this.fileHero.length > 0){
        this.uploadHero();
      }else{
        this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})

      }

    })
  }
  createStore(){
    let myStore = {
      owner: this.info['id'],
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

  uploadHero(){
    this.productService.uploadFile(this.heroEndpoint+this.store.id, "hero", this.fileHero).subscribe(result => {
      this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }

}
