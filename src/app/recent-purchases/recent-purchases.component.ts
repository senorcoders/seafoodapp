import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recent-purchases',
  templateUrl: './recent-purchases.component.html',
  styleUrls: ['./recent-purchases.component.scss']
})
export class RecentPurchasesComponent implements OnInit {
  user: any;
  items: any;
  storeID: string;
  dates = [];
  firstShipped = [];
  firstNoShipped = [];
  shipped: any;
  datesShipping = [];
  showMore: boolean = false;
  showLess: boolean = false;
  showMoreNoShipped: boolean = false;
  showLessNoShipped: boolean = false;
  showLoading: boolean = true;
  showProduct: boolean = false;
  showShipped: boolean = false;
  firstProducts: any;
  constructor(private productS: ProductService, private toast: ToastrService, private auth: AuthenticationService) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();
    this.getStore();
  }
  getStore() {
    this.productS.getData('api/store/user/' + this.user.id).subscribe(
      result => {
        this.storeID = result[0].id;
        this.getPurchases();
        this.getPurchasesShipped();
      },
      e => {
        console.log(e);
      }
    );
  }
  getPurchases() {
    // this.productS.getData('api/store/fish/paid/'+this.storeID).subscribe(
    this.productS.getData(`api/store/orders/not-shipped/user/${this.user.id}`).subscribe(
      result => {
        console.log(result);
        if (result && result !== '') {
          this.items = result;
          this.showLoading = false;
          this.showProduct = true;
          this.getFirstNoShipped();
          // this.getDates();
        } else {
          this.showProduct = false;
          this.showLoading = false;
        }
      },
      e => {
        this.showProduct = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getPurchasesShipped() {
    // this.productS.getData('api/store/fish/items/paid/' + this.storeID).subscribe(
    this.productS.getData(`api/store/orders/shipped/user/${this.user.id}`).subscribe(
      result => {
        if (result && result !== '') {
          this.shipped = result;
          this.showShipped = true;
          this.getFirstPurchases();
          this.getDatesShipped();
        } else {
          this.showShipped = false;
        }
      },
      e => {
        this.showShipped = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getFirstPurchases() {
    this.firstShipped = [];
    this.shipped.forEach((data, index) => {
      if (index <= 10) {
        this.firstShipped[index] = data;
      }
    });
    if (this.shipped.length > 10) {
      this.showMore = true;
      this.showLess = false;
    } else {
      this.showMore = false;
      this.showLess = false;
    }
  }
  getAllPurchases() {
    this.showMore = false;
    this.showLess = true;
    this.firstShipped = this.shipped;
  }
  getFirstNoShipped() {
    this.firstNoShipped = [];
    this.items.forEach((data, index) => {
      if (index <= 3) {
        this.firstNoShipped[index] = data;
      }
    });
    if (this.items.length > 3) {
      this.showMoreNoShipped = true;
      this.showLessNoShipped = false;
    } else {
      this.showMoreNoShipped = false;
      this.showLessNoShipped = false;
    }
  }
  getAllNoShipped() {
    this.showMoreNoShipped = false;
    this.showLessNoShipped = true;
    this.firstNoShipped = this.items;
  }
  getDates() {
    this.items.forEach((data, index) => {
      // convert date
      const date = new Date(data.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      this.dates[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }
  getDatesShipped() {
    this.shipped.forEach((data, index) => {
      // convert date
      const date = new Date(data.shoppingCart.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
      this.datesShipping[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }
}
