import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-reviewcart',
  templateUrl: './reviewcart.component.html',
  styleUrls: ['./reviewcart.component.scss']
})
export class ReviewcartComponent implements OnInit {

  shoppingCartId: any;
  checked:boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location


  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.shoppingCartId = params['shoppingCartId'];
    });

  }



  goToNextPage(){
        this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

  }

  back(){
    this._location.back();
  }

}
