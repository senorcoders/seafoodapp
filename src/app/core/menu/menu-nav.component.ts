import { Component, HostListener } from '@angular/core';
import { MenuItems } from './menu-items';
import { AuthenticationService } from '../../services/authentication.service';
import { IsLoginService } from '../login/is-login.service';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from '../../toast.service';
import { LanguageService } from '../language/language.service';
import { CartService } from '../cart/cart.service';
import { OrdersService } from '../orders/orders.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
declare var jQuery: any;
const defaultLanguage = 'en';
const additionalLanguages = ['ar'];
const languages: string[] = [defaultLanguage].concat(additionalLanguages);
@Component({
  selector: 'app-menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss']
})
export class MenuNavComponent {
  isLogged = false;
  role: any;
  fishTypeMenu: any;
  userData: any;
  searchForm: FormGroup;
  fishTypeMenuList: any = [];
  showCart = false;
  cartItem: any;
  showSuggestion = false;
  results: any;
  lang: any;
  // show:boolean=false;
  showOrders = false;
  logo: any = '../../../assets/svg/account-circle.svg';
  storeEndpoint: any = 'api/store/user/';
  base: string = environment.apiURLImg;
  storeID: any;
  isScrolled = false;
  lastScroll = 0;
  scrollUp: boolean;

  constructor(private fb: FormBuilder, private auth: AuthenticationService, private menuItems: MenuItems,
    private isLoggedSr: IsLoginService, private router: Router, private productService: ProductService,
    private toast: ToastrService, private translate: TranslateService, private languageService: LanguageService,
    private cart: CartService, private orders: OrdersService) {

  }

  @HostListener('window:scroll', ['$event'])
  classOnScroll($event: Event) {
    //const scrollOffset = $event.target.children[0].scrollTop;
    const scrollOffset = document.getElementById("top-nav").scrollTop;
    if (scrollOffset > 50) {
      this.isScrolled = true;
    } else {
      this.isScrolled = false;
    }

    // Determines up-or-down scrolling
    if (scrollOffset > this.lastScroll) {
      // Replace this with your function call for downward-scrolling
      this.scrollUp = true;
      // }, 800);
    } else if (scrollOffset < this.lastScroll) {
      // Replace this with your function call for upward-scrolling
      this.scrollUp = false;
    }

    // Updates scroll position
    this.lastScroll = scrollOffset;
  }

 ngOnInit() {

    jQuery(document).ready(function () {
      jQuery('#search-icon').on('click', function () {
        setTimeout(function () { jQuery('#search-input').focus(); }, 300);
      });

      jQuery('img.menu-icon').each(function () {
        const $img = jQuery(this);
        const imgID = $img.attr('id');
        const imgClass = $img.attr('class');
        const imgURL = $img.attr('src');

        jQuery.get(imgURL, function (data) {
          // Get the SVG tag, ignore the rest
          let $svg = jQuery(data).find('svg');

          // Add replaced image's ID to the new SVG
          if (typeof imgID !== 'undefined') {
            $svg = $svg.attr('id', imgID);
          }
          // Add replaced image's classes to the new SVG
          if (typeof imgClass !== 'undefined') {
            $svg = $svg.attr('class', imgClass + ' replaced-svg');
          }

          // Remove any invalid XML tags as per http://validator.w3.org
          $svg = $svg.removeAttr('xmlns:a');

          // Check if the viewport is set, else we gonna set it if we can.
          if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
            $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'));
          }

          $svg.addClass('menu-icon');


          // Replace image with new SVG
          $img.replaceWith($svg);

        }, 'xml');

      });
    });

    try {
      this.translate.setDefaultLang(defaultLanguage);
      this.translate.addLangs(additionalLanguages);
      this.lang = defaultLanguage;
      this.translate.use(defaultLanguage);
      this.languageService.setLanguage(defaultLanguage);
    } catch (e) {
      console.error(e);
    }

    this.isLoggedSr.isLogged.subscribe((val: boolean) => {
      this.isLogged = val;
    });
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role;
    });
    if (this.auth.isLogged()) {
      this.userData = this.auth.getLoginData();
      if (this.userData.role === 1) {
        this.getStore();
      }
      this.isLoggedSr.setLogin(true, this.userData.role);
      // create the cart
      const cart = {
        'buyer': this.userData['id']
      };
      this.productService.saveData('shoppingcart', cart).subscribe(result => {
        // set cart value
        this.cart.setCart(result);
        if (result && result['total'] !== 0) {
          this.showCart = true;
        } else {
          this.showCart = false;
        }
      },
        e => {
          console.log(e);
          this.showCart = false;
        });
      // check if the user has orders
      if (this.isLoggedSr.role.value === 2) {
        this.productService.getData(`shoppingcart/?where={"status":{"like":"paid"},"buyer":"${this.userData.id}"}`).subscribe(
          result => {
            if (result && result !== '') {
              this.showOrders = true;
              this.orders.setOrders(true);
            }
          },
          e => {
            this.showOrders = false;
            this.orders.setOrders(false);
            console.log(e);
          });
      }
    } else {
      this.isLoggedSr.setLogin(false, -1);
    }
    // subscribe to cart service to get the cart items.
    this.cart.cart.subscribe((cart: any) => {
      this.cartItem = cart
      console.log("CART ITEM", this.cartItem);
      if (this.cartItem && this.cartItem.total !== 0) {
        this.showCart = true;
      } else {
        this.showCart = false;
      }
    });
    this.orders.hasOrders.subscribe((hasOrder: any) => {
      this.showOrders = hasOrder;
    });
    this.getFishTypeMenu();
    this.searchForm = this.fb.group({
      search: ['', Validators.required]
    });
  }

  ngOnChanges() {
  }

  async logOut() {
    await this.isLoggedSr.setLogin(false, -1);
    await this.auth.logOut();
    this.router.navigate(['/']);
  }
  // openSearch(){
  //   if(this.show){
  //     this.show=false
  //   }
  //   else{
  //     this.show=true
  //   }
  // }
  getFishTypeMenu() {
    // this.productService.getData('featuredtypes-menu').subscribe(
    //   result=>{
    //     this.fishTypeMenu=result;
    //     this.addFishTypeMenu();
    //   },
    //   error=>{
    //     // console.log(error)
    //   }
    // )
  }
  search() {
    this.showSuggestion = false;
    // this.show=false;
    this.results = '';
    this.router.navigate([`search/${this.searchForm.get('search').value}/1`]);
    this.searchForm.reset();
  }
  searchBySuggestion(name) {
    this.searchForm.reset();
    this.results = '';
    this.showSuggestion = false;
    // this.show=false;
    this.router.navigate([`search/${name}`]);
  }
  goCart() {
    this.router.navigate(['/cart']);
  }
  addFishTypeMenu() {
    this.fishTypeMenu.featureds.forEach((category) => {
      if (category.childsTypes.length > 0) {
        const data = { 'children': [] };
        category.childsTypes.forEach((children) => {
          data['children'].push({ state: `fish-type/${children.child.name}/1`, name: children.child.name, translate: { en: { name: children.child.name }, ar: { name: children.child.name } } });
        });
        this.fishTypeMenuList.push(
          {
            state: `fish-type/${category.name}/1`, type: 'sub', children: data.children,
            translate: {
              en: {
                name: category.childsTypes[0].parent.name
              },
              ar: {
                name: category.childsTypes[0].parent.name
              }
            }
          }
        );
      } else {
        this.fishTypeMenuList.push({ state: `fish-type/${category.name}/1`, type: 'link', translate: { en: { name: category.name }, ar: { name: category.name } } });
      }
    });
  }
  suggestions() {
    let search = this.searchForm.get('search').value;
    if (search && search.length >= 3) {
      search = {
        name: search
      };
      this.productService.suggestions(search).subscribe(
        result => {
          this.results = result;
          this.showSuggestion = true;
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.showSuggestion = false;
    }
  }
  closeSuggestion() {
    this.showSuggestion = false;
    // this.show=false
  }
  changeLanguage(e) {
    const value = e.srcElement.value;
    if (value !== this.lang) {
      this.translate.use(value);
      this.lang = value;
      this.languageService.setLanguage(value);
    }
  }

  // Get store for seller
  getStore() {
    this.productService.getData(this.storeEndpoint + this.userData['id']).subscribe(result => {
      console.log('Resultado store', result);
      this.storeID = result[0].id;
      if (result[0].hasOwnProperty('logo') && result[0]['logo'] !== '') {
        this.logo = this.base + result[0].logo;
      } else {
        this.logo = '../../../assets/svg/account-circle.svg';
      }
    }, error => {
      console.error(error);
    });
  }
}
