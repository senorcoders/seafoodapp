import { Component, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-homeve2',
  templateUrl: './homeve2.component.html',
  styleUrls: ['./homeve2.component.scss']
})
export class Homeve2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    jQuery('body').addClass('home-header');
  }

  ngAfterViewInit() {
    jQuery('.customer-cards-carousel').slick({
      dots: true,
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
            slidesToScroll: 1
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    jQuery('.blog-cards-carousel').slick({
      dots: true,
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
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

}
