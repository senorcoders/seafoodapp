import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from '../toast.service';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { PricingChargesService } from '../services/pricing-charges.service';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.scss']
})
export class MyProductsComponent implements OnInit {
  info: any;
  storeEndpoint: any = 'api/store/user/';
  products: any = [];
  store: any;
  base: string = environment.apiURLImg;
  image: SafeStyle = [];
  user: any;
  currentPrincingCharges: any = [];
  currentExchangeRate: number;

  constructor(
    private auth: AuthenticationService,
    private productService: ProductService,
    private toast: ToastrService,
    private pricingChargesService: PricingChargesService,
    private sanitizer: DomSanitizer,
    private titleS: TitleService) {
      this.titleS.setTitle('Products');

     }

  ngOnInit() {
    

    this.user = this.auth.getLoginData();
    this.getCurrentPricingCharges();
    this.getMyData();
  }

  getMyData() {
    this.info = this.auth.getLoginData();
    if (this.user.role === 0) {
      this.getProducts();
    } else {
      this.getStore();
    }
  }
  getCurrentPricingCharges() {
    this.pricingChargesService.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        console.log('result', result);
        this.currentExchangeRate = result['exchangeRates'];
        console.log(this.currentExchangeRate);
      }, error => {
        console.log(error);
      }
    );
  }

  getStore() {
    this.productService.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results[0];
      this.getProducts();
    });
  }


  getProducts() {
    if (this.user.role === 0) {
      this.productService.getData('store/allProducts').subscribe(result => {
        this.products = result;
        setTimeout(() =>  this.replaceImgBySvg(), 1000);

        // working on the images to use like background
        this.products.forEach((data, index) => {
          if (data.imagePrimary && data.imagePrimary !== '') {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`);
          } else if (data.images && data.images.length > 0) {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.images[0].src})`);
          } else {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
          }
        });
      });
    } else {
      this.productService.getData('store/' + this.store.id).subscribe(result => {
        this.products = result['fishs'];
        console.log("Products seller", this.products);
        setTimeout(() =>  this.replaceImgBySvg(), 1000);

        // working on the images to use like background
        this.products.forEach((data, index) => {
          if (data.imagePrimary && data.imagePrimary !== '') {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`);
          } else if (data.images && data.images.length > 0) {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.images[0].src})`);
          } else {
            this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
          }
        });
      });
    }

  }


  replaceImgBySvg(){
    jQuery('img.icon-action').each(function(){
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');
  
      jQuery.get(imgURL, function(data) {
          // Get the SVG tag, ignore the rest
          var $svg = jQuery(data).find('svg');
  
          // Add replaced image's ID to the new SVG
          if(typeof imgID !== 'undefined') {
              $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if(typeof imgClass !== 'undefined') {
              $svg = $svg.attr('class', imgClass+' replaced-svg');
          }
  
          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');
          
          // Check if the viewport is set, else we gonna set it if we can.
          if(!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
              $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
          }
       
          
          // Replace image with new SVG
          $img.replaceWith($svg);
  
      }, 'xml');
  
  });
  }

  smallDesc(str) {
    if (str.length > 20) {
      const text = str.split(/\s+/).slice(0, 20).join(' ');
      return text + '...';
    } else {
      return str;
    }
  }

  deleteProduct(id, index) {
    this.productService.deleteData('api/fish/' + id).subscribe(result => {
      this.deleteNode(index);
      this.toast.success('Product deleted succesfully!', 'Well Done', { positionClass: 'toast-top-right' });

    });
  }

  deleteNode(i) {
    this.products.splice(i, 1);
    console.log(this.products);
  }



}
