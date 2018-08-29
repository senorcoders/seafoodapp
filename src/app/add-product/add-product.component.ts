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
import { AuthenticationService } from '../services/authentication.service';
import { environment } from '../../environments/environment';

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
  minimunorder: FormControl;
  measurement: FormControl;
  description: FormControl;
  types: FormControl;
  base:string=environment.apiURLImg;
  pTypes:any = [];
  country: FormControl;
  raised: FormControl;
  preparation: FormControl;
  treatment: FormControl;
  fileToUpload: any = [];
  info:any;
  store:any = [];
  storeEndpoint:any = 'api/store/user/';
  existStore:boolean = true;
  primaryImg:any;
  countries=environment.countries;
  constructor(private product:ProductService, private toast:ToastrService, private auth: AuthenticationService){}
  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getTypes();
    this.getMyData();
  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      this.pTypes = result;
    })
   
  }

  getMyData(){
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getStore(){
    this.product.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results;
      if(this.store.length < 1){
        this.existStore = false;
      }
    })
  }

  createFormControls() {
    this.name = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.minimunorder = new FormControl('', Validators.required);
    this.measurement = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.types = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);
    this.raised = new FormControl('', Validators.required);
    this.preparation = new FormControl('', Validators.required);
    this.treatment = new FormControl('', Validators.required);

  }

  createForm() {
    this.myform = new FormGroup({
      name: this.name,
      price: this.price,
      minimunorder: this.minimunorder,
      measurement: this.measurement,
      description: this.description,
      types: this.types,
      country: this.country,
      raised: this.raised,
      preparation: this.preparation,
      treatment: this.treatment
    });
  }

  onSubmit() {
    if (this.myform.valid) {
      let data = {
        "type" : this.types.value,
        "store": this.store[0].id,
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
          },
          "minimumOrder" : this.minimunorder.value,
          "raised": this.raised.value,
          "preparation": this.preparation.value,
          "treatment": this.treatment.value
          
      }
      this.product.saveData('fish', data).subscribe(result =>{
        if(this.fileToUpload.length > 0 || this.primaryImg.length > 0){
          this.uploadFileToActivity(result['id']);
        }else{
          this.toast.success("Product added succesfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      });
    }else{
      this.toast.error("All fields are required", "Error",{positionClass:"toast-top-right"} );

    }
  }

  handleFileInput(files: FileList, opt) {
    if(opt != 'primary'){
      this.fileToUpload = files;
    }
    else{
      this.primaryImg=files;
    }
    console.log("Files", files);
}

uploadFileToActivity(productID) {
  if(this.primaryImg && this.primaryImg.length > 0){
  this.product.postFile(this.primaryImg, productID, 'primary').subscribe(
    data => {
      console.log(data)
    },error => {
      console.log(error);
    });
  }
  this.product.postFile(this.fileToUpload, productID, 'secundary').subscribe(data => {
    // do something, if upload success
    console.log("Data", data);
    this.myform.reset();
    this.toast.success("Product added succesfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error => {
      console.log(error);
    });
  
}

}
