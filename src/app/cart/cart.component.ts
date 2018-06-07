import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart:any;
  products:any = [];
  empty:boolean = true;
  total:any;
  constructor(private auth: AuthenticationService, private productService: ProductService) { }

  ngOnInit() {
    this.getCart();
  }

  getCart(){
   this.cart =  this.auth.getCart();
   this.getItems();
  }

  getItems(){
    this.productService.getData("shoppingcart/" + this.cart.id).subscribe(result => {
        console.log("Products", result);
        this.products = result['items'];
        this.total = result['total'];
        if (this.products.length > 0){
          this.empty = false;
        }
    })
  }

  getTotalxItem(count, price){
    return count*price;
  }

  deleteNode(i){
    this.products.splice(i, 1);
    console.log(this.products);
  }

 

}
