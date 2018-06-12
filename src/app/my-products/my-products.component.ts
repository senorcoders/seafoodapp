import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  info:any;
  storeEndpoint:any = 'api/store/user/';
  products:any = [];
  store:any;
  base:string="http://138.68.19.227:7000";


  constructor(private auth: AuthenticationService, private productService: ProductService, private toast:ToastrService) { }

  ngOnInit() {
    this.getMyData();
  }

  getMyData(){
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getStore(){
    this.productService.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results[0];
      this.getProducts();
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

deleteProduct(id, index){
  this.productService.deleteData('api/fish/'+id).subscribe(result =>{
    console.log("Done", result);
    this.deleteNode(index);
    this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}

deleteNode(i){
  this.products.splice(i, 1);
  console.log(this.products);
}



}
