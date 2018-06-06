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
  storeEndpoint:any = "api/store/user/";
  buttonText:string;

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
        console.log(this.store);
        this.buttonText = "Update";
      }else{
        this.buttonText = "Create";
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

}
