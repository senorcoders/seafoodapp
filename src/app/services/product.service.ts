import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment.prod';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
};
// const httpOptionsForm = {
//   headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data'})
// };
const  API = environment.apiURL;
@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  // Function to Get List of all fish with pagination
  listProduct(data) {
    return this.http.get(`${API}api/fish/${data.pageNumber}/${data.numberProduct}`);
  }

  // Function to get the product categories with a limit parameter
  getAllCategoriesProducts() {
    return this.http.get(`${API}FishType?limit=100`);
  }

  // Function to get the Tree Categories
  getTreeCategory() {
    return this.http.get( `${API}fishTypes/Tree` );
  }

  // General function to post data to the API
  saveData(endpoint, data) {
    return this.http.post(`${API}${endpoint}`, data, httpOptions);

  }
  // General function to get data to the API
  getData(endpoint) {
    return this.http.get(`${API}${endpoint}`);
  }

  // General function to delete data to the API
  deleteData(endpoint) {
    return this.http.delete(`${API}${endpoint}`, httpOptions);

  }

  // General function to put data to the API
  updateData(endpoint, data) {
    return this.http.put(`${API}${endpoint}`, data, httpOptions);

  }


  //Function to upload Shipping documents 
  uploadPDF(fileToUpload, itemId) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');

    const formData: FormData = new FormData();
   
      formData.append('shippingDocs', fileToUpload);
    
    console.log(fileToUpload);
    return this.http
      .post(`${API}api/itemshopping/${itemId}/shipping-documents`, formData, httpOptionsForm);
  }

  // Funtion to get the pending products
  getPendingProducts() {
    return this.http.get( `${API}api/fish/pending` );
  }

  //Function to get the Seafood SKU required to upload a new product
  generateSKU( store: string, category: string, subcategory: string, country_code: string ) {
    const data = {
      store_code: store,
      category_code: category,
      subcategory_code: subcategory,
      country: country_code
    };
    return this.http.post(`${API}api/fish/fish/sku`, data, httpOptions);
  }

 
// General function to patch data
  patchData(endpoint, data) {
    return this.http.patch(`${API}${endpoint}`, data, httpOptions);
  }

  // Function to patch fish status
  patchStatus(id, status, message ) {
    return this.http.put( `${API}api/fish/${id}/status/${status}/`, message, httpOptions );
  }

  //Function to set shipped product
  setShippedProduct(endpoint) {
    return this.http.put(`${API}${endpoint}`, httpOptions);
  }
 
  // Function to get product by category
  getProdutsByCategory(category, page) {
    return this.http.get(`${API}api/fish-type/${category}/${page}/12`);
  }

  //Function to search product by name
  searchProductByName(name, page) {
    const body = {'search': name};
    return this.http.post(`${API}api/fish/search/${page}/12`, body, httpOptions);
  }

  //Function to get a product detail
  getProductDetail(id) {
    return this.http.get(`${API}fish/${id}`);
  }

  //Function to add a fish data
  addCategory(data) {
    return this.http.post(`${API}fishtype`, data, httpOptions);
  }

  //Function to get the parent levels of a fish
  getParentLevels() {
    return this.http.get(`${API}allFishTypeParents`);
  }

  //Function to edit a fish category
  editCategory(id, data) {
    return this.http.put(`${API}fishtype/${id}`, data, httpOptions);
  }

  //Function to de delete a fish category
  deleteCategory(id) {
    return this.http.delete(`${API}fishtype/${id}`, httpOptions);
  }

  //Function to delete a image category
  deleteImageCategory(link) {
    return this.http.delete(link, httpOptions);
  }

  //Function to add image category
  AddCategoryImage(file, id) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('images', file[i]);
    }
    return this.http.post(`${API}api/fishtype/images/${id}`, formData, httpOptionsForm);
  }

  //Function to post a file to the API
  postFile(fileToUpload, id, opt) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    console.log(id, fileToUpload);
    const formData: FormData = new FormData();
    if (opt !== 'primary') {
      for (let i = 0; i < fileToUpload.length; i++) {
        formData.append('images', fileToUpload[i]);
      }
      return this.http.post(`${API}api/fish/images/${id}`, formData, httpOptionsForm);
    } else {
      for (let i = 0; i < fileToUpload.length; i++) {
        formData.append('image', fileToUpload[i]);
      }
      return this.http.post(`${API}api/fish/image/${id}`, formData, httpOptionsForm);
    }
  }

//Function to upload a file to the database
uploadFile(endpoint, field, fileToUpload) {
  const httpOptionsForm: any = {headers: new HttpHeaders() };
  httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
  const formData: FormData = new FormData();
  for (let i = 0; i < fileToUpload.length; i++) {
    formData.append(field, fileToUpload[i]);
}
  return this.http
    .post(`${API}${endpoint}`, formData, httpOptionsForm);
}


//Function to post a store form to the API
  postStoreForm(data, fileToUpload) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const description = data.description;
    const location = data.location;
    const owner = data.owner;
    const name = data.name;
    const formData: FormData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('location', location);
    formData.append('owner', owner);
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append('logo', fileToUpload[i]);
    }
    return this.http
      .post(`${API}api/store`, formData, httpOptionsForm);
  }

  //Function to get store by product 
  getStoreByProduct(id) {
    return this.http.get(`${API}store/${id}`);
  }

  //Function to recovery password 
  updatePassword(email, oldpassword, newpassword) {
    const data = {
      'email': email,
      'password': oldpassword,
      'newPassword': newpassword
    };
    return this.http.put(`${API}api/user/update-password`, data, httpOptions);
  }

  //Function to update primary image
  updatePrimaryImage(fileToUpload, link) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append('image', fileToUpload[i]);
    }
    return this.http.put(`${API}${link}`, formData, httpOptionsForm);
  }

  //Function to get suggestions
  suggestions(name) {
    return this.http.post(`${API}api/fish/suggestions`, name, httpOptions);
  }

  //Function to add a fish to favorites
  isFavorite(data) {
    return this.http.post(`${API}api/favoritefish`, data, httpOptions);
  }

  //Function to add sfsFiles
  sfsFiles(endpoint, field, fileToUpload) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append(field, fileToUpload[i][0]);
    }
    return this.http.post(`${API}${endpoint}`, formData, httpOptionsForm);
  }

  //Function to update a file
  updateFile(endpoint, fileToUpload) {
    const httpOptionsForm: any = {headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append('sfs', fileToUpload[i]);
  }
    return this.http.put(`${API}${endpoint}`, formData, httpOptionsForm);
  }
  /************Filter Store*************/
  filterFish(
    category: string,
    subcategory: string,
    subspecies: string,
    descriptor: string,
    country: string,
    raised: string,
    preparation: string,
    treatment: string,
    minPrice: string,
    maxPrice: string,
    min: string,
    max: string,
    cooming_soon: string ) {
    const data = {
      'category': category,
      'subcategory': subcategory,
      'subspecies': subspecies,
      'descriptor': descriptor,
      'country': country,
      'raised': raised,
      'preparation': preparation,
      'treatment': treatment,
      'minPrice': minPrice,
      'maxPrice': maxPrice,
      'minimumOrder': min,
      'maximumOrder': max,
      'cooming_soon': cooming_soon
    };
    return this.http.post(`${API}fish/filter`, data, httpOptions);
  }

  //Function to get the categories
  getCategories() {
    return this.http.get(`${API}fishTypes/parents`);
  }

  //Function to get subcategories
  getSubCategories(parent_id: string) {
    if ( parent_id === '' ) {
      return this.http.get(`${API}fishTypes/childs`);
    } else {
      return this.http.get(`${API}fishTypes/${parent_id}/childs`);
    }
  }

  //Function to get fish countries
  getFishCountries() {
    return this.http.get(`${API}fish/country`);
  }
}
