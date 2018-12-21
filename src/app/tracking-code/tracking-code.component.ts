import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tracking-code',
  templateUrl: './tracking-code.component.html',
  styleUrls: ['./tracking-code.component.scss']
})
export class TrackingCodeComponent implements OnInit {
	itemId:any;
	trackingForm:FormGroup;
  fileToUpload:any=[];
  image0:any;
  image1:any;
  image2:any;
  image3:any;
  image4:any;
  image5:any;
  image6:any;
  image7:any;
  image8:any;
  image9:any;  
	isVisible:any=[false,false,false,false,false,false,false,false,false,false];
  	private base64image:String="";
  constructor(private fb:FormBuilder, private route: ActivatedRoute, private productS:ProductService, private toast:ToastrService, private orderService:OrderService) { 
	  this.route.params.subscribe(params => {
		      this.itemId=(this.route.snapshot.params['item']);
		}) 
	}

  ngOnInit() {
  	this.trackingForm=this.fb.group({
  		//code:[''],
  		file1:['', Validators.required],
  		file2:['', Validators.required],
  		file3:['', Validators.required],
  		file4:['', Validators.required],
  		file5:['', Validators.required],
  		file6:['', Validators.required],
  		file7:['', Validators.required],
  		file8:['', Validators.required],
  		file9:['', Validators.required],
  		file10:['', Validators.required]
  	})
  }
  saveTracking(){
    console.log(this.fileToUpload)
    this.orderService.uploadShippingImages( this.itemId, this.image0, this.image1, this.image2, this.image3, this.image4, this.image5, this.image6, this.image7, this.image8, this.image9 )
    .subscribe(
      result => {
        console.log( result );
        this.toast.success("Order marked as document fulfillment!",'Order Updated',{positionClass:"toast-top-right"});
      },
      error => {
        console.log( error );
      }
    )  
  }
  handleFileInput(files: FileList, e, $event, index) {
    
    /******************/
    var inputValue = $event.target;
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
        if (index == 0)
          this.image0 = myReader.result
        else if( index == 1 )
          this.image1 = myReader.result
        else if( index == 2 )
          this.image2 = myReader.result
        else if( index == 3 )
          this.image3 = myReader.result
        else if( index == 4 )
          this.image4 = myReader.result
        else if( index == 5 )
          this.image5 = myReader.result
        else if( index == 6 )
          this.image6 = myReader.result
        else if( index == 7 )
          this.image7 = myReader.result
        else if( index == 8 )
          this.image8 = myReader.result
        else if( index == 9 )
          this.image9 = myReader.result
          
      
    }
    myReader.readAsDataURL(file);
    /*****************/
      

    this.isVisible[e-1]=true;
    this.fileToUpload.push(files);
    this.trackingForm.controls['file'+e].disable();
    setTimeout(()=>{this.uploadImage(files,e)},200)
  }

    uploadImage(event:FileList, name) {
    let preview = document.querySelector('#preview'+name);
    let file    = event.item(0);
    //to show image
    let reader  = new FileReader();

    // Client-side validation example
    if (file.type.split('/')[0] !=='image') {
      console.log('unsupported file type ');
      return;
    }
    reader.onloadend = function () {
      preview.setAttribute('src',reader.result);
    }
    if (file) {
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(readerEvt) {
    let binaryString = readerEvt.target.result;
    this.base64image=btoa(binaryString);
  }

}
