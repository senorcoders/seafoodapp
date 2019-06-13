import { Component, OnInit, NgZone, ViewChild, ElementRef, Input  } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormGroup, FormControl, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { ProductService } from '../../services/product.service';
import { NgClass, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from '../../toast.service';
import { AuthenticationService } from '../../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'fish-form',
  templateUrl: './fish-form.component.html',
  styleUrls: ['./fish-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [NgClass, NgIf]
})
export class FishFormComponent implements OnInit {
  private eventSellerSelected: any;
  @Input() seller: Observable<void>;
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  sellerInfo: any;
  
  @ViewChild('myInput', { static: true })
  myInputVariable: ElementRef;
  public product: FormGroup;
  public countries = [];
  public countriesWithShipping = [];
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

  public preparationOptions: any[] = [
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
  public user: any = { role: 0 };

  //for features
  features;
  public wholeFishAction = true;
  public wholeFishs = [];
  public raised = [];
  public head = "on";
  // public preparationOptions = [];
  public fishPreparation = [];
  public typesModal = [];
  public defaultTrimming = [];
  // public hideTrimModal = true;
  public partsModal = [];
  public trimmingsModal = [];
  public store: any;
  public storeEndpoint = 'api/store/user/';
  public info: any;
  public existStore = true;
  public ProcessingParts = [];
  // public trimmings = [];
  private identifier = "_arr";
  public treatments = [];
public staticmin:number = 1;
weightType:any = 'Kg';
  constructor(public parentForm: FormGroupDirective, private countryService: CountriesService,
    private productService: ProductService, private zone: NgZone,
    private route: ActivatedRoute, private sanitizer: DomSanitizer,
    private toast: ToastrService, private auth: AuthenticationService
  ) {
    let productID = this.route.snapshot.params['id'];
    if (productID !== null && productID !== undefined) {
      this.productID = productID;
    }
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe( (sellerInfo) => {
      console.log('lololol', sellerInfo);
      this.sellerInfo = sellerInfo;
      this.getStore();
    } );
    this.createFormGroup();
    this.getCountries();
    this.getCountriesWithShipping();
    this.getAllCities();
    this.getAllTypesByLevel();

    //For features
    this.createFormGroupFeatures();
    this.getMyData();
    this.getFishPreparation();
    this.getwholeFishWeight();
    this.reaised();
    this.getParts();
    this.getTrimmingModal();
    
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
      subSpeciesSelected: new FormControl('', Validators.nullValidator),
      descriptorSelected: new FormControl('', Validators.nullValidator),
      seller_sku: new FormControl('', Validators.nullValidator),
      hsCode: new FormControl('', Validators.nullValidator),
      minimunorder: new FormControl('', Validators.required),
      maximumorder: new FormControl('', Validators.required),
      images: new FormControl('', Validators.nullValidator),
      imagesSend: new FormControl("", Validators.nullValidator),
      unitOfSale: new FormControl("", Validators.required),
      perBoxes: new FormControl(false, Validators.nullValidator),
      averageUnitWeight: new FormControl(10, Validators.required),
      deletedImages: new FormControl("[]", Validators.nullValidator),
      //features
      headOffWeight: new FormControl('0-1kg', Validators.required),
      headOnWeight: new FormControl('0-1kg', Validators.required),
      acceptableSpoilageRate: new FormControl('', Validators.nullValidator),
      raised: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
      // preparation: new FormControl("", Validators.required),
      head: new FormControl(this.head, Validators.required),
      wholeFishAction: new FormControl(this.wholeFishAction, Validators.required),
      // price: new FormControl('0', Validators.required),
      priceShow: new FormControl(true, Validators.nullValidator),
      foreignfish: new FormControl(false, Validators.required)
    }));

    (this.parentForm.form.controls.product as FormGroup).valueChanges.subscribe(it => {
      console.log("product", it);
      if (it.perBoxes === true) {
        this.showAverageUnit = true;
        if(it.averageUnitWeight > 0 && it.minimunorder < it.averageUnitWeight){
          this.product
          it.minimunorder = it.averageUnitWeight;
          this.controls().minimunorder.setValue(it.averageUnitWeight);
        }

      } else {
        this.showAverageUnit = false;
      }

      if(it.unitOfSale == 'lbs'){
        this.weightType = "Lbs"
      }else{
        this.weightType = "Kg";
      }
      if (it.imagesSend !== '' && this.images.length === 0)
        this.images = JSON.parse(it.imagesSend);

      //Features
      if (it.speciesSelected !== undefined && it.speciesSelected !== null) {
        if (it.speciesSelected === '5bda361c78b3140ef5d31fa4') {
          this.hideTrimModal = false;
        } else {
          this.hideTrimModal = true;
        }
      }

      this.wholeFishAction = it.wholeFishAction;
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
            let arr = JSON.parse(this.getValue().deletedImages);
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
    this.indexImage = 0;
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

  public async setDefaultImage(i) {
    //Buscamos la imagen primary anterior para ponerle un change y la guarde
    let indexPrimary = this.images.findIndex(it => {
      return it.type === "primary";
    });
    for (let k = 0; k < this.images.length; k++) {
      this.images[k].type = "secundary";
    }
    this.images[i].type = "primary";

    //agrego la imagen a deletedImages
    //pero solo cuando se esta actualizando un producto y tiene url
    //y no es la imagen default initial
    let indexRepeat = 0, arr = JSON.parse(this.getValue().deletedImages);
    console.log(this.images[i].url !== undefined, this.images[i].url !== null, this.images[i].defaultInial !== true, this.images[i]);
    if (this.productID !== "" &&
      this.images[i].url !== undefined && this.images[i].url !== null &&
      this.images[i].defaultInial !== true) {
      indexRepeat = arr.findIndex(it => {
        return it === this.images[i].url;
      });
      console.log("indexRepeat", indexRepeat);
      if (indexRepeat === -1) arr.push(this.images[i].url);

    }

    //buscamos si la imagen default anterior estaba en lista de borrar
    //si esta la sacamos porque ahora sera secundary como antes
    indexRepeat = arr.findIndex(it => {
      return it === this.images[indexPrimary].url;
    });
    if (indexRepeat !== -1) {
      if (arr.length > 1)
        arr.splice(indexRepeat, 1);
      else
        arr = [];
    }
    this.setValue({ deletedImages: JSON.stringify(arr) });

    if (indexPrimary !== -1 && this.images[indexPrimary].defaultInial === true) {
      delete this.images[indexPrimary].url;
      this.images[indexPrimary].change = true;
    }
    console.log(arr, this.images.map((it, i) => {
      it = JSON.parse(JSON.stringify(it));
      delete it.src;
      it.i = i;
      return it;
    }));
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

  public inLimit(to) {
    let limit = { min: (this.images.length - 4) * -1, max: 0 };
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

  //#region fish features

  getMyData() {
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getWholes() {
    this.productService.getData("wholefishweight").subscribe(it => {

    });
  }

  getStore() {
    console.log( 'role', this.info['role'] );
    if( this.info !== undefined && this.sellerInfo !== undefined && this.info['role'] == 0 )
      this.info.id = this.sellerInfo.id;

    if( this.info !== undefined ) {
      this.productService.getData(this.storeEndpoint + this.info.id).subscribe(results => {
        this.store = results;
        console.log( 'store', results );
        this.getTrimmingByStore();
        this.getParts();
        this.getProcessingParts();
        if (this.store.length < 1) {
          this.existStore = false;
        }
      });
    }
    
  }

  getFishPreparation() {
    this.productService.getData('fishpreparation').subscribe(results => {
      let arr = results as any[];
      arr = arr.filter(it => {
        return !it.isTrimming;
      });
      this.fishPreparation = arr;
      this.preparationOptions = arr;
      this.setValue({ preparation: this.preparationOptions[0].id });
      this.getTrimming();
    });
  }

  getProcessingParts() {
    if( this.store[0] !== undefined ) {
      this.productService.getData('storeTrimming/store/' + this.store[0].id).subscribe(
        res => {
          this.ProcessingParts = res as any;
        },
        e => {
          console.log(e);
        }
      );
    }    
  }

  private createFormGroupFeatures() {
    // this.features = this.parentForm.form;
    // this.features.addControl('features', new FormGroup({
    //   headOffWeight: new FormControl('0-1kg', Validators.required),
    //   headOnWeight: new FormControl('0-1kg', Validators.required),
    //   acceptableSpoilageRate: new FormControl('', Validators.nullValidator),
    //   raised: new FormControl('', Validators.required),
    //   treatment: new FormControl('', Validators.required),
    //   // preparation: new FormControl("", Validators.required),
    //   head: new FormControl(this.head, Validators.required),
    //   wholeFishAction: new FormControl(this.wholeFishAction, Validators.required),
    //   // price: new FormControl('0', Validators.required),
    //   priceShow: new FormControl(true, Validators.nullValidator)
    // }));

    // this.parentForm.form.controls.product.valueChanges.subscribe(it => {


    // });

    // this.parentForm.form.controls.features.valueChanges.subscribe(it => {
    //   this.wholeFishAction = it.wholeFishAction;
    // });

    // this.checkPriceForm();
  }

  private getwholeFishWeight() {
    this.productService.getData("wholefishweight").subscribe(it => {
      this.wholeFishs = it as any;
      this.setValue({ headOffWeight: this.wholeFishs[0].id, headOnWeight: this.wholeFishs[0].id })
      console.log("wholefishweight", it);
    });
    this.productService.getData("treatment").subscribe(it => {
      this.treatments = it as any;
      console.log(it);
    });
  }

  public getTrimming() {
    this.productService.getData('trimmingtype').subscribe(
      res => {
        const data = res as any[];
        this.trimmings = this.fishPreparation.concat(data);
      },
      e => {
        console.log(e);
      }
    );
  }

  private reaised() {
    this.productService.getData("raised").subscribe(it => {
      this.raised = it as any;
    });
  }

  public controlsFeatures() {
    return (this.parentForm.form.controls.features as FormGroup).controls;
  }

  public assignHead(head) {
    if (this.head === 'both') {
      // this.head = head;
      if (head === 'off') this.head = 'on';
      else if (head === 'on') this.head = 'off';
    } else if (this.head !== head) {
      this.head = 'both';
    } else if (this.head === head) {
      if (head === 'off') this.head = 'on';
      else if (head === 'on') this.head = 'off';
    }
    let priceShow = this.head !== 'both';
    this.setValue({ head: this.head, priceShow });
  }

  public assingWholeFish(re) {
    let disable = this.controls().acceptableSpoilageRate.disabled;
    console.log("disable", disable);
    if (disable !== true) {
      this.wholeFishAction = re;
      this.setValue({ wholeFishAction: this.wholeFishAction });
    }
  }

  private setValueFeatures(value) {
    this.parentForm.form.patchValue({ features: value })
  }

  getTrimmingModal() {
    this.productService.getData('trimmingtype').subscribe(
      result => {
        this.typesModal = result as any;
        let data: any = result;

        console.log("Trimming Types", result);
        data.forEach(result => {
          if (result.defaultProccessingParts && result.defaultProccessingParts.length > 1) {
            result.defaultProccessingParts.forEach(res2 => {
              this.defaultTrimming.push({ trim: result.name, name: res2 })
            })
          }
          else {
            this.defaultTrimming.push({ trim: result.name, name: result.defaultProccessingParts })
          }
        })
      },
      e => {
        console.log(e)
      }
    )
  }

  getParts() {
    this.productService.getData('processingParts').subscribe(
      result => {
        this.partsModal = result as any;
      },
      e => {
        console.log(e)
      }
    )
  }

  private getTrimmingByStore() {
    if( this.store[0] !== undefined ) {
      this.productService.getData('storeTrimming/store/' + this.store[0].id).subscribe(
        result => {
          this.trimmingsModal = result as any;
        },
        e => {
          console.log(e)
        }
      )
    }
  }

  public isDefault(part, trim) {
    let data;
    // console.log("isDefault", part, trim, this.trimmingsModal);
    this.trimmingsModal.forEach(res => {
      if (res.type.length > 0) {
        if (trim == res.type[0].name) {
          if (res.type[0].defaultProccessingParts && res.type[0].defaultProccessingParts.includes(part)) {
            data = true
          }
          else {
            data = false
          }
        }
      }
    })
    return data
  }

  public isChecked(part, trim) {
    let data
    this.trimmingsModal.forEach(res => {
      if (res.type.length > 0) {

        if (trim == res.type[0].name) {
          if (res.type[0].defaultProccessingParts && res.type[0].defaultProccessingParts.includes(part) || (res.processingParts && res.processingParts.name == part)) {
            data = true
          }
        }
      }
    })
    return data
  }

  public checked(event, type, part) {
    let id;
    this.trimmingsModal.forEach(res => {
      if (type == res.trimmingType) {
        if (part == res.processingParts.id) {
          id = res.id
        }
      }
    })
    if (event.target.checked) {
      this.saveData(type, part);
    }
    else {
      this.delete(id)
    }
  }

  private saveData(types, parts) {
    let data = {
      "processingParts": parts,
      "store": this.store[0].id,
      "trimmingType": types
    }
    this.productService.saveData('storeTrimming', data).subscribe(
      res => {
        this.toast.success("Trimmings Saved!", 'Well Done', { positionClass: "toast-top-right" })

        this.getTrimmingByStore();
      },
      e => {
        this.toast.error("Please try again", 'Error', { positionClass: "toast-top-right" })
        console.log(e)
      }
    )
  }

  private delete(id) {
    this.productService.deleteData('storeTrimming/' + id).subscribe(
      res => {
        this.toast.success("Trimmings Deleted!", 'Well Done', { positionClass: "toast-top-right" })
        this.getTrimmingByStore();
      },
      e => {
        this.toast.error("Please try again", 'Error', { positionClass: "toast-top-right" })
        console.log(e)
      }
    )
  }

  //#endregion

}
