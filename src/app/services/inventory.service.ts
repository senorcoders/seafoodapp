import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
@Injectable()
export class InventoryService {

  constructor( private http: HttpClient ) { }

  getSellers() {
    return this.http.get(`api/user/sellers`)
  }

  getSellersSkus( seller_id ) {
    return this.http.get(`api/variation/skus/${seller_id}`)
  }

  getVariationStock( variation ) {
    return this.http.get(`api/variation/${variation}/stock`)
  }

  saveInventory( inventory ) {
    return this.http.post( 'api/inventory', inventory )
  }
  
  deleteInventory( id ) {
    return this.http.delete( `fishStock/${id}` );
  }
}
