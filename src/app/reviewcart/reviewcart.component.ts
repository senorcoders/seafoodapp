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

  shoppingCartId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
   


  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
    });

  }



  goToNextPage(){
        this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

  }

}
