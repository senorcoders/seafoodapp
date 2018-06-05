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
  showPrvP:boolean= false;
  showNextP:boolean=false;
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
        this.nextProductsExist()
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
  nextProductsExist(){
    if(this.products.length>1){
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
}
