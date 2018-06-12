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
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';

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
  fileToUpload: any = [];
  productID:any;
  show:boolean = true;
  user:any;
  images:any = [];
  primaryImg:string;
  showUpload:boolean=false;
  constructor(private product:ProductService, private route: ActivatedRoute, private router: Router, private toast:ToastrService, private auth: AuthenticationService){}
  ngOnInit() {
    //this.createFormControls();
    //this.createForm();
    this.user = this.auth.getLoginData();
    this.getTypes();
    this.productID= this.route.snapshot.params['id'];
   if(this.user['role'] < 2){
     this.getDetails();
   }

  }


  getDetails(){
    this.product.getProductDetail(this.productID).subscribe(data => {
      console.log("Product", data);
      this.name = data['name'];
      this.description = data['description'];
      this.price = data['price'].value;
      this.measurement = data['weight'].type;
      this.country = data['country'];
      this.show = true;
      this.types = data['type'].id;
      this.images = data['images'];
      this.primaryImg=data['imagePrimary']
  }, error=>{
    console.log("Error", error)
    this.show = false;
  });
  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      console.log(result);
      this.pTypes = result;
    })
   
  }

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
          },
          "images": this.images
      }
      console.log(data);
      this.product.updateData('fish/'+this.productID, data).subscribe(result =>{
        console.log("Done", result);
        console.log("Length", this.fileToUpload.length);
        if(this.fileToUpload.length > 0){
          this.uploadFileToActivity(this.productID);

        }else{
          this.toast.success("Product updated succesfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      });
    
  }

  deleteProduct(){
    this.product.deleteData('fish/'+this.productID).subscribe(result =>{
      console.log("Done", result);
      this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})
       this.router.navigate(['/home']);

    });
  }
  showUploadBtn(){
    this.showUpload=true;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log("Files", files);
}

uploadFileToActivity(productID) {
  this.product.postFile(this.fileToUpload, productID, 'secundary').subscribe(data => {
    // do something, if upload success
    console.log("Data", data);
    //this.myform.reset();
    this.toast.success("Product updated succesfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error => {
      console.log(error);
    });
}
updatePrimaryImg(img:FileList){
  if(img.length > 0){
    this.product.postFile(img, this.productID, 'primary').subscribe(data => {
    this.toast.success("Primary Image updated succesfully!",'Well Done',{positionClass:"toast-top-right"})
    this.getDetails();
    this.showUpload=false;
    }, error => {
      console.log(error);
    });
  }
}
deleteNode(i){
  this.images.splice(i, 1);
  console.log(this.images);
}

}
