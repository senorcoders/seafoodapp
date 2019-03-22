import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable'
import { environment } from '../../environments/environment';

@Injectable()
export class Interceptor implements HttpInterceptor {

    public static url = environment.apiURL;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        let event: HttpRequest<any>;
        let data = localStorage.getItem('login');

        if (data) {
            let json = JSON.parse(data);
            let token = json['token'];
            console.log("Token Interceptor", token);


            event = req.clone({
                url: Interceptor.url + req.url,
                setHeaders: {
                    'token': `${token}`
                }
            });
        } else {
            event = req.clone({
                url: Interceptor.url + req.url
            });
        }

        return next.handle(event);
    }
}