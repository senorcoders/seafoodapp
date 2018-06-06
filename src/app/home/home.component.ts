import { Component, OnInit } from '@angular/core';
import {ProductService} from'../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products:any;
  API:string="http://138.68.19.227:7000";
  constructor(private product:ProductService) { }
  ngOnInit() {
    let data={
      pageNumber:0,
      numberProduct: 9
    }
   this.product.listProduct(data).subscribe(
    result=>{
      this.products=result;
      console.log(this.products)
    },error=>{
      console.log(error)
    }
   )
  }

}
