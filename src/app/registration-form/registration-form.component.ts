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
  constructor() { }

  ngOnInit() {
  }

  switchToSell(){

  
    console.log(this.buyer);
    console.log("Switching");
    
    if(this.buyer == true){
      this.buyer = false;  
      jQuery("#content_dark").swap({  
        target: "content_light", // Mandatory. The ID of the element we want to swap with  
        opacity: "0.8", // Optional. If set will give the swapping elements a translucent effect while in motion  
        speed: 1200, // Optional. The time taken in milliseconds for the animation to occur  
        callback: function() { // Optional. Callback function once the swap is complete  
            console.log("Swap Complete");  
                jQuery('#dark-side-title').html('WANTO TO BUY?');
                jQuery('#dark-side-p').html('Want to get the best seafood for the lowest price? Register below!');
                jQuery('#dark-side-btn').html("I'm a buyer");
        }  
    });
      
    }else{
      this.buyer = true;
       jQuery("#content_dark").swap({  
         target: "content_light", // Mandatory. The ID of the element we want to swap with  
         opacity: "0.8", // Optional. If set will give the swapping elements a translucent effect while in motion  
         speed: 1200, // Optional. The time taken in milliseconds for the animation to occur  
         callback: function() { // Optional. Callback function once the swap is complete  
             console.log("Swap Complete");  
                    jQuery(this).insertBefore(jQuery(this).prev('.side-dark-gray'));
                   jQuery('#dark-side-title').html('WANTO TO sell?');
                  jQuery('#dark-side-p').html("Well, what are you waiting for? That fish isn't going to sell itself...");
                  jQuery('#dark-side-btn').html("I'm a seller");
         }  
     });
   
    }
 


  }



}
