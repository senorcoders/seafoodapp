import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
declare var jQuery:any;
import {IsLoginService} from '../core/login/is-login.service';
import { CartService } from '../core/cart/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
	products:any;
	showLoading:boolean=true;
	showPrvP:boolean= false;
	showNextP:boolean=false;
  showPrvPS:boolean= false;
  showNextPS:boolean=false;
	showNotFound:boolean=false;
	image:SafeStyle=[];
  searchForm:FormGroup;  
  searchPage=1;
  search:any;
  page:any;
  paginationNumbers:any=[];
  pageNumbers:any;
	API:string=environment.apiURLImg;
  paginationSearch:boolean=false;
  role:any;
  filterForm:FormGroup;
  searchCategories:any;
  searchSubcategories:any;
  countries:any;
  allCountries=environment.countries;
  minPriceField:number = 0;
  maxPriceField:number = 35;
  isClearButton:boolean = false;
  hideKg:boolean = true;
  initialKg:number = 5;
  deliveredPrice:number = 0;
  cartEndpoint:any = 'api/shopping/add/';
  cart:any;

  constructor(private islogin:IsLoginService,private route: ActivatedRoute,private productService:ProductService, private toast:ToastrService, 
    private sanitizer: DomSanitizer, private fb:FormBuilder, private router:Router, private cartService:CartService) { }

  ngOnInit() {
    jQuery('.category').select2();
    jQuery('.subcategory').select2();
    jQuery('.country').select2();
    jQuery('#selectRaised').select2({
      placeholder: "Raised"
    });
    jQuery('#selectTreatment').select2({
      placeholder: "Treatment"
    });
    jQuery('#selectPreparation').select2({
      placeholder: "Preparation"
    });
    
    jQuery("#sliderPrice").slider({
      ticks: [this.minPriceField, 5 ,10 ,15, 20, 25, 30, this.maxPriceField],      
      min: this.minPriceField, max: this.maxPriceField, value: [this.minPriceField, this.maxPriceField],
      ticks_labels: ['$' + this.minPriceField , '$5', '$10', '$15','$20','$25','$30', '$' + this.maxPriceField ],
      step: 5,
      ticks_snap_bounds: 0,
      tooltip_position:'bottom',
      tooltip: 'always'
    });
    

    jQuery("#sliderPrice").on('slideStop', (slider) => {
      
      //console.log( slider.value.oldValue );
      //console.log( slider.value.newValue );
      jQuery('.current-price').html( '$' + slider.value[0] + ' to $' + slider.value[1] );
      jQuery('#minPriceValue').val( slider.value[0] );
      jQuery('#maxPriceValue').val( slider.value[1] );
      this.filterProducts();
    })

    jQuery("#sliderMin").slider({
      //ticks: [0, 10, 20, 30, 40],
      value: 0,
      step: 10,
      max: 100,
      //ticks_labels: ['0', '10', '20', '30', '40' ],
      ticks_snap_bounds: 0
    });
    jQuery("#sliderMin").on('slideStop', (slider) => {
      
      console.log( slider.value );
      jQuery('.current-min').html( slider.value );
      jQuery('#minimumValue').val( slider.value );
      this.filterProducts();
    })

    jQuery('#clear').on( 'click', () =>{
      this.isClearButton = true;
      this.showLoading = true;
      jQuery('.category').val(0).trigger('change');
      jQuery('.subcategory').val(0).trigger('change');
      jQuery('.country').val(0).trigger('change');
      jQuery('#selectTreatment').val(0).trigger('change');
      jQuery('#selectRaised').val(0).trigger('change');
      jQuery('#selectPreparation').val(0).trigger('change');
      jQuery('#comming_soon').prop('checked', false);
      
      jQuery("#sliderMin").slider('destroy');
      jQuery("#sliderMax").slider('destroy');
      jQuery("#sliderMin").slider({ value:0, step: 10,
        max: 100, });
      jQuery("#sliderMax").slider({ value:0,step: 10,
        max: 100, });
      jQuery('#minPriceValue').val( "0" );
      jQuery('#maxPriceValue').val( "0" );
      
      jQuery("#sliderPrice").slider('destroy');
      jQuery("#sliderPrice").slider({
        ticks: [this.minPriceField, 5 ,10 ,15, 20, 25, 30, this.maxPriceField],      
        min: this.minPriceField, max: this.maxPriceField, value: [this.minPriceField, this.maxPriceField],
        ticks_labels: ['$' + this.minPriceField , '$5', '$10', '$15','$20','$25','$30', '$' + this.maxPriceField ],
        step: 5,
        ticks_snap_bounds: 0,
        tooltip_position:'bottom',
        tooltip: 'always'
      });

      jQuery('#minPriceValue').val( 0 );
      jQuery('#maxPriceValue').val( 0 );
      
      jQuery('.current-max').val( '' );
      jQuery('.current-min').val( '' );
      jQuery('.current-price').val( '' );
      
      this.getProducts(12,this.page);

      jQuery("#sliderMin").on('slideStop', (slider) => {        
        console.log( slider.value );
        jQuery('.current-min').html( slider.value );
        jQuery('#minimumValue').val( slider.value );
        this.filterProducts();
      })
      jQuery("#sliderMax").on('slideStop', (slider) => {
        jQuery('.current-max').html( slider.value );
        jQuery('#maximumValue').val( slider.value );
        this.filterProducts();
      })
      jQuery("#sliderPrice").on('slideStop', (slider) => {
        
        jQuery('.current-price').html( '$' + slider.value[0] + ' to $' + slider.value[1] );
        jQuery('#minPriceValue').val( slider.value[0] );
        jQuery('#maxPriceValue').val( slider.value[1] );
        this.filterProducts();
      })
      jQuery('.current-price').html( '' );
      jQuery('.current-max').html( '' );
      jQuery('.current-min').html( '' );

    } )

    jQuery("#sliderMax").slider({
      //ticks: [0, 10, 20, 30, 40],
      value: 0,
      max: 100,
      step: 10,
      //ticks_labels: ['0', '10', '20', '30', '40' ],
      ticks_snap_bounds: 0
    });
    jQuery("#sliderMax").on('slideStop', (slider) => {      
      console.log( slider.value );
      jQuery('.current-max').html( slider.value );
      jQuery('#maximumValue').val( slider.value );
      this.filterProducts();
    })

    this.route.params.subscribe(params => {
      this.page=this.route.snapshot.params['page'];
      this.search=params['query'];
      //if pagination is for all products
      if(this.search=='all'){
        this.paginationNumbers=[];
        this.paginationSearch=false;
        this.getProducts(12,this.page)
      }
      //if paginations if for the search value
      else{
        this.paginationSearch=true;
        this.Search(this.search, this.page);
      }
      this.islogin.role.subscribe((role:number)=>{
        this.role=role
      })
      jQuery(document).ready(function(){
        jQuery([document.documentElement, document.body]).animate({
          scrollTop: jQuery('#search').offset().top
        }, 1000);
      })
      
    });
  	this.searchForm=this.fb.group({
  		search:['',Validators.required]
    })
    this.filterForm = this.fb.group({
      category: '',
      subcategory: '',
      country: ''
    });
    this.getCategories();
    jQuery('.category').on('change', (e)=>{
      console.log( jQuery('.category').val() );
      let subcategorySelected = e.target.value;
      this.getSubCategories( subcategorySelected );
      if( subcategorySelected == 0 ){
        jQuery('.subcategory-container').hide();
      }else{
        jQuery('.subcategory-container').show();
      }      
      this.filterProducts();
    })
    jQuery('.subcategory').on('change', (e)=>{            
      this.filterProducts();
    })
    jQuery('.country').on('change', (e)=>{            
      this.filterProducts();
    })
    jQuery('#selectRaised').on('change', (e)=>{            
      this.filterProducts();
    })
    jQuery('#selectPreparation').on('change', (e)=>{            
      this.filterProducts();
    })
    jQuery('#selectTreatment').on('change', (e)=>{            
      this.filterProducts();
    })

    jQuery('#comming_soon').on('change', () => {
      this.filterProducts();
    })
    
    this.getFishCountries();
    this.getSubCategories('');
    this.getCart();
  }


  getCart(){
    this.cartService.cart.subscribe((cart:any)=>{
      this.cart=cart
    })
  }
  getProducts(cant,page){
  	let data={
  		pageNumber:page,
  		numberProduct: cant
  	}
  	this.productService.listProduct(data).subscribe(
  		result=>{
        this.isClearButton = false;
  			this.products=result['productos'];
        console.log("Productos", this.products);
        //add paginations numbers
        this.pageNumbers=parseInt(result['pagesNumber']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
  			this.showLoading=false;
  			//working on the images to use like background
         	this.products.forEach((data, index)=>{
	            if (data.imagePrimary && data.imagePrimary !='') {
	              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
	            }
	            else if(data.images && data.images.length>0){
	              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
	            }
	            else{
	              this.image[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
	            }
	        });
	        if(this.products.length==0){
	          this.showNotFound=true;
	        }
	        else{
	          this.showNotFound=false;
	        }
	        this.nextProductsExist(1);
          this.previousProductExist(1)
  		},
  		e=>{
  			this.showLoading=true;
  			this.showError('Something wrong happened, Please Reload the Page')
  			console.log(e)
  		}
  	)
  }
  nextProductsExist(val){
    //if it's the pagination is for all product
    if(val==1){
      if(this.page<this.pageNumbers){
        this.showNextP=true;
      }else{
        this.showNextP=false;
      }
    }
    //if pagination is for the search
    else{
      if(this.page<this.pageNumbers){
        this.showNextPS=true;
      }else{
        this.showNextPS=false;
      }
    }
  }
  previousProductExist(val){
    //if it's the pagination is for all product
    if(val==1){
      if(this.page>1){
        this.showPrvP=true;
      }else{
        this.showPrvP=false;
      }
    }
    //if pagination is for the search
    else{
      if(this.page>1){
        this.showPrvPS=true;
      }else{
        this.showPrvPS=false;
      }
    }
  }
   goTo(page,option){
    this.paginationNumbers=[];
    //go to number page if it for all products
    if(option==1){
      this.router.navigate([`/products/all/${page}`]);
    }
    //go to number page if it for the search
    else{
      this.router.navigate([`/products/${this.search}/${page}`]);
    }
  }
  nextPage(){
    this.paginationNumbers=[];
    this.page++;
    this.router.navigate([`/products/all/${this.page}`]);
  }
  previousPage(){
    this.paginationNumbers=[];
      if(this.page>1){
        this.page--;
        this.router.navigate([`/products/all/${this.page}`]);
      }
      else{
        this.router.navigate([`/products/all/${this.page}`]);
      }
  }
nextPageSearch(){
  this.paginationNumbers=[];
  this.page++;
  this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
previousPageSearch(){
  this.paginationNumbers=[];
  if(this.page>1){
    this.page--;
    this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
  else{
    this.router.navigate([`/products/${this.search}/${this.page}`]);
  }
}
deleteProduct(id, index){
  this.productService.deleteData('api/fish/'+id).subscribe(result =>{
    this.deleteNode(index);
    this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}
Search(query, page){
this.productService.searchProductByName(query,page).subscribe(
  result=>{
        this.searchPage+=1;
        this.products=result['fish'];
        this.pageNumbers=parseInt(result['pagesCount']);
        for (let i=1; i <= this.pageNumbers; i++) {
          this.paginationNumbers.push(i)
        }
        this.showLoading=false;
        //working on the images to use like background
         this.products.forEach((data, index)=>{
            if (data.imagePrimary && data.imagePrimary !='') {
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`)
            }
            else if(data.images && data.images.length>0){
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
            }
            else{
              this.image[index]=this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)')
            }
         });
        if(this.products.length==0){
          this.showNotFound=true;
        }
        else{
          this.showNotFound=false;
        }
        this.nextProductsExist(2)
        this.previousProductExist(2);
      },
      error=>{
        console.log(error)
      }
    )
}
searchProducts(query){
  this.paginationNumbers=[];
  this.router.navigate([`/products/${query}/1`]);
}
deleteNode(i){
  this.products.splice(i, 1);
}
smallDesc(str) {
     if(str.length>20){
        let text=str.split(/\s+/).slice(0,20).join(" ")
        return text+'...' 
    }
    else{
      return str
    }
  }
   showSuccess(e){
    this.toast.success(e,'Well Done',{positionClass:"toast-top-right"})
  }
   showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }

  getCategories(){  	
  	this.productService.getCategories().subscribe(
  		result=>{        
        this.searchCategories = result;
  		},
  		e=>{
  			this.showLoading=true;
  			this.showError('Something wrong happened, Please Reload the Page')
  			console.log(e)
  		}
  	)
  }

  getSubCategories(category_id:string){  	
  	this.productService.getSubCategories(category_id).subscribe(
  		result=>{        
        this.searchSubcategories = result;        
  		},
  		e=>{
  			this.showLoading=true;
  			this.showError('Something wrong happened, Please Reload the Page')
  			console.log(e)
  		}
  	)
  }

  getFishCountries(){  	
  	this.productService.getFishCountries().subscribe(
  		result=>{
        let filterCountries:any = [];
        this.allCountries.map( country => {
          var exists = Object.keys(result).some(function(k) {
            return result[k] === country.code;
          });
          if( exists ){
            filterCountries.push( country );
            return country;
          }
        } )
        console.log(filterCountries);
        this.countries = filterCountries;

  		},
  		e=>{
  			this.showLoading=true;
  			this.showError('Something wrong happened, Please Reload the Page')
  			console.log(e)
  		}
  	)
  }


  filterProducts(){
    if( this.isClearButton ){
      return;
    }
    let cat = jQuery('.category').val();
    let subcat = jQuery('.subcategory').val();
    let country = jQuery('.country').val();
    let raised = jQuery('#selectRaised').val();
    let preparation = jQuery('#selectPreparation').val();
    let treatment = jQuery('#selectTreatment').val();
    let minPrice = jQuery("#minPriceValue").val();
    let maxPrice = jQuery("#maxPriceValue").val();
    let minimumOrder = jQuery("#minimumValue").val();
    let maximumOrder = jQuery("#maximumValue").val();
    let cooming_soon = jQuery('#comming_soon').prop('checked');//jQuery("#comming_soon").val();
    console.log(preparation);
    if(!cooming_soon){
      cooming_soon ="0";
    }else{
      cooming_soon = cooming_soon.toString();
    }

    if( (minPrice == '' || minPrice == this.minPriceField ) && ( maxPrice == '' || maxPrice == this.maxPriceField ) ){
      minPrice = '0';
      maxPrice = '0';
    }
      

    if(minimumOrder == '')
      minimumOrder = '0';
    if(maximumOrder == '')
      maximumOrder = '0';

    
    if( cat == '0' && subcat == '0' && country == '0' && Object.keys(raised).length == 0 && Object.keys(preparation).length  == 0 && Object.keys(treatment).length == 0 && minPrice == '0' && maxPrice == '0' && minimumOrder == '0' && maximumOrder == '0' && cooming_soon == '0' ){
      this.getProducts(12,this.page)
    }else{
      this.showLoading=true;
      this.products = [];
      this.productService.filterFish( cat, subcat, country, raised, preparation, treatment, minPrice, maxPrice, minimumOrder, maximumOrder, cooming_soon ).subscribe(
        result => {
          this.showLoading=false;
          this.paginationNumbers=[];
          this.products=result;
          if( result == undefined ||  Object.keys(result).length == 0  )
            this.showNotFound = true;
          else
            this.showNotFound = false;
        },
        error => {
          console.log( error );
        }
      )
    }
    
    
  }

    increaseWeight(weight, max, i, id, country, category){
      if(weight < max){
        weight += 5;
        if(category != ''){
          var row = document.getElementById('products-container');
          var cards = row.querySelectorAll('.category-'+ category);
          for (var index = 0; index < cards.length; index++) {
              var classes = cards[index].className.split(" ");
              this.products[classes[6]].minimumOrder = weight;
              this.getShippingRates(weight, classes[5], classes[7]);

            }

        }else{
          this.products[i].minimumOrder = weight;
          this.getShippingRates(weight, country, id);
        }
        
      }
    }

    dicreaseWeight(weight, i, id, country, category){
      if(weight > 5){
        weight -= 5;
        if(category != ''){
          var row = document.getElementById('products-container');
          var cards = row.querySelectorAll('.category-'+ category);
          for (var index = 0; index < cards.length; index++) {
              var classes = cards[index].className.split(" ");
              this.products[classes[6]].minimumOrder = weight;
              this.getShippingRates(weight, classes[5], classes[7]);

            }

        }else{
          this.products[i].minimumOrder = weight;
          this.getShippingRates(weight, country, id);
        }
     

      }

    }

    getWeight(weight, max, i, id, country, category){
      if(weight < max){
        if(category != ''){
          var row = document.getElementById('products-container');
          var cards = row.querySelectorAll('.category-'+ category);
          for (var index = 0; index < cards.length; index++) {
              var classes = cards[index].className.split(" ");
              this.products[classes[6]].minimumOrder = weight;
              this.getShippingRates(weight, classes[5], classes[7]);

            }

        }else{
          this.products[i].minimumOrder = weight;
          this.getShippingRates(weight, country, id);
        }
        
      }else{
       
        if(category != ''){
          var row = document.getElementById('products-container');
          var cards = row.querySelectorAll('.category-'+ category);
          for (var index = 0; index < cards.length; index++) {
              var classes = cards[index].className.split(" ");
              this.products[classes[6]].minimumOrder = max;
              this.getShippingRates(max, classes[5], classes[7]);

            }

        }else{
          this.products[i].minimumOrder = max;
          this.getShippingRates(max, country, id);
        }

      }

    }


    getShippingRates(weight, country, id){
      this.productService.getData('shippingRates/country/'+ country + '/' + weight).subscribe(result=> {
          //console.log(result);
          var card = document.getElementById('product-' + id);
          var box = card.getElementsByClassName('single-kg-box')[0];
          var prices = card.getElementsByClassName('hidden-prices');
          var deliveredPice = document.getElementById('product-' + id + '-delivered');
          var deliveredPiceTotal:any = document.getElementById('product-' + id + '-delivered-total');
          (box as HTMLElement).style.display = 'block';
          for (var index = 0; index < prices.length; index++) {
            (prices[index] as HTMLElement).style.display = 'flex';
            }
        if(result.hasOwnProperty('message')){
          deliveredPice.innerHTML = result['message'];
          deliveredPiceTotal.innerHTML = "";
        }else{
          deliveredPice.innerHTML = result['type'] + ' '+ result['price'] + " / kg";
          deliveredPiceTotal.innerHTML = 'Delivered Price';
        }
       
      })
    }
  
    getDeliverTotal(price, weight){
      return price * weight;
    }


    addToCart(product){
      let item = {
        "fish":product.id,
        "price": {
                "type": product.price.type,
                "value": product.price.value
            },
        "quantity": {
            "type": product.price.type,
            "value": product.minimumOrder
        },
        "shippingStatus":"pending"
    }
      this.productService.saveData(this.cartEndpoint + this.cart['id'], item).subscribe(result => {
          //set the new value to cart
          this.cartService.setCart(result)
          this.toast.success("Product added to the cart!",'Product added',{positionClass:"toast-top-right"});
  
      })
    }

    myEnterFunction(id){
      var card = document.getElementById('product-' + id);
      var prices = document.getElementById('delivered-cont-' + id);
      var deliveredPiceTotal:any = document.getElementById('product-' + id + '-delivered-total');
      var btn = document.getElementById('btn-add-' + id);
      var sellerPrice = card.querySelectorAll('.sellers-price');
      var singlePrice = card.querySelectorAll('.single-price');
      var singleCalc = card.querySelectorAll('.single-calc');
      if((prices as HTMLElement).style.display == "flex"){
        deliveredPiceTotal.innerHTML = '';
        (card as HTMLElement).style.marginBottom = '50px';
        (btn as HTMLElement).style.visibility = 'visible';
        (btn as HTMLElement).style.marginTop = '-30px';
        (sellerPrice[0] as HTMLElement).style.display= 'flex';
        (singlePrice[0] as HTMLElement).style.display= 'none';
        (singleCalc[0] as HTMLElement).style.display= 'none';

      }


    }

    leaveFunction(id){
      var prices = document.getElementById('delivered-cont-' + id);
      var deliveredPiceTotal:any = document.getElementById('product-' + id + '-delivered-total');
      var btn = document.getElementById('btn-add-' + id);

      if((prices as HTMLElement).style.display == "flex"){
        (btn as HTMLElement).style.visibility = 'hidden';
        deliveredPiceTotal.innerHTML = 'Delivered Price';

      }

    }

}
