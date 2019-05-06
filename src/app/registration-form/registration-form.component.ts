import { Component, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit {
buyer:boolean = true;
class:any = '';
showConfirmation=true;

  constructor() { }

  ngOnInit() {
  }

  switchToSell(){

  
    console.log(this.buyer);
    console.log("Switching");
      var obj = jQuery("#content_dark");
      var sec = jQuery("#content_light");

    if(this.buyer == true){
      this.buyer = false;  
        obj.addClass('sliding');
      	// do swapping
					obj.animate({
						opacity: "0,8"
					}, 100, function() {
						obj.animate({
							top: "0px",
							left: "-" + (sec.width() + 30) + "px"
						}, 500, function() {
							obj.animate({
								opacity: "1"
							}, 100);
						});
					});
					sec.animate({
						opacity: "0.8"
					}, 100, function() {
						sec.animate({
							top:"0px",
							left: (obj.width() + 30) +"px"
						}, 500, function() {
							sec.animate({
								opacity: "1"
							}, 100, function() { 
              console.log("listo");
              obj.removeClass('sliding');
              jQuery('#dark-side-title').html('I WANT TO BUY');
               jQuery('#dark-side-p').html('Register today to start browsing our online catalogue of global sellers');
              jQuery('#dark-side-btn').html("Buy now");
 							});
						});
					});
   
      
    }else{
      this.buyer = true;
      obj.addClass('sliding');
	// do swapping
          sec.animate({
            opacity: "0,8"
          }, 100, function() {
            sec.animate({
              top: "0px",
              left: "0px"
            }, 500, function() {
              sec.animate({
                opacity: "1"
              }, 100);
            });
          });
          obj.animate({
            opacity: "0.8"
          }, 100, function() {
            obj.animate({
              top:"0px",
              left: "0px"
            }, 500, function() {
              obj.animate({
                opacity: "1"
              }, 100, function() { 
              console.log("listo");
              obj.removeClass('sliding');
              jQuery('#dark-side-title').html('WANT TO sell?');
              jQuery('#dark-side-p').html("Well, what are you waiting for? That fish isn't going to sell itself...");
              jQuery('#dark-side-btn').html("I'm a seller");
            });
          });
        });
      
   
    }
 


  }



}
