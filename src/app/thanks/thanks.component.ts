import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit {
  loadProduct:boolean=true;
  products:any = [];
  API:string=environment.apiURLImg;

  constructor(private product:ProductService) { }

  ngOnInit() {
    this.getComingsoon();
  }

  getComingsoon(){
    let json = {
      "category":"0","subcategory":"0","subspecies":"0","descriptor":"0","country":"0","raised":[],"preparation":[],"treatment":[],"minPrice":"0","maxPrice":"0","minimumOrder":"0","maximumOrder":"0","cooming_soon":"true"};
    console.log(json);
    this.product.saveData('fish/filter', json).subscribe(
      result=>{
        console.log("prod", result);
        this.products = result;
        this.loadProduct = false;
      },
      error=>{
        console.log(error);
      }
    )
  }

  getShortDesc(data){  
    if(data.length>20){
        let text=data.split(/\s+/).slice(0,20).join(" ")
        return text+'...' 
    }
    else{
      return data
    }
  }
}
