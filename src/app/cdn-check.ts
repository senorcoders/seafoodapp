import { Injectable } from "@angular/core";
// import 'whatwg-fetch'
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class CDNCheck {

    cdn = "./"

    constructor(private http: HttpClient) {
    }

    async load() {

        await this.awaitCDNResponse();

        //for check blocked cdn
        let myHeaders = new HttpHeaders();
        myHeaders.append("Content-Type", "text/plain");
        if ((window as any).cdnWorking === true)
            this.cdn = environment.cdnURL;
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
            // "assets/cdn/jquery-3.2.1.min.js",
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
                await this.insertElement(true, this.cdn+ st);
            }
            catch (e) {
                console.error(3);
            }

        }

        //lets second script
        for (let sc of scripts) {
            try {
                await this.insertElement(false, this.cdn+ sc);
            }
            catch (e) {
                console.error(e);
            }
        }

    }

    awaitCDNResponse() {

        let ready = function (re) {
            setTimeout(function () {
                if ((window as any).cdnWorking === true || (window as any).cdnWorking === false) {
                    re();
                }
                else
                    ready(re);
            }, 100);
        }

        return new Promise(function (resolve) {
            ready(resolve);
        });

    }
}