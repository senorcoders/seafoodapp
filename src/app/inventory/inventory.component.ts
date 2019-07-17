import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { InventoryService } from '../services/inventory.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { Location } from '@angular/common';


@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  inventories: any;
  sellers: any;
  skus: any;
  myform: FormGroup;
  seller: FormControl;
  sku: FormControl;
  date: FormControl;
  short_date: FormControl;
  quantity: FormControl;
  pickupCost: FormControl;
  today = new Date();
  min = new Date();
  max = new Date();
  constructor(
    private route: ActivatedRoute,
    private auth: AuthenticationService,
    private toast: ToastrService,
    public inventoryService: InventoryService,
    dateAdapter: DateTimeAdapter<any>,
    private _location: Location
  ) {
    this.min.setDate( this.today.getDate() );
    this.max.setDate( this.today.getDate() + 120 );
    dateAdapter.setLocale('en-EN'); // change locale to Japanese
  }

 ngOnInit() {
    this.seller = new FormControl('', Validators.required);
    this.sku = new FormControl('', Validators.required);
    this.date = new FormControl('', Validators.required);
    this.short_date = new FormControl('', Validators.required);
    this.quantity = new FormControl('', Validators.required);
    this.pickupCost = new FormControl('', Validators.required);

    this.myform = new FormGroup({
      seller: this.seller,
      sku: this.sku,
      date: this.date,
      short_date: this.short_date,
      quantity: this.quantity,
      pickupCost: this.pickupCost
    });
    this.getSellers();
  }

  changeSelectedSeller( value ){
    console.log( value );
    this.getSellerSKUS();
  }

  changeSelectedSku( value ) {
    this.getVariationStock()
  }

  getVariationStock(){
    this.inventoryService.getVariationStock( this.sku.value ).subscribe(
      res => {
        this.inventories = res;        
      },
      error => {
        console.log( error );
      }
    )
  }

  getSellers() {
    this.inventoryService.getSellers().subscribe(
      res => {
        this.sellers = res;
      }, 
      error => {

      }
    )
  }

  getSellerSKUS() {
    this.inventoryService.getSellersSkus( this.seller.value ).subscribe(
      res => {
        this.skus = res;
      },
      error => {

      }
    )
  }

  saveInventory() {
    let etaDate = new Date(this.date.value);
    let unixDate = etaDate.getTime();
    this.myform.controls['date'].setValue( unixDate );
    this.myform.controls['short_date'].setValue( etaDate.toLocaleDateString( 'en-US' ) );
    console.log( etaDate.toLocaleDateString( 'en-US' ) );
    console.log( this.myform.value );
    this.inventoryService.saveInventory(this.myform.value).subscribe( 
      res => {
        if( res.hasOwnProperty('message') ) {
          this.toast.error( res['message'] , 'Error', { positionClass: "toast-top-right" })
        } else {
          console.log( 'inventory', res );
          this.getVariationStock();
          this.toast.success('Inventory Saved!', 'Well Done', { positionClass: "toast-top-right" })

        }

      },
      error => {
        console.log( error );
      }
    );
  }

  delete( id ) {
    this.inventoryService.deleteInventory( id ).subscribe(
      res => {
        this.getVariationStock();
        this.toast.success('Inventory deleted', 'Well Done', { positionClass: "toast-top-right" })
      },
      error => {

      }
    );
  }
}
