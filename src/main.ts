import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
const cdn = environment.cdnURL;
const appendsHead = `
<link rel="stylesheet" href="cdnLink/cdn/flexslider.css">
  <link href="cdnLink/cdn/select2.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="cdnLink/cdn/bootstrap-slider.min.css" />
  <link rel="stylesheet" href="cdnLink/cdn/bootstrap-float-label.min.css"/>
`.replace(/cdnLink/g, cdn);
const appendsBody = `
<script src="cdnLink/cdn/jquery-3.2.1.min.js"></script>
<link rel="stylesheet" type="text/css" href="cdnLink/cdn/slick.css"/>
<link rel="stylesheet" type="text/css" href="cdnLink/cdn/slick-theme.css"/>
<link rel="stylesheet" type="text/css" href="cdnLink/cdn/css/font-awesome.min.css" />
<link href="https://fonts.googleapis.com/css?family=Josefin+Sans:100, 100i,300,400" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?family=Open+Sans:200,300,300i,400,400i,600,900" rel="stylesheet">
<script src="cdnLink/cdn/slick.js"></script>
<script src="cdnLink/cdn/jquery.flexslider-min.js"></script>
<script src="cdnLink/cdn/select2.min.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDS90wl64q94qXJxQ-nM3Adt1K6P9-d9gE"></script>
<script src="cdnLink/cdn/Chart.min.js"></script>
<script src="cdnLink/cdn/bootstrap-slider.min.js"></script>
`.replace(/cdnLink/g, cdn);
//Ahora reemplazamos por los cdn url
document.head.innerHTML = document.head.innerHTML+ appendsHead;
document.body.innerHTML = document.body.innerHTML+ appendsHead;

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
