import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

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
  base:string="https://apiseafood.senorcoders.com";
  image:SafeStyle=[];

  constructor(private auth: AuthenticationService, private productService: ProductService, private toast:ToastrService, private sanitizer: DomSanitizer) { }

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
      this.products = result['fishs'];
      //working on the images to use like background
      this.products.forEach((data, index)=>{
        if (data.imagePrimary && data.imagePrimary !='') {
          this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`)
        }
        else if(data.images && data.images.length>0){
          this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.images[0].src})`)
        }
            else{
          this.image[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
        }
      });
    })
  }

  smallDesc(str) {
    return str.split(/\s+/).slice(0,20).join(" ");
}

deleteProduct(id, index){
  this.productService.deleteData('api/fish/'+id).subscribe(result =>{
    this.deleteNode(index);
    this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}

deleteNode(i){
  this.products.splice(i, 1);
  console.log(this.products);
}



}
