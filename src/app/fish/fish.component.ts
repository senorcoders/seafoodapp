import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import{ProductService} from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery:any;
import { environment } from '../../environments/environment';
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
  
  orgCats:any = [];
  tmpParentID:any;
  constructor(private product: ProductService, private fb: FormBuilder, private toast:ToastrService) { }

  ngOnInit() {
    this.getCategories();
    this.categoryForm=this.fb.group({
      name:['',Validators.required],
      description:['', Validators.required],
      parent: [''],
      sfsMargin: ['']
    })
    this.categoryForm.controls['parent'].setValue('none');
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
        this.categories=result;
        this.organizeCat();
      },
      error=>{
        console.log(error)
      }
    )
  }


  organizeCat(){
    this.categories.forEach(element => {
      if(element['parentsTypes'] == ""){
        this.orgCats.push(element);

      }
    });
  }


  addCategory(){
    if(this.buttonLabel=="Edit Fish"){
      this.editCategory(this.id);
    }
    else{
      this.saveNewCategory();
    }
  }

  clearArrays(){
    this.categories = [];
    this.orgCats = [];
  }

  saveNewCategory(){
    console.log(this.categoryForm.get('parent').value);
    this.product.addCategory(this.categoryForm.value).subscribe(
      result=>{
        if(this.categoryForm.get('parent').value != 'none'){
          this.addParentCategory(result);
        }else{
          this.uploadFileTocat(result);
        }
            
      this.categoryForm.reset();
      },
      error=>{
        this.showError(error.error)
        console.log(error)
      }
    )
  }

  addParentCategory(result){
    console.log(result);
    this.product.saveData('parenttype', {"parent": result['parent'], "child": result['id']}).subscribe(res => {
        console.log(res);
        this.uploadFileTocat(result);
    })
  }

  editParentCategory(result, id, addImage){
    console.log(result);
    this.product.patchData('parenttype/'+this.tmpParentID, {"parent": result['parent'], "child": result['id']}).subscribe(res => {
        console.log(res);
        this.updateImage(id, addImage);
    })
  }
  uploadFileTocat(result){
    if(this.fileToUpload!=null){
      this.addImageToCategory(result);
  }else{
    this.showSuccess('Category Added');
    this.clearArrays();
    this.getCategories();

  }
  }


  addImageToCategory(result){
    this.product.AddCategoryImage(this.fileToUpload, result['id']).subscribe(
      result=>{
        this.showSuccess('Category Added');
        this.clearArrays();
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
  edit(index,id){
    this.id=id;
    this.categoryForm= this.fb.group({
      name:[this.orgCats[index].name,Validators.required],
      description:[this.orgCats[index].description, Validators.required],
      parent: ["none"],
      sfsMargin: [this.orgCats[index].sfsMargin]
    })
    this.buttonLabel="Edit Fish";
    if(this.orgCats[index].images!=null){
      this.currentImage=environment.apiURLImg+this.orgCats[index].images[0].src;
      this.showImage=true;
    }
  }

  editSub(id, child, parent, sub, sfsMargin){
    console.log(sub);
    this.tmpParentID = sub['id'];
    this.id=id;
    this.categoryForm= this.fb.group({
      name:[child.name,Validators.required],
      description:[child.description, Validators.required],
      parent: [parent],
      sfsMargin: [sfsMargin]
    })
    this.buttonLabel="Edit Fish";
    if(child.images!=null){
      this.currentImage=environment.apiURLImg+child.images[0].src;
      this.showImage=true;
    }
  }
  codeToEdit(id, addImage){
    this.product.editCategory(id,this.categoryForm.value).subscribe(
      result=>{
        console.log(result);
        if(this.categoryForm.get('parent').value != 'none'){
          this.editParentCategory(result, id, addImage);
        }else{
          this.updateImage(id, addImage);
        }
       
      },
      error=>{
        this.showError('Something wrong happened')
        console.log(error)
      }
    )
  }


  updateImage(id, addImage){
    if (addImage) {
      this.product.AddCategoryImage(this.fileToUpload, id).subscribe(
        result=>{
          this.showSuccess('Fish Updated');
          this.clearArrays();
          this.getCategories();
          this.removePreviusImg();
          this.fileToUpload=null;
          jQuery('#previewImg').css('display','none');
          this.categoryForm.reset();
          this.buttonLabel="Add Fish";
          this.showImage=false;
          this.currentImage='';
        },
        error=>{
          this.showError(error.error)
        }
      )
    }else{
      this.showSuccess('Fish Updated');
      this.clearArrays();
      this.getCategories();
      this.categoryForm.reset();
      this.buttonLabel="Add Fish";
      this.showImage=false;
      this.currentImage='';
    }
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

  deleteSubCategory(id, parent){
    this.product.deleteData('parenttype/'+parent).subscribe(result => {
      console.log(result);
      this.deleteCategory(id);
    })
  }
  deleteCategory(id){
    this.product.deleteCategory(id).subscribe(
      result=>{
        this.clearArrays();
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
