import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
};

@Injectable()
export class ProductService {

  constructor(private http: HttpClient) { }

  // Function to Get List of all fish with pagination
  listProduct(data) {
    return this.http.get(`api/fish/${data.pageNumber}/${data.numberProduct}`);
  }

  // Function to get the product categories with a limit parameter
  getAllCategoriesProducts() {
    return this.http.get(`FishType?limit=100`);
  }

  // Function to get the Tree Categories
  getTreeCategory() {
    return this.http.get(`fishTypes/Tree`);
  }

  // General function to post data to the API
  saveData(endpoint, data) {
    return this.http.post(`${endpoint}`, data, httpOptions);

  }
  // General function to get data to the API
  getData(endpoint) {
    return this.http.get(`${endpoint}`);
  }

  // General function to delete data to the API
  deleteData(endpoint) {
    return this.http.delete(`${endpoint}`, httpOptions);

  }

  // General function to put data to the API
  updateData(endpoint, data) {
    return this.http.put(`${endpoint}`, data, httpOptions);

  }


  //Function to upload Shipping documents 
  uploadPDF(fileToUpload, itemId) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');

    const formData: FormData = new FormData();

    formData.append('shippingDocs', fileToUpload);

    console.log(fileToUpload);
    return this.http
      .post(`api/itemshopping/${itemId}/shipping-documents`, formData, httpOptionsForm);
  }

  // Funtion to get the pending products
  getPendingProducts() {
    return this.http.get(`api/fish/pending`);
  }

  //Function to get the Seafood SKU required to upload a new product
  generateSKU(store: string, category: string, subcategory: string, country_code: string) {
    const data = {
      store_code: store,
      category_code: category,
      subcategory_code: subcategory,
      country: country_code
    };
    return this.http.post(`api/fish/fish/sku`, data, httpOptions);
  }


  // General function to patch data
  patchData(endpoint, data) {
    return this.http.patch(`${endpoint}`, data, httpOptions);
  }

  // Function to patch fish status
  patchStatus(id, status, message) {
    return this.http.put(`api/fish/${id}/status/${status}/`, message, httpOptions);
  }

  //Function to set shipped product
  setShippedProduct(endpoint) {
    return this.http.put(`${endpoint}`, httpOptions);
  }

  // Function to get product by category
  getProdutsByCategory(category, page) {
    return this.http.get(`api/fish-type/${category}/${page}/12`);
  }

  //Function to search product by name
  searchProductByName(name, page) {
    const body = { 'search': name };
    return this.http.post(`api/fish/search/${page}/12`, body, httpOptions);
  }

  //Function to get a product detail
  getProductDetail(id) {
    return this.http.get(`fish/${id}`);
  }

  getProductDetailVariations(id) {
    return this.http.get(`api/fish/${id}/variations/`);
  }

  getProductDetailVariationsForEdit(id) {
    return this.http.get(`api/fish/${id}/variations/edit`);
  }

  //Function to add a fish data
  addCategory(data) {
    return this.http.post(`fishtype`, data, httpOptions);
  }

  //Function to get the parent levels of a fish
  getParentLevels() {
    return this.http.get(`allFishTypeParents`);
  }

  //Function to edit a fish category
  editCategory(id, data) {
    return this.http.put(`fishtype/${id}`, data, httpOptions);
  }

  //Function to de delete a fish category
  deleteCategory(id) {
    return this.http.delete(`api/fishType/${id}`, httpOptions);
  }

  //Function to delete a image category
  deleteImageCategory(link) {
    return this.http.delete(link, httpOptions);
  }

  //Function to add image category
  AddCategoryImage(file, id) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append('images', file[i]);
    }
    return this.http.post(`api/fishtype/images/${id}`, formData, httpOptionsForm);
  }

  //Function to post a file to the API
  postFile(fileToUpload, id, opt) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    console.log(id, fileToUpload);
    const formData: FormData = new FormData();
    if (opt !== 'primary') {
      for (let i = 0; i < fileToUpload.length; i++) {
        formData.append('images', fileToUpload[i]);
      }
      return this.http.post(`api/fish/images/${id}`, formData, httpOptionsForm);
    } else {
      for (let i = 0; i < fileToUpload.length; i++) {
        formData.append('image', fileToUpload[i]);
      }
      return this.http.post(`api/fish/image/${id}`, formData, httpOptionsForm);
    }
  }

  updateImages(images:File[], id) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    return this.http.put(`api/fish/images/${id}`, formData, httpOptionsForm);
  }

  //Function to upload a file to the database
  uploadFile(endpoint, field, fileToUpload) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append(field, fileToUpload[i]);
    }
    return this.http
      .post(`${endpoint}`, formData, httpOptionsForm);
  }


  //Function to post a store form to the API
  postStoreForm(data, fileToUpload) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
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
      .post(`api/store`, formData, httpOptionsForm);
  }

  //Function to get store by product 
  getStoreByProduct(id) {
    return this.http.get(`store/${id}`);
  }

  //Function to recovery password 
  updatePassword(email, oldpassword, newpassword) {
    const data = {
      'email': email,
      'password': oldpassword,
      'newPassword': newpassword
    };
    return this.http.put(`api/user/update-password`, data, httpOptions);
  }

  //Function to update primary image
  updatePrimaryImage(fileToUpload, link) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append('image', fileToUpload[i]);
    }
    return this.http.put(`${link}`, formData, httpOptionsForm);
  }

  //Function to get suggestions
  suggestions(name) {
    return this.http.post(`api/fish/suggestions`, name, httpOptions);
  }

  //Function to add a fish to favorites
  isFavorite(data) {
    return this.http.post(`api/favoritefish`, data, httpOptions);
  }

  //Function to add sfsFiles
  sfsFiles(endpoint, field, fileToUpload) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append(field, fileToUpload[i][0]);
    }
    return this.http.post(`${endpoint}`, formData, httpOptionsForm);
  }

  //Function to update a file
  updateFile(endpoint, fileToUpload) {
    const httpOptionsForm: any = { headers: new HttpHeaders() };
    httpOptionsForm.headers.append('Content-Type', 'multipart/form-data');
    const formData: FormData = new FormData();
    for (let i = 0; i < fileToUpload.length; i++) {
      formData.append('sfs', fileToUpload[i]);
    }
    return this.http.put(`${endpoint}`, formData, httpOptionsForm);
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
    cooming_soon: string) {
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
    return this.http.post(`fish/filter`, data, httpOptions);
  }

  //Function to get the categories
  getCategories() {
    return this.http.get(`fishTypes/parents`);
  }

  //Function to get subcategories
  getSubCategories(parent_id: string) {
    if (parent_id === '') {
      return this.http.get(`fishTypes/childs`);
    } else {
      return this.http.get(`fishTypes/${parent_id}/childs`);
    }
  }

  //Function to get fish countries
  getFishCountries() {
    return this.http.get(`fish/country`);
  }
}
