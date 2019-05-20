import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../core/cart/cart.service';
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';
import { ToastrService } from '../toast.service';
import { OrderService } from '../services/orders.service';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  // buyer:string;
  userData: any;
  shoppingCarts: any = [];
  showLoading: boolean = true;
  showData: boolean = false;
  dates = [];
  API: any = environment.apiURLImg;
  searchText: any;
  status: string;
  orders: any = [];
  orderStatus: any = [];
  statusHistorical: any;
  newStatus: any;
  orderNumber: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  items:any = [];
  subtotal: any;
  shipping: any;
  fees: any;
  total: any;
  constructor(private productService: ProductService, private Cart: CartService, private auth: AuthenticationService,
    private orderService: OrderService,
    private toast: ToastrService,) { }

  ngOnInit() {

    this.userData = this.auth.getLoginData();
    this.getCartPaid();
    this.statusHistorical = '0';
    this.getStatus();
    this.getOrders();
  }
  getCartPaid() {
    this.productService.getData(`api/orders/open/${this.userData.id}`).subscribe(
      result => {
        this.showLoading = false;
        this.shoppingCarts = result;
        this.getDates();
        this.showData = true;
        setTimeout(() => this.chargeJS(), 1000);

        console.log(result);
      },
      e => {
        console.log(e);
      }
    );
  }


  getDates() {
    this.shoppingCarts.forEach((data, index) => {
      // convert date
      const date = new Date(data.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      // get time am or pm
      let hours = date.getHours();
      const min = date.getMinutes();
      let minutes;
      if (min < 10) {
        minutes = '0' + min;
      } else {
        minutes = min;
      }
      let ampm = 'AM';
      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }
      const dates = {
        month: months[date.getMonth()],
        day: date.getDate(),
        year: date.getFullYear(),
        time: hours + ':' + minutes + ' ' + ampm
      };
      this.dates[index] = dates;
    });
  }

  getLength(items) {
    const lng = items.items.length;
    if (lng > 1) {
      return true;
    } else {
      return false;
    }

  }

  getImage(item) {
    const img = item.items[0].fish['imagePrimary'];

    if (img !== undefined) {
      return this.API + img;

    } else {
      return '../../assets/Logo-1.png';
    }
  }


  chargeJS() {
    console.log(jQuery('#slidinTab'))
    //Sliding underline effect
    var $el, leftPos, newWidth;
    var $mainNav: any = jQuery("#slidinTab");

    $mainNav.append("<li id='magic-line'></li>");

    jQuery('#magic-line').css('position', 'absolute');
    jQuery('#magic-line').css('background', '$dark_blue');
    jQuery('#magic-line').css('height', '2px');
    jQuery('#magic-line').css('width', '350px');
    jQuery('#magic-line').css('left', '0');
    jQuery('#magic-line').css('bottom', '-2px');
    jQuery('#magic-line').css('border-radius', '2px');
    /* Cache it */
    var $magicLine = jQuery("#magic-line");


    jQuery("#slidinTab li a").click(function () {
      $el = jQuery(this);
      leftPos = $el.position().left;
      newWidth = $el.width();

      $magicLine.stop().animate({
        left: leftPos,
        // width: newWidth
      });
    });
  }

  getStatus() {
    this.orderService.getOrderStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log( error );
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }

  getOrders() {
    this.showNoData = false;
    console.log('status', this.status);
    console.log('orderNumber', this.orderNumber);

    if (
        ( this.statusHistorical === undefined && this.orderNumber === undefined) ||
        ( this.statusHistorical === '0' && ( this.orderNumber === undefined || this.orderNumber === '' ) )
      ) {
      this.orderService.getCanceledDeliveredOrders( this.userData['id'] ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            console.log("Completed", this.orders);
            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( this.status !== '0' && ( this.orderNumber === undefined || this.orderNumber === '' ) ) {// by status
      this.orderService.getOrdersBuyerByStatus( this.userData['id'], this.status ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            console.log("Completed", this.orders);

            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( ( this.orderNumber !== undefined || this.orderNumber > 0 ) &&  this.statusHistorical === '0' ) {// by order number
      this.orderService.getOrdersBuyerByNumber( this.userData['id'], this.orderNumber ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            console.log("Completed", this.orders);

            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else if ( this.statusHistorical !== '0' && this.orderNumber !== undefined || this.orderNumber !== '' ) {
      this.orderService.getOrdersBuyerByStatusAndNumber( this.userData['id'], this.statusHistorical, this.orderNumber ).subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            console.log("Completed", this.orders);

            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    } else {
      this.orderService.getAllOrders().subscribe(
        res => {
          if (res['length'] > 0) {
            this.orders = res;
            console.log("Completed", this.orders);

            this.showNoData = false;
          } else {
            this.showNoData = true;
          }
          console.log( res );
        },
        error => {
          console.log( error );
          this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
        }
      );
    }

  }

  //OPEN ITEMS OF AN ORDER

  openChild(items, subtotal, shipping, fees, total){
    this.items = items;
    this.subtotal = subtotal;
    this.shipping = shipping;
    this.fees = fees;
    this.total = total;
    jQuery('#open-table').hide(); 
    jQuery('#child-table').show();

  }
  hideChild(){
    jQuery('#child-table').hide(); 
    jQuery('#open-table').show();
  }

  //CANCELING A SINGLE ORDER ITEM
  cancelOrder( itemID: string ) {
    this.orderService.updateStatus ( '5c017b5a47fb07027943a40c', itemID, this.userData ).subscribe(
      res => {
        this.toast.success('The item was cancelled', 'Well Done', { positionClass: 'toast-top-right' });
      },
      error => {
        this.toast.error( 'Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' } );
        console.log( error );
      }
    );
  }

  //PRINT ORDER
  print(invoice_pdf){
    const pdf_url:any = `${this.API}/api/shoppingcart/PDF/${invoice_pdf}/pdf_invoices`;
    window.open(pdf_url, '_blank');

  }
}
