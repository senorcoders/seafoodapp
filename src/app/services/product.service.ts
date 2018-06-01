import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
const  API="http://138.68.19.227:7000/";
@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }
  
  listProduct(data){
    return this.http.get(`${API}api/fish/${data.pageNumber}/${data.numberProduct}`)
  }
  getAllCategoriesProducts(){
    return this.http.get(`${API}FishType`)
  }
  saveData(endpoint, data){
    console.log(JSON.stringify(data));
        return this.http.post(`${API}${endpoint}`, data, httpOptions);

  }

}
 