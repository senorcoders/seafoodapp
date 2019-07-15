import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { CountriesService } from '../services/countries.service';
import { ProductService } from '../services/product.service';
import { DomSanitizer } from '@angular/platform-browser';
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

  constructor(private toast:ToastrService, private countryService: CountriesService,
    private productService: ProductService, private sanitizer: DomSanitizer) {}
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
      deletedImages: this.deletedImages
    });

  }

  submit(){
    console.log(this.productForm.value);
  if(this.productForm.valid){
    console.log("Valido");
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
      break;

    default:
      selectedType = this.productForm.get('subspecieVariant').value;
      break;
  }
  this.updateLevels(selectedType, level);
  this.updateProcess(selectedType);
  
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
  let mainCat = this.productForm.get('category').value;
  let fishp = this.productForm.get('preparation').value;
  this.productService.getData(`fishtype/${mainCat}/preparation/${fishp}/childs`).subscribe(res => {
    console.log("Childs", res);
    this.preparationChilds = res;
  })
}


getKgs(){
  let cat = this.productForm.get('category').value;
  let preparation = this.productForm.get('childPreparation').value;
  this.productService.getData(`fishvariations/type/${cat}/preparation/${preparation}`).subscribe(res  => {
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
}
