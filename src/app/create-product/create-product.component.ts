import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProductService } from '../services/product.service';
import { CountriesService } from '../services/countries.service';
// import { ToastrService } from '../toast.service';
import { AuthenticationService } from '../services/authentication.service';
import { PricingChargesService } from '../services/pricing-charges.service';
import { environment } from '../../environments/environment';
import * as XLSX from 'ts-xlsx';
import { NgProgress } from 'ngx-progressbar';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from '../toast.service';
import { HttpClient } from '@angular/common/http';
import { reject } from 'q';
import { Subject } from 'rxjs/Subject';
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
  sellers: any = [];
  selectedSeller: string;
  selectedSellerInfo: any;
  pd = [];
  hideTrimModal: boolean = true;
  public loading = false;
  private storeEndpoint: any = 'api/store/user/';
  public store: any;
  public myform: FormGroup;
  public showError = false;
  private trimmings = [];
  private seafood_sku = '';
  private productID = '';
  public user: any = {};
  private ready = false;
  public loadingDetails = false;
  public eventsSubject: Subject<any> = new Subject<any>();

  private product: any = {};
  public currentExchangeRate: any;
  public currentPrincingCharges: any;

  public createProduct = true;

  public sellectedSeller: any;
  public sellerChange: Subject<void> = new Subject<void>();

  public speciesSelected = "";
  lbHandler: number = 1;


  constructor(
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private countryService: CountriesService,
    private pricingChargesService: PricingChargesService,
    private fb: FormBuilder,
    public ngProgress: NgProgress,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {
    this.user = this.auth.getLoginData();
    let productID = this.route.snapshot.params['id'];
    if (productID !== null && productID !== undefined) {
      this.productID = productID;
      this.createProduct = false;
    }
  }

  private emitEventToChild(str) {
    this.eventsSubject.next(str)
  }

  emitSellerSelectedToChild() {
    this.getSeller(this.selectedSeller);

  }

 ngOnInit() {
    if (this.createProduct) {
      this.getSellers();
    }
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

  getSellers() {
    this.productService.getData(`api/v2/user?where={%22role%22:1}&limit=200`).subscribe(
      res => {
        this.sellers = res['data'];
      },
      e => {
        console.log(e);
      }
    );
  }

  getSeller(seller_id) {
    this.productService.getData('user/' + seller_id).subscribe(it => {
      console.log('user', it);
      this.getStore();
      this.selectedSellerInfo = it;
      this.sellerChange.next(this.selectedSellerInfo);
    });
  }

  receiveMessage($event) {
    console.log($event);
    // Si tenemos productID es para editar producto
    this.ready = true;
    if (this.productID !== '' && this.currentExchangeRate !== 0) {
      this.getDetails();
    }
  }

  private getUser() {
    const loginData = this.auth.getLoginData();
    this.productService.getData('user/' + loginData['id']).subscribe(it => {
      console.log('user', it);
      this.user = it;
      if (this.user['role'] !== 0) {
        this.disableInputs();
      }
    });
  }

  private disableInputs() {
    const product = (this.myform.controls.product as FormGroup).controls;
    // let features = (this.myform.controls.features as FormGroup).controls;
    product.name.disable();
    product.country.disable();
    product.processingCountry.disable();
    product.city.disable();
    product.unitOfSale.disable();
    product.averageUnitWeight.disable();
    product.parentSelectedType.disable();
    product.speciesSelected.disable();
    product.subSpeciesSelected.disable();
    product.descriptorSelected.disable();
    // features.acceptableSpoilageRate.disable();
    product.raised.disable();
    product.treatment.disable();
    // features.wholeFishAction.disable();
  }

  private async getDetails() {
    if (this.loadingDetails === true) return;
    this.loadingDetails = true;
    this.loading = true;
    const parent = await this.getParent();
    console.log('parent', parent, this.productID);
    this.productService.getProductDetailVariations(this.productID)
      .subscribe(async data => {
        try {
          this.product = JSON.parse(JSON.stringify(data));
          console.log("Producto", data);
          let images = await this.getImages(data);

          let product = {
            name: data["name"],
            brandName: data["brandname"] || "",
            country: data["country"],
            processingCountry: data["processingCountry"],
            city: data["city"],
            unitOfSale: data["unitOfSale"],
            averageUnitWeight: data["unitOfSale"] == 'lbs' ? data['boxWeight'] * 2.205 : data['boxWeight'],
            parentSelectedType: parent["level0"] ? parent["level0"].id : "",
            speciesSelected: parent["level1"] ? parent["level1"].id : '',
            subSpeciesSelected: parent["level2"] ? parent["level2"].id : '',
            descriptorSelected: data["descriptor"] ? data["descriptor"] : '',
            seller_sku: data["seller_sku"] || '',
            hsCode: data["hsCode"],
            minimunorder: data["unitOfSale"] == 'lbs' ? data['minimumOrder'] * 2.205 : data['minimumOrder'],
            maximumorder: data["unitOfSale"] == 'lbs' ? data['maximumOrder'] * 2.205 : data['maximumOrder'],
            imagesSend: images.forForm,
            price: data["price"] ? (data["price"].value / this.currentExchangeRate).toFixed(2) : 0,
            perBoxes: data['perBox'],
            // acceptableSpoilageRate: data["acceptableSpoilageRate"] || "",
            raised: data["raised"].id || "",
            treatment: data["treatment"].id || "",
            head: data["head"] || "on",
            wholeFishAction: data["wholeFishAction"],
            foreignfish: data["foreign_fish"]
          };
          console.log("product fetched", product);
          this.store = data['store'];
          this.selectedSeller = data['store']['owner'];
          this.getSeller(this.selectedSeller);
          // let features = {
          //   price: data["price"] ? (data["price"].value / this.currentExchangeRate).toFixed(2) : 0,
          //   // acceptableSpoilageRate: data["acceptableSpoilageRate"] || "",
          //   raised: data["raised"].id || "",
          //   treatment: data["treatment"].id || "",
          //   head: data["head"] || "on",
          //   wholeFishAction: data["wholeFishAction"]
          // };

          const price = {
            headAction: data['headAction'],
          };

          // let varit = this.reingenieriaVariations(data, data["variations"]);
          // features = Object.assign(features, varit.features);
          this.setValue({ product, price });
          const we: any = {};
          we.isTrimms = data['isTrimms'];
          we.weights = data['weights'];
          we.weightsTrim = data['weightsTrim'];
          we.weightsFilleted = data['weightsFilleted'];
          we.wholeFishAction = data['wholeFishAction'];
          console.log(we);
          this.emitEventToChild(we);
          this.speciesSelected = parent['level1'] ? parent['level1'].id : '';
        } catch (e) {
          console.error(e);
        }
        this.getUser();

        this.loading = false;
        this.ngProgress.done();
      }, error => {
        console.log(error);
        this.toast.error('Error when getting product', 'Error', { positionClass: 'toast-top-right' });
        this.loading = false;
        this.ngProgress.done();
      });
  }

  private getParent() {
    return this.productService.getData(`fishType/parents/${this.productID}`).toPromise() as any;
  }

  private async getImages(product) {
    console.log(product['images']);
    let forForm = [], forInput = [];
    let imagePrimary, imagePrimaryForForm,
      baseUrl = environment.apiURLImg, imagePrimary64,
      rt: any = { responseType: 'blob' };
    try {
      imagePrimary = await this.http.get(baseUrl + product['imagePrimary'], rt).toPromise() as any;
      imagePrimary64 = await this.blobToBase64(imagePrimary);
      imagePrimaryForForm = {
        src: imagePrimary64,
        url: product['imagePrimary'],
        type: 'primary',
        defaultInial: true
      };
      forForm.push(imagePrimaryForForm);
      forInput = [this.blobToFile(imagePrimary, 'primary.jpg')];
    } catch (e) {
      console.error(e);
    }

    // Para agregar las imasgenes secundarias
    if (product['images'] && product['images'].length > 0) {
      for (let image of product['images']) {
        if(typeof image === "object" && image.src)
          image = image.src;
        try {
          const imageSecond = await this.http.get(baseUrl + image, rt).toPromise() as any;
          const imageSecond64 = await this.blobToBase64(imageSecond);
          const imageSecondForForm = {
            src: imageSecond64,
            url: image,
            type: 'secundary'
          };
          forForm.push(imageSecondForForm);
          forInput.push(this.blobToFile(imageSecond, 'second.jpg'));
        } catch (e) { console.error(e); }
      }
    }

    return {
      forForm: JSON.stringify(forForm),
      forInput: forInput
    };
  }

  public byPassImageUrl(image) {
    return this.sanitizer.bypassSecurityTrustStyle(image);
  }


  private blobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  }

  private setValue(value) {
    this.myform.patchValue(value);
  }

  getMyData() {
    this.info = this.auth.getLoginData();
    if (this.user['role'] !== 0) {
      this.getStore();
    }
  }

  getStore() {
    let endpoint = this.storeEndpoint + this.info.id;
    if (this.user['role'] === 0) {
      endpoint = this.storeEndpoint + this.selectedSeller;
    }
    console.log('store endpoint', endpoint);
    this.productService.getData(endpoint).subscribe(results => {
      this.store = results;
    });
  }


  // getContentForSKU() {
  //   const parentType = this.myform.value.product.parentSelectedType;

  //   return {
  //     store: this.store[0].id, parentType, parentType, this.myform.value.product.processingCountry
  //   };
  // }

  async onSubmit() {
    this.showError = true;
    this.loading = true;

    if (this.selectedSeller == undefined && this.user['role'] == 0) {
      this.toast.error('Please select a seller', 'Error', { positionClass: 'toast-top-right' });
      this.loading = false;
      this.ngProgress.done();
    } else {
      const keys = Object.keys(this.myform.controls);
      for (const name of keys) {
        const keys_ = Object.keys((this.myform.controls[name] as any).controls);
        for (const na of keys_) {
          if ((this.myform.controls[name] as any).controls[na].valid === false) {
            console.log(name + '.' + na, (this.myform.controls[name] as any).controls[na]);
          }
        }
      }

      if (this.myform.valid) {
        console.log(this.myform.value);
        const value = this.myform.value,
          product = value.product,
          features = product,
          pricing = value.price;

        product.speciesSelected = product.speciesSelected || this.speciesSelected;
        // Para checkar si hay imagenes
        if (product.imagesSend === '') {
          this.loading = false;
          this.ngProgress.done();
          return this.toast.error('Add the images of your product', 'Error', { positionClass: 'toast-top-right' });
        } else {
          const imagesSend = JSON.parse(product.imagesSend);
          if (imagesSend.length === 0) {
            this.loading = false;
            this.ngProgress.done();
            return this.toast.error('Add the images of your product', 'Error', { positionClass: 'toast-top-right' });
          }
        }
        // Para checkar si hay imagen default
        if (product.images !== undefined && product.images !== '') {
          const images = JSON.parse(product.imagesSend);
          const index = images.findIndex(it => {
            return it.type === 'primary';
          });
          if (index === -1) {
            this.loading = false;
            this.ngProgress.done();
            return this.toast.error('Select a default image', 'Error', { positionClass: 'toast-top-right' });
          }
        }
        // si es actualizando un producto para saber los que se eliminan
        const variationsDeleted = JSON.parse(pricing.variationsDeleted);

        let variations: any = {}, variationsTrim: any = {}, variationsEnd = [],
          weightsFilleted = [];
        if (pricing.weights !== '') {
          variations = JSON.parse(pricing.weights);
        }
        if (pricing.weightsTrim !== '') {
          variationsTrim = JSON.parse(pricing.weightsTrim);
        }

        if (pricing.weightsFilleted !== '') {
          weightsFilleted = JSON.parse(pricing.weightsFilleted);
        }

        // Para quitar las options
        const itereOptions = it => {
          delete it.options;
          return it;
        };
        // Para ver si es varations Trimming
        if (features.wholeFishAction === false && product.speciesSelected === '5bda361c78b3140ef5d31fa4') {
          console.log(Object.keys(variationsTrim));
          for (const key of Object.keys(variationsTrim)) {
            const fishPreparation = key;
            const itr = {
              fishPreparation,
              prices: variationsTrim[key].map(itereOptions)
            };
            variationsEnd.push(itr);
          }
        } else if (features.wholeFishAction === false && product.speciesSelected !== '5bda361c78b3140ef5d31fa4') {
          // para los fillete
          const fishPreparation = '5c93c01465e25a011eefbcc4';

          const itr = {
            fishPreparation,
            prices: weightsFilleted.map((it, i) => {
              const price = pricing['weightsFillete_arr'][i];
              it.price = price;
              return itereOptions(it);
            })
          };
          variationsEnd.push(itr);
        } else {
          // Para los ON
          let fishPreparation = '5c93bff065e25a011eefbcc2';
          if (variations.on.keys && variations.on.keys.length > 0) {
            for (const it of variations.on.keys) {
              const wholeFishWeight = it;
              const itr = {
                fishPreparation,
                wholeFishWeight,
                prices: variations.on[it].map(itereOptions)
              };
              variationsEnd.push(itr);
            }
          }
          // Para off
          fishPreparation = '5c93c00465e25a011eefbcc3';
          if (variations.off.keys && variations.off.keys.length > 0) {
            for (const it of variations.off.keys) {
              const wholeFishWeight = it;
              const itr = {
                fishPreparation,
                wholeFishWeight,
                prices: variations.off[it].map(itereOptions)
              };
              variationsEnd.push(itr);
            }
          }
        }
        // Buscamos si algun price yeva id, si lleva quiere decir que es
        // Para actualizar
        variationsEnd = variationsEnd.map(it => {
          const index = it.prices.findIndex(it => {
            return it.idVariation !== null && it.idVariation !== undefined;
          });
          if (index !== -1) {
            it.idVariation = it.prices[index].idVariation;
          }
          return it;
        });

        // Para quitar el _off y _arr
        for (let i = 0; i < variationsEnd.length; i++) {
          if (variationsEnd[i].fishPreparation !== null && variationsEnd[i].fishPreparation !== undefined) {
            variationsEnd[i].fishPreparation = variationsEnd[i].fishPreparation.replace('_off', '');
            variationsEnd[i].fishPreparation = variationsEnd[i].fishPreparation.replace('_arr', '');
          }

          if (variationsEnd[i].wholeFishWeight !== null && variationsEnd[i].wholeFishWeight !== undefined) {
            variationsEnd[i].wholeFishWeight = variationsEnd[i].wholeFishWeight.replace('_off', '');
            variationsEnd[i].wholeFishWeight = variationsEnd[i].wholeFishWeight.replace('_arr', '');
          }
        }
        if (variationsEnd.length === 0) {
          this.loading = false;
          this.ngProgress.done();
          return this.toast.error('You have to add at least one price', 'Error', { positionClass: 'toast-top-right' });
        }

        // this.ngProgress.start();
        // let priceAED = Number(features.price).toFixed(2);
        const data: any = {
          parentType: product.parentSelectedType,
          "specie": product.speciesSelected,
          'type': product.subSpeciesSelected,
          'descriptor': product.descriptorSelected === '' ? null : product.descriptorSelected,
          'store': this.store[0].id,
          'quality': 'good',
          'name': product.name,
          'description': '',
          'country': product.country,
          'processingCountry': product.processingCountry,
          'city': product.city,
          // 'price': {
          //   'type': '$',
          //   'value': priceAED,
          //   'description': priceAED + ' for pack'
          // },
          'weight': {
            'type': "kg",
            'value': 5
          },
          "foreign_fish": product.foreignfish,
          'perBox': product.perBoxes,
          'perBoxes': product.perBoxes,
          'unitOfSale': product.unitOfSale,
          'boxWeight': product.unitOfSale == 'lbs' ? product.averageUnitWeight / 2.205 : product.averageUnitWeight,
          'minimumOrder': product.unitOfSale == 'lbs' ? product.minimunorder / 2.205 : product.minimunorder,
          'maximumOrder': product.unitOfSale == 'lbs' ? product.maximumorder / 2.205 : product.maximumorder,
          // "acceptableSpoilageRate": features.acceptableSpoilageRate,
          'raised': features.raised,
          'treatment': features.treatment,
          'seller_sku': product.seller_sku,
          'seafood_sku': this.seafood_sku,
          'mortalityRate': 1,
          'waterLostRate': '0',
          'status': '5c0866e4a0eda00b94acbdc0',
          'brandName': product.brandName,
          'hsCode': product.hsCode,
          variations: variationsEnd,
          'role': this.user['role']
        };
        if (this.productID !== "") {
          data.idProduct = this.product.id;
          data.variationsDeleted = variationsDeleted;
          data.pricesDeleted = JSON.parse(pricing.pricesDeleted);
        }
        console.log(data);
        if (this.productID !== "") {
          this.productService.updateData('api/variations', data).subscribe(result => {
            this.uploadImagesAction(product, result);
          }, err => {
            this.showError = false;
            this.loading = false;
            this.ngProgress.done();
            this.toast.error('Error when saving the product returns try', 'Error', { positionClass: 'toast-top-right' });
          });
        } else {
          this.productService.saveData('api/variations/add', data).subscribe(result => {
            this.uploadImagesAction(product, result);
          }, err => {
            this.showError = false;
            this.loading = false;
            this.ngProgress.done();
            this.toast.error('Error when saving the product returns try', 'Error', { positionClass: 'toast-top-right' });
          });
        }
      } else {
        this.loading = false;
        this.ngProgress.done();
        return this.toast.error('fields are required', 'Error', { positionClass: 'toast-top-right' });
      }
    }
  }

  private async uploadImagesAction(product, result) {
    if (product.imagesSend !== undefined && product.imagesSend !== '') {
      let images = JSON.parse(product.imagesSend),
        deletedImages = product.deletedImages;
      // Si se esta actualizando un producto
      // se filtra las imagenes, las que tiene url son
      // las nuevas imagenes
      if (this.productID !== '') {
        images = images.filter(it => {
          return it.url === undefined || it.url === null || it.type === 'primary' || it.change === true;
        });
        console.log(images.length, deletedImages);
        try {
          // La imagen primary siempre se vuelve a subir
          const files: File[] = [];

          for (const image of images) {
            let extension = this.getExtension(image.src);
            const file = this.blobToFile(this.b64toBlob(image.src, 'image/' + extension), new Date().getTime().toString() + '-' + this.productID + "." + extension);
            if (image.type === 'primary') {
              await this.productService.postFile([file], this.productID, 'primary').toPromise();
              continue;
            } else {
              files.push(file);
            }
          }
          // secondary images are uploaded on background
          this.productService.updateData('api/fish/images/delete/' + this.productID, { deletedImages }).toPromise();
          this.productService.updateImages(files, this.productID).toPromise();
        } catch (e) {
          console.error(e);
        }
        this.finish();
      } else {
        this.uploadFileToActivity(result['id'], images);
      }

    } else {
      this.finish();
    }
  }

  private getExtension(encoded) {
    return encoded.substring("data:image/".length, encoded.indexOf(";base64"));
  }

  private finish() {
    if (this.productID === '') {
      this.toast.success('Product added successfully!', 'Well Done', { positionClass: 'toast-top-right' });
    } else {
      this.toast.success('Product updated successfully!', 'Well Done', { positionClass: 'toast-top-right' });
    }
    this.showError = false;
    this.loading = false;
    this.ngProgress.done();
    this.myform.reset();
    this.router.navigate(['/my-products']);
  }

  private async uploadFileToActivity(productID, images) {
    const files = [];
    try {
      for (const image of images) {
        let extension = this.getExtension(image.src);
        const file = this.blobToFile(this.b64toBlob(image.src, 'image/' + extension), new Date().getTime().toString() + '-' + productID + "." + extension);
        if (image.type === 'primary') {
          await this.productService.postFile([file], productID, 'primary').toPromise();
          continue;
        } else {
          files.push(file);
        }
      }
      // secondary images are uploaded on background
      this.saveImages(productID, 'secundary', files);
    } catch (e) {
      console.error(e);
    }
    this.finish();

  }

  saveImages(productID, status, files) {
    return this.productService.postFile(files, productID, status).toPromise();
  }

  public getCurrentPricingCharges() {
    this.pricingChargesService.getCurrentPricingCharges().subscribe(
      result => {
        this.currentPrincingCharges = result;
        this.currentExchangeRate = result['exchangeRates'];
        if (this.ready === true && this.productID !== '') { this.getDetails(); }
      }, error => {
        console.log(error);
      }
    );
  }


  public blobToFile = (theBlob: Blob, fileName: string): File => {
    // const b: any = theBlob;
    // // A Blob() is almost a File() - it's just missing the two properties below which we will add
    // b.lastModifiedDate = new Date();
    // b.name = fileName;

    // // Cast to a File() type
    // return <File>theBlob;
    return new File([theBlob], fileName, { lastModified: new Date().getTime() });
  }

  public b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    const sliceSize = 512;
    const byteCharacters = atob(b64Data.replace(/^data:image\/(png|jpeg|jpg|blob|blob[0-9]{1,50});base64,/, ''));
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

}

