import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
const  API=environment.apiURL;
@Injectable()
export class OrderService {

  constructor( private http: HttpClient ) { }

  getCart( buyer:string ){
    return this.http.post(`${API}shoppingcart`, { buyer: buyer })
  }

  updateCart( id:string, data:any ){
    return this.http.put(`${API}shoppingcart/${id}`, data, httpOptions)
    
  }


  getSellerFulfillsOrders(){
    return this.http.get(`${API}itemshopping/status/5c13f453d827ce28632af048`)
  }

  markItemAsShipped( itemID:string ){
    return this.http.put( `${API}api/itemshopping/${itemID}/5c017b0e47fb07027943a406`, {} )
  }

  uploadShippingImages( id, image0, image1, image2, image3, image4, image5, image6, image7, image8, image9 ){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    //for(var i = 0; i < fileToUpload.length; i++) {
      console.log( 'post image' );
      formData.append('image0', image0  );
      formData.append('image1', image1  );
      formData.append('image2', image2  );
      formData.append('image3', image3  );
      formData.append('image4', image4  );
      formData.append('image5', image5  );
      formData.append('image6', image6  );
      formData.append('image7', image7  );
      formData.append('image8', image8  );      
      formData.append('image9', image9  );
    //}
    return this.http.post(`${API}shipping/${id}/upload`, formData, httpOptionsForm);
  }
}