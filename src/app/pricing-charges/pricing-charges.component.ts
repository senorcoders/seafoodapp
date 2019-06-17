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
import { PricingChargesService } from '../services/pricing-charges.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from '../toast.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
declare var jQuery:any;

@Component({
  selector: 'app-pricing-charges',
  templateUrl: './pricing-charges.component.html',
  styleUrls: ['./pricing-charges.component.scss']
})
export class PricingChargesComponent implements OnInit {
  myform: FormGroup;
  type: FormControl;
  price: FormControl;
  selectedType;
  newPrice;
  /*uaeTaxes: FormControl;
  handlingFees: FormControl;
  customs: FormControl;
  lastMileCost: FormControl;*/
  historyPricing:any = [];
  currentPricing:any = [];

  constructor(private route: ActivatedRoute,
    public PricingChargesService: PricingChargesService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService, private sanitizer: DomSanitizer) { }

 ngOnInit() {    
    this.createForm();
    this.getCurrentPricing();
    this.getHistoryPricing();
  }

  showConfirmModal(){
    jQuery('#mtype').html( jQuery("#type option:selected").text() );
    //this.selectedType = jQuery("#type option:selected").text();
    this.newPrice = jQuery("#price").val();
    //jQuery('.mprice').html( jQuery("#price").val() );
    jQuery('.confirmUpdate').modal('show');
  }

  changeSelectedType( value ){
    console.log( value );
    console.log(  jQuery("#type option:selected").text() );
    this.selectedType =  jQuery("#type option:selected").text();
  }

  createForm(){
    this.price = new FormControl('', Validators.required);
    this.type = new FormControl('', Validators.required);
    
    this.myform = new FormGroup({      
      type: this.type,
      price: this.price
    });
  }

  getCurrentPricing(){
    this.PricingChargesService.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPricing = result;
      },
      error => {
        console.log( error )
      }
    )
  }

  getHistoryPricing() {
    this.PricingChargesService.getPricingCharges()
    .subscribe(
      result => {
        this.historyPricing = result;
      },
      error => {
        console.log( error );
      }
    )
  }

  savePricing() {
    jQuery('.confirmUpdate').modal('hide');
    this.PricingChargesService.savePricingCharges( this.myform.value )
    .subscribe(
      result => {
        console.log( result );
        this.getHistoryPricing();
        this.getCurrentPricing();
        this.myform.controls["price"].setValue("");
        this.toast.success('Pricing Charge saved', 'Well Done', { positionClass: "toast-top-right" })

      },
      error => {
        console.log( error );
      }
    )
  }

  deletePricing() {
    this.PricingChargesService.deletePricingCharges( this.myform.value )
    .subscribe(
      result => {
        console.log( result );
        this.getHistoryPricing();
      },
      error => {
        console.log( error );
      }
    )
  }

}
