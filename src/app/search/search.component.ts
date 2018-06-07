import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm:FormGroup;
  products:any;
  searchQuery:string;
  API:string="http://138.68.19.227:7000";
  constructor(private route: ActivatedRoute,private product: ProductService, private fb:FormBuilder, private toast:ToastrService) { }
  ngOnInit() {
    this.searchForm=this.fb.group({
      search: ['',Validators.required],
    })
    this.route.params.subscribe(params => {
      this.searchQuery= this.route.snapshot.params['search'];
      this.searchProducts(this.searchQuery);
    })
  }
  searchProducts(query){
    this.searchQuery=query;
    this.product.searchProductByName(query).subscribe(
      result=>{
        this.products=result;
      },
      error=>{
        console.log(error)
      }
    )
  }
   showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  smallDesc(str) {
   return str.split(/\s+/).slice(0,20).join(" ");
  }
}
