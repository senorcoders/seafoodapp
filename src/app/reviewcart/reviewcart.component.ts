import { Component, OnInit } from '@angular/core';
import { CartService } from '../core/cart/cart.service';
import { OrderService } from '../services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reviewcart',
  templateUrl: './reviewcart.component.html',
  styleUrls: ['./reviewcart.component.scss']
})
export class ReviewcartComponent implements OnInit {
  products: any = [];
  total: any;
  totalOtherFees: number;
  shipping: any;
  totalWithShipping: any;
  buyerId: string;
  shoppingCartId: any;


  constructor(
    private Cart: CartService,
    private orders: OrderService,
    private route: ActivatedRoute,
    private router: Router,


  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
      this.getCart();

    });

  }

  getCart() {


    this.Cart.cart.subscribe((cart: any) => {
      if (cart && cart['items'] !== '') {
        this.products = cart['items'];
        /*this.total=cart['total'];
        this.shipping=cart['shipping']
        this.totalOtherFees=cart['totalOtherFees']*/
        this.totalWithShipping = this.total + this.shipping + this.totalOtherFees;
        this.buyerId = cart['buyer'];

        this.orders.getCart(this.buyerId)
          .subscribe(
            res => {
              this.total = res['subTotal'];
              this.shipping = res['shipping'];
              this.totalOtherFees = res['totalOtherFees'] + res['uaeTaxes'];
              this.totalWithShipping = res['total'];
            },
            error => {
              console.log(error);
            }
          );
      }

    });
  }

  getTotalxItem(count, price) {
    return count * price;
  }

  goToNextPage(){
        this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

  }

}
