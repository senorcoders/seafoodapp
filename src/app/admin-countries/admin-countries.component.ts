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
import { CountriesService } from '../services/countries.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
declare var jQuery:any;

@Component({
  selector: 'app-admin-countries',
  templateUrl: './admin-countries.component.html',
  styleUrls: ['./admin-countries.component.scss']
})
export class AdminCountriesComponent implements OnInit {

  myform: FormGroup;
  countries: any = [];
  country: FormControl;
  eta: FormControl;
  selectedID: String;

  constructor(public countriesService: CountriesService,
    private auth: AuthenticationService,
    public ngxSmartModalService: NgxSmartModalService,
    private toast: ToastrService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.createForm();
    this.getCountries();
  }

  createForm() {
    this.country = new FormControl('', Validators.required);
    this.eta = new FormControl('', Validators.required);

    this.myform = new FormGroup({
      country: this.country,
      eta: this.eta
    });
  }

  getCountries() {
    this.countriesService.getCountries().subscribe(
      result => {
        this.countries = result;
      },
      error => {
        console.log( error );
      }
     );
  }

  saveExpectedDeliveryDate() {
    if ( this.selectedID !== '' && this.selectedID !== undefined ) {
      //save
      this.countriesService.saveDeliveryDate( this.myform.value ).subscribe(
        result => {
          this.getCountries();
        },
        error => {
          console.log( error );
        }
      );

    } else {
      //update 
      this.countriesService.updateDeliveryDate( this.country.value, this.myform.value ).subscribe(
        result => {
          this.getCountries();
        },
        error => {
          console.log( error );
        }
      );
    }
  }
}
