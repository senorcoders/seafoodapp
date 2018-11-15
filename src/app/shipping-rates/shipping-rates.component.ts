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
import { CountriesService } from '../services/countries.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
declare var jQuery:any;

@Component({
  selector: 'app-shipping-rates',
  templateUrl: './shipping-rates.component.html',
  styleUrls: ['./shipping-rates.component.scss']
})
export class ShippingRatesComponent implements OnInit {
  shippingRateLists:any =[];
  shippingCountries:any=[];  
  myform: FormGroup;
  sellerCountry: FormControl;
  sellerCity: FormControl;
  type: FormControl;
  operation: FormControl;
  cost: FormControl;
  weight: FormControl;
  cities:any=[];
  countries:any=[];
  constructor(private route: ActivatedRoute,
    public shippingService: ShippingRatesService,
    public countryService: CountriesService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast:ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getCountries();
    this.createForm();
    jQuery('#filterCountry').select2({
      placeholder: {
        id: '0', // the value of the option
        text: 'Select a Country'
      },      
      allowClear: true
    });
    this.getShippingRates();
    jQuery('#filterCountry').on('change', (e)=>{
      this.getShippingRates();      
    })

    this.getShippingCountries();
   
  }

  getCountries(){
    this.countryService.getCountries().subscribe(
      result => {
        this.countries = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  getCities(){
    this.countryService.getCities( this.sellerCountry.value ).subscribe(
      result => {
        this.cities = result[0].cities;
      },
      error => {

      }
    )
  }

  createForm(){
    this.shippingRateLists  = new FormControl('', Validators.required);
    this.sellerCountry      = new FormControl('', Validators.required);
    this.sellerCity         = new FormControl('', Validators.required);
    this.type               = new FormControl('Kilo', Validators.required);
    this.operation          = new FormControl('Under', Validators.required);
    this.cost               = new FormControl('', Validators.required);
    this.weight             = new FormControl('', Validators.required);
    this.myform = new FormGroup({      
      sellerCountry:  this.sellerCountry,
      sellerCity:     this.sellerCity,
      type:           this.type,
      operation:      this.operation,
      cost:           this.cost,
      weight:         this.weight
    });
  }

  getShippingRates(){
    let selectedCountry = jQuery('#filterCountry').val();
    console.log( selectedCountry );
    if( selectedCountry == "0" || selectedCountry == undefined ){
      selectedCountry = "0";
      this.shippingService.getShippingRates().subscribe(
        result=>{
          if (result instanceof Array) {
            this.shippingRateLists=result.map( ( row ) => {
              console.log(row.sellerCountry);
              this.countries.forEach(element => {
                if( element.code == row.sellerCountry ){
                  row.sellerCountry = element.name ;
  
                }
                
              });
              return row;
            } )
          }          
        },
        error=>{
          console.log( error )
        }
      )
    }else
      this.getShippingRatesByCountry();
    
  
  }
  getShippingCountries(){
    this.shippingService.getShippingCountries().subscribe( 
      result =>{        
        if (result instanceof Array) {        
          result.map( row => {        
          this.countries.forEach( element => {
            if( element.code == row ){              
              console.log( element );
              this.shippingCountries.push( element );
            }
          } )
        } )
        }
        //this.shippingCountries = result;
      },
      error => {
        console.log( error );
      }
    )
  }
  getShippingRatesByCountry(){
    let selectedCountry = jQuery('#filterCountry').val();
    this.shippingService.getShippingRatesByCountry( selectedCountry ).subscribe(
      result => {
        if (result instanceof Array) {
          this.shippingRateLists=result.map( ( row ) => {
            console.log(row.sellerCountry);
            this.countries.forEach(element => {
              if( element.code == row.sellerCountry ){
                row.sellerCountry = element.name ;
  
              }
              
            });
            return row;
          } )
        }
        
      },
      error => {
        console.log( error )
      }
    )
  }
  onSubmit(){
    this.shippingService.saveShippingRates( this.myform.value )
    .subscribe(
      result=>{
        this.getShippingRates();
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
        this.getShippingRates();
        this.toast.success("Shipping rate deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})
      } ,
      error => {
        console.log(error);
      }
    )
  }
}
