import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archive-products',
  templateUrl: './archive-products.component.html',
  styleUrls: ['./archive-products.component.scss']
})
export class ArchiveProductsComponent implements OnInit {
  category:string;
  products:any;
  API:string="http://138.68.19.227:7000";
  prvPage =0;
  showPrvP:boolean= false;
  showNextP:boolean=false;
  showNotFound=false;
  constructor(private route: ActivatedRoute, private product:ProductService, private toast:ToastrService) { }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.category= this.route.snapshot.params['category'];
      this.product.getProdutsByCategory(this.category,0).subscribe(
      result=>{
        this.products=result;
        if(this.products.length==0){
          this.showNotFound=true;
        }
        else{
          this.showNotFound=false;
        }
        this.nextProductsExist()
      },
      error=>{
        this.showError(error.error);
        console.log(error)
      }
    )
    });
  }
 showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  nextProductsExist(){
    if(this.products.length>10){
      this.showNextP=true;
    }
    else{
      this.showNextP=false;
    }
  }
  previousProductExist(){
    if(this.prvPage>0){
      this.showPrvP=true;
    }
    else{
      this.showPrvP=false
    }
  }
  nextPage(){
    this.prvPage=this.prvPage+1;
    this.product.getProdutsByCategory(this.category, this.prvPage).subscribe(
      result=>{
        this.products=result;
        this.nextProductsExist();
        this.previousProductExist()
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
        this.previousProductExist();
      },
      error=>{
        console.log(error)
      }
    )
}
smallDesc(str) {
    return str.split(/\s+/).slice(0,20).join(" ");
}
}
