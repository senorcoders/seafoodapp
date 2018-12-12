import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
const  API=environment.apiURL;
@Injectable()
export class PricingChargesService {

  constructor(private http: HttpClient) { }

  getCurrentPricingCharges(){
    return this.http.get(`${API}pricingCharges/current`)
  }

  getPricingCharges(){
    return this.http.get(`${API}pricingCharges/history`)
  }
  savePricingCharges(data){
    return this.http.post(`${API}pricingCharges`, data, httpOptions);

  }

  getPricingChargesByWeight( itemID:string, weight:number ){
    return this.http.get(`${API}api/fish/${itemID}/charges/${weight}`)
  }

  deletePricingCharges(id){
    return this.http.delete(`${API}pricingCharges/${id}`, httpOptions);
  }
}
