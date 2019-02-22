import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IsLoginService } from '../core/login/is-login.service';
import { CartService } from '../core/cart/cart.service';
import { PricingChargesService } from '../services/pricing-charges.service';
declare var jQuery: any;
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  productID: any;
  name: any;
  currentPrincingCharges: any = [];
  currentExchangeRate: number;
  description: any;
  country: any;
  price: any;
  images: any = [];
  priceDesc: any;
  base: any = environment.apiURLImg;
  category: any;
  show: boolean = true;
  cart: any;
  count: number = 1;
  cartEndpoint: any = 'api/shopping/add/';
  chargesEndpoint: any = 'api/fish/';
  priceValue: any;
  priceType: any;
  measurement: any;
  currency: string;
  showCart: boolean = false;
  mainImg: any;
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 1 };
  showLoading: boolean = true;
  isLogged: boolean;
  isFavorite: boolean = false;
  favorite: any;
  idUser: string;
  favoriteId: string;
  role: number;
  storeId: string;
  storeName: string;
  enabledHeart: boolean = false;
  logo: any;
  reviews: any;
  averageReview: any = 0;
  raised: any;
  preparation: any;
  treatment: any;
  min: any;
  max: any;
  charges: any;
  cooming_soon: string;
  showTaxes: boolean = false;
  FXRateFees = 0;
  delivered: number = 0;
  brandname:any;
  processingCountry:any;
  countries:any = environment.countries;
  types:any = '';
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    private toast: ToastrService,
    private router: Router,
    private isLoggedSr: IsLoginService,
    private cartService: CartService,
    private sanitizer: DomSanitizer,
    private pricingServices: PricingChargesService
  ) {

  }

  ngOnInit() {
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role;
      if (role === 1) {
        this.currency = 'USD';
      } else {
        this.currency = 'AED(GBP)';
      }
    });
    this.productID = this.route.snapshot.params['id'];
    this.getCurrentPricingCharges();
    this.getCart();
    this.isLoggedSr.isLogged.subscribe((val: boolean) => {
      this.isLogged = val;
    });
    const data = this.auth.getLoginData();
    this.idUser = data['id'];
    this.getFavorite();
    this.getTypes();
  }

  verifyQty() {
    if (this.count > this.max) {
      this.count = this.max;
    } else {
      this.getPricingCharges();
    }
  }
  getFavorite() {
    const data = {
      user: this.idUser,
      fish: this.productID
    };
    this.productService.isFavorite(data).subscribe(
      result => {
        if (result['msg']) {
          this.isFavorite = true;
          this.favoriteId = result['id'];
        } else {
          this.isFavorite = false;
        }
      },
      e => {
        console.log(e);
      }
    );
  }
  setFlexslider() {
    if (this.mainImg || this.images) {
      setTimeout(() => {
        jQuery('.flexslider').flexslider({
          animation: 'slide',
          controlNav: true
          //   start:function(slider){
          //     jQuery(".slide-current-slide").text(slider.currentSlide+1);
          //     jQuery(".slide-total-slides").text("/"+slider.count)
          // },
          // before:function(slider){
          //     jQuery(".slide-current-slide").text(slider.animatingTo+1)
          // }
        });
        this.showLoading = false;
      }, 100);
    } else {
      this.showLoading = false;
    }
  }
  getProductDetail() {
    this.productService.getProductDetail(this.productID).subscribe(data => {
      console.log(data);
      if( this.role !== 1 ) {
        this.currentExchangeRate = 1;
      }
      if (data['minimumOrder'] < 1) {
        this.min = 1;
      } else {
        this.min = data['minimumOrder'];
        this.count = this.min;
      }
      this.cooming_soon = data['cooming_soon'];
      this.max = data['maximumOrder'];
      this.count = this.min;
      this.getPricingCharges();
      this.name = data['name'];
      this.description = data['description'];
      if (data['images']) {
        data['images'].forEach((value) => {
          this.images.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${value.src})`));
        });
      }
      this.price = data['price'].description;
      this.category = data['type'].name;
      this.show = true;
      this.priceValue = data['price'].value;
      this.priceValue = data['price'].value;
      this.priceType = this.currency; // data['price'].type;
      this.measurement = data['weight'].type;
      if(data['imagePrimary'] !== null) { this.mainImg = (this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data['imagePrimary']})`)) }else{ this.mainImg = (this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)'))};
      this.storeId = data['store'].id;
      this.storeName = data['store'].name;
      this.brandname = data['brandname'];
      if (data['raised'] && data['raised'] !== '') {
        this.raised = data['raised'];
      } else {
        this.raised = 'Not provided';
      }
      if (data['preparation'] && data['preparation'] !== '') {
        this.preparation = data['preparation'];
      } else {
        this.preparation = 'Not provided';
      }
      if (data['treatment'] && data['treatment'] !== '') {
        this.treatment = data['treatment'];
      } else {
        this.treatment = 'Not provided';
      }
      this.country = data['country'] || '';
      this.processingCountry = data['processingCountry'] || '';
      if (data['store'].logo && data['store'].logo !== '') {
        this.logo = this.base + data['store'].logo;
      } else {
        this.logo = '../../assets/seafood-souq-seller-logo-default.png';
      }
      this.getReview();
      this.setFlexslider();
      this.getPriceKg(this.count);
      this.getPricingCharges();
    }, error => {
      console.log('Error', error);
      this.show = false;
    });
  }
  showHide(id) {
    jQuery('#' + id).css('display', 'none');
    jQuery('#input-text').css('display', 'block');
    jQuery('#input-text').focus();
  }
  getCart() {
    this.cartService.cart.subscribe((cart: any) => {
      this.cart = cart;
    });
  }

  increaseCount() {
    if (this.count < this.max) {
      this.count++;
      this.getPricingCharges();
    }
  }

  dicreaseCount() {
    if (this.count > this.min) {
      this.count--;
      this.getPricingCharges();
    }

  }

  addToCart() {
    const item = {
      'fish': this.productID,
      'price': {
        'type': this.priceType,
        'value': this.priceValue
      },
      'quantity': {
        'type': this.measurement,
        'value': this.count
      },
      'shippingStatus': 'pending'
    };
    this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(result => {
      this.showCart = true;
      // set the new value to cart
      this.cartService.setCart(result);
      this.toast.success('Product added to the cart!', 'Product added', { positionClass: 'toast-top-right' });

    });
  }

  goToCart() {
    this.router.navigate([('/cart')]);
  }
  submitFavorite() {
    this.enabledHeart = true;
    if (this.isFavorite) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
  }
  addFavorite() {
    const data = {
      user: this.idUser,
      fish: this.productID
    };
    this.productService.saveData('FavoriteFish', data).subscribe(
      result => {
        this.favoriteId = result['id'];
        this.isFavorite = true;
        this.enabledHeart = false;
      },
      e => {
        console.log(e);
      }
    );
  }
  removeFavorite() {
    this.productService.deleteData('FavoriteFish/' + this.favoriteId).subscribe(
      result => {
        this.isFavorite = false;
        this.enabledHeart = false;
      },
      e => {
        console.log(e);
      }
    );
  }
  getReview() {
    this.productService.getData(`reviewsstore?where={"store":"${this.storeId}"}`).subscribe(
      result => {
        this.reviews = result;
        this.calcStars();
      },
      e => {
        console.log(e);
      }
    );
  }
  calcStars() {
    this.reviews.forEach((data) => {
      this.averageReview += data.stars;
    });
    this.averageReview /= this.reviews.length;
  }
  getTotal() {
    const subtotal = (this.count * this.priceValue / this.currentExchangeRate ).toFixed(2);
    return subtotal;
  }

  getCurrentPricingCharges() {
    this.pricingServices.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        console.log('result', result);
        this.currentExchangeRate = result['exchangeRates'][0].price;
        console.log( this.currentExchangeRate );
        this.getProductDetail();
      }, error => {
        console.log( error );
      }
    )
  }
  getPricingCharges() {
    this.pricingServices.getPricingChargesByWeight(this.productID, this.count)
      .subscribe(
        res => {
          this.charges = res;
          this.getPriceKg(this.count);
          this.showTaxes = true;

        },
        error => {
          console.log(error);
        }
      );

    /*this.productService.getData(this.chargesEndpoint + this.productID).subscribe(res => {
      console.log("Charges", res);
      this.charges = res;
    })*/

  }

  finallyPrice() {
    const subtotal = this.count * this.priceValue;
    const total = subtotal +
      this.charges['uaeTaxesFee'] +
      this.charges['sfsMarginCost'] +
      this.charges['shippingCost']['cost'] +
      this.charges['customsFee'] ;
      // this.charges['fishCost'] +

    return Number(parseFloat(total).toFixed(2));
  }
  getPriceKg(weight) {
    this.productService.getData(`api/fish/${this.productID}/charges/${weight}`).subscribe(result => {
      this.delivered = result['finalPrice'] / weight;
    },
      e => {
        console.log(e);
      }
    );
  }

  findCountries(code){
    for (var i=0; i < this.countries.length; i++) {
        if (this.countries[i].code === code) {
            return this.countries[i].name;
        }
    }
} 

getTypes(){
  this.productService.getData(`/fishType/parents/${this.productID}`).subscribe(res =>{
    console.log("Categorías", res);
    this.types = res;
  })
}
}
