import { Component, OnInit, Type } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from '../toast.service';
import { OrderService } from '../services/orders.service';
import { Options, ChangeContext } from 'ng5-slider';
import { CountriesService } from '../services/countries.service';
import { Router } from '@angular/router';
import { CartService } from '../core/cart/cart.service';

declare var jQuery;
@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products: any;
  showLoading: boolean;
  showNotFound: boolean = false;
  image: SafeStyle = [];
  searchPage = 1;
  search: any;
  API: string = environment.apiURLImg;
  searchCategories: any;
  searchSubcategories: any;
  searchSubSpecie: any;
  searchDescriptor: any = [];
  countries: any;
  allCountries: any = [];
  minPriceField: number = 0;
  maxPriceField: number = 35;
  cooming_soon: string = '';
  isClearButton: boolean = false;
  hideKg: boolean = true;
  initialKg: number = 5;
  deliveredPrice: number = 0;
  cartEndpoint: any = 'api/shopping/add/';
  cart: any;
  buyerId: any;
  userInfo: any;
  showQty: boolean = false;
  minValue: number = 0;
  maxValue: number = 35;
  name: any;
  hideCat: boolean = false;
  hideSubcat: boolean = true;
  hideSpecie: boolean = true;
  hideVariant: boolean = true;
  filteredItems: any = [];
  showClear: boolean = false;
  tmpCatName: any;
  tmpSubcat: any;
  tmpSpecie: any;
  tmpVariant: any;
  options: Options = {
    floor: 0,
    ceil: 35,
    step: 5,
    translate: (value: number): string => {
      return 'AED ' + value;
    }
  };
  shoppingCartId: any;
  productsCart: any = [];
  total: any;
  imageCart: any = [];
  showIcon: boolean = true;
  preparataion:any = [];
  treatment:any = [];
  raised:any = [];
  isDisabled= false;
  tmpPrice: any;
  disabledInputs:boolean = false;
  public loading:boolean = true;

  public isChange:any = {};
  staticField:any;

  constructor(private auth: AuthenticationService, private productService: ProductService, 
    private sanitizer: DomSanitizer, private toast: ToastrService, private cartService: OrderService, 
    private countryservice: CountriesService, private router: Router, private cService: CartService) {
    }
  async ngOnInit() {
    //GET current user info to be used to get current cart of the user
    this.userInfo = this.auth.getLoginData();
    if(this.userInfo == null){
      this.router.navigate(["/"]);
    }
    this.buyerId = this.userInfo['id'];
    this.getCart();
    this.getProducts(100, 1);
    // this.getAllTypesByLevel();
    await this.getPreparation();
    await this.getRaised();
    await this.getTreatment();
    await this.getCountries();
    await this.getFishCountries();
    await this.getParentsCat();
    console.log("Aqui deberia carga el JS");
    setTimeout(() => this.chargeJS(), 500);
    this.loading = false;

    //JAVASCRIPT FOR FILTER
    
   
    jQuery('#minAmount').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
    });
    jQuery('#maxAmount').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
    });
    jQuery('#cooming').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
    });
  }
  //Create pills
  async createPills(id, val, name) {
    let value = jQuery(val).val();
    await this.getTypeName(value, name);
    jQuery('#' + id).css('display', 'inline-block');
  }
  createPillCheckbox(id, val, name, array) {
    let value = [];
    if (jQuery(val).val() != undefined) {
      jQuery(val).each(function (i) {
        let item = array.filter(obj => {
          return obj.id == jQuery(this).val();
        })
        value[i] = item[0]['name'];
      });
      let string = value.join(", ");
      jQuery('#' + id + ' button span').html(string);
      jQuery('#' + id).css('display', 'inline-block');
    }
    else {
      this.destroyCheckboxPill(name);
    }
  }
  createPillRadio(id, val) {
    let value = jQuery(val).val();
    jQuery('#' + id + ' button span').html(value);
    jQuery('#' + id).css('display', 'inline-block');
  }
  //GET FISH TYPE NAME FOR FILTER PILLS
  async getTypeName(id, name) {
    await new Promise((resolve, reject) => {
      this.productService.getData(`fishType/${id}`).subscribe(res => {
        if (name == 'tmpCatName') {
          this.tmpCatName = res['name'];
        }
        else if (name == 'tmpSubcat') {
          this.tmpSubcat = res['name'];
        }
        else if (name == 'tmpSpecie') {
          this.tmpSpecie = res['name'];
        }
        else {
          this.tmpVariant = res['name'];
        }
        resolve(res);
      }, error => {
        reject();
      });
    });
  }
  //CHARGE LATE JS
  chargeJS() {
    jQuery('.input-preparation:checkbox').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
      this.createPillCheckbox('pill-preparation', '.input-preparation:checkbox:checked', 'preparation', this.preparataion);
    });

    jQuery('.input-raised:checkbox').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
      this.createPillCheckbox('pill-raised', '.input-raised:checkbox:checked', 'raised', this.raised);
    });
    jQuery('.input-treatment:checkbox').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
      this.createPillCheckbox('pill-treatment', '.input-treatment:checkbox:checked', 'treatment', this.treatment);
    });

    jQuery('input[type=radio][name=country]').on('change', (e) => {
      this.disabledInputs = true;
      this.showClear = true;
      this.filterProducts();
      this.createPillRadio('pill-country', 'input[type=radio][name=country]:checked');
    });
    jQuery('input[type=radio][name=cat]').change((e) => {
      console.log("Changing cat");
      e.stopImmediatePropagation();
      this.disabledInputs = true;
      this.showClear = true;
      const subcategorySelected = e.target.value;
      if (subcategorySelected === 0) {
        this.getAllTypesByLevel();
      }
      else {
        this.getOnChangeLevel(subcategorySelected);
      }
      this.filterProducts();
      setTimeout(() => {
        this.hideCat = true;
        this.hideSubcat = false;
      }, 1000);
      this.createPills('pill-category', 'input[type=radio][name=cat]:checked', 'tmpCatName');
    });
    jQuery('input[type=radio][name=subcat]').on('change', (e) => {
      e.stopImmediatePropagation();
      this.disabledInputs = true;
      this.showClear = true;
      const specie = e.target.value;
       this.filterProducts();
      this.getOnChangeLevel(specie);
      setTimeout(() => {
        this.hideCat = true;
        this.hideSubcat = true;
        this.hideSpecie = false;
      }, 1000);
      this.createPills('pill-subcategory', 'input[type=radio][name=subcat]:checked', 'tmpSubcat');
    });
    jQuery('input[type=radio][name=specie]').on('change', (e) => {
      e.stopImmediatePropagation();
      this.disabledInputs = true;
      this.showClear = true;
      const variant = e.target.value;
      this.getOnChangeLevel(variant);
      this.filterProducts();
      if(this.searchDescriptor.length > 0){
        setTimeout(() => {
          this.hideCat = true;
          this.hideSubcat = true;
          this.hideSpecie = true;
          this.hideVariant = false;
        }, 1000);
      }
      this.createPills('pill-specie', 'input[type=radio][name=specie]:checked', 'tmpSpecie');

    });
    jQuery('input[type=radio][name=variant]').on('change', (e) => {
      this.disabledInputs = true;
      e.stopImmediatePropagation();
      this.showClear = true;
      this.filterProducts();
      this.createPills('pill-variant', 'input[type=radio][name=variant]:checked', 'tmpVariant');
    });
  }
  //GETTING cart info
  async getCart() {
    this.productsCart = [];
    await new Promise((resolve, reject) => {
    this.cartService.getCart(this.buyerId).subscribe(cart => {
      console.log("Cart", cart);
      this.cart = cart;
      if (cart && cart.hasOwnProperty('items')) {
        if (cart['items'].length > 0) {
          this.shoppingCartId = cart['id'];
          this.productsCart = cart['items'];
          this.total = cart['subTotal'];
          this.productsCart.forEach((data, index) => {
            if (data.fish.imagePrimary && data.fish.imagePrimary != '') {
              this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.imagePrimary})`);
            }
            else if (data.images && data.images.length > 0) {
              this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.images[0].src})`);
            }
            else {
              this.imageCart[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
            }
            resolve();
          });
        }
      }
    }, error => {
        reject();
      console.log(error);
    });
});
  }
  //GET THE COUNTRIES LIST
  async getCountries() {
    this.allCountries = [];
    this.countries = [];
    this.filteredItems = [];
    await new Promise((resolve, reject) => {
      this.countryservice.getCountries().subscribe(result => {
        this.allCountries = result;
        resolve();
      }, error => {
        console.log(error);
        reject();
      });
    });
  }
  //Map only countries with fishes
  async getFishCountries() {
    await new Promise((resolve, reject) => {
    this.productService.getFishCountries().subscribe(result => {
      const filterCountries: any = [];
      this.allCountries.map(country => {
        const exists = Object.keys(result).some(function (k) {
          return result[k] === country.code;
        });
        if (exists) {
          filterCountries.push(country);
          return country;
        }
      });
      this.countries = filterCountries;
      this.filteredItems = this.countries;
      resolve();
    }, e => {
      this.showLoading = true;
      this.showError('Something wrong happened, Please Reload the Page');
      console.log(e);
      reject();
    });
    })
  }
  //GET all of the products
  getProducts(cant, page) {
    const data = {
      pageNumber: page,
      numberProduct: cant
    };
    this.productService.listProduct(data).subscribe(result => {
      this.isClearButton = false;
      this.products = result['productos'];
      console.log('Productos', result);

      // add paginations numbers
      this.showLoading = false;
      this.disabledInputs = false;
      // working on the images to use like background
      if (this.products.length === 0) {
        this.showNotFound = true;
      }
      else {
        this.showNotFound = false;
        this.products.forEach((data, index) => {
          this.isChange[data.id] = {status: false, kg: 0};
          if (data.imagePrimary && data.imagePrimary !== '') {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
          }
          else if (data.images && data.images.length > 0) {
            let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${src})`);
          }
          else {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
          }
        });
      }
    }, e => {
      this.showLoading = true;
      this.showError('Something wrong happened, Please Reload the Page');
      console.log(e);
    });
  }
  //Show toaster messages
  showSuccess(e) {
    this.toast.success(e, 'Well Done', { positionClass: 'toast-top-right' });
  }
  showError(e) {
    this.toast.error(e, 'Error', { positionClass: 'toast-top-right' });
  }
  //Function to remove spaces in category name
  removeSpaces(text) {
    return text.replace(" ", '-');
  }
  //GET RANGE VALUE ON CHANGE FOR EACH PRODUCT
  getRange(variation, type) {
    let val: any = jQuery('#range-' + variation).val();

    this.comparePrices(type, val);
    
   
  }

  comparePrices(type, val){
    console.log("Type", type, val);
    if (type !== '') {
      const row = document.getElementById('products-container');
      const cards = row.querySelectorAll('.category-' + type);
      for (let index = 0; index < cards.length; index++) {
          const classes = cards[index].className.split(' ');
          console.log("Classes", classes);
          console.log("Max", parseFloat(classes[10]));
          let min:any;
          let max:any;
          if(classes[12] == "true"){
            min = parseFloat(classes[13]);
            max = parseFloat(classes[14]);
          }else{
            min = parseFloat(classes[11]);
            max = parseFloat(classes[10]);
          }
          console.log("Minimo y maximo", min, max);
          if(val > max){
            console.log("es mayor al max", parseFloat(classes[10]));
            jQuery('#amount-' + classes[7]).val(max);
            jQuery('#cart-amount-' + classes[7]).val(max);
            this.products[classes[6]].qty = max;

          }else if(val < min){
            jQuery('#amount-' + classes[7]).val(min);
            jQuery('#cart-amount-' + classes[7]).val(min);

            this.products[classes[6]].qty = min;

          }else{
            console.log("es menor al max");

            jQuery('#amount-' + classes[7]).val(val);
            jQuery('#cart-amount-' + classes[7]).val(val);

            this.products[classes[6]].qty = val;


          }
          // this.moveBubble(classes[7]);
          // jQuery('#edit-qty-' + classes[7]).css('display', 'none');
          // jQuery('#qty-kg-' + classes[7]).css('display', 'block');
          this.showQty = true;
          this.getShippingRates(val, classes[8], classes[7], classes[6]);
        }

    }
  }
  showRangeVal(id, i){
    let val: any = jQuery('#range-' + id).val();
    jQuery('#edit-qty-' + id).css('display', 'none');
    jQuery('#qty-kg-' + id).css('display', 'block');
    this.moveBubble(id);
    this.products[i].qty = val;

  }
  //GET the shipping rates
  getShippingRates(weight, id, variation, i) { 
    this.productService.getData(`api/fish/${id}/variation/${variation}/charges/${weight}/true`).subscribe(result => {
     this.tmpPrice = result['price'];
      const priceTByWeight = result['finalPrice'] / Number(parseFloat(weight));
      const priceT: any = priceTByWeight.toFixed(2);
      const calcFinalPrice:any = Number(parseFloat(result['weight'])) * Number(parseFloat(result['variation']['price']));
      const finalPrice:any = calcFinalPrice.toFixed(2);
      const label = document.getElementById('delivere-price-' + variation);
      const btn = document.getElementById('btn-add-' + variation);
      jQuery('#product-price-' + variation).html("AED " + finalPrice);
      jQuery('#cart-delivere-price-' + variation).html("AED " + finalPrice);
      if (result.hasOwnProperty('message')) {
        label.innerHTML = result['message'];
      }
      else {
        label.innerHTML = 'AED ' + priceT + '<span class="delivered-small-span"> (delivered/kg)</span>';
      }
      (label as HTMLElement).style.display = 'inline-block';
      (label as HTMLElement).style.whiteSpace = 'nowrap';
      (label as HTMLElement).style.textAlign = 'center';
      (btn as HTMLElement).style.display = 'block';
      this.isChange[id] = {status: true, kg: weight};
    });
  }
  //Save product in current usar cart
  addToCart(product) {
    console.log( 'product', product );
    this.isDisabled = true;
    const item = {
      'fish': product.id,
      'price': {
        'type': '$',
        'value': (this.tmpPrice).toString()
      },
      'quantity': {
        'type': 'kg',
        'value': product.qty
      }, 
      'shippingStatus': 'pending',
      'variation_id': product.variation.id
    };
    this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(async result => {
      // set the new value to cart
      // this.toast.success('Product added to the cart!', 'Product added', {positionClass: 'toast-top-right'});
      this.getItems();
      await this.getCart();
      this.openCart();
    }, err => {
      console.log("error",err);
      if (err.error) {
        this.isDisabled = false;
        this.toast.error( err.error.message, 'An error has occurred', { positionClass: 'toast-top-right' });
      }
    });
  }
  //Function to hide span 
  hideMe(id) {
    const span = document.getElementById('qty-kg-' + id);
    const input = document.getElementById('edit-qty-' + id);
    (span as HTMLElement).style.display = 'none';
    (input as HTMLElement).style.display = 'inline-block';
    input.focus();
  }
  handleInput($event, max, min, variation, type){
    console.log("ON INput", $event.srcElement.value);
    let val = $event.srcElement.value;
    this.staticField = $event.srcElement.value;
    var that = this;
    setTimeout(() => {
      if(that.staticField == val){
        console.log("El valor no ha cambiado en un segundo");
        this.manualInput(max, min, variation, type);
      }
    }, 1000);

  }
  //Functino to enter manual kg
  manualInput(max, min, variation, type) {
    let val: any = jQuery('#amount-' + variation).val();

    if (val > max) {
      val = max;
    } else if(val < min){
      val = min;
    }
    this.comparePrices(type, val);
    
  }
  async manualInputCart(max, min, variation, type, product, boxWeight = 1) {
    let val: any = jQuery('#cart-amount-' + variation).val();
    console.log("manualInput", val, type);

    if (val > max) {
      val = max;
    } else if(val < min){
      val = min;
    }
    await this.comparePrices(type, val);
    
  }

 
  //Function to hide input and show span
  showSpan(id) {
    const span = document.getElementById('qty-kg-' + id);
    const input = document.getElementById('edit-qty-' + id);
    (input as HTMLElement).style.display = 'none';
    (span as HTMLElement).style.display = 'block';
  }
  onUserChangeEnd(changeContext: ChangeContext): void {
    jQuery('#minPriceValue').val(changeContext.value);
    jQuery('#maxPriceValue').val(changeContext.highValue);
    this.filterProducts();
  }
  //FILTER PRODUCTS WITH PARAMETERS
  filterProducts() {
    this.showNotFound = false;
    if (this.isClearButton) {
      return;
    }
    const raised: any = [];
    const preparation: any = [];
    const treatment: any = [];
    const cat = jQuery('input[type=radio][name=cat]:checked').val() || "0";
    const subcat = jQuery('input[type=radio][name=subcat]:checked').val() || "0";
    const specie = jQuery('input[type=radio][name=specie]:checked').val() || "0";
    const variant = jQuery('input[type=radio][name=variant]:checked').val() || "0";
    const country = jQuery('input[type=radio][name=country]:checked').val() || "0";
    let minPrice = jQuery('#minPriceValue').val();
    let maxPrice = jQuery('#maxPriceValue').val();
    let minimumOrder = jQuery('#minAmount').val();
    let maximumOrder = jQuery('#maxAmount').val();
    let cooming_soon = jQuery('#cooming').prop('checked');
    if (!cooming_soon) {
      cooming_soon = '0';
    }
    else {
      cooming_soon = cooming_soon.toString();
    }
    jQuery('.input-treatment:checkbox:checked').each(function (i) {
      treatment[i] = jQuery(this).val();
    });
    jQuery('.input-raised:checkbox:checked').each(function (i) {
      raised[i] = jQuery(this).val();
    });
    jQuery('.input-preparation:checkbox:checked').each(function (i) {
      preparation[i] = jQuery(this).val();
    });
    if ((minPrice === '' || minPrice === this.minValue) && (maxPrice === '' || maxPrice === this.maxValue)) {
      minPrice = '0';
      maxPrice = '0';
    }
    if (minimumOrder === '') {
      minimumOrder = '0';
    }
    if (maximumOrder === '') {
      maximumOrder = '0';
    }
    if (cat === '0' &&
      subcat === '0' &&
      specie === '0' &&
      variant === '0' &&
      country === '0' &&
      Object.keys(raised).length === 0 &&
      Object.keys(preparation).length === 0 &&
      Object.keys(treatment).length === 0 &&
      minPrice === '0' &&
      maxPrice === '0' &&
      minimumOrder === '0' &&
      maximumOrder === '0' &&
      cooming_soon === '0') {
      this.getProducts(100, 1);
    }
    else {
      this.showLoading = true;
      this.products = [];
      this.image = [];
      this.productService.filterFish(cat, subcat, specie, variant, country, raised, preparation, treatment, minPrice, maxPrice, minimumOrder, maximumOrder, cooming_soon).subscribe(result => {
        this.showLoading = false;
        this.products = result;
        this.disabledInputs = false;
        // working on the images to use like background
        this.products.forEach((data, index) => {
          if (data.imagePrimary && data.imagePrimary !== '') {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
          }
          else if (data.images && data.images.length > 0) {
            let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${src})`);
          }
          else {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
          }
        });
        if (result === undefined || Object.keys(result).length === 0) {
          this.showNotFound = true;
        }
        else {
          this.showNotFound = false;
        }
      }, error => {
        console.log(error);
        this.showLoading = false;
        this.showNotFound = true;
      });
    }
  }
  //FILTER COUNTRIES BY NAME TYPING
  async filterItem(value) {
    if (!value) {
      await this.getCountries();
      this.getFishCountries();
    } // when nothing has typed
    this.filteredItems = Object.assign([], this.countries).filter(item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1);
    setTimeout(() => this.chargeJS(), 1000);
  }
  //GET CATEGORIES LIST
  getOnChangeLevel(selectedType: any) {
    this.productService.getData(`fishTypes/${selectedType}/all_levels`).subscribe(result => {
      result['childs'].map(item => {
        switch (item.level) {
          case 0:
            this.searchCategories = item.fishTypes;
            break;
          case 1:
            this.searchSubcategories = item.fishTypes;
            break;
          case 2:
            this.searchSubSpecie = item.fishTypes;
            break;
          case 3:
            this.searchDescriptor = item.fishTypes;
            break;
          default:
            break;
        }
      });
      setTimeout(() => this.chargeJS(), 1000);
    }, error => {
      console.log(error);
    });
  }
  getAllTypesByLevel() {
    this.productService.getData(`getTypeLevel`).subscribe(result => {
      this.searchCategories = result['level0'];
      this.searchSubcategories = result['level1'];
      this.searchSubSpecie = result['level2'];
      this.searchDescriptor = result['level3'];
    }, error => {
      console.log(error);
    });
  }
  //CLEAR ALL
  async clear() {
    this.isClearButton = true;
    this.loading = true;
    this.showNotFound = false;
    this.showLoading = true;
    this.hideCat = false;
    this.hideSubcat = true;
    this.hideSpecie = true;
    this.hideVariant = true;
    this.name = '';
    await this.getCountries();
    this.getFishCountries();
    this.products = [];
    jQuery('input:checkbox').prop('checked', false);
    jQuery('#minAmount').val('');
    jQuery('#maxAmount').val('');
    jQuery('input[type=radio]').prop('checked', false);
    jQuery('#pill-category').css('display', 'none');
    jQuery('#pill-subcategory').css('display', 'none');
    jQuery('#pill-specie').css('display', 'none');
    jQuery('#pill-variant').css('display', 'none');
    jQuery('.filter-pills li').css('display', 'none');
    this.getProducts(100, 1);
    this.tmpCatName = '';
    this.tmpSubcat = '';
    this.tmpSpecie = '';
    this.tmpVariant = '';
    this.showClear = false;
    setTimeout(() => this.chargeJS(), 1000);
    this.loading = false;
  }
  //CLEAR FILTER WITH PILLS
  destroyPillCat() {
    this.showLoading = true;
    this.hideCat = false;
    this.hideSubcat = true;
    this.hideSpecie = true;
    this.hideVariant = true;
    jQuery('input[type=radio][name=cat]').prop('checked', false);
    jQuery('input[type=radio][name=subcat]').prop('checked', false);
    jQuery('input[type=radio][name=specie]').prop('checked', false);
    jQuery('input[type=radio][name=variant]').prop('checked', false);
    jQuery('#pill-category').css('display', 'none');
    jQuery('#pill-subcategory').css('display', 'none');
    jQuery('#pill-specie').css('display', 'none');
    jQuery('#pill-variant').css('display', 'none');
    this.filterProducts();
  }
  destroyPillSubat() {
    this.showLoading = true;
    this.hideCat = true;
    this.hideSubcat = false;
    this.hideSpecie = true;
    this.hideVariant = true;
    jQuery('input[type=radio][name=subcat]').prop('checked', false);
    jQuery('input[type=radio][name=specie]').prop('checked', false);
    jQuery('input[type=radio][name=variant]').prop('checked', false);
    jQuery('#pill-subcategory').css('display', 'none');
    jQuery('#pill-specie').css('display', 'none');
    jQuery('#pill-variant').css('display', 'none');
    this.filterProducts();
  }
  destroyPillSpecie() {
    this.showLoading = true;
    this.hideCat = true;
    this.hideSubcat = true;
    this.hideSpecie = false;
    this.hideVariant = true;
    jQuery('input[type=radio][name=specie]').prop('checked', false);
    jQuery('input[type=radio][name=variant]').prop('checked', false);
    jQuery('#pill-specie').css('display', 'none');
    jQuery('#pill-variant').css('display', 'none');
    this.filterProducts();
  }
  destroyPillVariant() {
    this.showLoading = true;
    this.hideCat = true;
    this.hideSubcat = true;
    this.hideSpecie = true;
    this.hideVariant = false;
    jQuery('input[type=radio][name=variant]').prop('checked', false);
    jQuery('#pill-variant').css('display', 'none');
    this.filterProducts();
  }
  destroyCheckboxPill(id) {
    this.showLoading = true;
    jQuery('.input-' + id + ':checkbox').prop('checked', false);
    jQuery('#pill-' + id).css('display', 'none');
    this.filterProducts();
  }
  async destroyPillRadio(id) {
    jQuery(`input[type=radio][name=${id}]`).prop('checked', false);
    jQuery('#pill-' + id).css('display', 'none');
    this.name = '';
    await this.getCountries();
    this.getFishCountries();
    this.filterProducts();
  }
  //FUNCTION TO OPEN AND GET THE CART
  openCart() {
    this.isDisabled = false;
    jQuery('body').addClass('has-active-menu');
    jQuery('.c-mask').addClass('is-active');
    jQuery('.cart-window').addClass('is-active');
    jQuery('.c-mask').on('click', function () {
      jQuery('body').removeClass('has-active-menu');
      jQuery('.c-mask').removeClass('is-active');
      jQuery('.cart-window').removeClass('is-active');
    });
  }
  closeCart() {
    jQuery('body').removeClass('has-active-menu');
    jQuery('.c-mask').removeClass('is-active');
    jQuery('.cart-window').removeClass('is-active');
  }
  getTotalxItem(count, price) {
    return count * price;
  }
  checkout() { 
    this.closeCart();
    this.router.navigate(['/reviewcart'], { queryParams: { shoppingCartId: this.shoppingCartId } });
  }

  goToCart(){
    this.closeCart();
    this.router.navigate(['/cart']);
  }
  deleteItem(i, id) {
    this.productService.deleteData(`itemshopping/${id}`).subscribe(result => {
      this.productsCart.splice(i, 1);
      this.getItems();
      this.closeCart();
      this.toast.success('Item removed from cart!', 'Well Done', { positionClass: 'toast-top-right' });
    }, e => {
      this.toast.error("Error deleting item!", "Error", { positionClass: "toast-top-right" });
      console.log(e);
    });
  }
  getItems() {
    let cart = {
      "buyer": this.buyerId
    };
    this.productService.saveData("shoppingcart", cart).subscribe(result => {
      this.cService.setCart(result);
      console.log(' calcular totales', result);
    }, e => { console.log(e); });
  }
  // GET PARENTS CATEROGIES
  async getParentsCat() {
    await new Promise((resolve, reject) => {
    this.productService.getData(`fishTypes/parents/with-fishes`).subscribe(res => {
      this.searchCategories = res;
      console.log("search cat", jQuery('input[type=radio][name=cat]'));
      resolve();
    }, error => {
      reject();

    });
  })
  }
  showMore() {
    jQuery('#filterCollapse').collapse('hide');
    jQuery('#filterCollapse2').collapse('show');
    this.showIcon = false;
  }
  showLess() {
    jQuery('#filterCollapse').collapse('show');
    jQuery('#filterCollapse2').collapse('hide');
    this.showIcon = true;
  }

  //GET LIST OF ITEMS FOR EACH FILTER CHECKBOX
  async getPreparation(){
    await new Promise((resolve, reject) => {
      this.productService.getData(`fishPreparation`).subscribe(res=> {
        this.preparataion = res;
        resolve();
      }, error =>{reject()})
    })
  }

  async getTreatment(){
    await new Promise((resolve, reject) => {
      this.productService.getData(`treatment`).subscribe(res=> {
        this.treatment = res;
        resolve();
      }, error =>{reject()})
    })
  }

  async getRaised(){
    await new Promise((resolve, reject) => {
      this.productService.getData(`raised`).subscribe(res=> {
        this.raised = res;
        resolve();
      }, error =>{reject()})
    })
  }

  //JAVASCRIPT FOR SLIDES
  moveBubble(id){
    console.log("Moving...", id);
    var el, newPoint, newPlace, offset;
 
    jQuery('#range-' + id).on('input', function () {
     jQuery(this).trigger('change');
 });
 // Select all range inputs, watch for change
 jQuery('#range-' + id).change(function() {
 
  // Cache this for efficiency
  el = jQuery(this);
  
  // Measure width of range input
  var width = el.width();
  
  // Figure out placement percentage between left and right of input
  newPoint = (el.val() - el.attr("min")) / (el.attr("max") - el.attr("min"));
   
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

  public getIdVarian(product){
    return product.variation.wholeFishWeight!=null? product.variation.wholeFishWeight.id : product.variation.fishPreparation.id;
  }
 
  public getFixedNumber(number){
    if( number !== null && Math.round(number) !== number) {
      number = number.toFixed(2);
  }
  return number;
  }
}
