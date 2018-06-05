import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
// const httpOptionsForm = {
//   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
// };
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
  getProdutsByCategory(category, page){
    return this.http.get(`${API}api/fish-type/${category}/${page}/10`);
  }
  searchProductByName(name){
    return this.http.get(API+'fish/?where={"name":{"contains":"'+name+'"}}')
  }

  getProductDetail(id){
    return this.http.get(`${API}fish/${id}`);

  }



  postFile(fileToUpload, id){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    console.log(id, fileToUpload);
    const formData: FormData = new FormData();
    for(var i = 0; i < fileToUpload.length; i++) {
      formData.append("images", fileToUpload[i]);
  }
  
    return this.http
      .post(`${API}api/fish/images/${id}`, formData, httpOptionsForm);
}

}
 