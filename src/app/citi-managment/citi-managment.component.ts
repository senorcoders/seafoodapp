import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ShippingRatesService } from '../services/shipping-rates.service';
import { AuthenticationService } from '../services/authentication.service';
import { CountriesService } from '../services/countries.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from '../toast.service';
import { DomSanitizer } from '@angular/platform-browser';
declare var jQuery: any;

@Component({
  selector: 'app-citi-managment',
  templateUrl: './citi-managment.component.html',
  styleUrls: ['./citi-managment.component.scss']
})
export class CitiManagmentComponent implements OnInit {
  shippingRateLists: any = [];
  shippingCountries: any = [];
  shippingCities: any = [];
  allCities: any = [];
  myform: FormGroup;
  filterForm: FormGroup;
  country: FormControl;
  city: FormControl;
  filterCountry: FormControl;
  mineta: FormControl;
  cities: any = [];
  countries: any = [];
  tableCountries: any = [];

  constructor(
    public shippingService: ShippingRatesService,
    public countryService: CountriesService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast: ToastrService) {  }

 ngOnInit() {
    this.createForm();
    this.getCountries();
    this.getAllCities();
    this.getCountriesWithCities();
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
      );
    } else {
      this.countryService.getCountries().subscribe(
        result => {
          this.tableCountries = result;
        },
        error => {
          console.log( error );
        }
      );
    }
  }

  getCountries() {
    this.countryService.getCountries().subscribe(
      result => {
        this.countries = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  getCountriesWithCities() {
    this.countryService.getCountriesWithCities().subscribe(
      result => {
        this.tableCountries = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  getFilterCountries() {
    this.countryService.getCitiesByCoutry( jQuery("#filterCountry").val() ).subscribe(
      result => {
        this.tableCountries = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  getCities() {
    this.countryService.getCitiesByCoutry(this.country.value).subscribe(
      result => {
        this.cities = result['cities'];
      },
      error => {

      }
    );
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
    this.country = new FormControl('', Validators.required);
    this.city = new FormControl('', Validators.required);
    this.mineta = new FormControl('', Validators.required);
    this.filterCountry = new FormControl('');

    this.filterForm = new FormGroup( {
      filterCountry: this.filterCountry
    } );

    this.myform = new FormGroup({
      country: this.country,
      city: this.city,
      mineta: this.mineta
    });
  }

  onSubmit() {
    this.countryService.updateCity(this.myform.value)
      .subscribe(
        result => {
          this.getCountriesWithCities();
          this.toast.success('City updated succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
        },
        error => {
          console.log(error);
        }
      );
  }

  deleteCity(countryID, cityCode) {
    this.countryService.deleteCity( { country: countryID, city: cityCode } )
      .subscribe(
        result => {
           this.getCountriesWithCities();
          this.toast.success('City deleted succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
        },
        error => {
          console.log(error);
        }
    );
  }

}
