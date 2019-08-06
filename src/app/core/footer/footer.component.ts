import { Component } from '@angular/core';
import { MenuItems } from '../menu/menu-items';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from '../../toast.service';
import { LanguageService } from '../language/language.service';
import { IsLoginService } from '../login/is-login.service';
import * as AOS from 'aos';
import { TranslateService } from '@ngx-translate/core';
declare var jQuery: any;
const defaultLanguage = "en";
const additionalLanguages = ["ar"];
const languages: string[] = [defaultLanguage].concat(additionalLanguages);
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  subscribeForm: FormGroup;
  language: any;
  MenuItems: any;
  isLogged: boolean = false;
  lang: any;
  role: any;
  isHomepage: boolean;
  constructor(private fb: FormBuilder, private menuItems: MenuItems, private router: Router,
    private toast: ToastrService, private auth: AuthenticationService, private languageService: LanguageService, private menu: MenuItems,
    private isLoggedSr: IsLoginService, private translate: TranslateService) {
    this.MenuItems = this.menu;
  }
 ngOnInit() {
    jQuery(document).ready(function () {
      AOS.init();
    })
    jQuery(window).on('load', function () {
      AOS.refresh();
    });
    this.router.events.subscribe(
      () => {
        if (this.router.url == "/") {
          this.isHomepage = true
        }
        else {
          this.isHomepage = false;
        }
      }
    )
    //language
    this.translate.setDefaultLang(defaultLanguage);
    this.translate.addLangs(additionalLanguages);
    // let initLang = this.translate.getBrowserLang();
    // this.lang=initLang;
    // if (languages.indexOf(initLang) === -1) {
    //   initLang = defaultLanguage;
    // }
    // this.translate.use(initLang);
    //this.languageService.setLanguage(initLang);
    this.lang = defaultLanguage;
    this.translate.use(defaultLanguage);
    this.languageService.setLanguage(defaultLanguage);
    //language
    this.languageService.language.subscribe((value: any) => {
      this.language = value;
    })
    this.subscribeForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
    this.isLoggedSr.isLogged.subscribe((val: boolean) => {
      this.isLogged = val;
    })
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role
    })
  }
  logOut() {
    this.isLoggedSr.setLogin(false, -1)
    this.auth.logOut();
    this.router.navigate(["/home"]);
  }
  subscribe() {
    this.auth.subscribe(this.subscribeForm.get('email').value).subscribe(
      result => {
        this.toast.success('Now you will receive all our news', 'Great !!!', { positionClass: "toast-top-right" })
      },
      error => {
        console.log(error)
        if (error.error.code == "E_UNIQUE") {
          this.toast.error('Your email already exists in our database', 'Error', { positionClass: "toast-top-right" })
        }
        else {
          this.toast.error('Something bad happened. Please try again', 'Error', { positionClass: "toast-top-right" })
        }
      }
    )
  }
  changeLanguage(e) {
    let value = e.srcElement.value;
    if (value != this.lang) {
      this.translate.use(value);
      this.lang = value
      this.languageService.setLanguage(value);
    }
  }
}
