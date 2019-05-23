import { Injectable } from "@angular/core";
// import 'whatwg-fetch'
import { environment } from "../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Script } from "vm";

@Injectable()
export class CDNCheck {

    cdn = "./"

    constructor(private http: HttpClient) {
        // new Script("https://d66z88a3oqo8j.cloudfront.net/assets/cdn/select2.min.js", { timeout: 3000, displayErrors: true }).runInThisContext();
    }

    async load() {
        
        await this.awaitCDNResponse();

        //for check blocked cdn
        let myHeaders = new HttpHeaders();
        myHeaders.append("Content-Type", "text/plain");
        if ((window as any).cdnWorking)
            this.cdn = environment.cdnURL;
        try {
            await this.insertLinks();
        }
        catch (e) {
            console.error(e);
        }

        console.log("loaded scripts");
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
            // "assets/cdn/select2.min.js",
            "assets/cdn/Chart.min.js",
            "assets/cdn/bootstrap-slider.min.js",
            "assets/cdn/jquery-swapsies.js",
            "assets/cdn/jquery.flexslider-min.js",
            "assets/cdn/hammer.js"
        ];

        //Lets firt styles
        for (let st of styles) {
            let _st = document.createElement("link");
            _st.setAttribute("rel", "stylesheet");
            _st.href = this.cdn + st;
            document.head.appendChild(_st);
        }

        //lets second script
        for (let sc of scripts) {
            let _sc = document.createElement("script");
            _sc.setAttribute("type", "text/javascript");
            _sc.src = this.cdn + sc;
            document.body.appendChild(_sc);
        }

    }

    awaitCDNResponse() {

        let ready = function (re) {
            setTimeout(function () {
                if ((window as any).cdnWorking === true || (window as any).cdnWorking === false)
                    re();
                else
                    ready(re);
            }, 100);
        }

        return new Promise(function (resolve) {
            ready(resolve);
        });

    }
}