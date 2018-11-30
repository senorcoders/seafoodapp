import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import { environment } from '../../environments/environment';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'})
  };
const httpOptionsTypeResponse={
      headers: new HttpHeaders({ "Content-Type": "application/json;charset=UTF-8"}),
      responseType: "text" as 'text'
};
const  API=environment.apiURL;
@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(user){
    let body = {"email":user.email,"password":user.password};
	  return this.http.put(API+'api/login', JSON.stringify(body), httpOptions);
  }
  setLoginData(data){
    data=JSON.stringify(data);
    localStorage.setItem('login',data);
  }
  getLoginData(){
    let data=localStorage.getItem('login');
    return JSON.parse(data);
  }
  logOut(){
    localStorage.removeItem('login');
    localStorage.removeItem('cart');

  }
  isLogged(){
    let data=this.getLoginData();
    if(data!==null){
      return true;
    }
    else{
      return false;
    }
  }
  register(data,role, dataExtra){
    let body = {"firstName":data.firstName,"lastName":data.lastName,"email":data.email,"password":data.password,"role":role, "dataExtra":dataExtra};
    return this.http.post(`${API}api/signup`, JSON.stringify(body), httpOptions);
  }

  setCart(data){
    data = JSON.stringify(data);
    localStorage.setItem('cart',data);

  }

  getCart(){
    let data=localStorage.getItem('cart');
    return JSON.parse(data);
  }
  subscribe(email){
    let data={
      'email':email
    }
    console.log(data)
    return this.http.post(`${API}subscriptor`, data, httpOptions)
  }
  getData(endpoint){
    return this.http.get(API+endpoint)
  }
  deleteData(endpoint){
    return this.http.delete(API+endpoint, httpOptions)
  }
  acceptUser(endpoint){
    return this.http.put(API+endpoint, httpOptions)
  }
  deniedUser(endpoint, data){
    return this.http.put(API+endpoint, data, httpOptions)
  }
  editUser(endpoint,role){
    let data={
      role:role
    }
    return this.http.put(API+endpoint, data, httpOptions)
  }
}
