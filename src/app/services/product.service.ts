import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
// const httpOptionsForm = {
//   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
// };
const  API=environment.apiURL;
@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }
  
  listProduct(data){
    return this.http.get(`${API}api/fish/${data.pageNumber}/${data.numberProduct}`)
  }
  getAllCategoriesProducts(){
    return this.http.get(`${API}FishType?limit=100`)
  }
  saveData(endpoint, data){
    return this.http.post(`${API}${endpoint}`, data, httpOptions);

  }

  updateData(endpoint, data){
    return this.http.put(`${API}${endpoint}`, data, httpOptions);

  }
  setShippedProduct(endpoint){
    return this.http.put(`${API}${endpoint}`, httpOptions);
  }
  getData(endpoint){
    return this.http.get(`${API}${endpoint}`)
  }

  deleteData(endpoint){
    return this.http.delete(`${API}${endpoint}`, httpOptions);

  }
  getProdutsByCategory(category, page){
    return this.http.get(`${API}api/fish-type/${category}/${page}/12`);
  }
  searchProductByName(name,page){
    let body={'search':name};
    return this.http.post(`${API}api/fish/search/${page}/12`, body, httpOptions)
  }

  getProductDetail(id){
    return this.http.get(`${API}fish/${id}`);
  }
  addCategory(data){
    return this.http.post(`${API}fishtype`, data, httpOptions);
  }
  editCategory(id,data){
    return this.http.put(`${API}fishtype/${id}`, data, httpOptions);
  }
  deleteCategory(id){
    return this.http.delete(`${API}fishtype/${id}`, httpOptions)
  }
  deleteImageCategory(link){
    return this.http.delete(link, httpOptions)
  }
  AddCategoryImage(file, id){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for(var i = 0; i < file.length; i++) {
      formData.append("images", file[i]);
    }
    return this.http.post(`${API}api/fishtype/images/${id}`, formData, httpOptionsForm);
  }
  postFile(fileToUpload, id, opt){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    console.log(id, fileToUpload);
    const formData: FormData = new FormData();
    if(opt != 'primary'){
      for(var i = 0; i < fileToUpload.length; i++) {
        formData.append("images", fileToUpload[i]);
      }
      return this.http.post(`${API}api/fish/images/${id}`, formData, httpOptionsForm);
    }
    else{
      for(var i = 0; i < fileToUpload.length; i++) {
        formData.append("image", fileToUpload[i]);
      }
      return this.http.post(`${API}api/fish/image/${id}`, formData, httpOptionsForm);
    }
  }

uploadFile(endpoint, field, fileToUpload){
  let httpOptionsForm:any = {headers: new HttpHeaders() };
  httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
  const formData: FormData = new FormData();
  for(var i = 0; i < fileToUpload.length; i++) {
    formData.append(field, fileToUpload[i]);
}
  return this.http
    .post(`${API}${endpoint}`, formData, httpOptionsForm);
}

  postStoreForm(data, fileToUpload){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    let description = data.description;
    let location = data.location;
    let owner = data.owner;
    let name = data.name;
    const formData: FormData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("owner", owner);
    for(var i = 0; i < fileToUpload.length; i++) {
      formData.append("logo", fileToUpload[i]);
    }
    return this.http
      .post(`${API}api/store`, formData, httpOptionsForm);
  }
  getStoreByProduct(id){
    return this.http.get(`${API}store/${id}`)
  }
  updatePassword(email, oldpassword, newpassword){
    let data={
      'email':email,
      'password':oldpassword,
      'newPassword':newpassword
    }
    return this.http.put(`${API}api/user/update-password`, data, httpOptions)
  }
  updatePrimaryImage(fileToUpload, link){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for(var i = 0; i < fileToUpload.length; i++) {
      formData.append("image", fileToUpload[i]);
    }
    return this.http.put(`${API}${link}`, formData, httpOptionsForm);
  }
  suggestions(name){
    return this.http.post(`${API}api/fish/suggestions`, name, httpOptions)
  }
  isFavorite(data){
    return this.http.post(`${API}api/favoritefish`,data,httpOptions)
  }
  sfsFiles(endpoint, field, fileToUpload){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for(var i = 0; i < fileToUpload.length; i++) {
      formData.append(field, fileToUpload[i][0]);
    }
    return this.http.post(`${API}${endpoint}`, formData, httpOptionsForm);
  }
  updateFile(endpoint, fileToUpload){
    let httpOptionsForm:any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for(var i = 0; i < fileToUpload.length; i++) {
      formData.append('sfs', fileToUpload[i]);
  }
    return this.http.put(`${API}${endpoint}`, formData, httpOptionsForm);
  }
  /************Filter Store*************/
  filterFish( category:string, subcategory:string, country:string ){
    let data={
      'category':category,
      'subcategory':subcategory,
      'country':country
    }
    return this.http.post(`${API}fish/filter`, data, httpOptions)
  }
  getCategories(){
    return this.http.get(`${API}fishTypes/parents`);
  }
  getSubCategories(parent_id:string){
    if( parent_id == '' ){
      return this.http.get(`${API}fishTypes/childs`);
    }else{
      return this.http.get(`${API}fishTypes/${parent_id}/childs`);
    }
  }
  getFishCountries(){
    return this.http.get(`${API}fish/country`);
  }
}