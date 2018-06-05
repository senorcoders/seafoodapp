import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archive-products',
  templateUrl: './archive-products.component.html',
  styleUrls: ['./archive-products.component.scss']
})
export class ArchiveProductsComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  category:string;
  products:any;
  API:string="http://138.68.19.227:7000";
  prvPage =0;
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor(private route: ActivatedRoute, private product:ProductService, private toast:ToastrService) { }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
 
  ngOnInit() {
    this.category= this.route.snapshot.params['category'];
    this.product.getProdutsByCategory(this.category,0).subscribe(
      result=>{
        this.products=result
        console.log(this.products)
      },
      error=>{
        this.showError(error.error);
        console.log(error)
      }
    )
    this.setHeight(window.innerHeight);
  }
 showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  nextPage(){
    this.prvPage=this.prvPage+1;
    this.product.getProdutsByCategory(this.category, this.prvPage).subscribe(
      result=>{
        this.products=result;
        console.log(result)
        console.log(this.products)
      },
      error=>{
        console.log(error)
      }
    )
  }
previousPage(){
    this.prvPage=this.prvPage-1;
    this.product.getProdutsByCategory(this.category, this.prvPage).subscribe(
      result=>{
        this.products=result;
      },
      error=>{
        console.log(error)
      }
    )
}
}
