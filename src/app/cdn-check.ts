import { Injectable } from "@angular/core";
// import 'whatwg-fetch'
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class CDNCheck {

    cdn = "./";

    constructor(private http: HttpClient, private cookie: CookieService) {
    }

    async load() {

        //for check country
        try {
            let exist = this.cookie.check("country");
            console.log(exist);
            if (exist === false) {
                let response = await this.http.get("api/v2/cdn-check").toPromise() as any;
                console.log(response);
                if (response.message === "ok" && response.data.country === 'AE')
                    this.cdn = "./";
                else
                    this.cdn = environment.cdnURL;

                //save in cookies country
                if (response.data.country)
                    this.cookie.set("country", response.data.country, 0.25);

            } else {
                let country = this.cookie.get("country");
                if (country === 'AE')
                    this.cdn = "./";
                else
                    this.cdn = environment.cdnURL;
            }


        }
        catch (e) {
            console.error(e);
        }
        //change current cdn
        environment.currentCDN = this.cdn;

        try {
            await this.insertLinks();
        }
        catch (e) {
            console.error(e);
        }

        console.log("loaded scripts");
    }

    async insertElement(style: boolean, link) {
        return new Promise(function (res, rej) {
            let script = null;
            if (style === true) {
                script = document.createElement('link') as any;
                script.href = link;
                script.rel = 'stylesheet';
            } else {
                script = document.createElement('script') as any;
                script.src = link;
                script.type = 'text/javascript';
            }
            script.onError = rej;
            script.async = true;
            script.onload = res;
            script.addEventListener('error', rej);
            script.addEventListener('load', res);
            if (style === true)
                document.head.appendChild(script);
            else
                document.body.appendChild(script);
        })
    }

    async insertLinks() {
        let styles = [
            "assets/cdn/flexslider.css",
            "assets/cdn/select2.min.css",
            "assets/cdn/bootstrap-slider.min.css",
            "assets/cdn/bootstrap-float-label.min.css",
            "assets/cdn/slick.css",
            "assets/cdn/slick-theme.css",
            "assets/cdn/css/font-awesome.min.css",
        ];
        let scripts = [
            "assets/cdn/jquery-3.2.1.min.js",
            "assets/cdn/bootstrap.bundle.min.js",
            "assets/cdn/bigSlide.min.js",
            "assets/cdn/select2.min.js",
            "assets/cdn/Chart.min.js",
            "assets/cdn/bootstrap-slider.min.js",
            "assets/cdn/jquery-swapsies.js",
            "assets/cdn/jquery.flexslider-min.js",
            "assets/cdn/hammer.js"
        ];

        //Lets firt styles
        for (let st of styles) {
            try {
                await this.insertElement(true, this.cdn + st);
            }
            catch (e) {
                console.error(e);
            }

        }

        //lets second script
        for (let sc of scripts) {
            try {
                await this.insertElement(false, this.cdn + sc);
            }
            catch (e) {
                console.error(e);
            }
        }

        let scriptText = `
        jQuery(document).ready(function () {

            jQuery(document).on('click', 'footer a', function () {
              jQuery("html, body").animate({ scrollTop: 0 }, 'slow');
            });
          });
        `;
        let script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = scriptText;
        document.body.appendChild(script);

    }


    // awaitCDNResponse() {

    //     let ready = function (re) {
    //         setTimeout(function () {
    //             if ((window as any).cdnWorking === true || (window as any).cdnWorking === false) {
    //                 re();
    //             }
    //             else
    //                 ready(re);
    //         }, 100);
    //     }

    //     return new Promise(function (resolve) {
    //         ready(resolve);
    //     });

    // }
}