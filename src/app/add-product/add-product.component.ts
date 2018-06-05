import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {
    ReactiveFormsModule,
    FormsModule,
    FormGroup,
    FormControl,
    Validators,
    FormBuilder
} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {ProductService} from'../services/product.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

 langs: string[] = [
    'English',
    'French',
    'German',
  ];
  myform: FormGroup;
  name: FormControl;
  price: FormControl;
  measurement: FormControl;
  description: FormControl;
  types: FormControl;
  base:string="http://138.68.19.227:7000";
  pTypes:any = [];
  country: FormControl;
  fileToUpload: any = [];


  constructor(private product:ProductService, private toast:ToastrService){}
  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getTypes();
  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      console.log(result);
      this.pTypes = result;
    })
   
  }

  createFormControls() {
    this.name = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.measurement = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.types = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);

  }

  createForm() {
    this.myform = new FormGroup({
      name: this.name,
      price: this.price,
      measurement: this.measurement,
      description: this.description,
      types: this.types,
      country: this.country
    });
  }

  onSubmit() {
    if (this.myform.valid) {
      console.log("Form Submitted!");
      let data = {
        "type" : this.types.value,
         "quality": "good",
          "name": this.name.value,
          "description": this.description.value,
          "country": this.country.value,
          "price": {
              "type": "$",
              "value": this.price.value,
              "description":  this.price.value + " for pack"
          },
          "weight": {
              "type": this.measurement.value,
              "value": 5
          }
      }
      console.log(data);
      this.product.saveData('fish', data).subscribe(result =>{
        console.log("Done", result['id']);
        if(this.fileToUpload > 0){
          this.uploadFileToActivity(result['id']);
        }else{
          this.toast.success("Product added succesfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      });
    }else{
      this.toast.error("All fields are required", "Error",{positionClass:"toast-top-right"} );

    }
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log("Files", files);
}

uploadFileToActivity(productID) {
  this.product.postFile(this.fileToUpload, productID).subscribe(data => {
    // do something, if upload success
    console.log("Data", data);
    this.myform.reset();
    this.toast.success("Product added succesfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error => {
      console.log(error);
    });
}

}
