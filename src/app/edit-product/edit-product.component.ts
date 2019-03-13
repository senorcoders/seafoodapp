import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import {BrowserModule} from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { CountriesService } from '../services/countries.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { PricingChargesService } from '../services/pricing-charges.service';
import { NgProgress } from 'ngx-progressbar';
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
  brandname: FormControl;
  price: any;
  measurement: FormControl;
  description: FormControl;
  types: FormControl;
  base: string = environment.apiURLImg;
  pTypes: any = [];
  country: any;
  fileToUpload: any = [];
  productID: any;
  show: boolean = true;
  user: any;
  images: any = [];
  primaryImg: any;
  primaryImgLink: string;
  showUpload: boolean = false;
  showLoading: boolean = true;
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
  action: string;
  typeLevel0: any;
  typeLevel1;
  typeLevel2;
  typeLevel3;
  mainCategory: FormControl;
  descriptor: any;
  specie: FormControl;
  wholeFishWeight: FormControl;
  currentPrincingCharges:any;
  currentExchangeRate:any;
  wholeOptions = [
    '0-1 KG',
    '1-2 KG',
    '2-3 KG',
    '3-4 KG',
    '4-5 KG',
    '5-6 KG',
    '6-7 KG',
    '7-8 KG',
    '8+ KG'
  ];
  preparationOptions = [
    'Head On Gutted',
    'Head Off Gutted',
    'Filleted'
  ]
  showWholeOptions: boolean = false;
  hsCode: any;
  acceptableSpoilageRate: any;
  imageAPI:any = [];
  public loading = false;

  constructor(private product: ProductService, private route: ActivatedRoute, 
    private router: Router, private toast: ToastrService, 
    private auth: AuthenticationService, private sanitizer: DomSanitizer, 
    private countryService: CountriesService, private pricingChargesService: PricingChargesService,
    public ngProgress: NgProgress
    ) { }
  ngOnInit() {
    // this.createFormControls();
    // this.createForm();
    this.getCurrentPricingCharges();
    this.getCountries();
    this.user = this.auth.getLoginData();
    this.getTypes();
    this.productID = this.route.snapshot.params['id'];
    if (this.user['role'] < 2) {
      this.getDetails();
    }
    this.getAllCities();
  }


  getCurrentPricingCharges() {
    this.pricingChargesService.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        this.currentExchangeRate = result['exchangeRates'][0].price;
      }, error => {
        console.log(error);
      }
    )
  }

  getDetails() {
    this.product.getProductDetail(this.productID).subscribe(data => {
      console.log(data);
      this.name = data['name'];
      this.description = data['description'];
      this.brandname = data['brandname'];
      this.price = (data['price'].value / this.currentExchangeRate).toFixed(2);
      console.log("Precio", this.price);
      this.measurement = data['weight'].type;
      this.country = data['country'];
      if (data.hasOwnProperty('descriptor') && data['descriptor'] != null) {
        (data['descriptor'].hasOwnProperty('id')) ? this.descriptor = data['descriptor'].id : this.descriptor = '';
      }
      if (data.hasOwnProperty('processingCountry')) {
        this.processingCountry = data['processingCountry'];
      }
      this.city = data['city'];
      this.show = true;
      this.types = data['type'].id;
      this.specie = data['type'].parent;
      this.preparation = data['preparation'];
      this.raised = data['raised'];
      this.minimumOrder = data['minimumOrder'];
      this.maximumOrder = data['maximumOrder'];
      this.treatment = data['treatment'];
      this.cooming_soon = data['cooming_soon'];
      this.seller_sku = data['seller_sku'];
      this.seafood_sku = data['seafood_sku'];
      this.status = data['status'];
      this.wholeFishWeight = data['wholeFishWeight'];
       (data['status'] != null) ? this.selectedStatus = this.status.id : this.selectedStatus = null;
      this.hsCode = data['hsCode'];
      this.acceptableSpoilageRate = data['mortalityRate'];
      if (data['preparation'] != 'Filleted') {
        this.showWholeOptions = true;
      }
      if (data['images']) {
        this.imageAPI = data['images'];
        data['images'].forEach((val, index) => {
          if (val.hasOwnProperty('src')) {
            console.log('Val', val);

            this.images.push(this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${val.src})`));
            // this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${val.src})`);
            console.log(this.images);

          }
        });
      }
      console.log(data);
      if (data['imagePrimary'] != null && data['imagePrimary'] != '') {
        this.primaryImgLink = data['imagePrimary'];
        this.primaryImg = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.primaryImgLink})`);
      }

      this.showLoading = false;

    }, error => {
      console.log('Error', error);
      this.show = false;
    });
    this.getAllTypesByLevel();
  }

  getTypes() {
    this.product.getAllCategoriesProducts().subscribe(result => {
      this.pTypes = result;
    });

  }

  onSubmit() {
    this.loading = true;
    this.ngProgress.start();
    let whole;
    if (this.showWholeOptions) {
      whole = this.wholeFishWeight
    }
    else {
      whole = ''
    }
    let priceAED = (this.price * this.currentExchangeRate).toFixed(2);
    const data = {
      'type': this.types,
      'quality': 'good',
      'name': this.name,
      'brandname': this.brandname,
      'country': this.country,
      'processingCountry': this.processingCountry,
      'city': this.city,
      'price': {
        'type': '$',
        'value': priceAED,
        'description': this.price + ' for pack'
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
      'status': this.selectedStatus,
      'descriptor': this.descriptor,
      'wholeFishWeight': whole,
      'hsCode': this.hsCode,
      'mortalityRate': this.acceptableSpoilageRate
    };
    this.product.updateData('fish/' + this.productID, data).subscribe(result => {
      if (this.fileToUpload.length > 0) {
        this.uploadFileToActivity(this.productID);
        console.log(' Images');

      } else {
        console.log('No images');
        this.toast.success('Product updated succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
        this.loading = false;
        this.ngProgress.done();
      }

    });

  }

  deleteProduct() {
    this.product.deleteData('api/fish/' + this.productID).subscribe(result => {
      this.toast.success('Product deleted succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
      this.router.navigate(['/home']);

    });
  }
  showUploadBtn() {
    this.showUpload = true;
    this.showEdit = false;
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    this.imagesPreview(files);
  }
  addPrimaryImg(img: FileList) {
    this.product.postFile(img, this.productID, 'primary').subscribe(data => {
      // this.myform.reset();
      this.imageAPI = [];
      this.images = [];
      this.getDetails();
      this.toast.success('Primary Image was added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
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
      this.toast.success('Product updated succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
      this.loading = false;
      this.ngProgress.done();

    }, error => {
      console.log(error);
      this.loading = false;
      this.ngProgress.done();


    });
  }
  updatePrimaryImg(img: FileList) {

    if (img.length > 0) {
      console.log('IMage', this.primaryImgLink.substring(1));

      const link = this.primaryImgLink.substring(1);
      this.product.updatePrimaryImage(img, link).subscribe(
        result => {
          this.showLoading = true;
          this.toast.success('Primary Image updated succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
          this.getDetails();
          this.showUpload = false;
          this.showEdit = true;
        }, error => {
          console.log(error);
        });
    }
  }
  deleteNode(i) {
    console.log(this.images, i);
    const link = this.imageAPI[i].src.substring(1);
    this.product.deleteData(link).subscribe(result => {
      this.toast.success('Image deleted succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
      this.images.splice(i, 1);
      this.imageAPI.splice(i, 1);
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
    console.log(this.country);
    this.countryService.getCities(this.country).subscribe(
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
        console.log(error);
      }
    );
  }

  showModal(action) {
    this.action = action;
    jQuery('#confirm').modal('show');
  }
  confirm(val, action) {
    if (val) {
      if (action == 'update') {
        this.onSubmit();
        jQuery('#confirm').modal('hide');
      }
      else if (action == 'delete') {
        this.deleteProduct()
        jQuery('#confirm').modal('hide');
      }
    }
  }
  getAllTypesByLevel() {
    this.product.getData(`getTypeLevel`).subscribe(
      result => {
        this.typeLevel0 = result['level0'];
        this.typeLevel1 = result['level1'];
        this.typeLevel2 = result['level2'];
        this.typeLevel3 = result['level3'];
      },
      error => {

      }
    );
  }
  getOnChangeLevel(level: number, value) {
    let selectedType;
    switch (level) {
      case 0:
        selectedType = this.mainCategory;
        break;

      case 1:
        selectedType = this.specie;
        if (value == '5bda361c78b3140ef5d31fa4') {
          this.preparationOptions = [
            'Head On Gutted',
            'Head Off Gutted ',
            'Filleted - Trim A',
            'Filleted - Trim B',
            'Filleted - Trim C',
            'Filleted - Trim D',
            'Filleted - Trim D',
          ]
          this.showWholeOptions = true
        }
        else {
          this.preparationOptions = [
            'Filleted',
            'Head On Gutted',
            'Head Off Gutted '
          ]
        }
        break;

      case 3:
        selectedType = this.types;
        break;

      default:
        selectedType = this.types;
        break;
    }
    this.product.getData(`fishTypes/${selectedType}/all_levels`).subscribe(
      result => {
        result['childs'].map(item => {
          switch (item.level) {
            case 0:
              this.typeLevel0 = item.fishTypes;
              break;

            case 1:
              this.typeLevel1 = item.fishTypes;
              break;

            case 2:
              this.typeLevel2 = item.fishTypes;
              break;

            case 3:
              this.typeLevel3 = item.fishTypes;
              break;

            default:
              break;
          }
        });
      },
      error => {
        console.log(error);
      }
    )
  }
  showWhole(value) {
    if (value != 'Filleted') {
      this.showWholeOptions = true;
    }
    else {
      this.showWholeOptions = false;
    }
  }

  imagesPreview(files) {

    if (files) {
        var filesAmount = files.length;
  
        for (let i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
  
            reader.onload = (event: Event) => {
                jQuery(jQuery.parseHTML('<img style="width: 50%; padding: 10px;">')).attr('src', event.target['result']).appendTo('div.gallery');
            }
  
            reader.readAsDataURL(files[i]);
        }
    }
  
  };
}
