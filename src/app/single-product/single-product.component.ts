import { Component, OnInit, HostListener, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { IsLoginService } from '../core/login/is-login.service';
import { CartService } from '../core/cart/cart.service';
import { PricingChargesService } from '../services/pricing-charges.service';
declare var jQuery: any;
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { CountriesService } from '../services/countries.service';
import 'rxjs/add/operator/catch';
import { OrderService } from '../services/orders.service';
import { Options, ChangeContext, PointerType } from 'ng5-slider';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  in_AED: string;
  productID: any;
  name: any;
  outOfStock = false;
  currentPrincingCharges: any = [];
  currentExchangeRate: number;
  description: any;
  country: any;
  price: any;
  images: any = [];
  priceDesc: any;
  base: any = environment.apiURLImg;
  category: any;
  show = true;
  cart: any;
  count:any = 1;
  cartEndpoint: any = 'api/shopping/add/';
  chargesEndpoint: any = 'api/fish/';
  priceValue: any;
  priceType: any;
  measurement: any;
  currency: string;
  showCart = false;
  mainImg: any;
  slideConfig = { 'slidesToShow': 4, 'slidesToScroll': 1 };
  showLoading = true;
  isLogged: boolean;
  isFavorite = false;
  favorite: any;
  idUser: string;
  favoriteId: string;
  role: number;
  storeId: string;
  storeName: string;
  enabledHeart = false;
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
  showTaxes = false;
  FXRateFees = 0;
  delivered = 0;
  brandname: any;
  processingCountry: any;
  countries: any = [];
  types: any = '';
  perBox:any;
  boxWeight:any;
  unitOfSale:any = '';
  // mortalityRate: any;
  wholeFishWeight: any = null;
  options: Options = {
    floor: 1,
    ceil: 1000,
    translate: (value: number): string => {
      return value + ' kg';
    }
  };
  value: any = 1;
  currentVaritionID = '';
  public withVariations = false;
  public variations = [];
  public selectVariation = '';

  public inter: any;
  public noWholeFish = false;
  public kg:any = 0;
  public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  public variationId = '';
  public fishOption = '';
  staticField: any;
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    private toast: ToastrService,
    private router: Router,
    private isLoggedSr: IsLoginService,
    private sanitizer: DomSanitizer,
    private pricingServices: PricingChargesService,
    private countryService: CountriesService,
    private cartService: OrderService,
    private cService: CartService) {
    // Para cuando se vaya a otra pagina quitar el css del footer y funciones
    this.router.events.subscribe(it => {
      $('app-footer').css({ position: 'relative', top: 'auto' });
      clearInterval(this.inter);
    });

   

  }

  ngAfterViewInit() {


    // $('#content-fixed').css('height', $(window).height());
    // $("#sticky-div").css("height", $(window).height());
    this.inter = setInterval(this.loadingImage.bind(this), 500);

    // Para checkar cuando el footer es visible
    // $(window).scroll(function () {
    //   if ($(window).width() > 991) {
    //     if (isScrolledIntoView($('app-footer'))) {
    //       $('#sticky-div').addClass('no');
    //     } else {
    //       $('#sticky-div').removeClass('no');
    //     }
    //   }
    // });

    // function isScrolledIntoView(elem) {
    //   var $elem = $(elem);
    //   var $window = $(window);

    //   var docViewTop = $window.scrollTop();
    //   var docViewBottom = docViewTop + $window.height();

    //   var elemTop = $elem.offset().top;
    //   var elemBottom = elemTop + $elem.height();

    //   // return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    //   // console.log(elemTop, docViewBottom);
    //   return elemTop <= docViewBottom;
    // }

  }

  loadingImage() {
    if ($(window).width() <= 991) {
      $('app-footer').css({
        top: $('#product-content').height() + $('#product-images').height() + 200,
        position: 'absolute',
        width: '100%'
      });
    } else {
      // Agregamos esto al footer para que mantenga posicion
      $('app-footer').css({
        top: $('#product-images').height() + 200,
        position: 'absolute',
        width: '100%'
      });
    }

  }

 async ngOnInit() {
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role;
      if (role === 1) {
        this.currency = 'USD';
        this.in_AED = 'false';
      } else {
        this.currency = 'AED(USD)';
        this.in_AED = 'true';
      }

    });
    this.productID = this.route.snapshot.params['id'];
    let kg = this.route.snapshot.params['kg'];
    let fishOption = this.route.snapshot.params['fishOption'];
    let variationId = this.route.snapshot.params['variationId'];
    console.log('snapshots', kg, fishOption, variationId);
    if (kg !== undefined && kg !== null) { this.kg = parseInt(kg); }
    if (variationId !== undefined && variationId !== null) { this.variationId = variationId; }
    if (fishOption !== undefined && fishOption !== null) { this.fishOption = fishOption; }

    await this.getCurrentPricingCharges();
    this.selectTheVariation(fishOption, variationId);

    this.isLoggedSr.isLogged.subscribe((val: boolean) => {
      this.isLogged = val;
    });
    const data = this.auth.getLoginData();
    this.idUser = data['id'];
    this.getCart();

    this.getFavorite();
    this.getTypes();
    this.getCountries();
  }


  getCountries() {
    this.countryService.getCountries().subscribe(
      result => {
        this.countries = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  handleInput($event){
    console.log("ON INput", $event.srcElement.value);
    let val = $event.srcElement.value;
    this.staticField = $event.srcElement.value;
    var that = this;
    setTimeout(() => {
      if(that.staticField == val){
        console.log("El valor no ha cambiado en un segundo");
        this.verifyQty();
      }
    }, 1000);

  }
  verifyQty() {
    if (this.count > this.max) {
      this.count = this.max;
      this.value = this.count;
      this.count = parseInt(this.count);
      this.getPricingCharges();
    } else if (this.count < this.min) {
      this.count = this.min;
      this.value = this.count;
      this.count = parseInt(this.count);
      this.getPricingCharges();
    } else {
      this.value = this.count;
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

  getProductDetail() {
    this.productService.getProductDetailVariations(this.productID).subscribe(data => {
      console.log('Producto', data);
      if (this.role !== 1) {
        this.currentExchangeRate = 1;
      }
      if (data['minimumOrder'] < 1) {
        this.min = 0;
      } else {
        if(data.hasOwnProperty('minBox')){
          this.min = data['minBox'];
          this.count = this.min;
        }else{
          this.min = data['minimumOrder'];
          this.count = this.min;
        }
        
      }
      this.outOfStock = data['outOfStock'];
      this.cooming_soon = data['cooming_soon'];
      if(data.hasOwnProperty('maxBox')){
        this.max = data['maxBox'];
      }else{
        this.max = data['maximumOrder'];

      }
      this.value = this.kg !== 0 ? this.kg : this.min;
      const newOptions: Options = Object.assign({}, this.options);
      newOptions.ceil = this.max;
      newOptions.floor = this.min;
      this.options = newOptions;
      this.count = this.kg !== 0 ? this.kg : this.min;
      this.verifyQty();
      this.getPricingCharges();
      this.name = data['name'];
      this.description = data['description'];
      if (data['images']) {
        data['images'].forEach((value) => {
          if(typeof value === "object" && value.src)
            value = value.src;
          this.images.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${value})`));
        });
      }
      console.log(data["images"]);
      this.price = data['price'] ? data['price'].description : "";
      this.category = data['type'] ? data['type'].name : '';
      this.unitOfSale = data['unitOfSale'];
      this.show = true;
      this.perBox = data['perBox'];
      this.boxWeight = data['boxWeight'];
      this.priceValue = data['price'] ? data['price'].value : 0;
      this.priceType = this.currency; // data['price'].type;
      this.measurement = data['weight'].type;
      if (data['imagePrimary'] !== null) { this.mainImg = (this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data['imagePrimary']})`)) } else { this.mainImg = (this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')) };
      this.storeId = data['store'].id;
      this.storeName = data['store'].name;
      this.brandname = data['brandname'];
      // this.mortalityRate = data['acceptableSpoilageRate'] || 0; //Para mantener compatibilidad con productos nuevos
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

      if (data.hasOwnProperty('wholeFishWeight') && data['wholeFishWeight'] != '') {
        this.wholeFishWeight = data['wholeFishWeight'];
      }
      //Para saber si es de los nuevos products, que tiene variations
      if (data["variations"] !== undefined && data["variations"] !== null && data["variations"].length > 0) {
        this.withVariations = true;
        this.variations = data["variations"];
        this.currentVaritionID = this.variationId !== "" ? this.variationId : data['variations'][0].id;
        console.log("currentVariations", this.currentVaritionID);
        if (this.variations[0].wholeFishWeight !== null && this.variations[0].wholeFishWeight !== undefined)
          this.selectVariation = this.fishOption !== "" ? this.fishOption : this.variations[0].wholeFishWeight.id;
        else {
          this.selectVariation = this.fishOption !== "" ? this.fishOption : this.variations[0].fishPreparation.id;
          this.noWholeFish = true;
        }

      }
      console.log(this.withVariations, this.variations);
      this.getReview();
      this.getPricingCharges();
      this.manualRefresh.emit();
      this.showLoading = false;

    }, error => {
      console.log('Error', error);
      this.show = false;
      this.showLoading = false;

    });
  }

  public getPreparation() {
    let variation = this.variations.find(it => {
      if (it.wholeFishWeight !== null && it.wholeFishWeight !== undefined)
        return it.wholeFishWeight.id === this.selectVariation;
      return false;
    });
    if (variation !== undefined) return variation.fishPreparation.name;
    return "";
  }

  public getBon() {
    let variation = this.variations.find(it => {
      return it.fishPreparation.id === this.selectVariation;;
    });
    try {
      if (variation !== undefined) return variation.fishPreparation.defaultProccessingParts.join(", ");
    } catch (e) {
      console.error(e);
      return "";
    }

  }

  getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }

  public isVacio(id, idSuffix) {
    let element = document.querySelector('#' + id) as HTMLInputElement;
    if (element === null) return true;

    //unit measure
    const suffixElement = document.getElementById(idSuffix);
    const width = this.getTextWidth(element.value, 'Josefin Sans, sans-serif');
    if (suffixElement !== null)
      suffixElement.style.left = ($(element).width() / 2) + width + 'px';

    return element.value === '';
  }

  public getTag(perBox, id){
    let element = document.querySelector('#' + id) as HTMLInputElement;
    if (element === null) return '';
    try{
      let val = Number(element.value);
      if(val <= 1 && perBox === true) {
        return 'box';
      }
      return perBox === true ? 'boxes' : (this.unitOfSale).toLowerCase(); 
    }
    catch(e){
      console.log(e);
      return '';
    }
  }

  public selectTheVariation(idVariation, id) {
    console.log("variacion", idVariation);
    this.selectVariation = idVariation;
    this.currentVaritionID = id;
    this.updateMinMax(id);
    this.getPricingCharges();
  }


  updateMinMax(id){
    this.productService.getData(`api/fish/${this.productID}/variations/${id}`).subscribe(data => {
      console.log("Producto VAR", data);
      if (data['minimumOrder'] < 1) {
        this.min = 0;
      } else {
        if(data.hasOwnProperty('minBox')){
          this.min = data['minBox'];
          this.count = this.min;
        }else{
          this.min = data['minimumOrder'];
          this.count = this.min;
        }
        
      }
      this.outOfStock = data['outOfStock'];
      this.cooming_soon = data['cooming_soon'];

      if(data.hasOwnProperty('maxBox')){
        this.max = data['maxBox'];
      }else{
        this.max = data['maximumOrder'];

      }
    })
  }

  getCart() {

    this.cartService.getCart(this.idUser).subscribe(
      cart => {
        console.log("Cart", cart);
        this.cart = cart;
      },
      error => {
        console.log(error);
      })
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
      'shippingStatus': 'pending',
      'variation_id': this.currentVaritionID
    };
    this.productService.saveData(this.cartEndpoint + this.cart['id'] , item).subscribe(result => {
      this.showCart = true;
      // set the new value to cart
      this.cService.setCart(result);
      this.toast.success('Product added to the cart!', 'Product added', { positionClass: 'toast-top-right' });

    }, err => {
      console.log('err', err  );
      if( err.hasOwnProperty('error') ){
        this.toast.error( err.error.message, 'Seafood Souq', { positionClass: 'toast-top-right' });
      } else if ( err.error ) {
        this.toast.error('An error has occurred', err.error.message, { positionClass: 'toast-top-right' });
      } else {
        this.toast.error('An error has occurred', 'Seafood Souq', { positionClass: 'toast-top-right' });
      }
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
    const subtotal = (this.count * this.priceValue / this.currentExchangeRate).toFixed(2);
    return subtotal;
  }

  async getCurrentPricingCharges() {
    await new Promise((resolve, reject) => {
    this.pricingServices.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        console.log('result', result);
        this.currentExchangeRate = result['exchangeRates'];
        console.log(this.currentExchangeRate);
        this.getProductDetail();
        resolve();
      }, error => {
        console.log(error);
        reject();
      }
    )
    })
  }
  getPricingCharges() {
    console.log("current vairation ID", this.currentVaritionID);
    this.pricingServices.getPricingChargesByWeight(this.productID, this.currentVaritionID, this.count, this.in_AED)
      .subscribe(
        res => {
          console.log('Pricing Charges', res, this.count);
          this.charges = res;
          this.delivered = res['finalPricePerKG'] / this.count;
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
      this.charges['customsFee'];
    // this.charges['fishCost'] +

    return Number(parseFloat(total).toFixed(2));
  }


  findCountries(code) {
    for (var i = 0; i < this.countries.length; i++) {
      if (this.countries[i].code === code) {
        return this.countries[i].name;
      }
    }
  }

  getTypes() {
    this.productService.getData(`fishType/parents/${this.productID}`).subscribe(res => {
      console.log("Categorías", res);
      this.types = res;
    })
  }

  onUserChangeEnd(changeContext: ChangeContext): void {
    console.log(`onUserChangeEnd(${this.getChangeContextString(changeContext)})\n`);
    this.count = changeContext.value;
    console.log("Count", this.count);
    this.getPricingCharges();
  }

  getChangeContextString(changeContext: ChangeContext): string {
    return `{pointerType: ${changeContext.pointerType === PointerType.Min ? 'Min' : 'Max'}, ` +
      `value: ${changeContext.value}, ` +
      `highValue: ${changeContext.highValue}}`;
  }

  showElements() {
    document.getElementById('qty-text').style.display = 'none';
    document.getElementById('input-text').style.display = 'block';
    jQuery('#input-text').focus();
  }

  hideElements() {
    document.getElementById('input-text').style.display = 'none';
    document.getElementById('qty-text').style.display = 'block';
  }

  public getFixedNumber(number) {
    // if (number !== null && Math.round(number) !== number) {
    //   number = number.toFixed(2);
    // }
    return parseInt(number);
  }
}
