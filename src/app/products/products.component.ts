import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import{FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router,ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment';
declare var jQuery:any;
import {IsLoginService} from '../core/login/is-login.service';

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
	showNotFound=false;
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
  constructor(private islogin:IsLoginService,private route: ActivatedRoute,private productService:ProductService, private toast:ToastrService, private sanitizer: DomSanitizer, private fb:FormBuilder, private router:Router) { }

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

    jQuery("#sliderPrice").on('change', (slider) => {
      console.log( slider.value.oldValue );
      console.log( slider.value.newValue );
      jQuery('.current-price').html( '$' + slider.value.newValue[0] + ' to $' + slider.value.newValue[1] );
      jQuery('#minPriceValue').val( slider.value.newValue[0] );
      jQuery('#maxPriceValue').val( slider.value.newValue[1] );
      this.filterProducts();
    })

    jQuery("#sliderMin").slider({
      //ticks: [0, 10, 20, 30, 40],
      value: 0,
      step: 5,
      max: 100,
      //ticks_labels: ['0', '10', '20', '30', '40' ],
      ticks_snap_bounds: 0
    });
    jQuery("#sliderMin").on('change', (slider) => {
      console.log( slider.value.oldValue );
      console.log( slider.value.newValue );
      jQuery('.current-min').html( slider.value.newValue );
      jQuery('#minimumValue').val( slider.value.newValue );
      this.filterProducts();
    })

    jQuery("#sliderMax").slider({
      //ticks: [0, 10, 20, 30, 40],
      value: 0,
      max: 100,
      step: 5,
      //ticks_labels: ['0', '10', '20', '30', '40' ],
      ticks_snap_bounds: 0
    });
    jQuery("#sliderMax").on('change', (slider) => {
      console.log( slider.value.oldValue );
      console.log( slider.value.newValue );
      jQuery('.current-max').html( slider.value.newValue );
      jQuery('#maximumValue').val( slider.value.newValue );
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
  }
  getProducts(cant,page){
  	let data={
  		pageNumber:page,
  		numberProduct: cant
  	}
  	this.productService.listProduct(data).subscribe(
  		result=>{
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

    if(!cooming_soon){
      cooming_soon ="0";
    }else{
      cooming_soon = cooming_soon.toString();
    }

    if(minPrice == '')
      minPrice = '0';
    
    if(maxPrice == '')
      maxPrice = '100000';

    if(minimumOrder == '')
      minimumOrder = '0';
    if(maximumOrder == '')
      maximumOrder = '0';


    if( cat == '0' && subcat == '0' && country == '0' && raised == '0' && preparation == '0' && treatment == '0' && minPrice == this.minPriceField && maxPrice == this.maxPriceField && minimumOrder == '0' && maximumOrder == '0' && cooming_soon == '0' ){
      this.getProducts(12,this.page)
    }else{
      this.productService.filterFish( cat, subcat, country, raised, preparation, treatment, minPrice, maxPrice, minimumOrder, maximumOrder, cooming_soon ).subscribe(
        result => {
          this.paginationNumbers=[];
          this.products=result;
        },
        error => {
          console.log( error );
        }
      )
    }
    
    
  }

  

}
