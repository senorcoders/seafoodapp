import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastrService } from '../toast.service';
import { ViewChild, ElementRef } from '@angular/core';

declare var jQuery: any;
import { environment } from '../../environments/environment';
@ViewChild('categoryImageInput')
@Component({
  selector: 'app-add-category',
  templateUrl: './fish.component.html',
  styleUrls: ['./fish.component.scss']
})
export class FishComponent implements OnInit {
  categoryForm: FormGroup;
  preview: string;
  categories: any;
  private base64image: String = '';
  fileToUpload: any;
  buttonLabel = 'Add Product Category';
  id: number;
  showImage: boolean = false;
  currentImage: string;
  categoryImageInput: ElementRef;

  orgCats: any = [];
  tmpParentID: any;
  constructor(private product: ProductService, private fb: FormBuilder, private toast: ToastrService) { }

  ngOnInit() {
    this.getCategories();
    this.getFishTypeTree();
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      parent: [''],
      sfsMargin: [''],
      exworks: [''],
      cpi: ['']
    });
    this.categoryForm.controls['parent'].setValue('none');
  }
  showError(e) {
    this.toast.error(e, 'Error', { positionClass: 'toast-top-right' });
  }
  showSuccess(s) {
    this.toast.success(s, 'Well Done', { positionClass: 'toast-top-right' });
  }
  getCategories() {
    this.product.getParentLevels().subscribe(
      result => {
        this.categories = result;
        //this.organizeCat();
      },
      error => {
        console.log(error);
      }
    );
  }

  getFishTypeTree() {
    this.product.getTreeCategory().subscribe(
      result => {
        //this.categories = result;
        this.orgCats = result;
      },
      error => {
        this.showError(error);
      }
    );
  }

  organizeCat() {
    /*this.categories.forEach(element => {
      if (element['parentsTypes'] === '') {
        this.orgCats.push(element);

      }
    });*/
  }


  addCategory() {
    if (this.buttonLabel === 'Edit Product Category') {
      this.editCategory(this.id);
    } else {
      this.saveNewCategory();
    }
  }

  clearArrays() {
    this.categories = [];
    this.orgCats = [];
  }

  saveNewCategory() {
    console.log(this.categoryForm.get('parent').value);
    let level = 0;
    if (this.categoryForm.get('parent').value !== 'none') {
      this.product.getData(`fishType/${this.categoryForm.get('parent').value}`).subscribe(
        result => {
          level = result['level'];
          console.log(level);
          this.categoryForm.value.level = level + 1;
          this.product.addCategory(this.categoryForm.value).subscribe(
            resultInsert => {
              this.getFishTypeTree();
              if (this.categoryForm.get('parent').value !== 'none') {
                this.addParentCategory(resultInsert);
              } else {
                this.uploadFileTocat(resultInsert);
              }

              this.categoryForm.reset();
              this.categoryImageInput.nativeElement.value = '';
            },
            error => {
              this.showError(error.error);
              console.log(error);
            }
          );

        },
        error => {
          this.showError(error.error);
        }
      );
    } else {
      this.categoryForm.value.level = 0;
      this.product.addCategory(this.categoryForm.value).subscribe(
        resultInsert => {
          this.getFishTypeTree();
          if (this.categoryForm.get('parent').value !== 'none') {
            this.addParentCategory(resultInsert);

          } else {
            this.uploadFileTocat(resultInsert);
          }

          this.categoryForm.reset();
          this.categoryImageInput.nativeElement.value = "";
        },
        error => {
          this.showError(error.error);
          console.log(error);
        }
      );
    }
  }

  addParentCategory(result) {
    console.log(result);
    this.product.saveData('parenttype', { 'parent': result['parent'], 'child': result['id'] }).subscribe(res => {
      console.log(res);
      this.uploadFileTocat(result);
    });
  }

  editParentCategory(result, id, addImage) {
    console.log(result);
    /*this.product.updateData('parenttype/' + this.tmpParentID, {'parent': result['parent'], 'child': result['id']}).subscribe(res => {
        console.log(res);
        this.updateImage(id, addImage);
    });*/
  }
  uploadFileTocat(result) {
    if (this.fileToUpload != null) {
      this.addImageToCategory(result);
    } else {
      this.showSuccess('Category Added');
      this.getFishTypeTree();
      this.clearArrays();
      this.getCategories();

    }
  }


  addImageToCategory(result) {
    this.product.AddCategoryImage(this.fileToUpload, result['id']).subscribe(
      result => {
        this.showSuccess('Category Added');
        this.getFishTypeTree();
        this.clearArrays();
        this.getCategories();
        this.removePreviusImg();
        this.fileToUpload = null;
        jQuery('#previewImg').css('display', 'none');
      },
      error => {
        this.showError(error.error);
      }
    );
  }
  edit(index, id) {
    this.id = id;
    this.categoryForm = this.fb.group({
      name: [this.orgCats[index].name, Validators.required],
      description: [this.orgCats[index].description, Validators.required],
      parent: ['none'],
      sfsMargin: [this.orgCats[index].sfsMargin],
      exworks: [this.orgCats[index].exworks],
      cpi:[this.orgCats[index].cpi]
    });
    this.buttonLabel = 'Edit Fish';
    if (this.orgCats[index].images != null) {
      this.currentImage = environment.apiURLImg + this.orgCats[index].images[0].src;
      this.showImage = true;
    }
  }

  editSub(id, child, parent, sub, cpi, exworks) {
    console.log(sub);
    this.tmpParentID = sub['id'];
    this.id = id;
    this.categoryForm = this.fb.group({
      name: [child.name, Validators.required],
      description: [child.description, Validators.required],
      parent: [parent],
      sfsMargin: [0],
      cpi: [cpi],
      exworks: [exworks]
    });
    this.buttonLabel = 'Edit Product Category';
    if (child.images != null) {
      this.currentImage = environment.apiURLImg + child.images[0].src;
      this.showImage = true;
    }
  }
  codeToEdit(id, addImage) {
    let level = 0;
    if (this.categoryForm.value.parent !== id) {
      this.product.getData(`fishType/${this.categoryForm.value.parent}`).subscribe(
        resultLevel => {
          level = resultLevel['level'];
          this.categoryForm.value.level = level + 1;
          this.product.editCategory(id, this.categoryForm.value).subscribe(
            result => {
              console.log(result);
              this.getFishTypeTree();
              this.buttonLabel = 'Add Product Category';
              if (this.categoryForm.get('parent').value !== 'none') {
                this.editParentCategory(result, id, addImage);
                this.categoryForm.reset();
              } else {
                this.updateImage(id, addImage);
              }

            },
            error => {
              this.showError('Something wrong happened');
              console.log(error);
            }
          )
        },
        error => {
          this.showError(error.error);
        }
      )
    } else { // trying to set the current category as parent category
      this.showError( 'Parent Category is not valid' );
    }



  }


  updateImage(id, addImage) {
    if (addImage) {
      this.product.AddCategoryImage(this.fileToUpload, id).subscribe(
        result => {
          this.showSuccess('Product Category Updated');
          this.clearArrays();
          this.getCategories();
          this.removePreviusImg();
          this.getFishTypeTree();
          this.fileToUpload = null;
          jQuery('#previewImg').css('display', 'none');
          this.categoryForm.reset();
          this.buttonLabel = 'Add Product Category';
          this.showImage = false;
          this.currentImage = '';
          this.categoryForm.reset();
        },
        error => {
          this.showError(error.error);
        }
      );
    } else {
      this.showSuccess('Product Category Updated');
      this.clearArrays();
      this.getCategories();
      this.getFishTypeTree();
      this.categoryForm.reset();
      this.buttonLabel = 'Product Category Fish';
      this.showImage = false;
      this.currentImage = '';
    }
  }
  editCategory(id) {
    // if user add new image delete the old one and add new one
    if (this.fileToUpload != null) {
      // if the product has a image
      if (this.currentImage != null) {
        this.product.deleteImageCategory(this.currentImage).subscribe(
          result => {
            this.codeToEdit(id, true);
          },
          error => {
            console.log(error);
          }
        );
      } else {
        this.codeToEdit(id, true);
      }
    } else {
      this.codeToEdit(id, false);
    }
  }

  deleteSubCategory(id, parent) {
    console.info( 'id', id );
    this.deleteCategory(id);
  }
  deleteCategory(id) {
    this.product.deleteCategory(id).subscribe(
      result => {
        this.clearArrays();
        this.getCategories();
        this.showSuccess('Product Category was deleted');
        this.removePreviusImg();
        this.getFishTypeTree();
        this.fileToUpload = null;
        this.showImage = false;
        this.currentImage = '';
        this.categoryForm.reset();
        this.buttonLabel = 'Add Product Category';
        jQuery('#previewImg').css('display', 'none');
      },
      error => {
        if( error['error'].hasOwnProperty('message') ) {
          this.showError(error['error'].message);
        } else {

          this.showError('Something wrong happened');
        }
        console.log(error);
      }
    );
  }
  uploadImage(event: FileList) {
    jQuery('#previewImg').css('display', 'block');
    this.fileToUpload = event;
    const preview = document.querySelector('#previewImg');
    const file = event.item(0);
    // to convert base64
    const reader = new FileReader();
    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      this.showError('unsupported file type ');
      return;
    }
    reader.onloadend = function () {
      preview.setAttribute('src', (reader.result as string));
    };
    if (file) {
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    this.base64image = btoa(binaryString);
  }
  removePreviusImg() {
    const img = document.querySelector('#previewImg');
    img.setAttribute('src', '');
  }
  getSFSParentMargin() {
    let parentType = this.categoryForm.controls['parent'].value;
    if (parentType !== 'none') {
      this.product.getData(`fishType/${parentType}`).subscribe(
        result => {
          this.categoryForm.controls['sfsMargin'].setValue(result['sfsMargin']);
          this.categoryForm.controls['cpi'].setValue(result['cpi']);
          this.categoryForm.controls['exwork'].setValue(result['exwork']);
        },
        error => {

        }
      )

    }
  }


}
