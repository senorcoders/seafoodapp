import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
@Injectable()
export class PricingChargesService {

  constructor(private http: HttpClient) { }

  getCurrentPricingCharges(){
    return this.http.get(`pricingCharges/current`)
  }

  getPricingCharges(){
    return this.http.get(`pricingCharges/history`)
  }
  savePricingCharges(data){
    return this.http.post(`pricingCharges`, data, httpOptions);

  }

  getPricingChargesByWeight( itemID: string, variationID: string, weight: number, for_seller: string ){
    return this.http.get(`api/fish/${itemID}/variation/${variationID}/charges/${weight}/${for_seller}`)
  }

  deletePricingCharges(id){
    return this.http.delete(`pricingCharges/${id}`, httpOptions);
  }
}
