import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private http: HttpClient) { }

  getCategoryInfo( category_id: string ){
    return this.http.get(`fishType/${category_id}/setup`);
  }

  get( endpoint:string ){
    return this.http.get(endpoint);
  }

  post( endpoint:string , body ){
    return this.http.post( endpoint, body );
  }

  delete( endpoint:string ){
    return this.http.delete( endpoint );
  }

  saveCategorySetup( id, body ){
    return this.http.post(`fishtype/${id}/setup`, body );
  }
}