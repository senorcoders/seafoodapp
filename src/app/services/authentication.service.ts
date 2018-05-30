import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8'}),
    responseType: 'text'
  };
const  API="http://138.68.19.227:7000/api/";
@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(user){
    let body = {"email":user.email,"password":user.password};
	  return this.http.put(API+'login', JSON.stringify(body), httpOptions);
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
  register(data){
    let body={"firstName":data.firstName,"lastName":data.lastName,"location":data.location,"email":data.email,"password":data.password,"role":{"name":"standar"}};
    return this.http.post(`${API}signup`, JSON.stringify(body), httpOptions);
  }
}
