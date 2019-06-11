import { Component, OnInit, AfterViewChecked, HostListener } from '@angular/core';
import { WOW } from 'wowjs/dist/wow.min';
import { IsLoginService } from '../core/login/is-login.service';
import { AuthenticationService } from '../services/authentication.service';
declare var jQuery;
@Component({
  selector: 'app-homeve2',
  templateUrl: './homeve2.component.html',
  styleUrls: ['./homeve2.component.scss']
})
export class Homeve2Component implements OnInit {

  isMobile = false;
  role: number;
  isLoggedIn: boolean = false;

  constructor(private isLoggedSr: IsLoginService,  private auth: AuthenticationService) { }

  @HostListener('window:scroll', ['$event'])
  drawLine($event) {

    const path = document.querySelector('#line-svg');
    let percentScroll;

    jQuery(path).each(function () {
      this.style.strokeDasharray = this.getTotalLength();
      this.style.strokeDashoffset = this.getTotalLength();
    });

    percentScroll = window.pageYOffset / (document.body.offsetHeight - window.innerHeight);

    jQuery(path).each(function () {
      this.style.strokeDashoffset = Math.floor(this.getTotalLength() * (1 - percentScroll));
    });
  }

  ngOnInit() {
    jQuery('body').addClass('home-header');

    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    console.log("Probando Home");

    this.getLoginStatus();
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role
      if (this.role === -1)
        this.isLoggedIn = false;
    })

    
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

  ngAfterViewChecked() {
    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }


  public ngOnDestroy() {
    jQuery('body').removeClass('home-header');
  }
  ngAfterViewInit() {
    jQuery('.customer-cards-carousel').slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    jQuery('.blog-cards-carousel').slick({
      dots: false,
      arrows: true,
      infinite: false,
      speed: 300,
      slidesToShow: 2,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    jQuery('.preview-carousel').slick({
      dots: true,
      arrows: false,
      infinite: false,
      speed: 300,
      slidesToShow: 1,
      slidesToScroll: 1,
    });

    jQuery('#material-tabs').each(function () {

      let $active, $content, $links = jQuery(this).find('a');

      $active = jQuery($links[0]);
      $active.addClass('active');

      $content = jQuery($active[0].hash);

      $links.not($active).each(function () {
        jQuery(this.hash).hide();
      });

      jQuery(this).on('click', 'a', function (e) {

        $active.removeClass('active');
        $content.hide();

        $active = jQuery(this);
        $content = jQuery(this.hash);

        $active.addClass('active');
        $content.show();

        e.preventDefault();
      });
    });

    new WOW().init();
  }

}
