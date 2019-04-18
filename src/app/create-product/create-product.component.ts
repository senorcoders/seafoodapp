import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProductService } from '../services/product.service';
import { CountriesService } from '../services/countries.service';
// import { ToastrService } from '../toast.service';
import { AuthenticationService } from '../services/authentication.service';
import { PricingChargesService } from '../services/pricing-charges.service';
import { environment } from '../../environments/environment';
import * as XLSX from 'ts-xlsx';
import { NgProgress } from 'ngx-progressbar';
import { Router } from '@angular/router';
import { ToastrService } from '../toast.service';
declare var jQuery: any;
@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

  langs: string[] = [
    'English',
    'French',
    'German',
  ];

  public info: any;
  showNoData: boolean = false;
  default = [2, 3, 4, 3, 5];
  defaultTrimming = [];
  pd = [];
  hideTrimModal: boolean = true;
  public loading = false;
  private storeEndpoint: any = 'api/store/user/';
  public store: any;
  public myform: FormGroup;
  public showError = false;
  public currentExchangeRate = 0;
  public currentPrincingCharges: any;
  private trimmings = [];
  private seafood_sku = "";

  constructor(
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private countryService: CountriesService,
    private pricingChargesService: PricingChargesService,
    private fb: FormBuilder,
    public ngProgress: NgProgress,
    private router: Router
  ) { }
  ngOnInit() {
    this.myform = new FormGroup({
    });
    this.getCurrentPricingCharges();
    this.getMyData();
    this.productService.getData('fishpreparation').subscribe(
      res => {
        const data: any = res;
        this.trimmings = data;
      },
      e => {
        console.log(e);
      }
    );
  }

  getMyData() {
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getStore() {
    this.productService.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results;
    });
  }


  async generateSKU() {
    const parentType = this.myform.value.product.parentSelectedType;

    await new Promise((resolve, reject) => {
      this.productService.generateSKU(this.store[0].id, parentType, parentType, this.myform.value.product.processingCountry).subscribe(
        result => {
          this.seafood_sku = result as any;
          resolve();
        },
        error => {
          console.log(error);
          reject();
        }
      );
    });
  }

  async onSubmit() {
    this.showError = true;
    this.loading = true;
    let keys = Object.keys(this.myform.controls)
    for (let name of keys) {
      let keys_ = Object.keys((this.myform.controls[name] as any).controls);
      for (let na of keys_) {
        if ((this.myform.controls[name] as any).controls[na].valid === false) {
          console.log(name + "." + na, (this.myform.controls[name] as any).controls[na]);
        }
      }
    }

    if (this.myform.valid) {
      console.log(this.myform.value);
      let value = this.myform.value,
        product = value.product,
        features = value.features,
        pricing = value.price;
      let variations: any = {}, variationsTrim: any = {}, variationsEnd = [];
      if (pricing.weights !== '') {
        variations = JSON.parse(pricing.weights);
      }
      if (pricing.weightsTrim !== '') {
        variationsTrim = JSON.parse(pricing.weightsTrim);
      }

      //Para quitar las options
      let itereOptions = it => {
        delete it.options;
        return it;
      };
      //Para ver si es varations Trimming
      if (features.wholeFishAction === false && product.speciesSelected === '5bda361c78b3140ef5d31fa4') {
        console.log(Object.keys(variationsTrim));
        for (let key of Object.keys(variationsTrim)) {
          let fishPreparation = key;
          let itr = {
            fishPreparation,
            prices: variationsTrim[key].map(itereOptions)
          }
          variationsEnd.push(itr);
        }
      } else {
        //Para los ON
        let fishPreparation = this.trimmings[0].id;
        if (variations.on.keys && variations.on.keys.length > 0) {
          for (let it of variations.on.keys) {
            let wholeFishWeight = it;
            let itr = {
              fishPreparation,
              wholeFishWeight,
              prices: variations.on[it].map(itereOptions)
            }
            variationsEnd.push(itr);
          }
        }
        //Para off
        fishPreparation = this.trimmings[1].id;
        if (variations.off.keys && variations.off.keys.length > 0) {
          for (let it of variations.off.keys) {
            let wholeFishWeight = it;
            let itr = {
              fishPreparation,
              wholeFishWeight,
              prices: variations.off[it].map(itereOptions)
            }
            variationsEnd.push(itr);
          }
        }
      }
      let varationsOne = [{
        fishPreparation: features.preparation, prices: [
          { min: product.minimunorder, max: product.maximumorder, price: value.features.price }
        ]
      }];

      //Para quitar el _off y _arr
      for(let i=0; i<variationsEnd.length; i++){
        variationsEnd[i].fishPreparation = variationsEnd[i].fishPreparation.replace("_off", "");
        variationsEnd[i].fishPreparation = variationsEnd[i].fishPreparation.replace("_arr", "");

        variationsEnd[i].wholeFishWeight = variationsEnd[i].wholeFishWeight.replace("_off", "");
        variationsEnd[i].wholeFishWeight = variationsEnd[i].wholeFishWeight.replace("_arr", "");
      } 

      await this.generateSKU();
      // this.ngProgress.start();
      console.log(value.features.price, this.currentExchangeRate);
      let priceAED = (value.features.price * this.currentExchangeRate).toFixed(2);
      const data = {
        'type': product.subSpeciesSelected,
        'descriptor': product.descriptorSelected === '' ? null : product.descriptorSelected,
        'store': this.store[0].id,
        'quality': 'good',
        'name': product.name,
        'description': '',
        'country': product.country,
        'processingCountry': product.processingCountry,
        'city': product.city,
        'price': {
          'type': '$',
          'value': priceAED,
          'description': priceAED + ' for pack'
        },
        'weight': {
          'type': "kg",
          'value': 5
        },
        'minimumOrder': product.minimunorder,
        'maximumOrder': product.maximumorder,
        'raised': features.raised,
        // 'preparation': features.preparation,
        'treatment': features.treatment,
        'seller_sku': product.seller_sku,
        'seafood_sku': this.seafood_sku,
        'mortalityRate': 1,
        'waterLostRate': '0',
        'status': '5c0866e4a0eda00b94acbdc0',
        'brandname': product.brandName,
        'hsCode': product.hsCode,
        variations: variationsEnd.length > 0 ? variationsEnd : varationsOne
      };
      console.log(data);

      this.productService.saveData('api/variations/add', data).subscribe(result => {
        if (product.images !== undefined && product.images !== '') {
          this.showError = false;
          this.uploadFileToActivity(result['id'], product.imagesSend);
        } else {
          this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
          this.showError = false;
          this.loading = false;
          this.ngProgress.done();
          this.myform.reset();
          this.router.navigate(['/my-products']);
        }

      });
      this.loading = false;
      this.ngProgress.done();
    } else {
      this.toast.error('All fields are required', 'Error', { positionClass: 'toast-top-right' });
      this.loading = false;
      this.ngProgress.done();
    }
  }


  private async uploadFileToActivity(productID, images) {
    images = JSON.parse(images);
    let i = 0;
    for (let image of images) {
      try {
        let file = this.blobToFile(this.b64toBlob(image, "image/jpg"), new Date().getTime().toString() + "-" + productID);
        let files = [file];
        if (i === 0) {
          await this.productService.postFile(files, productID, 'primary').toPromise();
          i += 1;
          continue;
        }
        await this.saveImages(productID, 'secundary', files);
      }
      catch (e) {
        console.error(e);
      }
    }

    this.myform.reset();
    this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
    this.loading = false;
    this.ngProgress.done();
    this.router.navigate(['/my-products']);

  }

  saveImages(productID, status, files) {
    return this.productService.postFile(files, productID, status).toPromise();
  }

  public getCurrentPricingCharges() {
    this.pricingChargesService.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        this.currentExchangeRate = result['exchangeRates'];
        console.log(this.currentExchangeRate);
      }, error => {
        console.log(error);
      }
    )
  }


  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }

  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''));
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}

