import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/orders.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-reviewcart',
  templateUrl: './reviewcart.component.html',
  styleUrls: ['./reviewcart.component.scss']
})
export class ReviewcartComponent implements OnInit {
  products: any = [];
  total: any;
  totalOtherFees: any;
  shipping: any;
  totalWithShipping: any;
  buyerId: string;
  shoppingCartId: any;
  userInfo:any;

  constructor(
    private orders: OrderService,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService


  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
      this.userInfo = this.auth.getLoginData();
      this.buyerId = this.userInfo['id'];
      this.getCart();

    });

  }

  getCart() {
   this.orders.getCart(this.buyerId)
          .subscribe(
            res => {
              if (res && res['items'] !== '') {
              this.products = res['items'];

              console.log(res);
              this.total = res['subTotal'];
              this.shipping = res['shipping'];
              this.totalOtherFees = res['totalOtherFees'] + res['uaeTaxes'];
              this.totalWithShipping = res['total'];
              localStorage.setItem('shippingCost', this.shipping);
              localStorage.setItem('shoppingTotal', this.totalWithShipping);
              localStorage.setItem('shoppingCartId', this.shoppingCartId);
              localStorage.setItem('totalOtherFees', this.totalOtherFees);
            }
          
            },
            error => {
              console.log(error);
            }
          );
  
  }

  getTotalxItem(count, price) {
    return count * price;
  }

  goToNextPage(){
        this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

  }

}
