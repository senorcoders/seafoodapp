import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Router, RouterLinkWithHref } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { CartService } from '../core/cart/cart.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var jQuery: any;
import { environment } from '../../environments/environment';
import { IsLoginService } from '../core/login/is-login.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any = [];
  API: string = environment.apiURLImg;
  cdnURL: string = environment.cdnURL;
  role: any;
  showLoading: boolean = true;
  featuredSellers: any;
  showError: boolean = false;
  error: string;
  logos = [];
  featuredProducts: any;
  images = [];
  featuredTypesImages = [];
  loadProduct: boolean = true;
  featuredtypes: any;
  fishTypeMenu: any;
  fishTypeMenuImages = [];
  fishTypeMenuImagesChild = [];
  isLoggedIn: boolean = false;
  menu: any = [];
  lang: any = "en";


  constructor(private isLoggedSr: IsLoginService, private product: ProductService,
    private auth: AuthenticationService, private sanitizer: DomSanitizer,
    private cart: CartService, private router: Router) {
    jQuery(document).ready(function () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("Es movil");
        jQuery('video source').each(function (num, val) {
          jQuery(this).attr('src', '')
        });
      }
    });

  }


  async ngOnInit() {
    console.log(jQuery("body"));
    jQuery('body').addClass('home-header');
    jQuery('#carouselExampleIndicators').carousel({
      interval: false
    });
    var canScroll = 1;
    function pauseScroll() {
      console.log("GOT HERE");
      console.log("CUrrent Scroll: ", canScroll);
      canScroll = 1;
    } 

    //FIREFOX
    jQuery('#carouselExampleIndicators').bind('DOMMouseScroll', function (e) {
      e.stopImmediatePropagation();

      console.log("CanScroll: ", canScroll);
      if (canScroll == 1) {
        canScroll = 0;
        console.log("Doing", e);
        if (e.originalEvent.detail > 0) {
          //scroll down
          jQuery(this).carousel('next');
          setTimeout(pauseScroll, 1300);
        } else {
          //scroll up
          jQuery(this).carousel('prev');
          setTimeout(pauseScroll, 1300);

        }
      }

      //prevent page fom scrolling
      return false;

    });

    //IE, Opera, Safari
    jQuery('#carouselExampleIndicators').bind('mousewheel', function (e) {
      console.log("Wheel Data: ", e.originalEvent.wheelDelta);
      e.stopImmediatePropagation();
      if (e.originalEvent.wheelDelta < -25) {
        //scroll down
        jQuery(this).carousel('next');
      } else if (e.originalEvent.wheelDelta > 25) {
        //scroll up
        jQuery(this).carousel('prev');

      }

      //prevent page fom scrolling
      return false;
    });
    console.log("Probando Home");

    this.getLoginStatus();
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role
      if (this.role === -1)
        this.isLoggedIn = false;
    })

  }

  public ngOnDestroy() {
    jQuery('body').removeClass('home-header');
  }

  getLoginStatus() {
    let login = this.auth.getLoginData();
    console.log('login status', login);
    if (login != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }
  getFeaturedProducts() {
    this.product.getData('featuredproducts').subscribe(
      result => {
        this.featuredProducts = result;
        this.getImages();
      },
      error => {
        console.log(error);
        this.showError = true;
        this.error = "No Product found"
      }
    )
  }
  getFeaturedSeller() {
    this.product.getData('featuredseller').subscribe(
      result => {
        this.featuredSellers = result;
        this.getLogos();
      },
      error => {
        console.log(error);
        this.showError = true;
        this.error = "No Seller found"
      }
    )
  }
  getImages() {
    let val = this.featuredProducts.length;
    this.featuredProducts.forEach((data, index) => {
      this.product.getProductDetail(data.id).subscribe(result => {
        this.products[index] = result;
        if (result['imagePrimary'] && result['imagePrimary'] != '') {
          this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${result['imagePrimary']})`)
        }
        else if (result['images'] && result['images'].length > 0) {
          let src = result['images'][0].src ? result['images'][0].src : result['images'][0];
          this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${src})`)
        }
        else {
          this.images[index] = this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default-img-product.jpg)")
        }
        if (val - 1 == index) {
          this.loadProduct = false
        }
      }, error => {
        console.log(error)
      })
    })
  }
  getShortDesc(data) {
    if (data.length > 20) {
      let text = data.split(/\s+/).slice(0, 20).join(" ")
      return text + '...'
    }
    else {
      return data
    }
  }
  getLogos() {
    this.featuredSellers.forEach((data, index) => {
      this.product.getData('store/' + data.id).subscribe(
        result => {
          if (result['logo'] && result['logo'] != '') {
            this.logos[index] = this.API + result['logo'];
          }
          else {
            this.logos[index] = "../../assets/seafood -souq-seller-logo-default.png";
          }
        },
        error => {
          console.log(error)
        }
      )
    })
  }
  getFishTypeMenu() {
    // this.product.getData('featuredtypes-menu').subscribe(
    //   result=>{
    //     this.fishTypeMenu=result['featureds'];
    //     this.fishTypeMenu.forEach((data,index)=>{
    //       // if(data.childsTypes.length>0){
    //       //   let j=this.fishTypeMenuImagesChild.length;
    //       //   data.childsTypes.forEach((child, i)=>{
    //       //     //console.log(child.child.images[0].src)
    //       //     if(child.child.images && child.child.images.length>0){
    //       //       this.fishTypeMenuImagesChild[j]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${child.child.images[0].src})`)
    //       //     }
    //       //     else{
    //       //       this.fishTypeMenuImagesChild[j]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default.jpg)")
    //       //     }
    //       //     j++;
    //       //     //console.log(this.fishTypeMenuImagesChild[i])
    //       //   })
    //       // }
    //       //else{
    //         if(data.images && data.images.length>0){
    //           this.fishTypeMenuImages[index]=this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
    //         }
    //         else{
    //           this.fishTypeMenuImages[index]=this.sanitizer.bypassSecurityTrustStyle("url(../../assets/Logo-1.png)")
    //         }
    //       //}
    //     })
    //   },
    //   e=>{
    //    console.log(e)
    //   }
    // )
  }
  getFeaturedTypes() {
    this.product.getData('featuredtypes/').subscribe(
      result => {
        console.log("res", result);
        if (result.hasOwnProperty('featureds')) {
          this.featuredtypes = result['featureds'];
          this.featuredtypes.forEach((data, index) => {
            if (data.images && data.images.length > 0) {
              this.featuredTypesImages[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`)
            }
            else {
              this.featuredTypesImages[index] = this.sanitizer.bypassSecurityTrustStyle("url(../../assets/default.jpg)")
            }
          })
          jQuery(document).ready(function () {
            jQuery('#featuredtype2').appendTo('#featured1')
            jQuery('#featured2').remove();
          })
        }

      },
      error => {
        console.log(error)
      }
    )
  }
  register(page) {
    this.router.navigate(['/register'], { queryParams: { register: page } })
  }

  next() {
    jQuery('#carouselExampleIndicators').carousel('next');
  }

  prev() {
    jQuery('#carouselExampleIndicators').carousel('prev');
  }

}
