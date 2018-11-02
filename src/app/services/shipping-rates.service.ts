import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
const  API=environment.apiURL;
@Injectable()
export class ShippingRatesService {

  constructor(private http: HttpClient) { }

  getShippingRates(){
    return this.http.get(`${API}shippingRates`)
  }
  saveShippingRates(data){
    return this.http.post(`${API}shippingRates`, data, httpOptions);

  }

  deleteShippingRates(id){
    return this.http.delete(`${API}shippingRates/${id}`, httpOptions);
  }
}
