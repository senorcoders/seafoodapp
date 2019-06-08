import { Component, OnInit, AfterViewChecked, HostListener } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-homeve2',
  templateUrl: './homeve2.component.html',
  styleUrls: ['./homeve2.component.scss']
})
export class Homeve2Component implements OnInit {

  isMobile = false;

  constructor() { }

  // @HostListener('mousewheel', ['$event'])
  // drawLine($event: MouseEvent) {

  //   const svg: any = document.querySelector('#connecting-line');
  //   const l = 188; // the total length of the paths
  //   const dasharray = l;
  //   let dashoffset = l;
  //   // set the stroke-dasharray and the stroke-dashoffset for the paths
  //   svg.style.strokeDasharray = dasharray.toString();
  //   svg.style.strokeDashoffset = dashoffset.toString();

  //   document.getElementById('home-container').addEventListener('wheel',

  //     (e) => {

  //       e.preventDefault();
  //       //e.deltaY is the vertical movement
  //       if (dashoffset > 0 && e.deltaY > 0 ||
  //         dashoffset < l && e.deltaY < 0) {
  //         //using e.deltaY would have been too fast. I'm using e.deltaY/10 to change the paths's stroke-dashoffset
  //         dashoffset -= e.deltaY / 10;
  //       }

  //       //limiting the value of dashoffset
  //       if (dashoffset < 0) { dashoffset = 0; }
  //       if (dashoffset > l) { dashoffset = l; }
  //       //reset the stroke-dasharray and the stroke-dashoffset for the paths
  //       svg.style.strokeDashoffset = dashoffset.toString();
  //     }, false);
  // }

  ngOnInit() {
    jQuery('body').addClass('home-header');

    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  ngAfterViewChecked() {
    if (window.innerWidth < 800) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
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

      var $active, $content, $links = jQuery(this).find('a');

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

}
