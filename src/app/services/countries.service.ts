import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
const  API=environment.apiURL;
@Injectable()
export class CountriesService {

  constructor( private http: HttpClient ) { }

  getCountries(){
    return this.http.get(`${API}countries`)
  }
  getCities( country_code:string ){
    return this.http.get(`${API}countries?code=${country_code}`)
  }
  getAllCities(){
    return this.http.get(`${API}countries/cities`)
  }
  saveDeliveryDate( data ) {
    return this.http.post(`${API}countries/`, data );
  }
  getCitiesByCoutry( country_id ){
    return this.http.get(`${API}countries/${country_id}`)
  }
  updateDeliveryDate( id, data ) {
    return this.http.put(`${API}countries/${id}`, data)
  }

  updateMinETA( data ) {
    return this.http.put(`${API}api/countries/cityeta`, data );
  }
}
