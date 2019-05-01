import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormGroup, FormControl, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { ProductService } from '../../services/product.service';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'fish-form',
  templateUrl: './fish-form.component.html',
  styleUrls: ['./fish-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [NgClass, NgIf]
})
export class FishFormComponent implements OnInit {

  @ViewChild('myInput')
  myInputVariable: ElementRef;
  public product: FormGroup;
  public countries = [];
  public cities = [];
  public allCities = [];
  public hideTrimModal = true;
  price25 = 0;
  price100 = 0;
  price500 = 0;
  price1000 = 0;
  public deliveredPrices = [25, 100, 500, 1000];

  public typeLevel0 = [];
  public typeLevel1 = [];
  public typeLevel2 = [];
  public typeLevel3 = [];

  public preparationOptions = [
    'Head On Gutted',
    'Head Off Gutted',
    'Filleted'
  ];
  public trimmings = [];
  public showWholeOptions = false;

  public images = [];

  public showAverageUnit = false;
  private levels: any;
  private productID = "";
  private indexImage = 0;

  constructor(public parentForm: FormGroupDirective, private countryService: CountriesService,
    private productService: ProductService, private zone: NgZone,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    let productID = this.route.snapshot.params['id'];
    if (productID !== null && productID !== undefined) this.productID = productID;
  }

  ngOnInit() {
    this.createFormGroup();
    this.getCountries();
    this.getAllCities();
    this.getAllTypesByLevel();
  }

  private createFormGroup() {
    this.product = this.parentForm.form;
    this.product.addControl('product', new FormGroup({
      name: new FormControl('', Validators.required),
      brandName: new FormControl('', Validators.nullValidator),
      country: new FormControl('', Validators.required),
      processingCountry: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      kg: new FormControl('', Validators.nullValidator),
      parentSelectedType: new FormControl('', Validators.required),
      speciesSelected: new FormControl('', Validators.required),
      subSpeciesSelected: new FormControl('', Validators.required),
      descriptorSelected: new FormControl('', Validators.nullValidator),
      seller_sku: new FormControl('', Validators.nullValidator),
      hsCode: new FormControl('', Validators.nullValidator),
      minimunorder: new FormControl('', Validators.required),
      maximumorder: new FormControl('', Validators.required),
      images: new FormControl('', Validators.nullValidator),
      imagesSend: new FormControl("", Validators.required),
      unitOfSale: new FormControl("", Validators.required),
      averageUnitWeight: new FormControl(10, Validators.required),
      deletedImages: new FormControl("[]", Validators.nullValidator)
    }));
    (this.parentForm.form.controls.product as FormGroup).valueChanges.subscribe(it => {
      console.log(it);
      if (it.unitOfSale === "boxes") {
        this.showAverageUnit = true;
      } else {
        this.showAverageUnit = false;
      }
      if (it.imagesSend !== '' && this.images.length === 0)
        this.images = JSON.parse(it.imagesSend);
    });
  }

  public byPassImageUrl(image) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }

  public controls() {
    return (this.parentForm.form.controls.product as FormGroup).controls;
  }

  public isInvalid(name) {
    let control = this.controls()[name];
    // console.log(control, control.invalid && (control.dirty || control.touched));
    return control.invalid && (control.dirty || control.touched);
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
    let country = this.getValue().processingCountry;
    this.countryService.getCities(country).subscribe(
      result => {
        console.log(result);
        if ((result as any).length > 0 && result[0].cities) {
          this.cities = result[0].cities;
          if (this.cities.length > 0) {
            this.setValue({ city: result[0].cities[0]['code'] });
          }
        } else {
          this.cities = [];
          this.setValue({ city: "" });
        }
      }
    );
  }

  public getDeliveredPrice(val, qty) {
    // const data = {
    //   'cities': val,
    //   'weight': qty
    // };
    // this.productService.saveData('shippingRates/bycity', data).subscribe(res => {
    //   if (qty === 25) {

    //     (res == 0) ? this.price25 = this.price.value : this.price25 = res;
    //   } else if (qty === 100) {
    //     (res == 0) ? this.price100 = this.price.value : this.price100 = res;
    //   } else if (qty === 500) {
    //     (res == 0) ? this.price500 = this.price.value : this.price500 = res;
    //   } else if (qty === 1000) {
    //     (res == 0) ? this.price1000 = this.price.value : this.price1000 = res;
    //   }
    // });
  }

  public onCityChange(): void {

    this.deliveredPrices.forEach(element => {
      let city = this.getValue().city;
      this.getDeliveredPrice(city, element);
    });

  }

  public onChanges(): void {
    this.product.valueChanges.subscribe(val => {
      if (val.speciesSelected === '5bda361c78b3140ef5d31fa4') {
        this.hideTrimModal = false;
      }

      if (val.price != "" && val.city != null) {

        this.onCityChange();
      }
      else if (val.price != "" && val.city == null) {
        this.price25 = val.price;
        this.price100 = val.price;
        this.price500 = val.price;
        this.price1000 = val.price;
      }
    });
  }

  getAllTypesByLevel() {
    this.productService.getData(`getTypeLevel`).subscribe(
      result => {
        console.log(result, "variant");
        this.levels = result;
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
    if (this.getValue().parentSelectedType === '') {
      // this.typeLevel0 = [];
      this.typeLevel1 = [];
      this.typeLevel2 = [];
      this.typeLevel3 = [];
      return;
    }
    let selectedType = '';
    switch (level) {
      case 0:
        selectedType = this.getValue().parentSelectedType;
        break;

      case 1:
        selectedType = this.getValue().speciesSelected;
        if (value === '5bda361c78b3140ef5d31fa4') {
          this.preparationOptions = this.trimmings;
          this.showWholeOptions = true;
          // this.myform.controls['preparation'].setValue(this.preparationOptions[0]);

        } else {
          this.preparationOptions = [
            'Filleted',
            'Head On Gutted',
            'Head Off Gutted '
          ];
          // this.myform.controls['preparation'].setValue(this.preparationOptions[0]);

        }
        break;

      case 3:
        selectedType = this.getValue().subSpeciesSelected;
        break;

      default:
        selectedType = this.getValue().subSpeciesSelected;
        break;
    }
    this.productService.getData(`fishTypes/${selectedType}/ori_all_levels`).subscribe(
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

  private getValue() {
    return this.parentForm.form.value.product;
  }

  private setValue(value) {
    this.parentForm.form.patchValue({ product: value })
  }

  public onFileChange(event, i?) {

    if (event.target.files && event.target.files.length) {
      if (i !== undefined && i !== null) {
        let file = event.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => {
          this.images[i] = { src: reader.result, type: this.images[i].type };
          this.reSavedImages();
        };
      } else {
        for (let file of event.target.files) {
          let reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = () => {
            let type = this.images.length === 0 ? "primary" : "secundary";
            this.images.push({ src: reader.result, type });
            this.reSavedImages();
          };
        }
      }

    }
  }

  public remove(i) {
    if (this.images[i].url !== undefined && this.images[i].url !== null) {
      let arr = JSON.parse(this.getValue().deletedImages);
      arr.push(this.images[i].url);
      this.setValue({ deletedImages: JSON.stringify(arr) });
    }
    if (this.images.length === 1) {
      this.images = [];
    } else {
      this.images.splice(i, 1);
    }
    this.indexImage = this.images.length === 0 ? 0 : (this.images.length - 4) * -1;
    this.reSavedImages();
  }


  public change(i) {
    let input = document.createElement("input");
    input.setAttribute("hidden", "");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "");
    input.setAttribute("class", "form-control");
    input.onchange = event => this.onFileChange(event, i);
    input.click();
  }

  private reSavedImages() {
    this.setValue({
      imagesSend: this.images.length === 0 ? '' : JSON.stringify(this.images)
    });
    if (this.images.length === 0) this.resetFiles();
  }

  public setDefaultImage(i) {
    for (let i = 0; i < this.images.length; i++) {
      this.images[i].type = "secundary";
    }
    this.images[i].type = "primary";
    this.reSavedImages();
  }

  private resetFiles() {
    console.log(this.myInputVariable.nativeElement.files);
    this.myInputVariable.nativeElement.value = "";
    console.log(this.myInputVariable.nativeElement.files);
  }

  public toSl(to) {
    let limit = { min: (this.images.length - 4) * -1, max: 0 };
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

}
