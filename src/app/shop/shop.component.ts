import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../services/orders.service';
import { Options, ChangeContext } from 'ng5-slider';
import { CountriesService } from '../services/countries.service';
import { TitleService } from '../title.service';
import { Router } from '@angular/router';
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
  minValue: number = 0;
  maxValue: number = 35;
  name:any;
  hideCat:boolean = false;
  hideSubcat:boolean = true;
  hideSpecie:boolean = true;
  hideVariant:boolean = true;
  filteredItems:any = [];
  showClear:boolean = false;
  tmpCatName:any;
  tmpSubcat:any;
  tmpSpecie:any;
  tmpVariant:any;
  options: Options = {
    floor: 0,
    ceil: 35,
    step: 5,
    translate: (value: number): string => {
      return '$' + value;
    }
  };
  shoppingCartId: any;
  productsCart: any = [];
  total: any;
  imageCart:any = [];
showIcon:boolean = true;

  constructor(private auth: AuthenticationService,
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private toast: ToastrService,
    private cartService: OrderService,
    private countryservice: CountriesService,
    private titleS: TitleService,
    private router:Router) {
      this.titleS.setTitle('Shop Seafood');

     }

  async ngOnInit() {
    //GET current user info to be used to get current cart of the user
    this.userInfo = this.auth.getLoginData();
    this.buyerId = this.userInfo['id'];
    this.getCart();
    this.getProducts(100, 1);
    // this.getAllTypesByLevel();
    this.getParentsCat();
    await this.getCountries();
    this.getFishCountries();


    //JAVASCRIPT FOR FILTER

  jQuery('.input-raised:checkbox').on('change', (e) => {
    this.showClear = true;
    this.filterProducts();
    this.createPillCheckbox('pill-raised', '.input-raised:checkbox:checked', 'raised');
  });

  jQuery('.input-treatment:checkbox').on('change', (e) => { 
    this.showClear = true;  
    this.filterProducts();
    this.createPillCheckbox('pill-treatment', '.input-treatment:checkbox:checked', 'treatment');

  });

  jQuery('.input-preparation:checkbox').on('change', (e) => {
    this.showClear = true;
    this.filterProducts();
    this.createPillCheckbox('pill-preparation', '.input-preparation:checkbox:checked', 'preparation');

  });

  jQuery('#minAmount').on('change', (e) => {
    this.showClear = true;
    this.filterProducts();
  });

  jQuery('#maxAmount').on('change', (e) => {
    this.showClear = true;
    this.filterProducts();
  });

  jQuery('#cooming').on('change', (e) => {
    this.showClear = true;
    this.filterProducts();
  });
  

  

  }

  //Create pills

  async createPills(id, val, name){
    console.log(id, val, jQuery('#' + id));
    let value = jQuery(val).val();
    await  this.getTypeName(value, name);
    jQuery('#' + id).css('display', 'inline-block');
  }

  createPillCheckbox(id, val, name){
    let value = [];
    console.log("index", jQuery(val).val());
    if(jQuery(val).val() != undefined){
      jQuery(val).each(function(i){
        value[i] = jQuery(this).val() + " ";
      });
      jQuery('#' + id + ' button span').html(value);
      jQuery('#' + id).css('display', 'inline-block');
    }else{
      this.destroyCheckboxPill(name);
    }
   


  }

  createPillRadio(id, val){
    let value = jQuery(val).val();
    jQuery('#' + id + ' button span').html(value);
    jQuery('#' + id).css('display', 'inline-block');

  }

  //GET FISH TYPE NAME FOR FILTER PILLS

  async getTypeName(id, name){
    await new Promise((resolve, reject) => {
      this.productService.getData(`/fishType/${id}`).subscribe(res=>{
        console.log("Name", res);
        if(name == 'tmpCatName'){
          this.tmpCatName = res['name'];
        } else if(name == 'tmpSubcat'){
          this.tmpSubcat = res['name'];
        }else if(name == 'tmpSpecie'){
          this.tmpSpecie = res['name'];
        }else{
          this.tmpVariant = res['name'];
        }
        resolve(res);
      }, error =>{
        reject();
      })
    })
  }

  //CHARGE LATE JS

  chargeJS(){
    console.log("Cargando JS");
    jQuery('input[type=radio][name=country]').on('change', (e) => {
      this.showClear = true;
      this.filterProducts();
      this.createPillRadio('pill-country', 'input[type=radio][name=country]:checked');

    });

    jQuery('input[type=radio][name=cat]').change((e) => {
      e.stopImmediatePropagation();
      console.log("Changing cat",  jQuery('input[type=radio][name=cat]:checked').val());

      this.showClear = true;

      const subcategorySelected = e.target.value;

      if ( subcategorySelected === 0 ) {
        this.getAllTypesByLevel();
      } else {
        this.getOnChangeLevel(subcategorySelected );
      }
       this.filterProducts();
      setTimeout(() =>  {
        this.hideCat = true;
        this.hideSubcat = false;
      }, 1000);

      this.createPills('pill-category', 'input[type=radio][name=cat]:checked', 'tmpCatName');
    
    });

    jQuery('input[type=radio][name=subcat]').on('change', async (e) => {
      console.log("Changing subcat");
      this.showClear = true;
      const specie = e.target.value;
      await this.filterProducts();
      this.getOnChangeLevel(specie );
      setTimeout(() =>  {
        this.hideCat = true;
        this.hideSubcat = true;
        this.hideSpecie = false;
      }, 1000);
      this.createPills('pill-subcategory', 'input[type=radio][name=subcat]:checked', 'tmpSubcat');
    
    });

    jQuery('input[type=radio][name=specie]').on('change', (e) => {
      console.log("Changing specie");
      this.showClear = true;
      const variant = e.target.value;
      this.getOnChangeLevel(variant );
      this.filterProducts();
      setTimeout(() =>  {
        this.hideCat = true;
        this.hideSubcat = true;
        this.hideSpecie = true;
        this.hideVariant = false;

      }, 1000);

      this.createPills('pill-specie', 'input[type=radio][name=specie]:checked', 'tmpSpecie');
    });

    jQuery('input[type=radio][name=variant]').on('change', (e) => {
      console.log("Changing variant");

      this.showClear = true;
      this.filterProducts();    
      this.createPills('pill-variant', 'input[type=radio][name=variant]:checked', 'tmpVariant');
    });
  }

  //GETTING cart info

  getCart() {
    this.productsCart = [];

    this.cartService.getCart( this.buyerId ).subscribe(
      cart=> { 
        console.log("Cart", cart);
        this.cart = cart;

        if(cart && cart.hasOwnProperty('items')){
          console.log("Si existe");
          if(cart['items'].length > 0){
            console.log("Si es mayor a cero");
            this.shoppingCartId=cart['id']
           this.productsCart=cart['items'];     
            this.total= cart['subTotal'];  
            this.productsCart.forEach((data, index)=>{
              if (data.imagePrimary && data.imagePrimary !='') {
                this.imageCart[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
              }
              else if(data.images && data.images.length>0){
                this.imageCart[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
              }
              else{
                this.imageCart[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
              }
           });          
          }
         
        }
      
        

      },
      error=> {
        console.log( error );
      })
  }


  //GET THE COUNTRIES LIST

  async getCountries() {
    this.allCountries = [];
    this.countries = [];
    this.filteredItems = [];
    await new Promise((resolve, reject) => {
      this.countryservice.getCountries().subscribe(
        result => {
          console.log("ALl countries", result);
          this.allCountries = result;
          resolve();
        },
        error => {
          console.log(error);
          reject();
        }
      );
    })
   
  }

  //Map only countries with fishes

  getFishCountries() {
  	this.productService.getFishCountries().subscribe(
  		result => {
        console.log("Countries", result);
        const filterCountries: any = [];
        this.allCountries.map( country => {
          const exists = Object.keys(result).some(function(k) {
            return result[k] === country.code;
          });
          if ( exists ) {
            filterCountries.push( country );
            return country;
          }
        } );
        console.log(filterCountries);
        this.countries = filterCountries;
        this.filteredItems = this.countries;
        setTimeout(() =>  this.chargeJS(), 1000);


  		},
  		e => {
  			this.showLoading = true;
  			this.showError('Something wrong happened, Please Reload the Page');
  			console.log(e);
  		}
  	);
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
        // this.toast.success('Product added to the cart!', 'Product added', {positionClass: 'toast-top-right'});
        this.getCart();
        this.openCart();

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

  onUserChangeEnd(changeContext: ChangeContext): void {
    console.log("changeContext", changeContext);
    jQuery('#minPriceValue').val( changeContext.value );
    jQuery('#maxPriceValue').val( changeContext.highValue );
    this.filterProducts();
   }

   //FILTER PRODUCTS WITH PARAMETERS
   filterProducts(){
     this.showNotFound = false;
    if ( this.isClearButton ) {
      return;
    }
    const raised:any = [];
    const preparation:any = [];
    const treatment:any = [] ;
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
    } else {
      cooming_soon = cooming_soon.toString();
    }
    jQuery('.input-treatment:checkbox:checked').each(function(i){
      treatment[i] = jQuery(this).val();
    });

    jQuery('.input-raised:checkbox:checked').each(function(i){
      raised[i] = jQuery(this).val();
    });
    jQuery('.input-preparation:checkbox:checked').each(function(i){
      preparation[i] = jQuery(this).val();
    });

    if ( (minPrice === '' || minPrice === this.minValue ) && ( maxPrice === '' || maxPrice === this.maxValue ) ) {
      minPrice = '0';
      maxPrice = '0';
    }

    if (minimumOrder === '') {
      minimumOrder = '0';
    }
    if (maximumOrder === '') {
      maximumOrder = '0';
    }

    console.log("AMOUNT", minimumOrder, maximumOrder);


    if (
      cat === '0' &&
      subcat === '0' &&
      specie === '0' &&
      variant === '0' &&
      country === '0' &&
      Object.keys(raised).length === 0 &&
      Object.keys(preparation).length  === 0 &&
      Object.keys(treatment).length === 0 &&
      minPrice === '0' &&
      maxPrice === '0' &&
      minimumOrder === '0' &&
      maximumOrder === '0' &&
      cooming_soon === '0'
    ) {
      this.getProducts(100, 1);
    }else{
      this.showLoading = true;
      this.products = [];
      this.image = [];
      this.productService.filterFish( cat, subcat, specie, variant, country, raised, preparation, treatment,
        minPrice, maxPrice, minimumOrder, maximumOrder, cooming_soon ).subscribe(
        result => {
          console.log("Filter Result", result);
          this.showLoading = false;
          this.products = result;

          // working on the images to use like background
          this.products.forEach((data, index) => {
            if (data.imagePrimary && data.imagePrimary !== '') {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
            } else if (data.images && data.images.length > 0) {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`);
            } else {
              this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
            }
        });
          if ( result === undefined ||  Object.keys(result).length === 0  ) {
            this.showNotFound = true;
          } else {
            this.showNotFound = false;
          }
        },
        error => {
          console.log( error );
          this.showLoading = false;
          this.showNotFound = true;

        }
      );
    }
   }

   //FILTER COUNTRIES BY NAME TYPING
   async filterItem(value){
    if(!value){
        await this.getCountries();
        this.getFishCountries();
    } // when nothing has typed
    this.filteredItems = Object.assign([], this.countries).filter(
       item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
    setTimeout(() =>  this.chargeJS(), 1000);

 }


 //GET CATEGORIES LIST

 


getOnChangeLevel(selectedType: any ) {      
  
  console.log( 'selected type id', selectedType );
  this.productService.getData( `fishTypes/${selectedType}/all_levels` ).subscribe(
    result => {
      console.log("On change levels", result);

      result['childs'].map( item => {
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
      } );
      setTimeout(() =>  this.chargeJS(), 1000);

    },
    error => {
      console.log( error );
    }
  );
}

getAllTypesByLevel() {
  this.productService.getData(`getTypeLevel`).subscribe(
    result => {
      console.log("By level", result);
      this.searchCategories = result['level0'];
      this.searchSubcategories = result['level1'];
      this.searchSubSpecie = result['level2'];
      this.searchDescriptor = result['level3'];
    },
    error => {
      console.log( error );
    }
  );
}

//CLEAR ALL

  async clear(){
  this.isClearButton = true;
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
  this.tmpSubcat= '';
  this.tmpSpecie= '';
  this.tmpVariant= ''
  this.showClear = false;


}

//CLEAR FILTER WITH PILLS

destroyPillCat(){
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
  console.log("Destroying...");
  this.filterProducts();

  
}

destroyPillSubat(){

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
  console.log("Destroying...");
  this.filterProducts();

}

destroyPillSpecie(){
  this.showLoading = true;
  this.hideCat = true;
  this.hideSubcat = true;
  this.hideSpecie = false;
  this.hideVariant = true;
  jQuery('input[type=radio][name=specie]').prop('checked', false);
  jQuery('input[type=radio][name=variant]').prop('checked', false);
  jQuery('#pill-specie').css('display', 'none');
  jQuery('#pill-variant').css('display', 'none');
  console.log("Destroying...");
  this.filterProducts();
}

destroyPillVariant(){
  this.showLoading = true;
  this.hideCat = true;
  this.hideSubcat = true;
  this.hideSpecie = true;
  this.hideVariant = false;
  jQuery('input[type=radio][name=variant]').prop('checked', false);
  jQuery('#pill-variant').css('display', 'none');
  console.log("Destroying...");
  this.filterProducts();
}

destroyCheckboxPill(id){
  this.showLoading = true;
  jQuery('.input-' + id + ':checkbox').prop('checked', false);
  jQuery('#pill-' + id).css('display', 'none');
  this.filterProducts();
}

  async destroyPillRadio(id){
  jQuery(`input[type=radio][name=${id}]`).prop('checked', false);
  jQuery('#pill-' + id).css('display', 'none');
  this.name = '';
  await this.getCountries();
  this.getFishCountries(); 
  this.filterProducts();

}

//FUNCTION TO OPEN AND GET THE CART
openCart(){
  jQuery('body').addClass('has-active-menu');
  jQuery('.c-mask').addClass('is-active');
  jQuery('.cart-window').addClass('is-active');
  jQuery('.c-mask').on('click', function(){
    jQuery('body').removeClass('has-active-menu');
    jQuery('.c-mask').removeClass('is-active');
    jQuery('.cart-window').removeClass('is-active');
  })
}

closeCart(){
  jQuery('body').removeClass('has-active-menu');
    jQuery('.c-mask').removeClass('is-active');
    jQuery('.cart-window').removeClass('is-active');
}


getTotalxItem(count, price){
  return count*price;
}

checkout(){
  this.router.navigate(['/checkout'],  {queryParams: {shoppingCartId: this.shoppingCartId}});

}

deleteItem(i, id){
  this.productService.deleteData(`itemshopping/${id}`).subscribe(
    result=>{
      console.log(result);
      this.productsCart.splice(i, 1); 
      this.getItems();
      this.closeCart();
      this.toast.success('Item removed from cart!', 'Well Done', {positionClass: 'toast-top-right'});
    },
    e=>{
      this.toast.error("Error deleting item!", "Error",{positionClass:"toast-top-right"} );
      console.log(e)
    }
  )
}

getItems(){
  let cart = {
    "buyer": this.buyerId
  }
  this.productService.saveData("shoppingcart", cart).subscribe(result => {
    console.log(' calcular totales', result );
  },e=>{console.log(e)})
}

// GET PARENTS CATEROGIES

getParentsCat(){
  this.productService.getData(`/fishTypes/parents/with-fishes`).subscribe(res =>{
    this.searchCategories = res;
  })
}

showMore(){
  jQuery('#filterCollapse').collapse('hide');
  jQuery('#filterCollapse2').collapse('show');
  this.showIcon = false;
}

showLess(){
  jQuery('#filterCollapse').collapse('show');
  jQuery('#filterCollapse2').collapse('hide');
  this.showIcon = true;
}
}
