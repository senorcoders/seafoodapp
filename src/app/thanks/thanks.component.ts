import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';
declare var window:any;
@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit {


  constructor(private product:ProductService) { 
   
  }

 ngOnInit() {
    window.history.pushState( {} , 'Shop', '/shop' );
    window.history.pushState( {} , 'Thanks', '/thanks' );

  }


}
