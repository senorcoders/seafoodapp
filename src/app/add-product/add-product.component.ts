import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { CountriesService } from '../services/countries.service';
import { ProductService } from '../services/product.service';
declare var jQuery: any;
@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
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
  images:any = [];
  averageUnitWeight: FormControl;
  countries:any = [];
  countriesWithShipping:any = [];
  public cities = [];
  public allCities = [];
  raisedArray:any = [];
  treatments:any = [];
 
  constructor(private toast:ToastrService, private countryService: CountriesService,
    private productService: ProductService) {}
  ngOnInit() {
    this.createFormControl();
    this.RegisterProductForm();
    this.onChanges();
    this.getCountries();
    this.getCountriesWithShipping();
    this.reaised();
    this.getTreatment();
    this.getAllCities();
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
    this.averageUnitWeight = new FormControl('', [Validators.nullValidator]); 



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
      averageUnitWeight: this.averageUnitWeight
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
  });
}

}
