import { Component, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
buyer:boolean = true;
  constructor() { }

  ngOnInit() {
  }

  switchToSell(){

  
    console.log(this.buyer);
    console.log("Switching");
    
    if(this.buyer == true){
      this.buyer = false;
      jQuery('.side-dark-gray:parent').each(function(){
        jQuery(this).addClass('sliding');
      })
      jQuery('.side-dark-gray:parent')
      .animate({right: "+=80%" }, 1000);
      jQuery('.gray-light-side:parent').animate({left: "+=20%"}, 1000)
      setTimeout(() => {
        jQuery('.side-dark-gray:parent').each(function () {
          jQuery(this).animate({right: '0px'}, "linear")
          jQuery('.gray-light-side:parent').animate({left: "0px"}, "linear");
          jQuery(this).removeClass('sliding');
          jQuery(this).insertBefore(jQuery(this).prev('.gray-light-side'));
          jQuery('#dark-side-title').html('WANTO TO BUY?');
          jQuery('#dark-side-p').html('Want to get the best seafood for the lowest price? Register below!');
          jQuery('#dark-side-btn').html("I'm a buyer");
      });
      }, 1001);
    }else{
      this.buyer = true;
      jQuery('.gray-light-side:parent').each(function () {
        jQuery(this).insertBefore(jQuery(this).prev('.side-dark-gray'));
        jQuery('#dark-side-title').html('WANTO TO sell?');
        jQuery('#dark-side-p').html("Well, what are you waiting for? That fish isn't going to sell itself...");
        jQuery('#dark-side-btn').html("I'm a seller");
    });
    }
 


  }



}
