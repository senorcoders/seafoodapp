import { Component, OnInit, AfterViewChecked, HostListener, OnDestroy } from '@angular/core';
import { IsLoginService } from '../core/login/is-login.service';
import { AuthenticationService } from '../services/authentication.service';
import { HttpBackend, HttpClient} from '@angular/common/http';
import { NgwWowService } from 'ngx-wow';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare var jQuery;
@Component({
  selector: 'app-homeve2',
  templateUrl: './homeve2.component.html',
  styleUrls: ['./homeve2.component.scss']
})
export class Homeve2Component implements OnInit, OnDestroy {

  isMobile = false;
  role: number;
  isLoggedIn: boolean = false;
  mediumPosts:any = [];
  processing:boolean = false;
  private wowSubscription: Subscription;

  constructor(private isLoggedSr: IsLoginService,  private auth: AuthenticationService,
     private httpO: HttpClient,
      handler: HttpBackend, private router: Router, private wowService: NgwWowService) { 
    this.httpO = new HttpClient(handler);
  //   this.router.events.pipe(
  //     filter(event => event instanceof NavigationEnd)
  // ).subscribe(() => {
  //   this.wowService.init(); 
  // });
    this.wowService.init(); 

  }

  @HostListener('window:scroll', ['$event'])
  drawLine($event) {

    const path = document.querySelector('#lineAB');
    let percentScroll;

    jQuery(path).each(function () {
      this.style.strokeDasharray = this.getTotalLength();
      this.style.strokeDashoffset = this.getTotalLength();
    });

    percentScroll = window.pageYOffset / ((document.body.offsetHeight - window.innerHeight) - window.innerHeight);

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
    this.getMediumPosts();
    
    this.isLoggedSr.role.subscribe((role: number) => {
      this.role = role
      if (this.role === -1)
        this.isLoggedIn = false;
    });

    this.wowSubscription = this.wowService.itemRevealed$.subscribe(
      (item:HTMLElement) => {
        console.log("item", item);
        // do whatever you want with revealed element
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

  ngAfterViewChecked() {
    var that = this;
    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    if(location.search == ""){
      jQuery(document).scroll(function(){
        
          if (jQuery(document).scrollTop()>300 ) {
            if(that.processing == false){
            jQuery('body').removeClass("home-header").addClass("white-menu");
            }
          }
          else{
            if(that.processing == false){
              jQuery('body').addClass("home-header").removeClass("white-menu");
            }
           
          }
    });
  }
  
  }


  public ngOnDestroy() {
    this.wowSubscription.unsubscribe();
    this.processing = true;
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
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        },
        {
          breakpoint: 768,
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

  }


  //GET POST FROM MEDIUM
  getMediumPosts(){
    this.httpO.get('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@seafoodsouq').subscribe(res=>{
        console.log("Medium Posts", res);
        this.mediumPosts = res['items'];
        var that = this;
        setTimeout(() => {
          that.loadAsyncJS();
        }, 1000);
        
    })
}

loadAsyncJS(){
  console.log("Loaded");
  jQuery('.blog-cards-carousel').slick({
    dots: false,
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 2,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
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
}

shareFacebook(url){
  var newUrl = 'https://www.facebook.com/sharer.php?u=' + url;
  window.open(newUrl, '_blank');
}

shareTwitter(url){
  var newUrl = 'https://twitter.com/intent/tweet?url=' + url;
  window.open(newUrl, '_blank');
}

shareInstagram(url){
  var newUrl = 'https://www.instagram.com/seafoodsouq/';
  window.open(newUrl, '_blank');
}

}
