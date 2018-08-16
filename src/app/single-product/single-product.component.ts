import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import {IsLoginService} from '../core/login/is-login.service';
import {CartService} from '../core/cart/cart.service';
declare var jQuery:any;
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  productID:any; 
  name:any;
  description:any;
  country: any;
  price:any;
  images: any = [];
  priceDesc:any;
  base:any = "https://apiseafood.senorcoders.com";
  category:any;
  show:boolean = true;
  cart:any;
  count:number = 1;
  cartEndpoint:any = 'api/shopping/add/';
  priceValue:any;
  priceType:any;
  measurement:any;
  showCart:boolean = false;
  mainImg:any;
  slideConfig = {"slidesToShow": 4, "slidesToScroll": 1};
  showLoading:boolean=true;
  isLogged:boolean;
  isFavorite:boolean=false;
  favorite:any;
  idUser:string;
  favoriteId:string;
  role:number;
  storeId:string;
  storeName:string;
  constructor(private route: ActivatedRoute, public productService: ProductService, private auth: AuthenticationService, private toast:ToastrService,
  private router: Router, private isLoggedSr: IsLoginService, private cartService:CartService,private sanitizer: DomSanitizer) { 
}

  ngOnInit() {
    this.isLoggedSr.role.subscribe((role:number)=>{
      this.role=role
    })
    this.productID= this.route.snapshot.params['id'];
    this.getProductDetail(); 
    this.getCart();
     this.isLoggedSr.isLogged.subscribe((val:boolean)=>{
      this.isLogged=val;
    })
    let data=this.auth.getLoginData();
    this.idUser=data['id'];
    this.getFavorite();
  }
getFavorite(){
  let data={
    user:this.idUser,
    fish:this.productID
  }
  this.productService.isFavorite(data).subscribe(
    result=>{
      if(result['msg']){
        this.isFavorite=true
        this.favoriteId=result['id']
      }
      else{
        this.isFavorite=false
      }
    },
    e=>{
      console.log(e)
    }
  )
}
setFlexslider(){
  if(this.mainImg || this.images){
    setTimeout(()=>{
      jQuery('.flexslider').flexslider({
        animation: "slide"
        //controlNav: "thumbnails"
        });
      this.showLoading=false
    },100)
  }
  else{
    this.showLoading=false
  }
}
  getProductDetail(){
    this.productService.getProductDetail(this.productID).subscribe(data => {
      this.name = data['name'];
      this.description = data['description'];
      data['images'].forEach((value)=>{
        this.images.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${value.src})`));
      })
      this.price = data['price'].description;
      this.category = data['type'].name;
      this.show = true;
      this.priceValue = data['price'].value;
      this.priceType = data['price'].type;
      this.measurement = data['weight'].type;
      this.mainImg=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data['imagePrimary']})`);
      this.storeId=data['store'].id;
      this.storeName=data['store'].name;
      this.setFlexslider();
  }, error=>{
    console.log("Error", error)
    this.show=false
  });
  }

  getCart(){
    this.cartService.cart.subscribe((cart:any)=>{
      this.cart=cart
    })
  }

  increaseCount(){
    this.count++;
  }

  dicreaseCount(){
    console.log(this.count);
    if(this.count > 1){
      this.count--;

    }

  }

  addToCart(){
    let item = {
      "fish":this.productID,
      "price": {
              "type": this.priceType,
              "value": this.priceValue
          },
      "quantity": {
          "type": this.measurement,
          "value": this.count
      },
      "shippingStatus":"pending"
  }
    this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(result => {
        this.showCart = true;
        //set the new value to cart
        this.cartService.setCart(result)
        this.toast.success("Product added to the cart!",'Product added',{positionClass:"toast-top-right"});

    })
  }

  goToCart(){
    this.router.navigate([('/cart')]);
  }
  submitFavorite(){
    if(this.isFavorite){
      this.removeFavorite()
    }
    else{
      this.addFavorite();
    }
  }
  addFavorite(){
    let data={
      user:this.idUser,
      fish:this.productID
    }
    this.productService.saveData('FavoriteFish',data).subscribe(
      result=>{
        this.isFavorite=true;
      },
      e=>{
        console.log(e)
      }
    )
  }
  removeFavorite(){
    this.productService.deleteData('FavoriteFish/'+this.favoriteId).subscribe(
      result=>{
        this.isFavorite=false;
      },
      e=>{
        console.log(e)
      }
    )
  }

}
