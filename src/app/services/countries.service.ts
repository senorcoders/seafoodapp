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
}
