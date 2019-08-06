import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
@Injectable()
export class ShippingRatesService {

  constructor(private http: HttpClient) { }

  getShippingRates(){
    return this.http.get(`shippingRates`)
  }

  getShippingRatesByCountry( country:string ){
    return this.http.get(`shippingRates?sellerCountry=${country}`)
  }

  getShippingRatesByCity( country:string, city:string ){
    return this.http.get(`shippingRates?sellerCountry=${country}&sellerCity=${city}`)
    //return this.http.get(`shippingRates/country/${country}/city/${city}`)
  }

  getShippingCountries(){
    return this.http.get(`shippingRates/countries`)
  }

  getShippingCities( country:string ){  
    return this.http.get(`shippingRates/country/${country}/cities`)
  }

  saveShippingRates(data){
    return this.http.post(`shippingRates`, data, httpOptions);

  }

  deleteShippingRates(id){
    return this.http.delete(`shippingRates/${id}`, httpOptions);
  }
}
