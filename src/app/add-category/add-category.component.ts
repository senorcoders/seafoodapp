import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import{ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  private base64image:String="";
  constructor(private product: ProductService, private fb: FormBuilder, private toast:ToastrService) { }

  ngOnInit() {
    this.categoryForm=this.fb.group({
      name:['',Validators.required],
      description:['', Validators.required]
    })
  }
  showError(e){
    this.toast.error(e,'Error',{positionClass:"toast-top-right"})
  }
  showSuccess(s){
    this.toast.success(s,'Well Done',{positionClass:"toast-top-right"})
  }
    uploadImage(event:FileList) {
  let preview = document.querySelector('#previewPlayerImg');
  let file    = event.item(0);
  //to convert base64
  let reader  = new FileReader();
  //to show image
  let reader2  = new FileReader();
  // Client-side validation example
  if (file.type.split('/')[0] !=='image') {
    this.showError('unsupported file type ');
    return;
  }
  reader2.onloadend = function () {
    preview.setAttribute('src',reader2.result);
  }
  if (file) {
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(file);
    reader2.readAsDataURL(file);
  }
}
_handleReaderLoaded(readerEvt) {
  let binaryString = readerEvt.target.result;
  this.base64image=btoa(binaryString);
}
}
