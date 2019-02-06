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
  description: FormControl;
  types: FormControl;
  parentSelectedType: FormControl;
  speciesSelected: FormControl;
  subSpeciesSelected: FormControl;
  descriptorSelected: FormControl;
  base: string = environment.apiURLImg;
  pTypes: any = [];
  parentTypes: any = [];
  country: FormControl;
  processingCountry: FormControl;
  city: FormControl;
  raised: FormControl;
  preparation: FormControl;
  treatment: FormControl;
  seller_sku: FormControl;
  seafood_sku: FormControl;
  stock: FormControl;
  waterLostRate: FormControl;
  mortalityRate: FormControl;
  wholeFishWeight: FormControl;
  brandName:FormControl;
  processingParts:FormControl;
  fileToUpload: any = [];
  info: any;
  store: any = [];
  storeEndpoint: any = 'api/store/user/';
  existStore: boolean = true;
  primaryImg: any;
  countries: any = [];
  arrayBuffer: any;
  file: File;
  products: any = [];
  productsToUpload: any = [];
  showError: boolean = false;
  allCities: any = [];
  cities: any = [];
  preparationOptions=[
    'Filleted',
    'Whole',
    'Gutted'
  ]
  wholeOptions=[
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
  trimmings=[];
  parts=[];
  ProcessingParts:any;
  showWholeOptions:boolean=false;
  showProcessingParts:boolean=false;
  defaultTrimming=[]
  constructor(
    private product: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService,
    private countryService: CountriesService
  ) { }
  ngOnInit() {
    this.getAllTypesByLevel();
    this.createFormControls();
    this.createForm();
    this.getTypes();
    this.getSubcategories();
    this.getMyData();
    this.getAllCities();
    this.getCountries();
    this.getTrimming();
  }

  getTypes() {
    // this.product.getAllCategoriesProducts().subscribe(result => {
    this.product.getCategories().subscribe(result => {
      this.parentTypes = result;
    });
  }

  getSubcategories() {
    this.product.getSubCategories( this.parentSelectedType.value ).subscribe(result => {
      this.pTypes = result;
    });
  }

  getMyData() {
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getStore() {
    this.product.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results;
      this.getProcessingParts();
      if (this.store.length < 1) {
        this.existStore = false;
      }
    });
  }

  createFormControls() {
    this.name = new FormControl('', Validators.required);
    this.price = new FormControl('', Validators.required);
    this.minimunorder = new FormControl('', Validators.required);
    this.maximumorder = new FormControl('', Validators.required);
    this.cooming_soon = new FormControl(false, Validators.required);
    this.measurement = new FormControl('', Validators.required);
    this.description = new FormControl('', Validators.required);
    //this.types = new FormControl('', Validators.required);
    this.country = new FormControl('', Validators.required);
    this.processingCountry = new FormControl('');
    this.raised = new FormControl('', Validators.required);
    this.preparation = new FormControl('', Validators.required);
    this.treatment = new FormControl('', Validators.required);
    this.seller_sku = new FormControl('', Validators.required);
    this.seafood_sku = new FormControl('', Validators.required);
    this.stock = new FormControl('', Validators.required);
    this.mortalityRate = new FormControl('', Validators.required );
    this.waterLostRate = new FormControl('', Validators.required);
    this.parentSelectedType = new FormControl('', Validators.required);
    this.speciesSelected = new FormControl('', Validators.required);
    this.subSpeciesSelected = new FormControl( '', Validators.required );
    this.descriptorSelected = new FormControl('');
    this.city = new FormControl();
    this.wholeFishWeight = new FormControl('');
    this.brandName=new FormControl('');
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
      //types: this.types,
      country: this.country,
      processingCountry: this.processingCountry,
      city: this.city,
      raised: this.raised,
      preparation: this.preparation,
      treatment: this.treatment,
      seller_sku: this.seller_sku,
      seafood_sku: this.seafood_sku,
      stock: this.stock,
      mortalityRate: this.mortalityRate,
      waterLostRate: this.waterLostRate,
      parentSelectedType: this.parentSelectedType,
      speciesSelected: this.speciesSelected,
      subSpeciesSelected: this.subSpeciesSelected,
      descriptorSelected: this.descriptorSelected,
      wholeFishWeight:this.wholeFishWeight,
      brandName:this.brandName
    });
    this.myform.controls['measurement'].setValue('kg');
  }
  generateSKU() {
    const parentType = this.parentSelectedType.value;
    /*this.pTypes.forEach(row => {
      if (row.id == this.types.value) {
        parentType = row.parentsTypes[0].parent.id;

      }
    })*/

    this.product.generateSKU(this.store[0].id, parentType, this.parentSelectedType.value, this.country.value).subscribe(
      result => {
        console.log(result);
        this.seafood_sku.setValue(result);
      },
      error => {
        console.log(error);
      }
    );
  }
  onSubmit() {
    this.showError = true;    
    if (this.myform.valid) {
      const data = {
        'type': this.subSpeciesSelected.value,
        'descriptor': this.descriptorSelected.value,
        'store': this.store[0].id,
        'quality': 'good',
        'name': this.name.value,
        'description': this.description.value,
        'country': this.country.value,
        'processingCountry': this.processingCountry.value,
        'city': this.city.value,
        'price': {
          'type': '$',
          'value': this.price.value,
          'description': this.price.value + ' for pack'
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
        'stock': this.stock.value,
        'mortalityRate': this.mortalityRate.value,
        'waterLostRate': this.waterLostRate.value,
        'status': '5c0866e4a0eda00b94acbdc0',
        'wholeFishWeight':this.wholeFishWeight.value,
        'brandname':this.brandName.value
      };
      this.product.saveData('fish', data).subscribe(result => {
        // if (this.fileToUpload.length > 0 || this.primaryImg.length > 0) {
          this.showError = false;
          console.log( result );
          this.uploadFileToActivity(result['product']['id']);
        // } else {
          this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });
          // this.showError = false;
        // }

      });
    } else {
      this.toast.error('All fields are required', 'Error', { positionClass: 'toast-top-right' });

    }
  }

  handleFileInput(files: FileList, opt) {
    if (opt !== 'primary') {
      this.fileToUpload = files;
    } else {
      this.primaryImg = files;
    }
  }

  uploadFileToActivity(productID) {
    if (this.primaryImg && this.primaryImg.length > 0) {
      this.product.postFile(this.primaryImg, productID, 'primary').subscribe(
        data => {
          console.log(data);
        }, error => {
          console.log(error);
        });
    }
    if ( this.fileToUpload && this.fileToUpload.length > 0 ) {
      this.product.postFile(this.fileToUpload, productID, 'secundary').subscribe(data => {
        // do something, if upload success
        console.log('Data', data);
        this.myform.reset();
        this.toast.success('Product added succesfully!', 'Well Done', { positionClass: 'toast-top-right' });

      }, error => {
        console.log(error);
      });
    }


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
      console.log(item);
      const product = {
        'type': this.findTypeKey(item.Type),
        'store': this.store[0].id,
        'quality': item.Quality,
        'name': item.Name,
        'description': item.Description,
        'country': item.Country,
        processingCountry: item.processingCountry,
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
        'stock': item.stock,
        'mortalityRate': item.mortalityRate,
        'waterLostRate': item.waterLostRate,
      };
      this.productsToUpload.push(product);
      console.log(this.productsToUpload);
      console.log(index);
      if (index === (this.products.length - 1)) {
        console.log('Ready to Upload');
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
      console.log(result);
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
        console.log( error );
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
    this.countryService.getCities( this.country.value ).subscribe(
      result => {
        this.cities = result[0].cities;
      },
      error => {

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

  getOnChangeLevel( level: number, value ) {
    let selectedType = '';
    switch ( level ) {
      case 0:
        selectedType = this.parentSelectedType.value;
        break;
    
      case 1:
        selectedType = this.speciesSelected.value;
        if(value=='5bda361c78b3140ef5d31fa4'){
          this.preparationOptions=this.trimmings
          this.showWholeOptions=true
        }
        else{
          this.preparationOptions=[
            'Filleted',
            'Whole',
            'Gutted'
          ]
        }
        break;

      case 3:
        selectedType = this.subSpeciesSelected.value;
        break;

      default:
        selectedType = this.subSpeciesSelected.value;
        break;
    }
    console.log( 'selected type id', selectedType );
    this.product.getData( `fishTypes/${selectedType}/all_levels` ).subscribe(
      result => {
        result['childs'].map( item => {
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
        } );
        /*for (let index = level; index < result['childs'].length; index++) {          
          if ( index == 0 ) {
            
          }
        }*/
      },
      error => {
        console.log( error );
      }
    )
  }
  showWhole(value){
    if(value=='Whole'){
      this.showWholeOptions=true;
    }
    else{
       this.showWholeOptions=false;
    }
    this.parts=[];
    if(value =='Whole' || value=='Gutted' || value=='Filleted'){
      this.showProcessingParts=false
    }
    else{
      this.defaultTrimming.forEach(res=>{
        if(value==res.trim){
          this.parts.push(res)
        }
      })
      this.ProcessingParts.forEach(res=>{
        if(value==res.type[0].name){
          this.parts.push(res.processingParts)
        }
      })
      this.showProcessingParts=true
    }
  }
  getTrimming(){
    this.trimmings.push('Whole')
    this.trimmings.push('Gutted');
    this.product.getData('trimmingtype').subscribe(
      res=>{
        let data:any=res
        data.forEach(result=>{
          this.trimmings.push(result.name)
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
  getProcessingParts(){
    this.product.getData('storeTrimming/store/'+this.store[0].id).subscribe(
      res=>{
        this.ProcessingParts=res;
      },
      e=>{
        console.log(e)
      }
    )
  }
}


