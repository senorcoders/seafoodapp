import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms'
import { environment } from '../../environments/environment';
import {ProductService} from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
declare var jQuery:any;

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {
	searchForm:FormGroup
	countries=environment.countries;
	showProducts:boolean=false;
	products:any;
	showNextP:boolean=false;
  showPrvP:boolean=false;
  page:number;
  pageNumbers:any;
  paginationNumbers:any=[];
  showPagination:boolean=false;
  query:any;
  image:SafeStyle=[];
  API:string=environment.apiURLImg;
  types:any;
  noProduct:boolean=false;
  constructor(private fb:FormBuilder, private product:ProductService,private route: ActivatedRoute,private router:Router,private sanitizer: DomSanitizer) { 
  }

  ngOnInit() {
  	this.getFishType();
  	this.route.queryParams
    .subscribe(params => {
    	if(params.params && params.params!=''){
    		this.query=params.params
    		if(params.page && params.page>1){
    			this.page=params.page
    		}
    		else{
    			this.page=1
    		}
    		this.searchProducts()
    	}
    });
  	this.searchForm=this.fb.group({
  		Name:[''],
		Country:[''],
		FishType:[''],
		Raised:[''],
		Preparation:[''],
		Treatment:['']
  	})
  }
  searchProducts(){
	this.product.getData('search-avanced/'+this.page+'/12?'+this.query).subscribe(
		result=>{
			if(result['productos'].length>0){
				this.noProduct=false;
				this.products=result['productos']
				this.showProducts=true;
				this.showPagination=true;
				jQuery(document).ready(function(){
			        jQuery([document.documentElement, document.body]).animate({
			          scrollTop: jQuery('#result').offset().top
			        }, 1000);
			      })
				this.pageNumbers=parseInt(result['pagesNumber'])
				 for (let i=1; i <= this.pageNumbers; i++) {
		          this.paginationNumbers.push(i)
		        }
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
				this.nextProductsExist();
        		this.previousProductExist();
			}
			else{
				this.products=[]
				this.noProduct=true;
			}
		},
		e=>{
			console.log(e)
		}
  	)
  }
   getFishType(){
  	this.product.getData('FishType/').subscribe(
  		result=>{
  			this.types=result
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  search(){
  	let endpoint=''
  	if(this.searchForm.get('Name').value!=''){
  		endpoint+='name='+this.searchForm.get('Name').value
  	}
  	if(this.searchForm.get('FishType').value != ''){
  		if(endpoint.split('?').pop()==''){
  			endpoint+='fishType='+this.searchForm.get('FishType').value
  		}
  		else{
  			endpoint+='&fishType='+this.searchForm.get('FishType').value
  		}
  		
  	}
  	if(this.searchForm.get('Country').value != ''){
  		if(endpoint.split('?').pop()==''){
  			endpoint+='country='+this.searchForm.get('Country').value
  		}
  		else{
  			endpoint+='&country='+this.searchForm.get('Country').value
  		}
  	}
  	if(this.searchForm.get('Raised').value != ''){
  		if(endpoint.split('?').pop()==''){
  			endpoint+='raised='+this.searchForm.get('Raised').value
  		}
  		else{
  			endpoint+='&raised='+this.searchForm.get('Raised').value
  		}
  	}
  	if(this.searchForm.get('Preparation').value != ''){
  		if(endpoint.split('?').pop()==''){
  			endpoint+='preparation='+this.searchForm.get('Preparation').value
  		}
  		else{
  			endpoint+='&preparation='+this.searchForm.get('Preparation').value
  		}
  	}
  	if(this.searchForm.get('Treatment').value != ''){
  		if(endpoint.split('?').pop()==''){
  			endpoint+='treatment='+this.searchForm.get('Treatment').value
  		}
  		else{
  			endpoint+='&treatment='+this.searchForm.get('Treatment').value
  		}
  	}
  	this.paginationNumbers=[];
  	this.router.navigate(['/advanced-search'],{ queryParams: { page:1,params: endpoint } })
  }
  nextProductsExist(){
	    if(this.page<this.pageNumbers){
	      this.showNextP=true;
	    }else{
	      this.showNextP=false;
	    }
	}
	previousProductExist(){
	     if(this.page>1){
	      this.showPrvP=true;
	    }else{
	      this.showPrvP=false;
	    }
	}
  nextPage(){
    this.paginationNumbers=[];
    this.page++;
    this.router.navigate(['/advanced-search'],{ queryParams: {page:this.page,params: this.query } })
  }
  goTo(page){
    this.paginationNumbers=[];
    this.router.navigate(['/advanced-search'],{ queryParams: {page:page, params: this.query } })
  }
  previousPage(){
    this.paginationNumbers=[];
    if(this.page>1){
      this.page--;
      this.router.navigate(['/advanced-search'],{ queryParams: {page:this.page, params: this.query } })
    }
    else{
      this.router.navigate(['/advanced-search'],{ queryParams: { params: this.query } })
    }
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
}
