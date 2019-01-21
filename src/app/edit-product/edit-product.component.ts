import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl, Validators, FormBuilder} from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {ProductService} from'../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { CountriesService } from '../services/countries.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
declare var jQuery: any;
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
  base:string=environment.apiURLImg;
  pTypes: any = [];
  country: any;
  fileToUpload: any = [];
  productID:any;
  show:boolean = true;
  user:any;
  images:any = [];
  primaryImg:any;
  primaryImgLink:string;
  showUpload: boolean=false;
  showLoading:boolean = true;
  showEdit: boolean = true;
  raised: FormControl;
  minimumOrder: FormControl;
  maximumOrder: FormControl;
  preparation: FormControl;
  treatment: FormControl;
  cooming_soon: FormControl;
  seller_sku: FormControl;
  seafood_sku: FormControl;
  city: FormControl;
  processingCountry: any;
  allCities: any = [];
  cities: any = [];
  countries: any = [];
  status: any;
  selectedStatus: any;
  action:string;
  constructor(private product: ProductService, private route: ActivatedRoute, private router: Router, private toast: ToastrService, private auth: AuthenticationService, private sanitizer: DomSanitizer, private countryService: CountriesService ) {}
  ngOnInit() {
    // this.createFormControls();
    // this.createForm();
    this.getAllCities();
    this.getCountries();
    this.user = this.auth.getLoginData();
    this.getTypes();
    this.productID = this.route.snapshot.params['id'];
   if (this.user['role'] < 2) {
     this.getDetails();
   }

  }
  getDetails() {
    this.product.getProductDetail(this.productID).subscribe(data => {
      console.log( data );
      this.name = data['name'];
      this.description = data['description'];
      this.price = data['price'].value;
      this.measurement = data['weight'].type;
      this.country = data['country'];
      if ( data.hasOwnProperty('processingCountry') ) {
        this.processingCountry = data['processingCountry'];
      }
      this.city = data['city'];
      this.show = true;
      this.types = data['type'].id;
      this.preparation = data['preparation'];
      this.raised = data['raised'];
      this.minimumOrder = data['minimumOrder'];
      this.maximumOrder = data['maximumOrder'];
      this.treatment = data['treatment'];
      this.cooming_soon = data['cooming_soon'];
      this.seller_sku = data['seller_sku'];
      this.seafood_sku = data['seafood_sku'];
      this.status = data['status'];
      this.selectedStatus = this.status.id;
      data['images'].forEach((val, index) => {
        if (val.hasOwnProperty('src')) {
          console.log('Val', val);
          this.images.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${val.src})`));
          // this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${val.src})`);
          console.log(this.images);

        }
      });
      console.log(data['imagePrimary']);
      if (data['imagePrimary'] != null) {
        this.primaryImgLink = data['imagePrimary'];
        this.primaryImg = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.primaryImgLink})`);
      }

        this.showLoading = false;

  }, error => {
    console.log('Error', error);
    this.show = false;
  });
  }

  getTypes() {
    this.product.getAllCategoriesProducts().subscribe(result => {
      this.pTypes = result;
    });

  }

  onSubmit() {
      const data = {
        'type' : this.types,
         'quality': 'good',
          'name': this.name,
          'description': this.description,
          'country': this.country,
          'processingCountry': this.processingCountry,
          'city': this.city,
          'price': {
              'type': '$',
              'value': this.price,
              'description':  this.price + ' for pack'
          },
          'weight': {
              'type': this.measurement,
              'value': 5
          },
          'images': this.images,
          'raised': this.raised,
          'minimumOrder': this.minimumOrder,
          'maximumOrder': this.maximumOrder,
          'preparation': this.preparation,
          'treatment': this.treatment,
          'coomingSoon': this.cooming_soon,
          'seller_sku': this.seller_sku,
          'seafood_sku': this.seafood_sku,
          'status': this.selectedStatus
      };
      this.product.updateData('fish/' + this.productID, data).subscribe(result => {
        if (this.fileToUpload.length > 0) {
          this.uploadFileToActivity(this.productID);
          console.log(' Images');

        } else {
          console.log('No images');
          this.toast.success('Product updated succesfully!', 'Well Done', {positionClass: 'toast-top-right'});

        }

      });

  }

  deleteProduct() {
    this.product.deleteData('api/fish/' + this.productID).subscribe(result => {
      this.toast.success('Product deleted succesfully!', 'Well Done', {positionClass: 'toast-top-right'});
       this.router.navigate(['/home']);

    });
  }
  showUploadBtn() {
    this.showUpload = true;
    this.showEdit = false;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
}
addPrimaryImg(img: FileList) {
  this.product.postFile(img, this.productID, 'primary').subscribe(data => {
    // this.myform.reset();
    this.getDetails();
    this.toast.success('Primary Image was added succesfully!', 'Well Done', {positionClass: 'toast-top-right'});
    }, error => {
      console.log(error);
    });
}
uploadFileToActivity(productID) {
  this.product.postFile(this.fileToUpload, productID, 'secundary').subscribe(data => {
    // do something, if upload success
    // this.myform.reset();
    console.log('Data', data);
    this.getDetails();
    this.toast.success('Product updated succesfully!', 'Well Done', {positionClass: 'toast-top-right'});
    }, error => {
      console.log(error);
    });
}
updatePrimaryImg(img: FileList) {

  if (img.length > 0) {
    console.log('IMage', this.primaryImgLink);

    const link = this.primaryImgLink.substring(1);
    this.product.updatePrimaryImage(img, link).subscribe(
      result => {
        this.showLoading = true;
        this.toast.success('Primary Image updated succesfully!', 'Well Done', {positionClass: 'toast-top-right'});
        this.getDetails();
        this.showUpload = false;
        this.showEdit = true;
      }, error => {
        console.log(error);
      });
  }
}
deleteNode(i) {
  const link = this.images[i].src.substring(1);
  this.product.deleteData(link).subscribe(result => {
    this.toast.success('Image deleted succesfully!', 'Well Done', {positionClass: 'toast-top-right'});
    this.images.splice(i, 1);
  });
}

getCountries() {
  this.countryService.getCountries().subscribe(
    result => {
      this.countries = result;
    },
    error => {
      console.log(error);
    }
  );
}

getCities() {
  console.log( this.country );
  this.countryService.getCities( this.country ).subscribe(
    result => {
      this.cities = result[0].cities;
    },
    error => {

    }
  );
}

getAllCities() {
  this.countryService.getAllCities().subscribe(
    result => {
      this.allCities = result;
      this.cities = result;
    },
    error => {
      console.log( error );
    }
  );
}
showModal(action){
  this.action=action;
  jQuery('#confirm').modal('show');
}
confirm(val,action){
  if(val){
    if(action=='update'){
      this.onSubmit();
      jQuery('#confirm').modal('hide');
    }
    else if(action=='delete'){
      this.deleteProduct()
      jQuery('#confirm').modal('hide');
    }
  }
}
}
