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
import * as XLSX from 'ts-xlsx';

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
  maximumorder: FormControl;
  cooming_soon: FormControl;
  measurement: FormControl;
  description: FormControl;
  types: FormControl;
  base:string=environment.apiURLImg;
  pTypes:any = [];
  country: FormControl;
  raised: FormControl;
  preparation: FormControl;
  treatment: FormControl;
  seller_sku: FormControl;
  seafood_sku: FormControl;
  fileToUpload: any = [];
  info:any;
  store:any = [];
  storeEndpoint:any = 'api/store/user/';
  existStore:boolean = true;
  primaryImg:any;
  countries=environment.countries;
  arrayBuffer:any;
  file:File;
  products:any = [];
  productsToUpload:any = [];
  showError:boolean=false
  constructor(private product:ProductService, private toast:ToastrService, private auth: AuthenticationService){}
  ngOnInit() {
    this.createFormControls();
    this.createForm();
    this.getTypes();
    this.getMyData();
  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      console.log(result);
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
    this.maximumorder = new FormControl('', Validators.required);
    this.cooming_soon = new FormControl('', Validators.required);
    this.measurement = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    this.types = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);
    this.raised = new FormControl('', Validators.required);
    this.preparation = new FormControl('', Validators.required);
    this.treatment = new FormControl('', Validators.required);
    this.seller_sku = new FormControl('', Validators.required);
    this.seafood_sku = new FormControl('', Validators.required);
  }

  createForm() {
    this.myform = new FormGroup({
      name: this.name,
      price: this.price,
      minimunorder: this.minimunorder,
      maximumorder: this.maximumorder,
      cooming_soon: this.cooming_soon,
      measurement: this.measurement,
      description: this.description,
      types: this.types,
      country: this.country,
      raised: this.raised,
      preparation: this.preparation,
      treatment: this.treatment,
      seller_sku: this.seller_sku,
      seafood_sku: this.seafood_sku
    });
    this.myform.controls['measurement'].setValue('kg');
  }
  generateSKU() {
    let parentType = '';
    this.pTypes.forEach( row => {
      if( row.id  == this.types.value ){
        parentType = row.parentsTypes[0].parent.id;

      }
    } )

    this.product.generateSKU( this.store[0].id,  parentType, this.types.value, this.country.value ).subscribe(
      result=>{
        console.log( result );
        this.seafood_sku.setValue(result);
      },
      error => {
        console.log( error );
      }
    )
  }
  onSubmit() {
    this.showError=true;
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
          "maximumOrder" : this.maximumorder.value,
          "cooming_soon": this.cooming_soon.value,
          "raised": this.raised.value,
          "preparation": this.preparation.value,
          "treatment": this.treatment.value,
          "seller_sku": this.seller_sku.value,
          "seafood_sku": this.seafood_sku.value
          
      }
      this.product.saveData('fish', data).subscribe(result =>{
        if(this.fileToUpload.length > 0 || this.primaryImg.length > 0){
          this.showError=false
          this.uploadFileToActivity(result['id']);
        }else{
          this.toast.success("Product added succesfully!",'Well Done',{positionClass:"toast-top-right"})
          this.showError=false;
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

incomingfile(event) 
  {
  this.file= event.target.files[0]; 
  }

 Upload() {
      let fileReader = new FileReader();
        fileReader.onload = (e) => {
            this.arrayBuffer = fileReader.result;
            var data = new Uint8Array(this.arrayBuffer);
            var arr = new Array();
            for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
            var bstr = arr.join("");
            var workbook = XLSX.read(bstr, {type:"binary"});
            var first_sheet_name = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[first_sheet_name];
            console.log(XLSX.utils.sheet_to_json(worksheet,{raw:true}));
            this.products = XLSX.utils.sheet_to_json(worksheet,{raw:true});
            this.structureData();
        }
        fileReader.readAsArrayBuffer(this.file);
}

structureData(){
  this.products.forEach((item, index) => {
    console.log(item);
    var product = {
      "type" : this.findTypeKey(item.Type),
      "store" : this.store[0].id,
      "quality" : item.Quality,
      "name" : item.Name,
      "description" : item.Description,
      "country" : item.Country,
      "price" : {
          "type" : "$",
          "value" : item.Price,
          "description" : item.Price + " for pack"
      },
      "weight" : {
          "type" : item.WeightMeasurement,  
          "value" : item.WeightValue
      },
      "minimumOrder" : item.MinimunOrder,
      "maximumOrder" : item.MaximumOrder,
      "raised": item.Raised,
      "preparation": item.Preparation,
      "Treatment": item.Treatment,
      "cooming_soon": item.cooming_soon,
      "seller_sku": item.seller_sku,
      "seafood_sku": item.seafood_sku
    }
    this.productsToUpload.push(product);
    console.log(this.productsToUpload);
    console.log(index);
    if(index === (this.products.length - 1)){
      console.log("Ready to Upload");
      this.bulkUpload();
    }

  });
}
findTypeKey(value) {
  for (var i = 0; i < this.pTypes.length; i++) {
      if (this.pTypes[i]['name'] === value) {
          return this.pTypes[i].id;
      }
  }
  return null;
}

bulkUpload(){

  var sendData = {"products": this.productsToUpload};
  this.product.saveData('api/fishs', sendData).subscribe(result =>{
      console.log(result);
      this.toast.success("Products added succesfully!",'Well Done',{positionClass:"toast-top-right"})

  });
}
}


