import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  document.write('<script async src="https://www.googletagmanager.com/gtag/js?id=UA-138510183-1"></script>');
  document.write('<script>window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'UA-138510183-1\');</script>');

  //<!-- Global site tag (gtag.js) - Google Analytics -->
  enableProdMode();
  if (window) {
    window.console.log = function () { };
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
