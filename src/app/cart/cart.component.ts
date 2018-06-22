import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { CartService } from '../core/cart/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  buyerId:any;
  products:any = [];
  empty:boolean;
  showLoading:boolean=true;
  total:any;
  shoppingEnpoint:any = 'shoppingcart/items';
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService, private Cart: CartService) { }

  ngOnInit() {
    this.getCart();
  }

  getCart(){
    this.Cart.cart.subscribe((cart:any)=>{
      if(cart && cart['items'] !=''){
        this.products=cart['items'];
        this.total=cart['total'];
        this.buyerId=cart['buyer']
        this.empty=false;
        this.showLoading=false;
      }
      else{
        this.showLoading=false;
        this.empty = true;
      }
    })
  }

  getItems(){
    let cart = {
      "buyer": this.buyerId
    }
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      this.Cart.setCart(result)
      this.toast.success("Cart updated!",'Well Done',{positionClass:"toast-top-right"})
    },e=>{console.log(e)})
  }

  getTotalxItem(count, price){
    return count*price;
  }
  deleteItem(i, id){
    this.productService.deleteData(`itemshopping/${id}`).subscribe(
      result=>{
        this.getItems();
      },
      e=>{
        this.toast.error("Error deleting item!", "Error",{positionClass:"toast-top-right"} );
        console.log(e)
      }
    )
  }

  getAllProductsCount(){
    var items:any = {"items": []};
    this.products.forEach((element, index) => {
      let item = { 
        "id": element['id'],
        "quantity": {
          "type": element['quantity'].type,
          "value": element['quantity'].value
        }
      }
      items['items'].push(item);
      if (items['items'].length == this.products.length){
        this.updatecart(items);
      } 
    });
  }

  updatecart(items){
    this.productService.updateData(this.shoppingEnpoint, items).subscribe(result => {
      this.getItems()
    }, error => {
      this.toast.error("Error updating cart!", "Error",{positionClass:"toast-top-right"} );

    })
  }


}
