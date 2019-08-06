import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class CountriesService {

  constructor( private http: HttpClient ) { }

  getCountries(){
    return this.http.get(`countries?limit=300&sort=name%20ASC`)
  }
  getCountriesWithCities() {
    return this.http.get(`api/countries/withCities`)
  }
  getCountriesWithShipping() {
    return this.http.get( 'api/v2/countriesWithShipping' );
  }
  getCities( country_code:string ){
    return this.http.get(`countries?code=${country_code}`)
  }
  getAllCities(){
    return this.http.get(`countries/cities`)
  }
  saveDeliveryDate( data ) {
    return this.http.post(`countries/`, data );
  }
  getCitiesByCoutry( country_id ){
    return this.http.get(`countries/${country_id}`)
  }
  updateDeliveryDate( id, data ) {
    return this.http.put(`countries/${id}`, data)
  }

  updateMinETA( data ) {
    return this.http.put(`api/countries/cityeta`, data );
  }

  updateCity( data ) {
    return this.http.put(`api/countries/city`, data );
  }

  deleteCity( data ) {
    return this.http.put(`api/countries/city/delete`, data );
  }
}
