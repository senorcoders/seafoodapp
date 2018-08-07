import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../services/product.service';
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
	isVisible:any=[false,false,false,false,false,false,false,false,false,false];
  	private base64image:String="";
  constructor(private fb:FormBuilder, private route: ActivatedRoute, private productS:ProductService, private toast:ToastrService) { 
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
  }
  handleFileInput(files: FileList, e) {
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
