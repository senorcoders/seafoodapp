import { Component } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { environment } from '../environments/environment';
import { filter } from 'rxjs/operators';

declare var gtag;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  router: string;
  data: any;

  constructor(public _router: Router, private route: ActivatedRoute) {

    this.router = _router.url;
    console.log(_router);
    //if (environment.production) {
      this._router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          (<any>window).gtag('config', 'GA_TRACKING_ID', { 'page_path': event.urlAfterRedirects });
        }
      })
    //}
  }


  onActivate(e, outlet) {
    outlet.scrollTop = 0;
    window.scrollTo(0, 0);
  }


}
