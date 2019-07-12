import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../environments/environment';
import * as moment from 'moment';
import { isNumber } from 'util';

@Component({
  selector: 'app-ammend-invoice',
  templateUrl: './ammend-invoice.component.html',
  styleUrls: ['./ammend-invoice.component.scss']
})
export class AmmendInvoiceComponent implements OnInit {

  public id = '';
  public shopping: any = {};
  public apiUrl = environment.apiURL;
  public subtotal = 0;
  public vat = 0;
  public total = 0;
  public invoiceReady = false;
  public items = [];
  public showDetails = true;
  //indicate if calcs are starts
  public calcNews = false;
  public textSave = 'amend invoice';

  constructor(
    private router: ActivatedRoute,
    private http: HttpClient,
    private route: Router
  ) { }

  ngOnInit() {
    this.id = this.router.snapshot.params['id'];
    this.http.get('api/v2/order-full/' + this.id).subscribe(it => {
      console.log(it);
      this.shopping = (it as any).data;
      this.subtotal = this.shopping.subTotal;
      this.total = this.shopping.total;
      this.vat = this.shopping.uaeTaxes;

      //the items of shopping the clone for new items
      this.items = this.shopping.items.map(it => {
        let priceDelivered = this.Number(
          (
            (this.Number(it.itemCharges.finalPrice) / this.Number(it.itemCharges.weight))
              .toFixed(2)
          )
        );
        return { id: it.id, description: it.description, quantity: this.Number(it.itemCharges.weight), vat: 0, total: 0, priceDelivered, amountEAD: 0 };
      });
      //for calculate amount, vat and total of items
      for (let i = 0; i < this.items.length; i++) { this.changeValue(this.items[i], i); }
      this.invoiceReady = true;
    });
  }

  public toggleDetails() {
    this.showDetails = !this.showDetails;
  }

  public Number = Number;

  public parseInt = parseInt;

  public parseFloat = parseFloat;

  public formatPaid() {
    if (this.shopping.paidDateTime)
      return moment(this.shopping.paidDateTime).format('DD/MM/YYYY');
  }

  public changeValue(it, i) {
    //check if there is a new value in prop of item
    let priceDelivered: any = this.Number(it.priceDelivered);
    let quantity: any = this.Number(it.quantity);
    if (
      (isNumber(priceDelivered) === true && priceDelivered > 0) &&
      (isNumber(quantity) === true && quantity > 0)
    ) {
      let vat = ((this.Number(priceDelivered) * quantity) * 0.05).toFixed(2),
        amountEAD = ((this.Number(priceDelivered) * quantity) * 0.95).toFixed(2),
        total = (this.Number(amountEAD) + this.Number(vat)).toFixed(2);
      this.items[i] = Object.assign(it, { priceDelivered: this.Number(priceDelivered).toFixed(2), vat, amountEAD, total });
      console.log(this.items);
      this.calcTotals();
    }
  }

  private calcTotals() {
    //calcs for totals and subtotal and vat in general
    this.total = 0; this.subtotal = 0; this.vat = 0;
    for (let it of this.items) {
      this.total += this.Number(it.total);
      this.vat += this.Number(it.vat);
      this.subtotal += this.Number(it.total) - this.Number(it.vat);
    }
    this.total = this.Number(this.total.toFixed(2));
    this.vat = this.Number(this.vat.toFixed(2));
    this.subtotal = this.Number(this.subtotal.toFixed(2));
    this.calcNews = true;
  }

  public newValue(it, prop) {
    //find item, check if value is diferent of 0
    let item = this.items.find(ite => ite.id === it.id);
    if (item !== undefined && isNumber(this.Number(item[prop])) && this.Number(item[prop]) > 0) return true;
    return false;

  }

  public getValue(it, prop) {
    //find item, check if value is diferent of 0
    let item = this.items.find(ite => ite.id === it.id);
    if (item !== undefined && isNumber(this.Number(item[prop])) && this.Number(item[prop]) > 0) return this.Number(item[prop]);
    return 'No Defined';
  }

  public ammendInvoice() {
    this.textSave = 'Amending...';
    let cart = this.shopping;
    cart.currentPrices = {
      total: this.total,
      subtotal: this.subtotal,
      vat: this.vat
    };
    let items = this.shopping.items.map(it => {

      //find item of items for assign new values
      let item = this.items.find(ite => ite.id === it.id);
      if (item !== undefined) {
        let currentPrices: any = {};
        let props = ['quantity', 'priceDelivered', 'total', 'vat', 'amountEAD']
        for (let p of props) {
          if (isNumber(this.Number(item[p])) === true && this.Number(item[p]) > 0) {
            currentPrices[p] = this.Number(item[p]);
          } else {
            console.log(item, p);
          }
        }
        it.currentPrices = currentPrices;
      }
      return it;
    });
    let dateTime = new Date().getTime();

    this.http.post('api/v2/ammend-invoice', { cart, items, dateTime }).subscribe(it => {
      console.log(it);
      this.route.navigate(['logistic-management']);
    });
  }

}
