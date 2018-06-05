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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

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
  fileToUpload: any;
  productID:any;
  show:boolean = false;


  constructor(private product:ProductService, private route: ActivatedRoute, private router: Router){}
  ngOnInit() {
    //this.createFormControls();
    //this.createForm();
    this.getTypes();
    this.productID= this.route.snapshot.params['id'];
    this.product.getProductDetail(this.productID).subscribe(data => {
      console.log("Product", data);
      this.name = data['name'];
      this.description = data['description'];
      this.price = data['price'].value;
      this.measurement = data['weight'].type;
      this.country = data['country'];
      this.show = true;
      this.types = data['type'].id;
  }, error=>{
    console.log("Error", error)
  });

  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      console.log(result);
      this.pTypes = result;
    })
   
  }

  // createFormControls() {
  //   this.name = new FormControl('', Validators.required);
  //   this.price = new FormControl('', Validators.required);
  //   this.measurement = new FormControl('', Validators.required);
  //   this.description = new FormControl('', Validators.required);
  //   this.types = new FormControl('', Validators.required);
  //   this.country = new FormControl('', Validators.required);

  // }

  // createForm() {
  //   this.myform = new FormGroup({
  //     name: this.name,
  //     price: this.price,
  //     measurement: this.measurement,
  //     description: this.description,
  //     types: this.types,
  //     country: this.country
  //   });
  // }

  onSubmit() {
      console.log("Form Submitted!");
      let data = {
        "type" : this.types,
         "quality": "good",
          "name": this.name,
          "description": this.description,
          "country": this.country,
          "price": {
              "type": "$",
              "value": this.price,
              "description":  this.price + " for pack"
          },
          "weight": {
              "type": this.measurement,
              "value": 5
          }
      }
      console.log(data);
      this.product.updateData('fish/'+this.productID, data).subscribe(result =>{
        console.log("Done", result);
        this.uploadFileToActivity(this.productID);

      });
    
  }

  deleteProduct(){
    this.product.deleteData('fish/'+this.productID).subscribe(result =>{
      console.log("Done", result);
      alert("Product deleted succesfully!");
      this.router.navigate(['/home']);

    });
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log("Files", files);
}

uploadFileToActivity(productID) {
  this.product.postFile(this.fileToUpload, productID).subscribe(data => {
    // do something, if upload success
    console.log("Data", data);
    //this.myform.reset();
    alert("Product updated succesfully!");
    }, error => {
      console.log(error);
    });
}

}
