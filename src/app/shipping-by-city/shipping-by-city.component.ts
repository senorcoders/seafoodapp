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
import { ToastrService } from '../toast.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-shipping-by-city',
  templateUrl: './shipping-by-city.component.html',
  styleUrls: ['./shipping-by-city.component.scss']
})
export class ShippingByCityComponent implements OnInit {
  shippingRateLists: any = [];
  shippingCountries: any = [];
  shippingCities: any = [];
  allCities: any = [];
  myform: FormGroup;
  country: FormControl;
  city: FormControl;
  filterCountry: string;
  mineta: FormControl;
  cities: any = [];
  countries: any = [];
  tableCountries: any = [];

  constructor(private route: ActivatedRoute,
    public shippingService: ShippingRatesService,
    public countryService: CountriesService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast: ToastrService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
    this.createForm();
    this.getCountries();
    this.getAllCities();
  }

  getFilterCountry() {
    const selectedCountry: any = document.getElementById( 'filterCountry' );
    const selectedVallue = selectedCountry.options[selectedCountry.selectedIndex].value;

    console.log( selectedVallue );
    if ( selectedVallue !== '0' ) {
      this.countryService.getCitiesByCoutry( selectedVallue ).subscribe(
        result => {
          this.tableCountries = result;
        },
        error => {
          console.log( error );
        }
      )
    } else {
      this.countryService.getCountries().subscribe(
        result => {
          this.tableCountries = result;
        },
        error => {
          console.log( error );
        }
      )
    }
    
  }

  getCountries() {
    this.countryService.getCountries().subscribe(
      result => {
        this.tableCountries = result;
        this.countries = result;
      },
      error => {
        console.log(error);
      }
    )
  }

  getCities() {
    this.countryService.getCitiesByCoutry(this.country.value).subscribe(
      result => {
        this.cities = result['cities'];
      },
      error => {

      }
    )
  }

  getAllCities() {
    this.countryService.getAllCities().subscribe(
      result => {
        this.allCities = result;
        this.cities = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  createForm() {
    //this.filterCountry = new FormControl('');
    this.country = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.mineta = new FormControl('', Validators.required);

    this.myform = new FormGroup({
      country: this.country,
      city: this.city,
      mineta: this.mineta
    });
  }

  onSubmit() {
    console.log('asd', this.myform);
    this.countryService.updateMinETA(this.myform.value)
      .subscribe(
        result => {
          this.getCountries();
          this.toast.success("Shipping rate added succesfully!", 'Well Done', { positionClass: "toast-top-right" })
        },
        error => {
          console.log(error);
        }
      )
  }

}
