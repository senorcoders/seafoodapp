import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

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
  shoppingEnpoint:any = 'shoppingcart/items';
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService) { }

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

  getAllProductsCount(){
    //console.log("products", this.products);
    var items:any = {"items": []};
    this.products.forEach((element, index) => {
      
      console.log("Producto", element);
      let item = { "id": element['id'],
                   "quantity": {
                      "type": element['quantity'].type,
                      "value": element['quantity'].value
                  }}
      items['items'].push(item);
      console.log("Items", items);
      console.log(index, this.products.length);
      if (items['items'].length == this.products.length){
        this.updatecart(items);
        console.log("Actualizar");
      } 

    });
   
  }

  updatecart(items){
     this.productService.updateData(this.shoppingEnpoint, items).subscribe(result => {
      console.log("Updated", result);
      this.toast.success("Cart updated!",'Well Done',{positionClass:"toast-top-right"})

    }, error => {
      this.toast.error("Error updating cart!", "Error",{positionClass:"toast-top-right"} );

    })
  }


}
