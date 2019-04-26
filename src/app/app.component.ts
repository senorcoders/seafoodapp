import { Component } from '@angular/core';
import { Router, NavigationEnd   } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  router: string;

  
  constructor(public _router: Router){
    this.router = _router.url;
    console.info('mode', environment.production);
    if (environment.production) {
      this._router.events.subscribe( event => {
        if (event instanceof NavigationEnd) {
          (<any>window).gtag('config', 'GA_TRACKING_ID', {'page_path': event.urlAfterRedirects});        
        }
      } )
    }
  }

  onActivate(e, outlet){
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);

  }
  
  
}
