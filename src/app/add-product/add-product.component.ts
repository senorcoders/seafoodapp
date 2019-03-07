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
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services/authentication.service';
import { PricingChargesService } from '../services/pricing-charges.service';
import { environment } from '../../environments/environment';
import * as XLSX from 'ts-xlsx';
declare var jQuery:any;
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
  typeLevel0: any;
  typeLevel1: any;
  typeLevel2: any;
  typeLevel3: any;
  myform: FormGroup;
  name: FormControl;
  price: FormControl;
  minimunorder: FormControl;
  maximumorder: FormControl;
  cooming_soon: FormControl;
  measurement: FormControl;
  types: FormControl;
  parentSelectedType: FormControl;
  speciesSelected: FormControl;
  subSpeciesSelected: FormControl;
  descriptorSelected: FormControl;
  base: string = environment.apiURLImg;
  pTypes: any = [];
  parentTypes: any = [];
  currentPrincingCharges: any = [];
  currentExchangeRate: number;
  country: FormControl;
  processingCountry: FormControl;
  city: FormControl;
  raised: FormControl;
  preparation: FormControl;
  treatment: FormControl;
  seller_sku: FormControl;
  seafood_sku: FormControl;
  waterLostRate: FormControl;
  mortalityRate: FormControl;
  wholeFishWeight: FormControl;
  brandName: FormControl;
  processingParts: FormControl;
  fileToUpload: any = [];
  info: any;
  store: any = [];
  storeEndpoint: any = 'api/store/user/';
  existStore: boolean = true;
  primaryImg: any = [];
  countries: any = [];
  arrayBuffer: any;
  file: File;
  products: any = [];
  productsToUpload: any = [];
  showError: boolean = false;
  allCities: any = [];
  cities: any = [];
  preparationOptions = [
    'Head On Gutted',
    'Head Off Gutted',
    'Filleted'
  ];
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
  trimmings = [];
  parts = [];
  ProcessingParts: any;
  showWholeOptions: boolean = false;
  showProcessingParts: boolean = false;
  hsCode: FormControl;
  price25: any = 0;
  price100: any = 0;
  price500: any = 0;
  price1000: any = 0;
  deliveredPrices = [25, 100, 500, 1000];


  typesModal: any;
  partsModal: any;
  myformModal: FormGroup;
  trimmingsModal: any = [];
  groupOrder = [];
  showNoData: boolean = false;
  default = [2, 3, 4, 3, 5];
  defaultTrimming = [];
  pd = [];
  hideTrimModal: boolean = true;
  public loading = false;



  constructor(
    private product: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private countryService: CountriesService,
    private pricingChargesService: PricingChargesService,
    private fb: FormBuilder
  ) { }
  ngOnInit() {
    this.myformModal = this.fb.group({
      trimmingType: ['', Validators.required],
      processingParts: ['', Validators.required]
    });
    this.getCurrentPricingCharges();
    this.getAllTypesByLevel();
    this.createFormControls();
    this.createForm();
    this.getTypes();
    this.getSubcategories();
    this.getMyData();
    this.getAllCities();
    this.getCountries();
    this.getTrimming();
    // this.countries = environment.countries;
  }

  getTypes() {
    // this.product.getAllCategoriesProducts().subscribe(result => {
    this.product.getCategories().subscribe(result => {
      this.parentTypes = result;
    });
  }

  getSubcategories() {
    this.product.getSubCategories(this.parentSelectedType.value).subscribe(result => {
      this.pTypes = result;
    });
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

  getMyData() {
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getStore() {
    this.product.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results;
      this.getTrimmingByStore();
      this.getParts();
      this.getTrimmingModal();
      this.getProcessingParts();
      if (this.store.length < 1) {
        this.existStore = false;
      }
    });
  }

  createFormControls() {
    this.name = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.minimunorder = new FormControl(1);
    this.maximumorder = new FormControl(1000);
    this.cooming_soon = new FormControl(false, Validators.required);
    this.measurement = new FormControl('', Validators.required);
    // this.types = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);
    this.processingCountry = new FormControl('', Validators.required);
    this.raised = new FormControl('', Validators.required);
    this.preparation = new FormControl('', Validators.required);
    this.treatment = new FormControl('', Validators.required);
    this.seller_sku = new FormControl('');
    this.seafood_sku = new FormControl('');
    this.mortalityRate = new FormControl('', Validators.required);
    this.waterLostRate = new FormControl('');
    this.parentSelectedType = new FormControl('', Validators.required);
    this.speciesSelected = new FormControl('', Validators.required);
    this.subSpeciesSelected = new FormControl('', Validators.required);
    this.descriptorSelected = new FormControl();
    this.city = new FormControl('');
    this.wholeFishWeight = new FormControl('');
    this.brandName = new FormControl('');
    this.hsCode = new FormControl('');
  }

  createForm() {
    this.myform = new FormGroup({
      name: this.name,
      price: this.price,
      minimunorder: this.minimunorder,
      maximumorder: this.maximumorder,
      cooming_soon: this.cooming_soon,
      measurement: this.measurement,
      // types: this.types,
      country: this.country,
      processingCountry: this.processingCountry,
      city: this.city,
      raised: this.raised,
      preparation: this.preparation,
      treatment: this.treatment,
      seller_sku: this.seller_sku,
      seafood_sku: this.seafood_sku,
      mortalityRate: this.mortalityRate,
      waterLostRate: this.waterLostRate,
      parentSelectedType: this.parentSelectedType,
      speciesSelected: this.speciesSelected,
      subSpeciesSelected: this.subSpeciesSelected,
      descriptorSelected: this.descriptorSelected,
      wholeFishWeight: this.wholeFishWeight,
      brandName: this.brandName,
      hsCode: this.hsCode,
    });
    this.myform.controls['measurement'].setValue('kg');
    this.onChanges();
    //this.onCityChange();
  }

  onCityChange(city): void {

    this.deliveredPrices.forEach(element => {
      this.getDeliveredPrice(city, element);

    });

  }

  onChanges(): void {
    this.myform.valueChanges.subscribe(val => {
      if (val.speciesSelected === '5bda361c78b3140ef5d31fa4') {
        this.hideTrimModal = false;
      }

      if(val.price != "" && val.city != null){

        this.onCityChange(val.city);
      }
      else if (val.price != "" && val.city == null) {
        this.price25 = val.price;
        this.price100 = val.price;
        this.price500 = val.price;
        this.price1000 = val.price;
      }
    });
  }

  getDeliveredPrice(val, qty) {
    const data = {
      'cities': val,
      'weight': qty
    };
    this.product.saveData('shippingRates/bycity', data).subscribe(res => {
      if (qty === 25) {

        (res == 0) ? this.price25 = this.price.value : this.price25 = res;
      } else if (qty === 100) {
        (res == 0) ? this.price100 = this.price.value : this.price100 = res;
      } else if (qty === 500) {
        (res == 0) ? this.price500 = this.price.value : this.price500 = res;
      } else if (qty === 1000) {
        (res == 0) ? this.price1000 = this.price.value : this.price1000 = res;
      }
    });
  }
  async generateSKU() {
    const parentType = this.parentSelectedType.value;
    /*this.pTypes.forEach(row => {
      if (row.id == this.types.value) {
        parentType = row.parentsTypes[0].parent.id;
      }
    })*/

    await new Promise((resolve, reject) => {
      this.product.generateSKU(this.store[0].id, parentType, this.parentSelectedType.value, this.processingCountry.value).subscribe(
        result => {
          // this.seafood_sku.setValue(result);
          console.log("sku", result);
          this.myform.controls["seafood_sku"].setValue(result);
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
    if (this.myform.valid) {
      await this.generateSKU();
      let priceAED = (this.price.value * this.currentExchangeRate).toFixed(2);
      const data = {
        'type': this.subSpeciesSelected.value,
        'descriptor': this.descriptorSelected.value,
        'store': this.store[0].id,
        'quality': 'good',
        'name': this.name.value,
        'description': '',
        'country': this.country.value,
        'processingCountry': this.processingCountry.value,
        'city': this.city.value,
        'price': {
          'type': '$',
          'value': priceAED,
          'description': priceAED + ' for pack'
        },
        'weight': {
          'type': this.measurement.value,
          'value': 5
        },
        'minimumOrder': this.minimunorder.value,
        'maximumOrder': this.maximumorder.value,
        'cooming_soon': this.cooming_soon.value,
        'raised': this.raised.value,
        'preparation': this.preparation.value,
        'treatment': this.treatment.value,
        'seller_sku': this.seller_sku.value,
        'seafood_sku': this.seafood_sku.value,
        'mortalityRate': this.mortalityRate.value,
        'waterLostRate': '',
        'status': '5c0866e4a0eda00b94acbdc0',
        'wholeFishWeight': this.wholeFishWeight.value,
        'brandname': this.brandName.value,
        'hsCode': this.hsCode.value,

      };

      this.product.saveData('fish', data).subscribe(result => {
        console.log("Lenght de las imagenes", this.fileToUpload, this.primaryImg);
        if (this.fileToUpload.length > 0 || this.primaryImg.length > 0) {
        this.showError = false;
        this.uploadFileToActivity(result['product']['id']);
        } else {
        this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
        this.showError = false;
        this.loading = false;
        this.myform.reset();

        }

      });
    } else {
      this.toast.error('All fields are required', 'Error', { positionClass: 'toast-top-right' });
      this.loading = false;


    }
  }

  handleFileInput(files: FileList, opt) {
    if (opt !== 'primary') {
      this.fileToUpload = files;
      this.imagesPreview(files);
      
    } else {
      this.primaryImg = files;
      this.readURL(files);
    }
  }

  uploadFileToActivity(productID) {
    if (this.primaryImg.length > 0 && this.fileToUpload.length > 0) {
      this.product.postFile(this.primaryImg, productID, 'primary').subscribe(
        data => {
          console.log(data);
          this.saveImages(productID, 'secundary', this.fileToUpload);


        }, error => {
          console.log(error);
          this.loading = false;

        });
    }else if(this.fileToUpload.length > 0 && this.primaryImg.length == 0){
      this.saveImages(productID, 'secundary', this.fileToUpload);
    }else if(this.primaryImg.length > 0 && this.fileToUpload.length == 0){
      this.saveImages(productID, 'primary', this.primaryImg);

    }
   


  }

  saveImages(productID, status, files){
      this.product.postFile(files, productID, status).subscribe(data => {
        // do something, if upload success
        this.myform.reset();
        this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
        this.loading = false;

      }, error => {
        console.log(error);
        this.loading = false;

      });
    
  }

  incomingfile(event) {
    this.file = event.target.files[0];
  }

  Upload() {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }));
      this.products = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.structureData();
    };
    fileReader.readAsArrayBuffer(this.file);
  }

  structureData() {
    this.products.forEach((item, index) => {
      const product = {
        'type': this.findTypeKey(item.Type),
        'store': this.store[0].id,
        'quality': item.Quality,
        'name': item.Name,
        'country': item.Country,
        'processingCountry': item.processingCountry,
        'city': item.city,
        'price': {
          'type': '$',
          'value': item.Price,
          'description': item.Price + ' for pack'
        },
        'weight': {
          'type': item.WeightMeasurement,
          'value': item.WeightValue
        },
        'minimumOrder': item.MinimunOrder,
        'maximumOrder': item.MaximumOrder,
        'raised': item.Raised,
        'preparation': item.Preparation,
        'Treatment': item.Treatment,
        'cooming_soon': item.cooming_soon,
        'seller_sku': item.seller_sku,
        'seafood_sku': item.seafood_sku,
        'mortalityRate': item.mortalityRate,
        'waterLostRate': item.waterLostRate,
      };
      this.productsToUpload.push(product);
      if (index === (this.products.length - 1)) {
        this.bulkUpload();
      }

    });
  }
  findTypeKey(value) {
    for (let i = 0; i < this.pTypes.length; i++) {
      if (this.pTypes[i]['name'] === value) {
        return this.pTypes[i].id;
      }
    }
    return null;
  }

  bulkUpload() {

    const sendData = { 'products': this.productsToUpload };
    this.product.saveData('api/fishs', sendData).subscribe(result => {
      this.toast.success('Products added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });

    });
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
    this.countryService.getCities(this.processingCountry.value).subscribe(
      result => {
        this.cities = result[0].cities;
        this.myform.controls['city'].setValue(result[0].cities[0]['code']);
        console.log(this.myform.controls['processingCountry'].value);
      }
    );
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
    let selectedType = '';
    switch (level) {
      case 0:
        selectedType = this.parentSelectedType.value;
        break;

      case 1:
        selectedType = this.speciesSelected.value;
        if (value === '5bda361c78b3140ef5d31fa4') {
          this.preparationOptions = this.trimmings;
          this.showWholeOptions = true;
          this.myform.controls['preparation'].setValue(this.preparationOptions[0]);

        } else {
          this.preparationOptions = [
            'Filleted',
            'Head On Gutted',
            'Head Off Gutted '
          ];
          this.myform.controls['preparation'].setValue(this.preparationOptions[0]);

        }
        break;

      case 3:
        selectedType = this.subSpeciesSelected.value;
        break;

      default:
        selectedType = this.subSpeciesSelected.value;
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
        /*for (let index = level; index < result['childs'].length; index++) {
          if ( index == 0 ) {

          }
        }*/
      },
      error => {
        console.log(error);
      }
    );
  }
  showWhole(value) {
    // if(value=='Whole'){
    //   this.showWholeOptions=true;
    // }
    // else{
    //    this.showWholeOptions=false;
    // }
    // this.parts=[];
    // this.ProcessingParts.forEach(res=>{
    //   if(value==res.type[0].name){
    //     this.parts.push(res.processingParts)
    //   }
    // })
    console.log(value);
    if (value === 'Head On Gutted' || value === 'Head Off Gutted') {
      this.showWholeOptions = true;
    } else {
      this.showWholeOptions = false;
    }
  }
  getTrimming() {
    this.trimmings.push('Head On Gutted');
    this.trimmings.push('Head Off Gutted');
    this.trimmings.push('Filleted');
    this.product.getData('trimmingtype').subscribe(
      res => {
        const data: any = res;
        data.forEach(result => {
          this.trimmings.push(result.name);
        });
      },
      e => {
        console.log(e);
      }
    );
  }
  getProcessingParts() {
    this.product.getData('storeTrimming/store/' + this.store[0].id).subscribe(
      res => {
        this.ProcessingParts = res;
      },
      e => {
        console.log(e);
      }
    );
  }



  getTrimmingByStore(){
    this.product.getData('storeTrimming/store/'+this.store[0].id).subscribe(
          result=>{
            this.trimmingsModal=result;
          },
          e=>{
            console.log(e)
          }
        )
  }
  getTrimmingModal(){
  	this.product.getData('trimmingtype').subscribe(
  		result=>{
  			this.typesModal=result;
        let data:any=result;

        console.log("Trimming Types", result);
        data.forEach(result=>{
          if(result.defaultProccessingParts.length>1){
            result.defaultProccessingParts.forEach(res2=>{
              this.defaultTrimming.push({trim:result.name,name:res2})
            })
          }
          else{
            this.defaultTrimming.push({trim:result.name,name:result.defaultProccessingParts})
          }
        })
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  getParts(){
  	this.product.getData('processingParts').subscribe(
  		result=>{
  			this.partsModal=result;
  		},
  		e=>{
  			console.log(e)
  		}
  	)
  }
  saveData(types,parts){
  	let data={
  		"processingParts": parts,
	    "store": this.store[0].id,
	    "trimmingType": types
	}
  	this.product.saveData('storeTrimming',data).subscribe(
  		res=>{
  			this.toast.success("Trimmings Saved!",'Well Done',{positionClass:"toast-top-right"})
      
        this.getTrimmingByStore();
  		},
  		e=>{
  			this.toast.error("Please try again",'Error',{positionClass:"toast-top-right"})
  			console.log(e)
  		}
	)
  }
  delete(id){
    this.product.deleteData('storeTrimming/'+id).subscribe(
      res=>{
        this.toast.success("Trimmings Deleted!",'Well Done',{positionClass:"toast-top-right"})
        this.getTrimmingByStore();
      },
      e=>{
        this.toast.error("Please try again",'Error',{positionClass:"toast-top-right"})
        console.log(e)
      }
    )
  }
  checked(event,type,part){
    let id;
    this.trimmingsModal.forEach(res=>{
      if(type==res.trimmingType){
        if(part==res.processingParts.id){
          id=res.id
        }
      }
    })
    if(event.target.checked){
      this.saveData(type,part);
    }
    else{
      this.delete(id)
    }
  }
  isDefault(part,trim){
    let data;
    this.trimmingsModal.forEach(res=>{
      if(res.type.length > 0){
        if(trim==res.type[0].name){
        if(res.type[0].defaultProccessingParts.includes(part)){
          data=true
        }
        else{
          data=false
        }
      }
    }
    })
    return data
  }
  

isChecked(part,trim){
  let data
  this.trimmingsModal.forEach(res=>{
    if(res.type.length > 0){

    if(trim==res.type[0].name){
      if(res.type[0].defaultProccessingParts.includes(part) || res.processingParts.name==part){
        data=true
      }
    }
  }
  })
  return data
}

readURL(files) {
  if (files[0]) {
    var reader = new FileReader();

    reader.onload = (e: Event) => {
      jQuery('#blah').attr('src', reader.result);
    }

    reader.readAsDataURL(files[0]);
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
