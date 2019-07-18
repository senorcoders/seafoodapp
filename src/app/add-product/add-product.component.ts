import { Component, OnInit, ViewChild, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { CountriesService } from '../services/countries.service';
import { ProductService } from '../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Options } from 'ng5-slider';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

declare var jQuery: any;
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  @ViewChild('myInput', { static: true })
  myInputVariable: ElementRef;
  productForm: FormGroup;
  name: FormControl;
  brand:FormControl;
  category:FormControl;
  specie:FormControl;
  subspecie:FormControl;
  subspecieVariant: FormControl;
  raised: FormControl;
  treatment: FormControl;
  sku: FormControl;
  country: FormControl;
  processingCountry: FormControl;
  portOfLoading: FormControl;
  hsCode: FormControl;
  domesticFish:FormControl;
  comingSoon: FormControl;
  unitOfMeasurement: FormControl;
  minOrder: FormControl;
  maxOrder: FormControl;
  perBoxes: FormControl;
  averageUnitWeight: FormControl;
  price: FormControl;
  countries:any = [];
  countriesWithShipping:any = [];
  public cities = [];
  public allCities = [];
  raisedArray:any = [];
  treatments:any = [];
  public typeLevel0 = [];
  public typeLevel1 = [];
  public typeLevel2 = [];
  public typeLevel3 = [];
  private productID = "";
  fishPreparation:any = [];
  preparation: FormControl;
  preparationChilds:any = [];
  childPreparation: FormControl;
  variationInfo:any = [];
  showAverageUnit:boolean = false;
  public staticmin: number = 1;
  images:FormControl;
  public imagesTmp = [];
  imagesSend: FormControl;
  deletedImages: FormControl;
  private indexImage = 0;
  tabsArray:any = [];
  keySelect:any = '';
  public weights: any = { keys: []};
  private await_ = false;
  private priceEnableChange = true;
  private waitChange3Seconds = null;
  public valueExample: number;
  private storeEndpoint: any = 'api/store/user/';
  public store: any;
  pricesDeleted:any = [];
  public user: any = {};
  public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  weightType:any = 'KG';
  private product: any = {};
  public createProduct = true;
  parent:any;
  measurements:any = [];
  public options: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    noSwitching: true
  };
  public exampleValues = {
    min: 0,
    max: 1
  };
  selectedType:any;


  constructor(private toast:ToastrService, private countryService: CountriesService,
    private productService: ProductService, private sanitizer: DomSanitizer,
    public zone: NgZone,  private router: Router,  private auth: AuthenticationService,
    private route: ActivatedRoute, private http: HttpClient) {
      this.user = this.auth.getLoginData();
      let productID = this.route.snapshot.params['id'];
      if (productID !== null && productID !== undefined) {
        this.productID = productID;
        this.createProduct = false;
        this.getDetails();
      }
      this.getStore();
    }
  ngOnInit() {
    this.createFormControl();
    this.RegisterProductForm();
    this.onChanges();
    this.getCountries();
    this.getCountriesWithShipping();
    this.reaised();
    this.getTreatment();
    this.getAllCities();
    this.getAllTypesByLevel();
    this.getMeasurements();
  }

  async getDetails(){
    this.parent= await this.getParent();

    this.productService.getProductDetailVariationsForEdit(this.productID).subscribe(async data =>
      {
        this.product = JSON.parse(JSON.stringify(data));
        console.log("Producto", this.product);
        this.setValues();

    })
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
        if (typeof image === "object" && image.src)
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
  private getParent() {
    return this.productService.getData(`fishType/parents/${this.productID}`).toPromise() as any;
  }

  async setValues() {
    let cat  = this.parent["level0"] ? this.parent["level0"].id : "";
    let speciesSelected =  this.parent["level1"] ? this.parent["level1"].id : '';
    let subSpeciesSelected = this.parent["level2"] ? this.parent["level2"].id : '';
    let descriptorSelected = this.product["descriptor"] ? this.product["descriptor"] : '';
    this.productForm.controls['name'].setValue(this.product.name);
    this.productForm.controls['name'].disable();
    this.productForm.controls['brand'].setValue(this.product.brandname);
    this.productForm.controls['raised'].setValue(this.product.raised.id);
    this.productForm.controls['raised'].disable();
    this.productForm.controls['treatment'].setValue(this.product.treatment.id);
    this.productForm.controls['treatment'].disable();
    this.productForm.controls['sku'].setValue(this.product.seller_sku);
    this.productForm.controls['country'].setValue(this.product.country);
    this.productForm.controls['country'].disable();
    this.productForm.controls['processingCountry'].setValue(this.product.processingCountry);
    this.productForm.controls['processingCountry'].disable();
    this.productForm.controls['portOfLoading'].setValue(this.product.city);
    this.productForm.controls['portOfLoading'].disable();
    this.productForm.controls['hsCode'].setValue(this.product.hsCode);
    this.productForm.controls['domesticFish'].setValue(this.product.foreign_fish);
    this.productForm.controls['comingSoon'].setValue(this.product.cooming_soon);
    this.productForm.controls['unitOfMeasurement'].setValue(this.product.unitOfSale);
    this.productForm.controls['unitOfMeasurement'].disable();
    this.productForm.controls['minOrder'].setValue(this.product.minimumOrder);
    this.productForm.controls['maxOrder'].setValue(this.product.maximumOrder);
    this.productForm.controls['perBoxes'].setValue(this.product.perBox);
    this.productForm.controls['averageUnitWeight'].setValue(this.product.boxWeight);
    this.productForm.controls['category'].setValue(cat);
    this.productForm.controls['category'].disable();
    this.productForm.controls['specie'].setValue(speciesSelected);
    this.productForm.controls['specie'].disable();
    this.productForm.controls['subspecie'].setValue(subSpeciesSelected);
    this.productForm.controls['subspecie'].disable();
    this.productForm.controls['subspecieVariant'].setValue(descriptorSelected);
    this.productForm.controls['subspecieVariant'].disable();
    this.updateProcess(cat);
    let images = await this.getImages(this.product);
    this.productForm.controls['imagesSend'].setValue(images.forForm);
   
  }
  getStore() {
    let endpoint = this.storeEndpoint + this.user.id;
    // if (this.user['role'] === 0) {
    //   endpoint = this.storeEndpoint + this.selectedSeller;
    // }
    console.log('store endpoint', endpoint);
    this.productService.getData(endpoint).subscribe(results => {
      this.store = results;
    });
  }
  createFormControl(){
    this.name = new FormControl('', [Validators.required]); 
    this.brand = new FormControl('', [Validators.nullValidator]); 
    this.category = new FormControl('', [Validators.required]); 
    this.specie = new FormControl('', [Validators.required]); 
    this.subspecie = new FormControl('', [Validators.required]); 
    this.subspecieVariant = new FormControl('', [Validators.nullValidator]); 
    this.raised = new FormControl('', [Validators.required]); 
    this.treatment = new FormControl('', [Validators.required]);
    this.sku = new FormControl('', [Validators.nullValidator]); 
    this.country = new FormControl('', [Validators.required]); 
    this.processingCountry = new FormControl('', [Validators.required]); 
    this.portOfLoading = new FormControl('', [Validators.required]); 
    this.hsCode = new FormControl('', [Validators.nullValidator]); 
    this.domesticFish = new FormControl(false, [Validators.required]); 
    this.comingSoon = new FormControl(false, [Validators.required]); 
    this.unitOfMeasurement = new FormControl('', [Validators.required]); 
    this.minOrder = new FormControl('', [Validators.required]); 
    this.maxOrder = new FormControl('', [Validators.required]); 
    this.perBoxes = new FormControl(false, [Validators.required]); 
    this.averageUnitWeight = new FormControl(10, [Validators.nullValidator]); 
    this.preparation = new FormControl('', [Validators.required]); 
    this.childPreparation = new FormControl('', [Validators.required]); 
    this.images = new FormControl('', Validators.nullValidator);
    this.imagesSend = new FormControl('', Validators.nullValidator);
    this.deletedImages = new FormControl('', Validators.nullValidator);
    this.price = new FormControl('', [Validators.required]); 

  }

  RegisterProductForm(){
    this.productForm = new FormGroup({
      name:this.name,
      brand: this.brand,
      category: this.category,
      specie: this.specie,
      subspecie: this.subspecie,
      subspecieVariant: this.subspecieVariant,
      raised: this.raised,
      treatment: this.treatment,
      sku: this.sku,
      country: this.country,
      processingCountry: this.processingCountry,
      portOfLoading: this.portOfLoading,
      hsCode: this.hsCode,
      domesticFish: this.domesticFish,
      comingSoon: this.comingSoon,
      unitOfMeasurement: this.unitOfMeasurement,
      minOrder:this.minOrder,
      maxOrder: this.maxOrder,
      perBoxes: this.perBoxes,
      averageUnitWeight: this.averageUnitWeight,
      preparation: this.preparation,
      childPreparation: this.childPreparation,
      images: this.images,
      imagesSend: this.imagesSend,
      deletedImages: this.deletedImages,
      price: this.price
    });
    this.productForm.controls['unitOfMeasurement'].disable();


  }

  submit(){
    console.log(this.productForm.value);
  if(this.productForm.valid){
    console.log("Valido");
    this.onSubmit();
  }else{
    console.log("Invalido");
    this.validateAllFormFields(this.productForm);
    this.showError("Please fix all required fields");
    this.scrollToError();
  }
  }


   //custom validation for each form field on DOM
   validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  } 

  //Show message error function
showError(e){
  this.toast.error(e,'Error',{positionClass:"toast-top-right"})
}

scrollTo(el: Element): void {
  if(el) { 
    console.log("el", el);
   el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

scrollToError(): void {
 let that:any = this;
setTimeout(function(){
  const firstElementWithError = document.querySelector('.is-invalid');
  console.log("HTMLElement", firstElementWithError);
  that.scrollTo(firstElementWithError);
 }, 500);


}

private getCountries() {
  this.countryService.getCountries().subscribe(
    result => {
      this.countries = result as any[];
    },
    error => {
      console.log(error);
    }
  );
}

private getCountriesWithShipping() {
  this.countryService.getCountriesWithShipping().subscribe(
    result => {
      if (result['message'] === 'ok') {
        this.countriesWithShipping = result['data'] as any[];
      }
    },
    error => {
      console.log(error);
    }
  );
}

private getAllCities() {
  this.countryService.getAllCities().subscribe(
    result => {
      this.allCities = result as any;
      this.cities = result as any;
    },
    error => {
      console.log(error);
    }
  );
}

public getCities() {
  let country = this.productForm.get('processingCountry').value;
  this.countryService.getCities(country).subscribe(
    result => {
      console.log(result);
      if ((result as any).length > 0 && result[0].cities) {
        this.cities = result[0].cities;
        if (this.cities.length > 0) {
          this.productForm.controls['portOfLoading'].setValue(result[0].cities[0]['code']);

        }
      } else {
        this.cities = [];
        this.productForm.controls['portOfLoading'].setValue("");

      }
    }
  );
}

private getMeasurements(){
  this.productService.getData("unitofmeasure").subscribe(res =>{
    console.log("UM", res);
    this.measurements = res;
  })
}
private reaised() {
  this.productService.getData("raised").subscribe(it => {
    this.raisedArray = it as any;
  });
}

private getTreatment() {
  this.productService.getData("treatment").subscribe(it => {
    this.treatments = it as any;
  });
}


onChanges(): void {
  this.productForm.valueChanges.subscribe(val => {
    console.log("cambiando..", val);
    if(val['perBoxes'] == true){
      this.showAverageUnit = true;
      if (val.averageUnitWeight > 0 && val.minOrder < val.averageUnitWeight) {
        // this.product
        val.minOrder = val.averageUnitWeight;
        this.productForm.controls['minOrder'].setValue(val.averageUnitWeight);  
      }
    }else{
      this.showAverageUnit = false;
    }

    if (val.unitOfMeasurement == 'lbs') {
      this.weightType = "Lbs"
    } else {
      this.weightType = "Kg";
    }

    if (val.imagesSend !== '' && this.imagesTmp.length === 0){
      this.imagesTmp = JSON.parse(val.imagesSend);

    }
    let min = Number(val.minOrder);
     let max = Number(val.maxOrder);
     if (min > 0 && max > 0) {
       this.options.floor = min;
       this.options.ceil = max;
       const newOptions: Options = Object.assign({}, this.options);
       newOptions.floor = min;
       newOptions.ceil = max;
       this.options = newOptions;
       this.exampleValues = {
         min: newOptions.floor,
         max: newOptions.ceil
       }; 
     }
     this.priceEnableChange = true;
     this.setOptionsInAll(true);


     if(this.waitChange3Seconds !== null) {
      clearTimeout(this.waitChange3Seconds);
      this.waitChange3Seconds = null;
    }
    this.waitChange3Seconds = setTimeout(it => {
      try {
        console.log(it);
        let min = Number(it.minimunorder);
        let max = Number(it.maximumorder);
        if (min > 0 && max > 0) {
          this.options.floor = min;
          this.options.ceil = max;
          const newOptions: Options = Object.assign({}, this.options);
          newOptions.floor = min;
          newOptions.ceil = max;
          this.options = newOptions;
          this.exampleValues = {
            min: newOptions.floor,
            max: newOptions.ceil
          };
          this.setOptionsInAll();
          this.refreshSlider();
        }
      }
      catch (e) {
        console.error(e);
      }
      this.waitChange3Seconds = null;
    }, 3000, val);
  });
}

getAllTypesByLevel() {
  this.productService.getData(`getTypeLevel`).subscribe(
    result => {
      console.log(result, "variant");
      this.typeLevel0 = result['level0'];
      if (this.productID !== "") {
        this.typeLevel1 = result['level1'];
        this.typeLevel2 = result['level2'];
        this.typeLevel3 = result['level3'];
      }
    },
    error => {

    }
  );
}


getOnChangeLevel(level: number, value?) {
  if (this.productForm.get('category').value === '') {
    // this.typeLevel0 = [];
    this.typeLevel1 = [];
    this.typeLevel2 = [];
    this.typeLevel3 = [];
    return;
  }
  let selectedType = '';
  switch (level) {
    case 0:
      selectedType = this.productForm.get('category').value;
      break;

    case 1:
      selectedType = this.productForm.get('specie').value;
      break;

    case 2:
      selectedType = this.productForm.get('subspecie').value;
      this.updateProcess(selectedType);
      break;

    default:
      selectedType = this.productForm.get('subspecieVariant').value;
      this.updateProcess(selectedType);
      break;
  }
  this.selectedType = selectedType;
  this.updateLevels(selectedType, level);
  
}

updateLevels(selectedType, level){
  this.productService.getData(`fishTypes/${selectedType}/ori_all_levels`).subscribe(
    result => {
      console.log("Resultado", result);
      result['childs'].map(item => {
        switch (item.level) {
          case 0:
            this.typeLevel0 = item.fishTypes;
            break;

          case 1:
            this.typeLevel1 = item.fishTypes;
            break;

          case 2:
            if (level > 0)
              this.typeLevel2 = item.fishTypes;
            break;

          case 3:
            if (level > 1)
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
  );
}

updateProcess(selectedType){
  this.productService.getData(`fishType/${selectedType}/setup`).subscribe(
    result => {
      console.log("Resultado", result);
      this.raisedArray = result['raisedInfo'];
      this.treatments = result['treatmentInfo'];
      this.productForm.controls['unitOfMeasurement'].setValue(result['unitOfMeasure']);
      if(result['fishPreparationInfo']){
        this.fishPreparation = result['fishPreparationInfo'];
      }else{
        this.fishPreparation = [];
      }
     
    },
    error => {
      console.log(error);
    }
  );
}

setvariations(){
  let fishp = this.productForm.get('preparation').value;
  this.productService.getData(`fishtype/${this.selectedType}/preparation/${fishp}/childs`).subscribe(res => {
    console.log("Childs", res);
    this.preparationChilds = res;
  })
}


getKgs(){
  let preparation = this.productForm.get('childPreparation').value;
  this.productService.getData(`fishvariations/type/${this.selectedType}/preparation/${preparation}`).subscribe(res  => {
      console.log("KGS", res);
      this.variationInfo = res['variationInfo'];
  });
}

public onFileChange(event, i?) {
  console.log(this.imagesTmp);
  if (event.target.files && event.target.files.length) {
    if (i !== undefined && i !== null) {
      let file = event.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imagesTmp[i] = { src: reader.result, type: this.imagesTmp[i].type };
        this.reSavedImages();
      };
    } else {
      for (let file of event.target.files) {
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          let type = this.imagesTmp.length === 0 ? "primary" : "secundary";
          this.imagesTmp.push({ src: reader.result, type });
          // let arr = JSON.parse( this.productForm.get('deletedImages').value);
          this.reSavedImages();
        };
      }
    }

  }
}

private reSavedImages() {
  let data = this.imagesTmp.length === 0 ? '' : JSON.stringify(this.imagesTmp);
  this.productForm.controls['imagesSend'].setValue(data);  
  if (this.imagesTmp.length === 0) this.resetFiles();
}

private resetFiles() {
  console.log(this.myInputVariable.nativeElement.files);
  this.myInputVariable.nativeElement.value = "";
  console.log(this.myInputVariable.nativeElement.files);
}

public toSl(to) {
  let limit = { min: (this.imagesTmp.length - 4) * -1, max: 0 };
  let index = JSON.parse(JSON.stringify({ ind: this.indexImage })).ind;
  if (to < 0) {
    index -= 1;
  } else {
    index += 1;
  }
  //verificamos que este entre los limites
  if (limit.min > index || limit.max < index) return;
  this.indexImage = index;
}

public inLimit(to) {
  let limit = { min: (this.imagesTmp.length - 4) * -1, max: 0 };
  let index = JSON.parse(JSON.stringify({ ind: this.indexImage })).ind;
  if (to < 0) {
    // index -= 1;
    // console.log("-1", limit.min < index, limit.min, index);
    return limit.min < index;
  } else {
    // index += 1;
    // console.log("1", limit.max > index, limit.max, index);
    return limit.max > index;
  }
}

public calcLeft(i) {
  if (this.indexImage === 0) return 0;
  let width = $(".col-3.img-select").width();
  if (this.indexImage < 0) {
    let minus = (this.indexImage) * width;
    return minus;
  }

  if (this.indexImage > 0) {
    let maxis = (this.indexImage) * width;
    return maxis;
  }

}

public byPassImageUrl(image) {
  return this.sanitizer.bypassSecurityTrustUrl(image);
}

pushTab(whole, $event){
  if($event.srcElement.checked === true){
    this.tabsArray.push(whole);
    console.log(this.tabsArray, $event);
    this.keySelect = whole.id;
  
    if(this.weights['keys'][this.keySelect] === undefined){
      this.weights['keys'][this.keySelect] = [{ min: this.options.floor, max: this.options.ceil, price: "", options: Object.assign({}, this.options) }];
  
    }
  
    console.log(this.weights);
  }else{

  }
  

 
}

public selectKey(k) {
  this.keySelect = k.id;
  console.log(this.weights, k);
  setTimeout(() => {
    this.refreshSlider();
    console.log(this.keySelect);
  }, 300);
}

private refreshSlider() {
  if (this.await_ === false) {
    this.await_ = true;
    setTimeout(() => {
      let r = {
        weights: JSON.stringify(this.weights)
      };
      this.productForm.controls['price'].setValue(r);  

      this.await_ = false;
    }, 500);
  }
  this.manualRefresh.emit();
  this.zone.run(function () { console.log("emit"); });
}

private setOptionsInAll(ignore?: boolean) {
  let itereOptions = function (it) {
    if (Object.prototype.toString.call(it) === '[object Object]') {
      if (ignore === true && it.min < this.options.floor) {
        it.min = this.options.floor;
        if (it.max < it.min) {
          it.max = it.min + 1;
        }
      }
      let op = Object.assign({}, this.options);
      console.log(op);
      it.options = op;
    }
    console.log(it);
    return it;
  };

  let keys = Object.keys(this.weights);
  for (let key of keys) {
    if(key === 'keys') continue;
    this.weights[key] = this.weights[key]
      .map(itereOptions.bind(this));
  }


}


public addPricing() {
  console.log( this.keySelect);
  let price = this.valueExample && this.valueExample.toString() !== "" && isNaN(this.valueExample) === false ? Number(this.valueExample) : "";
  console.log("Price", this.valueExample);
  let it = { min: this.exampleValues.min, max: this.exampleValues.max, price, options: this.options };
  let index = 0;
   if(this.weights[this.keySelect] == undefined){
     this.weights[this.keySelect] = [it];
   }else{
     this.weights[this.keySelect].push(it);
   }
    index = this.weights[this.keySelect].length;
  
  this.refactorizeRanges(index - 1);


  this.valueExample = 0;
  this.exampleValues = {
    min: this.options.floor,
    max: this.options.ceil
  };
  this.refreshSlider();
}

public refactorizeRanges(index) {
 
  let slides = [];
  slides = this.weights[this.keySelect];

 
  for (let i = index; i < slides.length; i++) {
    this.refactorizeRangesItere(i);
  }
  this.refreshSlider();
}

public refactorizeRangesItere(index) {
  //Si es para slides trim
  try {
    let newOptions: Options = Object.assign({}, this.options);
    this.options = newOptions;
    this.exampleValues = {
      min: newOptions.floor,
      max: newOptions.ceil
    };
    let range = {
      minLimit: 10,
      maxLimit: newOptions.ceil
    }
    let slides = [];
    slides = this.weights[this.keySelect];
    
    //Entonces calculamos el valor mas alto, para tomar desde ahi
    //el inicio de los demas slider
    let maxValue = 0;
    for (let i = 0; i < slides.length; i++) {
      let slide = slides[i];
      // if (index === 0) console.log(i, index, slide.max, maxValue, slide.max > maxValue);
      if (i === index || i > index) continue;
      if (slide.max > maxValue) maxValue = slide.max;
    }
    //ahora asignamos el mayor valor al slide
    range.minLimit = maxValue !== 0 ? maxValue + 1 : 0;
    range.minLimit = range.minLimit > newOptions.ceil ? newOptions.ceil : range.minLimit;
    let newOptions1 = Object.assign(range, newOptions);

    this.weights[this.keySelect][index].options = newOptions1;
    if (this.weights[this.keySelect][index].min < range.minLimit)
        this.weights[this.keySelect][index].min = range.minLimit;
   

  }
  catch (e) {
    console.error(e);
  }
}


public deletePrice(headAction, i) {
    if (this.productID !== "" &&
      this.weights[this.keySelect][i].id !== null &&
      this.weights[this.keySelect][i].id !== undefined
    ) {
     
      this.pricesDeleted.push(this.weights[this.keySelect][i].id);
     
    }
    if (this.weights[this.keySelect].length === 1) {
      this.weights[this.keySelect] = [];
    } else {
      this.weights[this.keySelect].splice(i, 1);
    }
  
  

  this.refreshSlider();
}

async onSubmit() {
      console.log(this.productForm.value);
      console.log("Weights", this.weights);
      const value = this.productForm.value;
      let product:any = {};

      product.speciesSelected = value.specie;
      product.category =  value.category;
      // Para checkar si hay imagenes
      if (value.imagesSend === '') {
        // this.loading = false;
        // this.ngProgress.done();
        return this.toast.error('Add the images of your product', 'Error', { positionClass: 'toast-top-right' });
      } else {
        const imagesSend = JSON.parse(value.imagesSend);
        if (imagesSend.length === 0) {
          // this.loading = false;
          // this.ngProgress.done();
          return this.toast.error('Add the images of your product', 'Error', { positionClass: 'toast-top-right' });
        }
      }
      // Para checkar si hay imagen default
      if (this.imagesTmp.length > 0) {
        const images = JSON.parse(value.imagesSend);
        const index = images.findIndex(it => {
          return it.type === 'primary';
        });
        if (index === -1) {
          // this.loading = false;
          // this.ngProgress.done();
          return this.toast.error('Select a default image', 'Error', { positionClass: 'toast-top-right' });
        }
      }
     
      let variations: any = JSON.parse( JSON.stringify(this.weights) );
      delete variations.keys;
      let variationsEnd:any = [];

      console.log("keys", Object.keys(variations));


      // Para quitar las options
      const itereOptions = it => {
        delete it.options;
        return it;
      };

        let fishPreparation = value.preparation;
        if (variations && Object.keys(variations).length > 0) {
          
          for (const it of Object.keys(variations)) {
            const wholeFishWeight = it;
            console.log("wholefish", wholeFishWeight);
            const itr = {
              fishPreparation,
              wholeFishWeight,
              prices: variations[it].map(itereOptions)
            };
            variationsEnd.push(itr);
          }
        }

      if (variationsEnd.length === 0) {
        // this.loading = false;
        // this.ngProgress.done();
        return this.toast.error('You have to add at least one price', 'Error', { positionClass: 'toast-top-right' });
      }

      // this.ngProgress.start();
      // let priceAED = Number(features.price).toFixed(2);
      const data: any = {
        parentType: value.category,
        "specie": value.specie,
        'type': value.subspecie,
        'descriptor': value.subspecieVariant === '' ? null : value.subspecieVariant,
        'store': this.store[0].id,
        'quality': 'good',
        'name': value.name,
        'description': '',
        'country': value.country,
        'processingCountry': value.processingCountry,
        'city': value.portOfLoading,
        'weight': {
          'type': "kg",
          'value': 5
        },
        "foreign_fish": value.domesticFish,
        'perBox': value.perBoxes,
        'perBoxes': value.perBoxes,
        'unitOfSale': value.unitOfMeasurement,
        'boxWeight': value.unitOfMeasurement == 'lbs' ? value.averageUnitWeight / 2.205 : value.averageUnitWeight,
        'minimumOrder': value.unitOfMeasurement == 'lbs' ? value.minOrder / 2.205 : value.minOrder,
        'maximumOrder': value.unitOfMeasurement == 'lbs' ? value.maxOrder / 2.205 : value.maxOrder,
        // "acceptableSpoilageRate": features.acceptableSpoilageRate,
        'raised': value.raised,
        'treatment': value.treatment,
        'seller_sku': value.sku,
        'seafood_sku': '',
        'mortalityRate': 1,
        'waterLostRate': '0',
        'status': this.user['role'] !== 0 ? '5c0866e4a0eda00b94acbdc0' : product.status,
        'brandName': value.brand,
        'hsCode': value.hsCode,
        variations: variationsEnd,
        'role': this.user['role'],
        cooming_soon: value.comingSoon,
      };
      if (this.productID !== "") {
        data.idProduct = this.product.id;
      }
      console.log(data);
    
      if (this.productID !== "") {
        this.productService.updateData('api/variations', data).subscribe(result => {
          this.uploadImagesAction(value, result);
        }, err => {
          // this.loading = false;
          // this.ngProgress.done();
          this.toast.error('Error when saving the product returns try', 'Error', { positionClass: 'toast-top-right' });
        });
      }else{
        this.productService.saveData('api/variations/add', data).subscribe(result => {
          this.uploadImagesAction(value, result);
        }, err => {
          // this.showError = false;
          // this.loading = false;
          // this.ngProgress.done();
          this.toast.error('Error when saving the product returns try', 'Error', { positionClass: 'toast-top-right' });
        });

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
  // this.showError = false;
  // this.loading = false;
  // this.ngProgress.done();
  this.productForm.reset();
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
