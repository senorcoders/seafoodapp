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
import { ShippingRatesService } from '../services/shipping-rates.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-shipping-rates',
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.scss']
})
export class ShippingRatesComponent implements OnInit {
  shippingRateLists:any =[];
  countries=environment.countries;
  myform: FormGroup;
  sellerCountry: FormControl;
  type: FormControl;
  operation: FormControl;
  cost: FormControl;
  weight: FormControl;

  constructor(private route: ActivatedRoute,
    public shippingService: ShippingRatesService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.shippingRateLists  = new FormControl('', Validators.required);
    this.sellerCountry      = new FormControl('', Validators.required);
    this.type               = new FormControl('', Validators.required);
    this.operation          = new FormControl('', Validators.required);
    this.cost               = new FormControl('', Validators.required);
    this.weight             = new FormControl('', Validators.required);
    this.myform = new FormGroup({      
      sellerCountry:  this.sellerCountry,
      type:           this.type,
      operation:      this.operation,
      cost:           this.cost,
      weight:         this.weight
    });

    this.getFeaturedList();
  }
  getFeaturedList(){
    this.shippingService.getShippingRates().subscribe(
        result=>{

          this.shippingRateLists=result
        },
        error=>{
          console.log(error)
        }
    )
  
  }
  onSubmit(){
    this.shippingService.saveShippingRates( this.myform.value )
    .subscribe(
      result=>{
        this.getFeaturedList();
        this.toast.success("Shipping rate added succesfully!",'Well Done',{positionClass:"toast-top-right"})
      },
      error => {
        console.log(error);
      }
    )
  }
  deleteShippingItem( id:string ){
    this.shippingService.deleteShippingRates( id )
    .subscribe(
      result => {
        this.getFeaturedList();
        this.toast.success("Shipping rate deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})
      },
      error => {
        console.log(error);
      }
    )
  }
}
