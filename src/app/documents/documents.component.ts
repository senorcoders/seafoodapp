import { Component, OnInit } from '@angular/core';
import { IsLoginService } from '../core/login/is-login.service';
import { ProductService } from '../services/product.service';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
	role:any;
	documents:any=[]
	uploadForm:FormGroup;
  constructor(private product:ProductService, private auth:IsLoginService, private fb:FormBuilder, private toast:ToastrService) { }

  ngOnInit() {
  	this.auth.role.subscribe((role:number)=>{
      this.role=role
    })
    this.uploadForm=this.fb.group({
    	name:['', Validators.required]
    })
  }
  handleFileInput(files:FileList){
  	this.documents=files
  	console.log(files)
  }
  saveDocument(){
  	if(this.documents.length>0){

  	}
  	else{
  		this.showError('Need to select a file')
  	}
  }
  showSuccess(s){
	this.toast.success(s, 'Well Done', { positionClass: "toast-top-right" })
  }
  showError(e){
	this.toast.error(e, 'Error', { positionClass: "toast-top-right" })
  }
}
