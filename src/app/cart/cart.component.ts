import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from '../toast.service';
import {Router} from '@angular/router';
import { environment } from '../../environments/environment';
import { OrderService } from '../services/orders.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CountriesService } from '../services/countries.service';
declare var jQuery:any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  itemToDelete:any;
  buyerId:any;
  products:any = [];
  empty:boolean;
  showLoading:boolean=true;
  total:any;
  shoppingEnpoint:any = 'shoppingcart/items';
  shoppingCartId:string;
  API:any = environment.apiURLImg;
  countries:any = [];
  shipping:any =  0;
  cart:any;
  /******** Other fees ***********/
  lastMilteCost = 0;
  sfsMargin = 0;
  uaeTaxes = 0;
  customs=  0;
  firstMileCost = 0;
  handlingFees=0;

  totalCustoms;
  totalSFSMargin= 0;
  totalUAETaxes=0;
  totalFirstMileCost=0;
  totalLastMileCost=0;
  totalOtherFees:any = 0;
  totalHandlingFees=0;
  /******** END Other fees ***********/
  otherFees:number = 0;
  totalWithShipping:any;
  index:any;
  userinfo:any;
  imageCart: any = [];
  preparataion:any =[];
  taxesPer:any;
  staticField: any;
  constructor(private auth: AuthenticationService, private productService: ProductService,
    private toast:ToastrService, private router:Router, private cartService:OrderService, 
    private sanitizer: DomSanitizer, private countriesService: CountriesService) { }


  async ngOnInit() {
    // this.getCart();
    //this.getItems()
    this.userinfo = this.auth.getLoginData();
    this.buyerId = this.userinfo['id'];
    await this.getCountries();
    await this.getPreparation();
    this.getTotal();
  }




  getTotal(){
    this.cartService.getCart( this.buyerId )
    .subscribe(

      cart=> {
        console.log("Cart", cart);
        if(cart && cart.hasOwnProperty('items')){
          console.log("Si existe");
          if(cart['items'].length > 0){
            console.log("Si es mayor a cero"); 
            this.cart = cart;
            this.shoppingCartId=cart['id']
            this.products=cart['items'];
            this.buyerId=cart['buyer']
            this.lastMilteCost = cart['lastMileCost'];
            this.firstMileCost = cart['firstMileCosts'];
            this.sfsMargin = cart['sfsMargin'];
            this.uaeTaxes = cart['uaeTaxes'];
            this.customs = cart['customs'];
            this.total= cart['subTotal'];
            this.shipping = cart['shipping'];
            this.taxesPer = cart['currentCharges']['uaeTaxes'];

            this.totalOtherFees = cart['totalOtherFees'];
            this.totalWithShipping = cart['total'];
            this.products.forEach((data, index) => {
              if (data.fish.imagePrimary && data.fish.imagePrimary != '') {
                this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.imagePrimary})`);
              }
              else if (data.images && data.images.length > 0) {
                this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.images[0].src})`);
              }
              else {
                this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
              }
            });
    
            this.hideLoader();
            this.empty = false;
            
          }else{
            this.hideLoader();
          }
         
        } else{
          this.hideLoader();
        }
       
      },
      error=> {
        console.log( error );
      }
    )
    
  }

  //GET COUNTRIES
  async getCountries() {
    await new Promise((resolve, reject) => {
    this.countriesService.getCountries().subscribe(
      result => {
        this.countries = result;
        resolve();
      },
      error => {
        console.log( error );
        reject();
      }
     );
    })
  }

  //FUNCTION TO GET ONLY THE TOTALS WHEN CHANGING QTY OF A PRODUCT
  getTotalPricing(){
      //this.showLoading=true;
      this.cartService.getCart( this.buyerId )
      .subscribe(        
        cart=> {
          this.showLoading = false;
          if(cart && cart.hasOwnProperty('items')){
            if(cart['items'].length > 0){
              this.products=cart['items'];
              this.products.forEach((data, index) => {
                setTimeout(() => {
                  console.log( jQuery('#range-' + data.fish.id), data.quantity.value);
                  jQuery('#range-' + data.fish.id).val(data.quantity.value);
                  this.moveBubble(data.fish.id);
  
              }, 100);
              });
              this.lastMilteCost = cart['lastMileCost'];
              this.firstMileCost = cart['firstMileCosts'];
              this.sfsMargin = cart['sfsMargin'];
              this.uaeTaxes = cart['totalUAETaxes'];
              this.customs = cart['customs'];
              this.total= cart['subTotal'];
              this.shipping = cart['shipping'];
              this.totalOtherFees = cart['totalOtherFees']+cart['totalUAETaxes'];
              this.totalWithShipping = cart['total'];
            
      
             
              
            }
          }
         
        },
        error=> {
          //this.showLoading = false;
          console.log( error );
        }
      )
      
    
  }
  hideLoader(){
    this.showLoading=false;
          this.empty = true;
  }

  getItems(){
    let cart = {
      "buyer": this.buyerId
    }
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      console.log(' calcular totales', result );
    },e=>{console.log(e)})
  }

  getTotalxItem(count, price){
    return count*price;
  }
  deleteItem(i, id){
    this.productService.deleteData(`itemshopping/${id}`).subscribe(
      result=>{
        this.products.splice(i, 1);
        console.log("Borrando item..", result, this.products);

        // this.getItems();
        jQuery('#confirmDelete').modal('hide');

        this.getAllProductsCount();
        if(this.products.length == 0){
          this.empty = true;
        }

      },
      e=>{
        this.toast.error("Error deleting item!", "Error",{positionClass:"toast-top-right"} );
        console.log(e)
      }
    )
  }

  getAllProductsCount(){
    var items:any = {"items": []};
    this.products.forEach((element, index) => {
      let item = { 
        "id": element['id'],
        "quantity": {
          "type": element['quantity'].type,
          "value": element['quantity'].value
        }
      }
      items['items'].push(item);
      console.log( 'get Product Counts', item );
      if (items['items'].length == this.products.length){
        this.updatecart(items);
      } 
    });
  }

  updatecart(items){
  
    this.productService.updateData(this.shoppingEnpoint, items).subscribe(result => {
      console.log( 'result', result );
    
      this.getTotalPricing();
    }, error => {
      this.toast.error("Error updating cart!", "Error",{positionClass:"toast-top-right"} );

    })
  }
  checkout(){
    localStorage.setItem('shippingCost', this.shipping);
    localStorage.setItem('shoppingTotal', this.totalWithShipping);
    localStorage.setItem('shoppingCartId', this.shoppingCartId);
    localStorage.setItem('totalOtherFees', this.totalOtherFees);
 
    //this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});
    this.router.navigate(['/reviewcart'],  {queryParams: {shoppingCartId: this.shoppingCartId}});
  
  }

   findCountryName(value) {
    for (var i = 0; i < this.countries.length; i++) {
        if (this.countries[i]['code'] === value) {
            return this.countries[i].name;
        }
    } 
    return null;
  }

  //FIND NAME OF PREPARATION

  findPreparationName(id){
    for (var i = 0; i < this.preparataion.length; i++) {
      if (this.preparataion[i]['id'] === id) {
          return this.preparataion[i].name;
      }
  } 
  return null;
  }
  showConfirmModal(itemID:string, index){
    console.log("Product modal ID", itemID, index);
    this.itemToDelete = itemID;
    this.index = index;
    jQuery('#confirmDelete').modal('show');
  }

  validateMax(i){
    console.log(this.products[i].quantity.value);
    if(this.products[i].quantity.value > this.products[i].fish.maximumOrder){
      this.products[i].quantity.value = this.products[i].fish.maximumOrder;
      this.getAllProductsCount();
    }else{
      this.getAllProductsCount();
    }
  }


    //Function to hide span 
    hideMe(id) {
      const span = document.getElementById('qty-kg-' + id);
      const input = document.getElementById('edit-qty-' + id);
      (span as HTMLElement).style.display = 'none';
      (input as HTMLElement).style.display = 'inline-block';
      input.focus();
    }

    handleInput($event, id, i, max, min, boxweight = 1){
      console.log("ON INput", $event.srcElement.value);
      let val = $event.srcElement.value;
      this.staticField = $event.srcElement.value;
      var that = this;
      setTimeout(() => {
        if(that.staticField == val){
          console.log("El valor no ha cambiado en un segundo");
          this.manualInput(id, i, max, min, boxweight = 1);
        }
      }, 1000);
  
    }
     //Functino to enter manual kg
  manualInput(id, i, max, min, boxweight = 1) {
    let val: any = jQuery('#edit-qty-' + id).val();
    val = val;
    console.log("minimo y maximo", min, max, val);

    if (val > parseFloat(max)) {
      val = parseFloat(max);
    }else if(val < parseFloat(min)){
      val = parseFloat(min);
    }
    this.products[i].quantity.value  = val * boxweight;
    // jQuery('#range-' + id).val(val);
    // this.moveBubble(id);
    this.getAllProductsCount();

  }
  //Function to hide input and show span
  showSpan(id) {
    const span = document.getElementById('qty-kg-' + id);
    const input = document.getElementById('edit-qty-' + id);
    (input as HTMLElement).style.display = 'none';
    (span as HTMLElement).style.display = 'block';
  }



  //JAVASCRIPT FOR SLIDES
  moveBubble(id){
    console.log("Id", id);
    var el, newPoint, newPlace, offset;
 
    jQuery('#range-' + id).on('input', function () {
   console.log("input");
     jQuery(this).trigger('change');
 });
 // Select all range inputs, watch for change
 jQuery('#range-' + id).change(function() {
  console.log("Changing");
  // Cache this for efficiency
  el = jQuery(this);
  
  // Measure width of range input
  var width = el.width();
  console.log("Width", width);

  
  // Figure out placement percentage between left and right of input
  newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
  console.log("Move Bubble", parseInt(el.val()), el.attr("max"), el.attr("min"));

   offset = -1;
 
  // Prevent bubble from going beyond left or right (unsupported browsers)
  if (newPoint < 0) { newPlace = 0; }
  else if (newPoint > 1) { newPlace = width; }
  else { newPlace = width * newPoint + offset; offset -= newPoint; }
  
  // Move bubble
  jQuery('#qty-kg-'+id).css('margin-left', newPlace);
  jQuery('#edit-qty-'+id).css('margin-left', newPlace);

  })
  // Fake a change to position bubble at page load
  .trigger('change');
  }

   //GET RANGE VALUE ON CHANGE FOR EACH PRODUCT
   getRange(id, i) {
    console.log(id, i);
    let val: any = jQuery('#range-' + id).val();
    console.log("Range Val", val);
    this.products[i].quantity.value  = val;
    this.moveBubble(id);

    console.log("Product in array", this.products[i]);
    this.getAllProductsCount();
  }

  showRangeVal(id, i){
    let val: any = jQuery('#range-' + id).val();
    this.products[i].quantity.value  = val;
  }

  //get preparation

  async getPreparation(){
    await new Promise((resolve, reject) => {
      this.productService.getData(`fishPreparation`).subscribe(res=> {
        console.log("Prep", res);
        this.preparataion = res;
        resolve();
      }, error =>{reject()})
    })
  }
}
  