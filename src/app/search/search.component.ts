import { Component, OnInit, HostListener } from '@angular/core';
import {ProductService} from '../services/product.service';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  searchForm:FormGroup;
  products:any;
  searchQuery:string;
  API:string="http://138.68.19.227:7000";
  constructor(private product: ProductService, private fb:FormBuilder, private toast:ToastrService) { }
  ngOnInit() {
    this.setHeight(window.innerHeight);
    this.searchForm=this.fb.group({
      search: ['',Validators.required],
    })
  }
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  searchProducts(){
    this.searchQuery=this.searchForm.get('search').value;
    this.product.searchProductByName(this.searchForm.get('search').value).subscribe(
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
