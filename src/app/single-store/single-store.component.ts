import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-single-store',
  templateUrl: './single-store.component.html',
  styleUrls: ['./single-store.component.scss']
})
export class SingleStoreComponent implements OnInit {
  userID:any;
  storeEndpoint:any = "api/store/user/";
  store:any = {
    name:"",
    description: "",
    location: "",
  };  
  hero:any;
  logo:any;
  base:string="http://138.68.19.227:7000";
  products:any = [];
  empty:boolean = false;



  constructor(private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.userID= this.route.snapshot.params['id'];
    this.getPersonalData();
  }

  getPersonalData(){
    this.getStoreData();
  }

  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.userID).subscribe(result =>{
      let res:any = result;
      if(typeof res !== 'undefined' && res.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        console.log(this.store);
        this.getProducts();

       
      }else{
        console.log("No tiene storre");
        this.empty = true;
      }
     

    })
  }

  getProducts(){
    this.productService.getData('store/' + this.store.id).subscribe(result => {
      console.log("Res", result);
      this.products = result['fish'];
    })
  }

  smallDesc(str) {
    return str.split(/\s+/).slice(0,20).join(" ");
}

}
