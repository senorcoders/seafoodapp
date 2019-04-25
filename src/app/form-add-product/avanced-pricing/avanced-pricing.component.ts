import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormControl, Validators, FormGroup, FormArray, RequiredValidator } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Options } from 'ng5-slider';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'avanced-pricing',
  templateUrl: './avanced-pricing.component.html',
  styleUrls: ['./avanced-pricing.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [NgClass, NgIf]
})
export class AvancedPricingComponent implements OnInit {

  price;
  private await_ = false;
  public headAction = true;
  public head = 'on';
  public weights: any = { on: { keys: [] }, off: { keys: [] } };
  public kgNames = {
    kg01: '0-1 KG',
    kg12: '1-2 KG',
    kg23: '2-3 KG',
    kg34: '3-4 KG',
    kg45: '4-5 KG',
    kg56: '5-6 KG',
    kg67: '6-7 KG',
    kg78: '7-8 KG',
    kg8m: '8+ KG',
    kg01_off: '0-1 KG',
    kg12_off: '1-2 KG',
    kg23_off: '2-3 KG',
    kg34_off: '3-4 KG',
    kg45_off: '4-5 KG',
    kg56_off: '5-6 KG',
    kg67_off: '6-7 KG',
    kg78_off: '7-8 KG',
    kg8m_off: '8+ KG',
  };
  public wholesFish: any[] = [];
  public keySelect = '';
  public options: Options = {
    floor: 0,
    ceil: 0,
    step: 1,
    noSwitching: true
  };
  public showPricingValue = false;
  public valueExample: number;
  public exampleValues = {
    min: 0,
    max: 1
  };
  public manualRefresh: EventEmitter<void> = new EventEmitter<void>();
  private priceEnableChange = true;
  public identifier = "_arr";

  public hideTrimesSlides = true;
  public trimmings = [];
  public keySelectTrim = "";
  public trimWeights: any = {};
  public wholeFishAction = true;
  public identifierTrim = "_trim";

  constructor(
    public parentForm: FormGroupDirective,
    private productService: ProductService,
    public zone: NgZone
  ) { }

  ngOnInit() {
    this.createFormGroup();
    this.productService.getData("wholefishweight").subscribe(its => {
      let wholes = its as any[];
      //Agregamos los wholes antes
      for (let i of wholes) {
        (this.parentForm.form.controls.price as FormGroup).addControl(i.id, new FormControl(false, Validators.nullValidator));
      }
      for (let i of wholes) {
        (this.parentForm.form.controls.price as FormGroup).addControl(i.id + "_off", new FormControl(false, Validators.nullValidator));
      }
      this.wholesFish = its as any;
    });
    this.getTrimming();
  }

  private createFormGroup() {

    this.price = this.parentForm.form;
    this.price.addControl('price', new FormGroup({
      headAction: new FormControl(this.headAction, Validators.required),
      weights: new FormControl('', Validators.nullValidator),
      weightsTrim: new FormControl('', Validators.nullValidator),
      example: new FormControl('', Validators.nullValidator)
    }));

    //Para conocer el maximo y minimo del product
    this.parentForm.form.controls.product.valueChanges.subscribe(it => {
      //Para elegir los slides que se muestran si es salmon o no
      if (it.speciesSelected === '5bda361c78b3140ef5d31fa4') {
        this.hideTrimesSlides = false;
      } else {
        this.hideTrimesSlides = true;
      }

      //Para asinar el maximo y minimo de slides
      try {
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
    });


    //Para detectar los cambios en los checkboxs
    this.parentForm.form.controls.price.valueChanges.subscribe(it => {
      //cuando se agregan contoles de slide al formuario
      //Crea un bucle sin fin de cambios
      if (this.priceEnableChange === true) {
        //Para que los controles que se agreguen no probocen el bucle
        this.priceEnableChange = false;

        //Para ver si son trimmings
        if (this.hideTrimesSlides === false && this.wholeFishAction === false) {
          this.proccessWeightsTrim();
        } else {
          //El usuario tiene seleccionado el head on
          if (this.headAction === true) {
            this.weights.on = this.proccessWeights(this.weights.on, it);
          } else {
            this.weights.off = this.proccessWeights(this.weights.off, it);
          }
          //si hay mas de un pricing seleccionado
          if (this.weights.on.keys.length > 1 || this.weights.off.keys.length > 1)
            this.setValueFeatures({ priceShow: false });
          else if (this.head !== 'both')
            this.setValueFeatures({ priceShow: true });
        }

        this.refreshSlider();
      }

    });

    //Para mostrar el advance pricing
    this.parentForm.form.controls.features.valueChanges.subscribe(it => {
      this.head = it.head;
      if (it.head === 'both') {
        if (this.showPricingValue === false) this.showPricingValue = true;
      } else if (it.head === 'on') {
        this.deletePrices(false);
        this.assingHead(true);
      } else if (it.head === 'off') {
        this.deletePrices(true);
        this.assingHead(false);
      }

      this.wholeFishAction = it.wholeFishAction;
    });
  }

  private getTrimming() {
    this.productService.getData('trimmingtype').subscribe(
      res => {
        this.trimmings = res as any;
        for (let i of this.trimmings) {
          (this.parentForm.form.controls.price as FormGroup).addControl(i.id, new FormControl(false, Validators.nullValidator));
        }
      },
      e => {
        console.log(e);
      }
    );
  }

  private setOptionsInAll() {
    let itereOptions = function (it) {
      if (Object.prototype.toString.call(it) === '[object Object]') {
        if (it.min < this.options.floor) {
          it.min = this.options.floor;
          if (it.max < it.min) {
            it.max = it.min + 1;
          }
        }
        let op = Object.assign({}, this.options);
        // console.log(op);
        it.options = op;
      }
      console.log(it);
      return it;
    };

    let keys = Object.keys(this.weights.on);
    for (let key of keys) {
      this.weights.on[key] = this.weights.on[key]
        .map(itereOptions.bind(this));
    }

    keys = Object.keys(this.weights.off);
    for (let key of keys) {
      this.weights.off[key] = this.weights.off[key]
        .map(itereOptions.bind(this));
    }

    //Para los trimmings
    keys = this.trimmings.map(it => { return it.id; });
    keys = keys.filter(it => {
      return this.getValue()[it];
    });
    for (let key of keys) {
      this.trimWeights[key] = this.trimWeights[key]
        .map(itereOptions.bind(this));
    }

  }

  public getNameWhole(id) {
    try {
      if (id.includes("_off") === true) {
        id = id.replace("_off", "");
      }
      return this.wholesFish.find(it => {
        return it.id === id;
      }).name;
    }
    catch (e) {
      console.error(e);
      return "";
    }
  }

  private proccessWeights(data, weights) {
    let keys = Object.keys(weights);
    keys = keys.filter(it => {
      if (
        it === 'headAction' ||
        it === 'weights' ||
        it === 'example' ||
        it === "weightsTrim" ||
        it.includes(this.identifier) === true
      ) return false;
      if (this.headAction === true) {
        if (it.includes('_off') === true) return false;
        else return weights[it];
      } else {
        if (it.includes('_off') === true) return weights[it];
        else return false;
      }
    });

    for (let k of keys) {
      if (data[k] === undefined) {
        data[k] = [{ min: this.options.floor, max: this.options.ceil, price: 45, options: Object.assign({}, this.options) }];
        try {
          (this.parentForm.form.controls.price as FormGroup)
            .addControl(k + this.identifier, new FormGroup(this.controlsArray(data[k])));
          console.log((this.parentForm.form.controls.price as FormGroup).controls[k + this.identifier]);
        }
        catch (e) { console.error(e); }
      }
    }
    data.keys = keys;
    // console.log(data);
    this.refreshSlider();
    this.priceEnableChange = true;
    return data;
  }

  private proccessWeightsTrim() {

    //Para los key que son agregar
    let keys = this.trimmings.map(it => { return it.id; });
    keys = keys.filter(it => {
      return this.getValue()[it];
    });

    for (let k of keys) {
      if (this.trimWeights[k] === undefined) {
        this.trimWeights[k] = [{ min: this.options.floor, max: this.options.ceil, price: 45, options: Object.assign({}, this.options) }];
        try {
          (this.parentForm.form.controls.price as FormGroup)
            .addControl(k + this.identifierTrim, new FormGroup(this.controlsArray(this.trimWeights[k])));
        }
        catch (e) { console.error(e); }
      }
    }

    //Para los key para remover
    keys = this.trimmings.map(it => { return it.id; });
    keys = keys.filter(it => {
      return !this.getValue()[it];
    });
    for (let k of keys) {
      if (this.trimWeights[k] !== undefined) {
        this.trimWeights[k] = undefined;
        try {
          (this.parentForm.form.controls.price as FormGroup)
            .removeControl(k + this.identifierTrim);
        }
        catch (e) { console.error(e); }
      }
    }

    this.refreshSlider();
    this.priceEnableChange = true;
  }

  public selectKey(k) {
    this.keySelect = k;
    console.log(this.weights, k);
    setTimeout(() => {
      this.refreshSlider();
      console.log(this.keySelect);
    }, 300);
  }

  public deletePrice(headAction, i) {
    let index = 0;
    if (headAction === true) {
      if (this.weights.on[this.keySelect].length === 1) {
        this.weights.on[this.keySelect] = [];
        index = 1;
      } else {
        this.weights.on[this.keySelect].splice(i, 1);
        index = this.weights.on[this.keySelect].length;
      }
    } else {
      if (this.weights.off[this.keySelect].length === 1) {
        this.weights.off[this.keySelect] = [];
        index = 1;
      } else {
        this.weights.off[this.keySelect].splice(i, 1);
        index = this.weights.off[this.keySelect].length;
      }
    }

    //Para remover los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelect + this.identifier] as FormGroup)
        .removeControl((i).toString());
    }
    catch (e) { console.error(e); }

    this.refreshSlider();
  }

  public deletePriceTrims(i) {
    if (this.trimWeights[this.keySelectTrim].length === 1) {
      this.trimWeights[this.keySelectTrim] = [];
    } else {
      this.trimWeights[this.keySelectTrim].splice(i, 1);
    }

    //Para remover los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelectTrim + this.identifierTrim] as FormGroup)
        .removeControl((i - 1).toString());
    }
    catch (e) { console.error(e); }

    this.refreshSlider();
  }

  private deletePrices(headAction) {
    let keys = [];
    this.priceEnableChange = false;
    if (headAction === true) {
      keys = this.weights.on.keys;
      this.weights.on = { keys: [] };
    } else {
      keys = this.weights.off.keys;
      this.weights.off = { keys: [] };
    }

    for (let i = 0; i < keys.length; i++) {
      let keySelect = keys[i];
      //Para remover los inputs
      try {
        (this.parentForm.form.controls.price as FormGroup).removeControl(keySelect + this.identifier);
      }
      catch (e) { console.error(e); }
    }
    this.priceEnableChange = true;
  }

  public addPricing() {
    console.log(this.headAction, this.keySelect);
    let price = isNaN(this.valueExample) == false ? this.valueExample : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price, options: this.options };
    let index = 0;
    if (this.headAction === true) {
      this.weights.on[this.keySelect].push(it);
      index = this.weights.on[this.keySelect].length;
    } else {
      this.weights.off[this.keySelect].push(it);
      index = this.weights.off[this.keySelect].length;
    }
    this.refactorizeRanges(index - 1);

    //Para agregar los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelect + this.identifier] as FormGroup)
        .addControl((index - 1).toString(), new FormControl(0, Validators.required));
    }
    catch (e) { console.error(e); }

    this.valueExample = 0;
    this.exampleValues = {
      min: this.options.floor,
      max: this.options.ceil
    };
    this.refreshSlider();
  }

  private controlsArray(arr) {
    let d = {};
    for (let i in arr) {
      d[i] = new FormControl('', Validators.required);
    }

    return d;
  }
  public isSelectTrim(tri) {
    return this.getValue()[tri + this.identifierTrim];
  }

  public getSelects() {
    return this.trimmings.filter(it => {
      return this.getValue()[it.id + this.identifierTrim];
    });
  }

  public refactorizeRanges(index) {
    if (this.hideTrimesSlides === false && this.wholeFishAction === false) {
      return this.refactorizeRangesTrim(index);
    }
    let slides = [];
    if (this.headAction === true) {
      slides = this.weights.on[this.keySelect];
    } else {
      slides = this.weights.off[this.keySelect];
    }
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
      if (this.headAction === true) {
        slides = this.weights.on[this.keySelect];
      } else {
        slides = this.weights.off[this.keySelect];
      }
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

      if (this.headAction === true) {
        this.weights.on[this.keySelect][index].options = newOptions1;
        if (this.weights.on[this.keySelect][index].min < range.minLimit)
          this.weights.on[this.keySelect][index].min = range.minLimit;
      } else {
        this.weights.off[this.keySelect][index].options = newOptions1;
        if (this.weights.off[this.keySelect][index].min < range.minLimit)
          this.weights.off[this.keySelect][index].min = range.minLimit;
      }

    }
    catch (e) {
      console.error(e);
    }
  }

  public refactorizeRangesTrim(index) {
    let slides = this.trimWeights[this.keySelectTrim];

    for (let i = index; i < slides.length; i++) {
      this.refactorizeRangesTrimIterate(i);
    }
    this.refreshSlider();
  }

  private refactorizeRangesTrimIterate(index) {
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
      slides = this.trimWeights[this.keySelectTrim];

      //Entonces calculamos el valor mas alto, para tomar desde ahi
      //el inicio de los demas slider
      let maxValue = 0;
      for (let i = 0; i < slides.length; i++) {
        let slide = slides[i];
        if (index === 0) console.log(i, index, slide.max, maxValue, slide.max > maxValue);
        if (i === index || i > index) continue;
        if (slide.max > maxValue) maxValue = slide.max;
      }
      //ahora asignamos el mayor valor al slide
      range.minLimit = maxValue !== 0 ? maxValue + 1 : 0;
      range.minLimit = range.minLimit > newOptions.ceil ? newOptions.ceil : range.minLimit;
      let newOptions1 = Object.assign(range, newOptions);

      this.trimWeights[this.keySelectTrim][index].options = newOptions1;
      if (this.trimWeights[this.keySelectTrim][index].min < range.minLimit)
        this.trimWeights[this.keySelectTrim][index].min = range.minLimit;

    }
    catch (e) {
      console.error(e);
    }
  }

  public getOptions(index) {
    if (this.headAction === true) {
      return this.weights.on[this.keySelect][index].options;
    } else {
      return this.weights.off[this.keySelect][index].options;
    }

  }

  public getIdentifier(key, i) {
    return key + this.identifier;
  }

  public getIdentifierTrim(key, i) {
    return key + this.identifierTrim;
  }

  public getControl(key, i) {
    if (((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifier] as FormGroup)
      .controls[i] === undefined) {
      console.log(key, i, (this.parentForm.form.controls.price as FormGroup).controls[key + this.identifier]);
    }
    return ((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifier] as FormGroup)
      .controls[i];
  }

  public getControlTrim(key, i) {
    if (((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim] as FormGroup)
      .controls[i] === undefined) {
      console.log(key, i, (this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim]);
    }
    return ((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim] as FormGroup)
      .controls[i];
  }

  public assingHead(r) {
    this.headAction = r;
    // this.keySelect = '';
    this.refreshSlider();
  }

  public controls() {
    return (this.parentForm.form.controls.price as FormGroup).controls;
  }

  public showPricing(res) {
    this.showPricingValue = res;
  }

  private refreshSlider() {
    if (this.await_ === false) {
      this.await_ = true;
      setTimeout(() => {
        let r = { weights: JSON.stringify(this.weights), weightsTrim: JSON.stringify(this.trimWeights) };
        this.setValue(r);
        this.await_ = false;
      }, 500);
    }
    this.manualRefresh.emit();
    this.zone.run(function () { /*console.log("emit");*/ });
  }

  private setValue(value) {
    this.parentForm.form.patchValue({ price: value })
  }

  private setValueFeatures(value) {
    this.parentForm.form.patchValue({ features: value })
  }

  public selectKeyTrim(trim) {
    let v: any = {};
    v[trim] = !this.getValue()[trim];
    this.setValue(v);
  }

  public selectKeyTrimAdd(trim) {
    this.keySelectTrim = trim;
  }

  public addPricingTrim() {
    let price = isNaN(this.valueExample) == false ? this.valueExample : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price, options: this.options };
    let index = 0;
    this.trimWeights[this.keySelectTrim].push(it);
    index = this.trimWeights[this.keySelectTrim].length;
    this.refactorizeRanges(index - 1);

    //Para agregar los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelectTrim + this.identifierTrim] as FormGroup)
        .addControl((index - 1).toString(), new FormControl(0, Validators.required));
    }
    catch (e) { console.error(e); }

    this.valueExample = 0;
    this.exampleValues = {
      min: this.options.floor,
      max: this.options.ceil
    };
    this.refreshSlider();
  }

  private getValue() {
    return this.parentForm.form.value.price;
  }

}
