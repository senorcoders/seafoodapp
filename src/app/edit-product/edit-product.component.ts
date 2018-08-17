import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {ProductService} from'../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

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
  base:string="https://apiseafood.senorcoders.com";
  pTypes:any = [];
  country: FormControl;
  fileToUpload: any = [];
  productID:any;
  show:boolean = true;
  user:any;
  images:any = [];
  primaryImg:any;
  primaryImgLink:string;
  showUpload:boolean=false;
  showLoading:boolean=true;
  showEdit:boolean=true;
  constructor(private product:ProductService, private route: ActivatedRoute, private router: Router, private toast:ToastrService, private auth: AuthenticationService,private sanitizer: DomSanitizer){}
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
      this.name = data['name'];
      this.description = data['description'];
      this.price = data['price'].value;
      this.measurement = data['weight'].type;
      this.country = data['country'];
      this.show = true;
      this.types = data['type'].id;
      data['images'].forEach((val, index)=>{
        this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${val.src})`);
      })
      this.primaryImgLink=data['imagePrimary'];
      this.primaryImg=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.primaryImgLink})`)
      if(this.primaryImg){
        this.showLoading=false;
      }
  }, error=>{
    console.log("Error", error)
    this.show = false;
  });
  }
  
  getTypes(){
    this.product.getAllCategoriesProducts().subscribe(result =>{
      this.pTypes = result;
    })
   
  }

  onSubmit() {
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
      this.product.updateData('fish/'+this.productID, data).subscribe(result =>{
        if(this.fileToUpload.length > 0){
          this.uploadFileToActivity(this.productID);

        }else{
          this.toast.success("Product updated succesfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      });
    
  }

  deleteProduct(){
    this.product.deleteData('api/fish/'+this.productID).subscribe(result =>{
      this.toast.success("Product deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})
       this.router.navigate(['/home']);

    });
  }
  showUploadBtn(){
    this.showUpload=true;
    this.showEdit=false
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
}
addPrimaryImg(img:FileList){
  this.product.postFile(img, this.productID, 'primary').subscribe(data => {
    //this.myform.reset();
    this.getDetails();
    this.toast.success("Primary Image was added succesfully!",'Well Done',{positionClass:"toast-top-right"})
    }, error => {
      console.log(error);
    });
}
uploadFileToActivity(productID) {
  this.product.postFile(this.fileToUpload, productID, 'secundary').subscribe(data => {
    // do something, if upload success
    //this.myform.reset();
    this.getDetails();
    this.toast.success("Product updated succesfully!",'Well Done',{positionClass:"toast-top-right"})
    }, error => {
      console.log(error);
    });
}
updatePrimaryImg(img:FileList){
  if(img.length > 0){
    let link = this.primaryImgLink.substring(1);
    this.product.updatePrimaryImage(img, link).subscribe(
      result=>{
        this.showLoading=true;
        this.toast.success("Primary Image updated succesfully!",'Well Done',{positionClass:"toast-top-right"})
        this.getDetails();
        this.showUpload=false;
        this.showEdit=true;
      }, error => {
        console.log(error);
      });
  }
}
deleteNode(i){
  let link = this.images[i].src.substring(1);
  this.product.deleteData(link).subscribe(result =>{
    this.toast.success("Image deleted succesfully!",'Well Done',{positionClass:"toast-top-right"})
    this.images.splice(i, 1);
  });
}

}
