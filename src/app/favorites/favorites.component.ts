import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
	favorites:any;
	userId:string;
	hasFavorite:boolean;
	showLoading:boolean=true;
  images:any=[];
  API:string="https://apiseafood.senorcoders.com";
  constructor(public productService: ProductService, private toast:ToastrService, private router: Router, private auth:AuthenticationService,private sanitizer: DomSanitizer) { }

  ngOnInit() {
  	let data=this.auth.getLoginData();
  	this.userId=data['id'];
  	this.getFavorites()
  }
  getFavorites(){
  	this.productService.getData('api/favoritefish/'+this.userId).subscribe(
  		result=>{
  			this.favorites=result;
        this.favorites.forEach((data, index)=>{
            
            if (data.fish.imagePrimary && data.fish.imagePrimary !='') {
              this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.imagePrimary})`)
            }
            else if(data.fish.images && data.fish.images.length>0){
              this.images[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.images[0].src})`)
            }
            else{
              this.images[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
            }
         });
  			this.showLoading=false
  			if(this.favorites.length>0){
  				this.hasFavorite=true;
  			}
  			else{
  				this.hasFavorite=false;
  			}
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  deletefavorite(id){
  	this.productService.deleteData('FavoriteFish/'+id).subscribe(
      result=>{
        this.toast.success('Favorite was deleted', 'Fine',{positionClass:"toast-top-right"})
        this.getFavorites();
      },
      e=>{
      	this.toast.error('Something wrong happened, Please try again', 'Error',{positionClass:"toast-top-right"})
        console.log(e)
      }
    )
  }
}
