import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/orders.service';
declare var jQuery;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: any;
	showLoading: boolean = true;
	showNotFound: boolean = false;
	image: SafeStyle = [];
  searchPage = 1;
  search: any;
	API: string = environment.apiURLImg;
  searchCategories: any;
  searchSubcategories: any;
  searchSubSpecie: any;
  searchDescriptor: any;
  countries: any;
  allCountries:any = [];
  minPriceField: number = 0;
  maxPriceField: number = 35;
  cooming_soon: string = '';
  isClearButton: boolean = false;
  hideKg: boolean = true;
  initialKg: number = 5;
  deliveredPrice: number = 0;
  cartEndpoint: any = 'api/shopping/add/';
  cart: any;
  buyerId:any;
  userInfo:any;
  showQty:boolean = false;

  constructor(private auth: AuthenticationService,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private cartService: OrderService) { }

  ngOnInit() {
    //GET current user info to be used to get current cart of the user
    this.userInfo = this.auth.getLoginData();
    this.buyerId = this.userInfo['id'];
    this.getCart();
    this.getProducts(100, 1);

  }


  //GETTING cart info

  getCart() {


    this.cartService.getCart( this.buyerId ).subscribe(
      cart=> { 
        console.log("Cart", cart);
        this.cart = cart;
      },
      error=> {
        console.log( error );
      })
  }


  //GET all of the products
  getProducts(cant, page) {
    console.log("Page", page);
  	const data = {
  		pageNumber: page,
  		numberProduct: cant
  	};
  	this.productService.listProduct(data).subscribe(
  		result => {
        this.isClearButton = false;
  			this.products = result['productos'];
        console.log('Productos', result);
        // add paginations numbers
       
  			this.showLoading = false;
  			// working on the images to use like background
	        if (this.products.length === 0) {        
              this.showNotFound = true;
	        } else {
            this.showNotFound = false;
            
         	this.products.forEach( ( data, index ) => {
            if (data.imagePrimary && data.imagePrimary !== '') {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
            } else if (data.images && data.images.length > 0) {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`);
            } else {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
            }
            console.log(this.image);
        });
	        }
	      
  		},
  		e => {
  			this.showLoading = true;
  			this.showError('Something wrong happened, Please Reload the Page');
  			console.log(e);
  		}
  	);
  }

  //Show toaster messages
  showSuccess(e) {
    this.toast.success(e, 'Well Done', {positionClass: 'toast-top-right'});
  }
   showError(e) {
    this.toast.error(e, 'Error', {positionClass: 'toast-top-right'});
  }

  //Function to remove spaces in category name
  removeSpaces(text){
    return text.replace(" ", '-')
  }
 

  //GET RANGE VALUE ON CHANGE FOR EACH PRODUCT
  getRange(id, i){
    console.log(id, i)
    let val:any = jQuery('#range-' + id).val();
    console.log("Range Val", val);
    this.products[i].qty = val;
    this.showQty = true;
    console.log("Product in array", this.products[i]);
    this.getShippingRates(val, id);

  }

  //GET the shipping rates
  getShippingRates(weight, id) {
    this.productService.getData( `api/fish/${id}/charges/${weight}` ).subscribe(result => {
        console.log("Shipping rates", result);
        const priceTByWeight =  result['finalPrice'] / Number(parseFloat( weight ) );
        const priceT: any = Number( priceTByWeight.toFixed(2) ).toString();
        const label = document.getElementById('delivere-price-' + id);
        const btn = document.getElementById('btn-add-' + id);
        if (result.hasOwnProperty('message')) {
          label.innerHTML = result['message'];
        } else {
          label.innerHTML = 'AED ' + priceT;
        }
        (label as HTMLElement).style.display = 'inline-block';
        (btn as HTMLElement).style.display = 'block';



    });
  }


  //Save product in current usar cart
  addToCart(product) {
    console.log("Producto", product);
    const item = {
      'fish': product.id,
      'price': {
              'type': product.price.type,
              'value': product.price.value
          },
      'quantity': {
          'type': product.price.type,
          'value': product.qty
      },
      'shippingStatus': 'pending'
  };
    this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(result => {
        // set the new value to cart
        this.toast.success('Product added to the cart!', 'Product added', {positionClass: 'toast-top-right'});

    }, err => {
      if ( err.error ) {
      this.toast.error('An error has occurred', err.error.message, { positionClass: 'toast-top-right' });
      }
    });
  }

  //Function to hide span 
  hideMe(id){
    const span = document.getElementById('qty-kg-' + id);
    const input =  document.getElementById('edit-qty-' + id);
    (span as HTMLElement).style.display = 'none';
    (input as HTMLElement).style.display = 'inline-block';
    input.focus();
  }
  //Functino to enter manual kg
  manualInput(id, i, max){
   let val:any =  jQuery('#edit-qty-' + id).val();
   if(val > max){
     val = max;
   }
   this.products[i].qty = val;
   jQuery('#range-'+id).val(val);
   this.getShippingRates(val, id);


  }

  //Function to hide input and show span
  showSpan(id){
    const span = document.getElementById('qty-kg-' + id);
    const input =  document.getElementById('edit-qty-' + id);
    (input as HTMLElement).style.display = 'none';
    (span as HTMLElement).style.display = 'block';
  }
}
