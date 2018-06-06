import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  productID:any; 
  name:any;
  description:any;
  country: any;
  price:any;
  images: any = [];
  priceDesc:any;
  base:any = "http://138.68.19.227:7000";
  category:any;
  show:boolean = false;
  cart:any;
  count:number = 1;
  cartEndpoint:any = 'api/shopping/add/';
  priceValue:any;
  priceType:any;
  measurement:any;
  showCart:boolean = false;
  constructor(private route: ActivatedRoute, public productService: ProductService, private auth: AuthenticationService, private toast:ToastrService) { }

  ngOnInit() {
    this.productID= this.route.snapshot.params['id'];
    this.getProductDetail();
    this.getCart();
  }


  getProductDetail(){
    this.productService.getProductDetail(this.productID).subscribe(data => {
      console.log("Product", data);
      this.name = data['name'];
      this.description = data['description'];
      this.images = data['images'];
      this.price = data['price'].description;
      this.category = data['type'].name;
      this.show = true;
      this.priceValue = data['price'].value;
      this.priceType = data['price'].type;
      this.measurement = data['weight'].type;
  }, error=>{
    console.log("Error", error)
  });
  }

  getCart(){
    this.cart = this.auth.getCart();
  }

  increaseCount(){
    this.count++;
  }

  dicreaseCount(){
    console.log(this.count);
    if(this.count > 1){
      this.count--;

    }

  }

  addToCart(){
    let item = {
      "fish":this.productID,
      "price": {
              "type": this.priceType,
              "value": this.priceValue
          },
      "quantity": {
          "type": this.measurement,
          "value": this.count
      }
  }
    this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(result => {
        console.log("Item added", result);
        this.showCart = true;
        console.log(this.showCart);
        this.toast.success("Product added to the cart!",'Product added',{positionClass:"toast-top-right"});

    })
  }

}
