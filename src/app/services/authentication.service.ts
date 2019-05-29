import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' })
};

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient) { }
  login(user) {
    let body = { "email": user.email, "password": user.password };
    return this.http.put('api/login', JSON.stringify(body), httpOptions);
  }
  setLoginData(data) {
    data = JSON.stringify(data);
    localStorage.setItem('login', data);
    console.log("Login Data", data);
  }
  getLoginData() {
    let data = localStorage.getItem('login');
    return JSON.parse(data);
  }
  logOut() {
    localStorage.removeItem('login');
    localStorage.removeItem('cart');

  }
  isLogged() {
    let data = this.getLoginData();
    if (data !== null) {
      return true;
    }
    else {
      return false;
    }
  }
  register(data, role, dataExtra, newQueries?) {
    newQueries = newQueries || "";
    let body = { "firstName": data.firstName, "lastName": data.lastName, "email": data.email, "password": data.password, "role": role, "dataExtra": dataExtra };
    console.log(body);
    return this.http.post(`api/signup${newQueries}`, body, httpOptions);
  }

  setCart(data) {
    data = JSON.stringify(data);
    localStorage.setItem('cart', data);

  }

  getCart() {
    let data = localStorage.getItem('cart');
    return JSON.parse(data);
  }
  subscribe(email) {
    let data = {
      'email': email
    }
    console.log(data)
    return this.http.post(`subscriptor`, data, httpOptions)
  }
  getData(endpoint) {
    return this.http.get(endpoint)
  }
  deleteData(endpoint) {
    return this.http.delete(endpoint, httpOptions)
  }
  acceptUser(endpoint) {
    return this.http.put(endpoint, httpOptions)
  }
  deniedUser(endpoint, data) {
    return this.http.put(endpoint, data, httpOptions)
  }
  editUser(endpoint, role) {
    let data = {
      role: role
    }
    return this.http.put(endpoint, data, httpOptions)
  }
}
