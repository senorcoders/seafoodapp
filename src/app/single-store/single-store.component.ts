import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from '../toast.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
declare var jQuery;
@Component({
  selector: 'app-single-store',
  templateUrl: './single-store.component.html',
  styleUrls: ['./single-store.component.scss']
})
export class SingleStoreComponent implements OnInit {

  storeID: any;
  storeEndpoint: any = 'store/';
  store: any = {
    name: '',
    description: '',
    location: '',
  };
  hero: any;
  logo: any;
  base: string = environment.apiURLImg;
  products: any = [];
  empty = false;
  form: any = {
    name: '',
    email: '',
    message: ''
  };
  formEndpoint: any = 'api/contact-form/';
  userID: any;
  averageReview: any = 0;
  comments: any;
  reviews: any;
  Stars = [];
  firstComments: any = [];
  showMore = false;
  showLess = false;
  simpleLayout = false;
  productImage: any = [];
  brands: any = [];
  certs: any = [];
  errorLoadingLogo = false;
  API: string = environment.apiURLImg;
  userInfo: any;


  constructor(private route: ActivatedRoute,
    public productService: ProductService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast: ToastrService, private sanitizer: DomSanitizer,
    private http: HttpClient) {
      jQuery(document).ready(function () {
      
    })
     }

     chargeJS(){
      jQuery(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        let tab = e.target.attributes.id.value; // newly activated tab
        let newTab = tab.split("-");
        let currentTab: any = '#nav-footer-' + newTab[2];
        let footerHolder = jQuery(currentTab).parent('.multiple-bottom');
        console.log(footerHolder[0].id);
        jQuery("#" + footerHolder[0].id + " .product-footer").removeClass('active');;
        jQuery(currentTab).tab('show');
      })
     }
  ngOnInit() {
    this.userInfo = this.auth.getLoginData();
    this.storeID = this.route.snapshot.params['id'];
    this.getPersonalData();
    this.getReview();
    this.getLogos();
  }

  public errorLoadLogo(e) {
    e.target.src = 'https://via.placeholder.com/150';
  }

  getLogos() {
    this.productService.getData(`api/store/${this.storeID}/brandscertifications`).subscribe(result => {
      console.log("Logos", result);
      if (result.hasOwnProperty('brands')) {
        if(result['brands'] != null){
          this.brands = result['brands'];

        }
      }

      if (result.hasOwnProperty('certifications')) {
        if(result['certifications'] != null){
        this.certs = result['certifications'];
        }
      }
    });
  }
  getPersonalData() {
    this.getStoreData();
  }
  getReview() {
    this.productService.getData(`reviewsstore?where={"store":"${this.storeID}"}`).subscribe(
      result => {
        this.reviews = result;
        this.getFirstComments();
        this.calcStars();
      },
      e => {
        console.log(e);
      }
    );
  }
  getFirstComments() {
    this.firstComments = [];

    this.reviews.forEach((data, index) => {
      if (index <= 2) {
        this.firstComments[index] = data;
      }
    });

    if (this.reviews.length > 3) {
      this.showMore = true;
      this.showLess = false;
    } else {
      this.showMore = false;
      this.showLess = false;
    }
  }

  getAllComments() {
    this.showMore = false;
    this.showLess = true;
    this.firstComments = this.reviews;
  }

  calcStars() {
    this.reviews.forEach((data) => {
      this.averageReview += data.stars;
    });

    this.averageReview /= this.reviews.length;
  }
  getStoreData() {
    this.productService.getData(this.storeEndpoint + this.storeID).subscribe(result => {
      if (result && result !== '') {
        if (result['logo'] && result['logo'] !== '') {
          this.logo = this.base + result['logo'];
        } else {
          this.logo = '../../assets/seafood -souq-seller-logo-default.png';
        }
        if (result['heroImage'] && result['heroImage'] !== '') {
          this.hero = this.base + result['heroImage'];
        } else {
          this.hero = '../../assets/hero_slide.jpg';
        }
        this.store.name = result['name'];
        this.store.description = result['description'];
        this.store.location = result['location'];
        this.userID = result['owner'];
        this.products = result['fishs'];
        console.log("SHOP", this.products);
        setTimeout(() => this.chargeJS(), 500);



        this.products.forEach((data, index) => {
          if (data.imagePrimary && data.imagePrimary !== '') {
            this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`);
          } else if (data.images && data.images.length > 0) {
            let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
            this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${src})`);
          } else {
            this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
          }
        });
      } else {
        this.empty = true;
      }
    });
  }
  private filterFish(store) {
    this.http.post(`fish/filter`, { store }).subscribe(fish => {
      var array: any = Object.entries(fish);
      this.products = array;
      //this for add images to products, but no correct with new endpoint
      // this.products.forEach((data, index) => {
      //   if (data.imagePrimary && data.imagePrimary !== '') {
      //     this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${data.imagePrimary})`);
      //   } else if (data.images && data.images.length > 0) {
      //     let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
      //     this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${src})`);
      //   } else {
      //     this.productImage[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
      //   }
      // });
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

  sendMail() {
    if (this.form.name !== '' && this.form.email !== '' && this.form.message !== '') {
      this.productService.saveData(this.formEndpoint + this.userID, this.form).subscribe(result => {
        this.toast.success('Submit successfully!', 'Well Done', { positionClass: 'toast-top-right' });

      }, error => {
        this.toast.error('Error sending email!', 'Error', { positionClass: 'toast-top-right' });

      });
    } else {
      this.toast.error('All fields are required!', 'Error', { positionClass: 'toast-top-right' });
    }
  }
  getDates(value) {
    const date = new Date(value);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
  }

  loadImage(data) {
    // this.isChange[data.variation.id] = { status: false, kg: 0 }; 
    if (data.imagePrimary && data.imagePrimary !== '') {
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
    }
    else if (data.images && data.images.length > 0) {
      let src = data['images'][0].src ? data['images'][0].src : data['images'][0];
      return this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${src})`);
    }
    else {
      return this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
    }

  }

}
