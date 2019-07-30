import { Component, OnInit, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { IsLoginService } from '../core/login/is-login.service';
import { AuthenticationService } from '../services/authentication.service';
import { HttpBackend, HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { NgwWowService } from 'ngx-wow';
declare var jQuery;

@Component({
  selector: 'app-homev3',
  templateUrl: './homev3.component.html',
  styleUrls: ['./homev3.component.scss']
})
export class Homev3Component implements OnInit {
  isMobile = false;
  role: number;
  isLoggedIn: boolean = false;
  mediumPosts:any = [];
  processing:boolean = false;
  canSlide:boolean = false;
  private wowSubscription: Subscription;
  constructor(private isLoggedSr: IsLoginService,  private auth: AuthenticationService,
    private httpO: HttpClient,
     handler: HttpBackend, private router: Router, private wowService: NgwWowService) { 
      this.httpO = new HttpClient(handler);

      this.wowService.init(); 
      jQuery(document).ready(function () {
        
        
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
          console.log("Es movil");
          jQuery('video source').each(function (num, val) {
            jQuery(this).attr('src', '')
          });
        }
      });

   
      jQuery(document).ready(function($) {
        $('html').addClass('no-js');
        $('.carousel').carousel('pause')
        var animationDelay = 2500,
            barAnimationDelay = 3800,
            barWaiting = barAnimationDelay - 3000,
            lettersDelay = 50,
            typeLettersDelay = 150,
            selectionDuration = 500,
            typeAnimationDelay = selectionDuration + 800,
            revealDuration = 600,
            revealAnimationDelay = 1500;
        initHeadline();
    
        function initHeadline() {
            singleLetters($('.cd-headline.letters').find('b'));
            animateHeadline($('.cd-headline'));
        }
    
        function singleLetters($words) {
            $words.each(function() {
                var word = $(this),
                    letters = word.text().split(''),
                    selected = word.hasClass('is-visible');
                for (let i in letters) {
                    if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                    letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
                }
                var newLetters = letters.join('');
                word.html(newLetters).css('opacity', 1);
            });
        }
    
        function animateHeadline($headlines) {
            var duration = animationDelay;
            $headlines.each(function() {
                var headline = $(this);
                if (headline.hasClass('loading-bar')) {
                    duration = barAnimationDelay;
                    setTimeout(function() {
                        headline.find('.cd-words-wrapper').addClass('is-loading')
                    }, barWaiting);
                } else if (headline.hasClass('clip')) {
                    var spanWrapper = headline.find('.cd-words-wrapper'),
                        newWidth = spanWrapper.width() + 10
                    spanWrapper.css('width', newWidth);
                } else if (!headline.hasClass('type')) {
                  console.log("No soy type");
                    var words = headline.find('.cd-words-wrapper b:first-child'),
                        width = 0;
                    words.each(function() {
                        var wordWidth = $(this).width();
                        if (wordWidth > width) width = wordWidth;
                    });
                    headline.find('.cd-words-wrapper').css('width', width);
                };
                setTimeout(function() {
                    hideWord(headline.find('.is-visible').eq(0))
                }, duration);
            });
        }
    
        function dynamicWidth($headlines, word){
          $headlines.each(function() {
          var headline = $(this);
          var width = 0;
          var wordWidth = word.width();
          console.log("Word width", wordWidth);
          if (wordWidth > width) width = wordWidth;
          headline.find('.cd-words-wrapper').css('width', width);
      });
        }
        function hideWord($word) {
          $('.carousel').carousel('next');

            var nextWord = takeNext($word);
            if ($word.parents('.cd-headline').hasClass('type')) {
                var parentSpan = $word.parent('.cd-words-wrapper');
                parentSpan.addClass('selected').removeClass('waiting');
                setTimeout(function() {
                    parentSpan.removeClass('selected');
                    $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
                }, selectionDuration);
                setTimeout(function() {
                    showWord(nextWord, typeLettersDelay)
                }, typeAnimationDelay);
            } else if ($word.parents('.cd-headline').hasClass('letters')) {
                var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
                hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
                showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
            } else if ($word.parents('.cd-headline').hasClass('clip')) {
                $word.parents('.cd-words-wrapper').animate({
                    width: '2px'
                }, revealDuration, function() {
                    switchWord($word, nextWord);
                    showWord(nextWord);
                });
            } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
                $word.parents('.cd-words-wrapper').removeClass('is-loading');
                switchWord($word, nextWord);
                setTimeout(function() {
                    hideWord(nextWord)
                }, barAnimationDelay);
                setTimeout(function() {
                    $word.parents('.cd-words-wrapper').addClass('is-loading')
                }, barWaiting);
            } else {
                switchWord($word, nextWord);
                setTimeout(function() {
                    hideWord(nextWord)
                }, animationDelay);
            }
        }
    
        function showWord($word, $duration?) {
            if ($word.parents('.cd-headline').hasClass('type')) {
                showLetter($word.find('i').eq(0), $word, false, $duration);
                $word.addClass('is-visible').removeClass('is-hidden');
            } else if ($word.parents('.cd-headline').hasClass('clip')) {
                $word.parents('.cd-words-wrapper').animate({
                    'width': $word.width() + 10
                }, revealDuration, function() {
                    setTimeout(function() {
                        hideWord($word)
                    }, revealAnimationDelay);
                });
            }
        }
    
        function hideLetter($letter, $word, $bool, $duration) {
            $letter.removeClass('in').addClass('out');
            if (!$letter.is(':last-child')) {
                setTimeout(function() {
                    hideLetter($letter.next(), $word, $bool, $duration);
                }, $duration);
            } else if ($bool) {
                setTimeout(function() {
                    hideWord(takeNext($word))
                }, animationDelay);
            }
            if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
                var nextWord = takeNext($word);
                switchWord($word, nextWord);
            }
        }
    
        function showLetter($letter, $word, $bool, $duration) {
            $letter.addClass('in').removeClass('out');

            if (!$letter.is(':last-child')) {
                setTimeout(function() {
                    showLetter($letter.next(), $word, $bool, $duration);
                }, $duration);
            } else {
                if ($word.parents('.cd-headline').hasClass('type')) {
                    setTimeout(function() {
                        $word.parents('.cd-words-wrapper').addClass('waiting');
                    }, 200);
                }
                if (!$bool) {
                    setTimeout(function() {
                        hideWord($word)
                    }, animationDelay)
                }

                setTimeout(() => {
                  dynamicWidth($('.cd-headline'), $word);

                }, 40);


            }
        }
    
        function takeNext($word) {
            return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
        }
    
        function takePrev($word) {
            return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
        }
    
        function switchWord($oldWord, $newWord) {
            $oldWord.removeClass('is-visible').addClass('is-hidden');
            $newWord.removeClass('is-hidden').addClass('is-visible');
        }
     
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

goToPreview(){
  this.router.navigate(['/shop'],{ queryParams: { preview:true}})
}

}
