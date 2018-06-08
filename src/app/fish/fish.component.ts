import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import{ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;
@Component({
  selector: 'app-add-category',
  templateUrl: './fish.component.html',
  styleUrls: ['./fish.component.scss']
})
export class FishComponent implements OnInit {
  categoryForm: FormGroup;
  preview:string;
  categories:any;
  private base64image:String="";
  fileToUpload:any;
  buttonLabel="Add Fish";
  id:number;
  showImage:boolean=false;
  currentImage:string;
  constructor(private product: ProductService, private fb: FormBuilder, private toast:ToastrService) { }

  ngOnInit() {
    this.getCategories();
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
  getCategories(){
    this.product.getAllCategoriesProducts().subscribe(
      result=>{
        this.categories=result
      },
      error=>{
        console.log(error)
      }
    )
  }
  addCategory(){
    if(this.buttonLabel=="Edit Fish"){
      this.editCategory(this.id);
    }
    else{
      this.product.addCategory(this.categoryForm.value).subscribe(
        result=>{
          this.showSuccess('Category Added');
          if(this.fileToUpload!=null){
            this.product.AddCategoryImage(this.fileToUpload, result['id']).subscribe(
            result=>{
              this.showSuccess('Photo Fish Added');
              this.getCategories();
              this.removePreviusImg();
              this.fileToUpload=null;
              jQuery('#previewImg').css('display','none')
            },
            error=>{
              this.showError(error.error)
            }
          )
        }
        /*refresh the category array*/
        this.getCategories();
        this.categoryForm.reset();
        },
        error=>{
          this.showError(error.error)
          console.log(error)
        }
      )
    }
  }
  edit(index,id){
    this.id=id;
    this.categoryForm= this.fb.group({
      name:[this.categories[index].name,Validators.required],
      description:[this.categories[index].description, Validators.required]
    })
    this.buttonLabel="Edit Fish";
    if(this.categories[index].images!=null){
      this.currentImage='http://138.68.19.227:7000'+this.categories[index].images[0].src;
      this.showImage=true;
    }
  }
  codeToEdit(id, addImage){
    this.product.editCategory(id,this.categoryForm.value).subscribe(
      result=>{
        this.categoryForm.reset();
        this.buttonLabel="Add Fish";
        if (addImage) {
          this.product.AddCategoryImage(this.fileToUpload, id).subscribe(
            result=>{
              this.showSuccess('Photo Fish Updated');
              this.getCategories();
              this.removePreviusImg();
              this.fileToUpload=null;
              jQuery('#previewImg').css('display','none')
            },
            error=>{
              this.showError(error.error)
            }
          )
        }
        this.showSuccess('Fish Updated');
        this.getCategories();
        this.showImage=false;
        this.currentImage='';
      },
      error=>{
        this.showError('Something wrong happened')
        console.log(error)
      }
    )
  }
  editCategory(id){
    //if user add new image delete the old one and add new one
    if(this.fileToUpload !=null){
      //if the product has a image 
      if(this.currentImage!=null){
        this.product.deleteImageCategory(this.currentImage).subscribe(
          result=>{
            this.codeToEdit(id,true)
          },
          error=>{
            console.log(error)
          }
        )
      }
      else{
        this.codeToEdit(id,true)
      }
    }
    else{
      this.codeToEdit(id, false);
    }
  }
  deleteCategory(id){
    this.product.deleteCategory(id).subscribe(
      result=>{
        this.getCategories();
        this.showSuccess('Fish was deleted')
        this.removePreviusImg();
        this.fileToUpload=null;
        this.showImage=false;
        this.currentImage='';
        this.categoryForm.reset();
        this.buttonLabel="Add Fish";
        jQuery('#previewImg').css('display','none')
      },
      error=>{
        this.showError('Something wrong happened')
        console.log(error)
      }
    )
  }
  uploadImage(event:FileList) {
    jQuery('#previewImg').css('display','block')
    this.fileToUpload=event;
    let preview = document.querySelector('#previewImg');
    let file    = event.item(0);
    //to convert base64
    let reader  = new FileReader();
    // Client-side validation example
    if (file.type.split('/')[0] !=='image') {
      this.showError('unsupported file type ');
      return;
    }
    reader.onloadend = function () {
      preview.setAttribute('src',reader.result);
    }
    if (file) {
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
_handleReaderLoaded(readerEvt) {
  let binaryString = readerEvt.target.result;
  this.base64image=btoa(binaryString);
}
removePreviusImg(){
  let img=document.querySelector('#previewImg')
  img.setAttribute('src','');
}
}
