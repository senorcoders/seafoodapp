import { Component, OnInit } from '@angular/core';
declare var jQuery:any;
@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {

  constructor() {
    jQuery(document).ready(function(){
 
    jQuery('#filter').keyup(function(event) {
      console.log("Filtering");
      var unicode = event.charCode ? event.charCode : event.keyCode;
      if (unicode == 27) { $(this).val(""); }
      var searchKey = $(this).val().toLowerCase();
      jQuery('.btn-link').each(function() {
          var cellText = $(this).text().toLowerCase();
          var accordion = $('#accordionGeneral');
          accordion.find('.btn-link:not(.collapsed)');
          accordion.parents('.col-lg-6').hide();
          if (cellText.indexOf(searchKey) >= 0) {
              $(this).parents('.col-lg-6').show();
          } else {
              $(this).parents('.col-lg-6').hide();
          }
      });
  });
});
  
  }

  ngOnInit() {
    setTimeout(() => this.chargeJS(), 1000);

  }

  chargeJS() {
    console.log(jQuery('#slidinTab'))
    //Sliding underline effect
    var $el, leftPos, newWidth;
    var $mainNav: any = jQuery("#slidinTab");

    $mainNav.append("<li id='magic-line'></li>");

    jQuery('#magic-line').css('position', 'absolute');
    jQuery('#magic-line').css('background', '#094D82');
    jQuery('#magic-line').css('height', '2px');
    jQuery('#magic-line').css('width', '50%');
    jQuery('#magic-line').css('left', '0');
    jQuery('#magic-line').css('bottom', '-2px');
    jQuery('#magic-line').css('border-radius', '2px');
    /* Cache it */
    var $magicLine = jQuery("#magic-line");


    jQuery("#slidinTab li a").click(function () {
      $el = jQuery(this);
      leftPos = $el.position().left;
      newWidth = $el.width();

      $magicLine.stop().animate({
        left: leftPos,
        // width: newWidth
      });
    });
  }

}
