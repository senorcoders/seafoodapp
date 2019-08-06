import { Component, OnInit } from '@angular/core';
import { IsLoginService } from '../core/login/is-login.service';
import { AuthenticationService } from '../services/authentication.service';
declare var jQuery;

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private isLoggedSr: IsLoginService, private auth: AuthenticationService) {  }

 ngOnInit() {
  this.getLoginStatus();

  this.isLoggedSr.role.subscribe((role: number) => {
    if (role === -1)
      this.isLoggedIn = false;
  });
  }

  ngAfterViewInit() {
    jQuery('.process-carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
     
    });
    jQuery('.content-carousel').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
     
    });
  }

  getLoginStatus() {
    let login = this.auth.getLoginData();
    console.log('login status', login);
    if (login != null) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

}
