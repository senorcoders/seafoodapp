import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
@Injectable()
export class OrderService {

  constructor( private http: HttpClient ) { }

  getOrderStatus() {
    return this.http.get(`orderStatus`);
  }

  getPaymentStatus() {
    return this.http.get(`api/orderStatus/payments`);
  }

  getLogisticOrderStatus() {
    return this.http.get(`api/orderStatus/logistic`);
  }

  getLogisticOrderStatusPagination(page, limit) {
    return this.http.get(`api/v2/orderStatus/logistic?page=${page}&limit=${limit}`);
  }

  getAllOrders() {
    return this.http.get(`api/itemshopping/all`);
  }
  getOrdersByStatus( status: string ) {
    return this.http.get(`api/itemshopping/status/${status}`);
  }
  getOrdersByNumber( orderNumber: string ) {
    return this.http.get(`api/itemshopping/order-number/${orderNumber}`);
  }
  getOrdersByStatusAndNumber( status: string, orderNumber: string ) {
    return this.http.get(`api/itemshopping/status/${status}/order-number/${orderNumber}`);
  }

  //For get orders with pagination
  getAllOrdersPagination(page:number, limit:number) {
    return this.http.get(`api/v2/itemshopping/all?page=${page}&limit=${limit}`);
  }
  getOrdersByStatusPagination(page:number, limit:number, status:string) {
    return this.http.get(`api/v2/itemshopping/status/${status}?page=${page}&limit=${limit}`);
  }
  getOrdersByNumberPagination(page:number, limit:number, orderNumber:string) {
    return this.http.get(`api/v2/itemshopping/order-number/${orderNumber}?page=${page}&limit=${limit}`);
  }
  getOrdersByStatusAndNumberPagination(page:number, limit:number, status:string, orderNumber:string) {
    return this.http.get(`api/v2/itemshopping/status/${status}/order-number/${orderNumber}?page=${page}&limit=${limit}`);
  }
  
  // Get Buyer Orders
  getAllBuyerOrders( userID:string ) {
    return this.http.get(`api/itemshopping/${userID}/all`);
  }
  getCanceledDeliveredOrders( userID:string ){
    return this.http.get( `api/itemshopping/${userID}/canceled-delivered` );
  }
  getOrdersBuyerByStatus( userID:string, status: string ) {
    return this.http.get(`api/itemshopping/${userID}/status/${status}`);
  }
  getOrdersBuyerByNumber( userID:string, orderNumber: string ) {
    return this.http.get(`api/itemshopping/${userID}/order-number/${orderNumber}`);
  }
  getOrdersBuyerByStatusAndNumber( userID:string, status: string, orderNumber: string ) {
    return this.http.get(`api/itemshopping/${userID}/status/${status}/order-number/${orderNumber}`);
  }
  // End get buyer orders

   getCart( buyer: string ) {
    return this.http.post(`shoppingcart`, { buyer: buyer });

  }

 

  validateCart(buyer){
    return this.http.get(`shoppingcart/${buyer}/check`);
  }

  updateCart( id: string, data: any ) {
    return this.http.put(`shoppingcart/${id}`, data, httpOptions);
  }


  getSellerFulfillsOrders() {
    return this.http.get(`itemshopping/status/5c13f453d827ce28632af048`);
  }

  getPayedItems() {
    return this.http.get(`itemshopping/payed`);
  }

  getPayedItemsPagination(page, limit) {
    return this.http.get(`api/v2/itemshopping/payed?page=${page}&limit=${limit}`);
  }

  getCanceledItems() {
    return this.http.get(`itemshopping/cancel`);
  }
  getItemsPayedByOrderNumber(order){
    return this.http.get(`itemshopping/payed/${order}`);
  }

  markItemAsShipped( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b0e47fb07027943a406`, {} );
  }

  markItemAsDelivered( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b3c47fb07027943a409`, {} );
  }

  markItemAsOutForDelivery( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b2147fb07027943a408`, {} );
  }

  markItemAsArrived( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b1447fb07027943a407`, {} );
  }

  markItemAsRepayed( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b4f47fb07027943a40b`, {} );
  }

  markItemAsCancelByBuyer( itemID: string ){
    return this.http.put( `api/itemshopping/${itemID}/5c017b5a47fb07027943a40c`, {} );
  }

  markItemAsRefounded( itemID: string ) {
    return this.http.put( `api/itemshopping/${itemID}/5c017b7047fb07027943a40e`, {} );
  }

  updateStatus( statusID: string, itemID: string, user: any ) {
    return this.http.put( `api/itemshopping/${itemID}/${statusID}`, { userEmail: user['email'], userID: user['id'] } );
  }
  updateETA( id, eta ) {
    return this.http.put( `itemshopping/${id}`, {buyerExpectedDeliveryDate: eta} )
  }
  updateItemsETA( data: any ) {
    return this.http.put( `api/itemshopping/updateETA`, data );
  }

  uploadShippingImages( id, image0, image1, image2, image3, image4, image5, image6, image7, image8, image9 ) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    // for(var i = 0; i < fileToUpload.length; i++) {
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
    // }
    return this.http.post(`shipping/${id}/upload`, formData, httpOptionsForm);
  }

  syncOrdersWithXeroInvoiceService() {
    return this.http.get(`xero/connect`);
  }
}
