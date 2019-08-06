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

        //Para cuando se usa el translate
        if (req.url.includes("/assets/i18n") === true || req.url.includes("https://") === true || req.url.includes("http://") === true) {
            return next.handle(req.clone({
                url: req.url
            }));
        }

        if (data) {
            let json = JSON.parse(data);
            let token = json['token'];


            event = req.clone({
                url: Interceptor.url + req.url,
                setHeaders: {
                    'token': `${token}`,
                    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
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