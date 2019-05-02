import { Component, OnInit, NgZone, EventEmitter, Output, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormControl, Validators, FormGroup, FormArray, RequiredValidator } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Options } from 'ng5-slider';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

// create your class that extends the angular validator class
export class CustomValidators extends Validators {

  // create a static method for your validation
  static validateInputRange(control: FormControl) {

    // first check if the control has a value
    if (control.value && Number(control.value) > 0) {
      return null;
    } else {
      return { value: true };
    }
  }
}

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
  // public showPricingValue = false;
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
  public productID = "";
  private firsTest = true;
  public weightsFilleted = [];
  public nameFilleted = "weightsFillete_arr";

  @Output() messageEvent = new EventEmitter<string>();
  @Input() events: Observable<void>;
  private eventsSubscription: Subscription;
  private speciesSelected = "";
  constructor(
    public parentForm: FormGroupDirective,
    private productService: ProductService,
    public zone: NgZone,
    public route: ActivatedRoute
  ) {
    let productID = this.route.snapshot.params['id'];
    if (productID !== null && productID !== undefined) this.productID = productID;
  }



  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(this.agregarVariations.bind(this))
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
      console.log("whole", this.wholesFish);
    });
    this.getTrimming();
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe()
  }

  private agregarVariations(it) {
    //Si es para editar un producto
    if (this.productID === '') return;
    this.priceEnableChange = false;
    try {

      if (it.isTrimms == false && it.wholeFishAction === false) {
        this.weightsFilleted = it.weightsFilleted.sort((a, b) => {
          return a.min - b.min;
        });
        (this.parentForm.form.controls.price as FormGroup)
          .setControl(this.nameFilleted, new FormGroup(this.controlsArray(this.weightsFilleted)));
      } else if (it.isTrimms === true) {
        this.trimWeights = it.weightsTrim;
        console.log(this.trimWeights);
        //Establecemos true los keys
        let keys = Object.keys(this.trimWeights);
        for (let k of keys) {
          this.trimWeights[k] = this.trimWeights[k].sort((a, b) => {
            return a.min - b.min;
          });
          let v = {};
          v[k] = true;
          this.setValue(v);
          try {
            (this.parentForm.form.controls.price as FormGroup)
              .addControl(k + this.identifierTrim, new FormGroup(this.controlsArray(this.trimWeights[k])));
          }
          catch (e) { console.error(e); }
        }
      } else {

        let weights = it.weights;
        this.weights = weights;
        for (let key of this.weights.on.keys) {
          this.weights.on[key] = this.weights.on[key].sort((a, b) => {
            return a.min - b.min;
          });
          let v = {};
          v[key] = true;
          this.setValue(v);
        }
        let keys = this.weights.on.keys
        for (let k of keys) {
          try {
            (this.parentForm.form.controls.price as FormGroup)
              .addControl(k + this.identifier, new FormGroup(this.controlsArray(this.weights.on[k])));
            console.log((this.parentForm.form.controls.price as FormGroup).controls[k + this.identifier]);
          }
          catch (e) { console.error(e); }
        }

        this.weights.off.keys = this.weights.off.keys.map(it => { return it.includes("_off") === true ? it : it + "_off"; })
        for (let key of this.weights.off.keys) {
          this.weights.off[key] = this.weights.off[key].sort((a, b) => {
            return a.min - b.min;
          });
          let v = {};
          v[key + "_off"] = true;
          this.weights.off[key + "_off"] = this.weights.off[key];
          delete this.weights.off[key];
          this.setValue(v);
        }
        keys = this.weights.off.keys
        for (let k of keys) {
          try {
            (this.parentForm.form.controls.price as FormGroup)
              .addControl(k + this.identifier, new FormGroup(this.controlsArray(this.weights.off[k + "_off"])));
            console.log((this.parentForm.form.controls.price as FormGroup).controls[k + this.identifier]);
          }
          catch (e) { console.error(e); }
        }
        this.setValue({ weights: this.weights });
        console.log("val", this.getValue());
      }
      this.priceEnableChange = true;
      this.setOptionsInAll();
    }
    catch (e) {
      console.error(e);
    }
  }

  private createFormGroup() {

    this.price = this.parentForm.form;
    this.price.addControl('price', new FormGroup({
      headAction: new FormControl(this.headAction, Validators.required),
      weights: new FormControl('', Validators.nullValidator),
      weightsTrim: new FormControl('', Validators.nullValidator),
      weightsFilleted: new FormControl('[]', Validators.nullValidator),
      example: new FormControl('', Validators.nullValidator),
      variationsDeleted: new FormControl('[]', Validators.nullValidator),
      pricesDeleted: new FormControl("[]", Validators.nullValidator)
    }));
    this.messageEvent.emit("hey listo.");

    //Para conocer el maximo y minimo del product
    this.parentForm.form.controls.product.valueChanges.subscribe(it => {
      //Para elegir los slides que se muestran si es salmon o no
      this.speciesSelected = it.speciesSelected
      if (this.speciesSelected === '5bda361c78b3140ef5d31fa4' && this.wholeFishAction === false) {
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
          if (this.keySelectTrim === '') {
            let trims = this.getSelects();
            if (trims.length > 0)
              this.selectKeyTrimAdd(trims[0].id);
          }

        } else {
          //El usuario tiene seleccionado el head on
          if (this.headAction === true) {
            this.weights.on = this.proccessWeights(this.weights.on, it);
          } else {
            this.weights.off = this.proccessWeights(this.weights.off, it);
          }
          //si hay mas de un pricing seleccionado
          if (this.weights.on.keys.length > 1 || this.weights.off.keys.length > 1) {
            this.setValueFeatures({ priceShow: false });
            if (this.keySelect === '') {
              if (this.headAction === true) {
                this.selectKey(this.weights.on.keys[0]);
              } else {
                this.selectKey(this.weights.off.keys[0]);
              }
            }
          } else if (this.head !== 'both')
            this.setValueFeatures({ priceShow: true });

          if (this.weights.on.keys.length > 0 || this.weights.off.keys.length > 0) {
            if (this.keySelect === '') {
              if (this.headAction === true) {
                this.selectKey(this.weights.on.keys[0]);
              } else {
                this.selectKey(this.weights.off.keys[0]);
              }
            }
          }

        }

        this.refreshSlider();
      }

    });

    //Para mostrar el advance pricing
    this.parentForm.form.controls.features.valueChanges.subscribe(it => {
      this.head = it.head;
      if (it.head === 'both') {
        // if (this.showPricingValue === false) this.showPricingValue = true;
      } else if (it.head === 'on') {
        this.deletePrices(false);
        this.assingHead(true);
      } else if (it.head === 'off') {
        this.deletePrices(true);
        this.assingHead(false);
      }

      this.wholeFishAction = it.wholeFishAction;
      if (this.speciesSelected === '5bda361c78b3140ef5d31fa4' && this.wholeFishAction === false) {
        this.hideTrimesSlides = false;
      } else {
        this.hideTrimesSlides = true;
      }
      if (this.wholeFishAction === false && this.priceEnableChange === true) {
        this.priceEnableChange = false;
        this.proccessWeightsFilleted();
        console.log("agregue filleted");
        setTimeout(() => {
          this.priceEnableChange = true;
        }, 500);
      }
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

    //Para los filleted
    this.weightsFilleted = this.weightsFilleted
      .map(itereOptions.bind(this));

    //Para los trimmings
    keys = this.trimmings.map(it => { return it.id; });
    keys = keys.filter(it => {
      return this.getValue()[it];
    });
    for (let key of keys) {
      console.log(key, this.trimWeights[key]);
      this.trimWeights[key] = this.trimWeights[key]
        .map(itereOptions.bind(this));
    }

  }

  public getNameWhole(id) {
    try {
      if (id.includes("_off") === true) {
        id = id.replace("_off", "");
      }
      let it = this.wholesFish.find(it => {
        return it.id === id;
      });
      if (it !== undefined && it !== null) return it.name;
      else return "";
    }
    catch (e) {
      console.error(e);
      return "";
    }
  }

  private proccessWeights(data, weights) {
    //Vamos aponer de los id que se eliminan
    let keys = Object.keys(weights);
    keys = keys.filter(it => {
      if (
        it === 'headAction' ||
        it === 'weights' ||
        it === 'example' ||
        it === "weightsTrim" ||
        it === "variationsDeleted" ||
        it === "pricesDeleted" ||
        it === this.nameFilleted ||
        it === "weightsFilleted" ||
        it.includes(this.identifier) === true
      ) return false;
      if (this.headAction === true) {
        if (it.includes('_off') === true) return false;
        else return !weights[it];
      } else {
        if (it.includes('_off') === true) return !weights[it];
        else return false;
      }
    });
    for (let k of keys) {
      if (this.headAction === true) {
        if (this.productID !== "" &&
          this.weights.on[k] !== undefined &&
          this.weights.on[k].length > 0 &&
          this.weights.on[k][0].idVariation !== null &&
          this.weights.on[k][0].idVariation !== undefined
        ) {
          let arr = JSON.parse(this.getValue().variationsDeleted);
          let indexLeft = arr.findIndex(it => {
            return it === this.weights.on[k][0].idVariation;
          });
          if (indexLeft == -1)
            arr.push(this.weights.on[k][0].idVariation);
          this.setValue({ variationsDeleted: JSON.stringify(arr) });
        }
      } else {
        if (this.productID !== "" &&
          this.weights.off[k] !== undefined &&
          this.weights.off[k].length > 0 &&
          this.weights.off[k][0].idVariation !== null &&
          this.weights.off[k][0].idVariation !== undefined
        ) {
          let arr = JSON.parse(this.getValue().variationsDeleted);
          let indexLeft = arr.findIndex(it => {
            return it === this.weights.off[k][0].idVariation;
          });
          if (indexLeft == -1)
            arr.push(this.weights.off[k][0].idVariation);
          this.setValue({ variationsDeleted: JSON.stringify(arr) });
        }
      }

    }

    keys = Object.keys(weights);
    keys = keys.filter(it => {
      if (
        it === 'headAction' ||
        it === 'weights' ||
        it === 'example' ||
        it === "weightsTrim" ||
        it === "variationsDeleted" ||
        it === "pricesDeleted" ||
        it === this.nameFilleted ||
        it === "weightsFilleted" ||
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
      //Para poner el id y eliminarlo
      if (this.productID !== "" &&
        this.trimWeights[k] !== undefined &&
        this.trimWeights[k].length > 0 &&
        this.trimWeights[k][0].idVariation !== null &&
        this.trimWeights[k][0].idVariation !== undefined
      ) {
        let arr = JSON.parse(this.getValue().variationsDeleted);
        arr.push(this.trimWeights[k][0].idVariation);
        this.setValue({ variationsDeleted: JSON.stringify(arr) });
      }
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

  private proccessWeightsFilleted() {

    //Fileted fish no tiene key
    //asi que simplemente se rrecorre el arry asigna 
    //los slides
    if (this.weightsFilleted.length === 0) {
      this.weightsFilleted = [{ min: this.options.floor, max: this.options.ceil, price: 45, options: Object.assign({}, this.options) }];
    }
    try {
      (this.parentForm.form.controls.price as FormGroup)
        .addControl(this.nameFilleted, new FormGroup(this.controlsArray(this.weightsFilleted)));
    }
    catch (e) { console.error(e); }

    //Para poner el id y eliminarlo
    // if (this.productID !== "" &&
    //   this.trimWeights[k] !== undefined &&
    //   this.trimWeights[k].length > 0 &&
    //   this.trimWeights[k][0].idVariation !== null &&
    //   this.trimWeights[k][0].idVariation !== undefined
    // ) {
    //   let arr = JSON.parse(this.getValue().variationsDeleted);
    //   arr.push(this.trimWeights[k][0].idVariation);
    //   this.setValue({ variationsDeleted: JSON.stringify(arr) });
    // }
    // if (this.trimWeights[k] !== undefined) {
    //   this.trimWeights[k] = undefined;
    //   try {
    //     (this.parentForm.form.controls.price as FormGroup)
    //       .removeControl(k + this.identifierTrim);
    //   }
    //   catch (e) { console.error(e); }
    // }

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

  public getNameTrim(price) {
    let i: any = 0;
    for (let t in this.trimWeights[this.keySelectTrim]) {
      let it = this.trimWeights[this.keySelectTrim][t];
      if (
        it.min === price.min &&
        it.max === price.max &&
        it.price === price.price
      ) {
        i = t;
        break;
      }
    }

    return i;
  }

  public getNameFilleted(price) {
    let i: any = 0;
    for (let t in this.weightsFilleted) {
      let it = this.weightsFilleted[t];
      if (
        it.min === price.min &&
        it.max === price.max &&
        it.price === price.price
      ) {
        i = t;
        break;
      }
    }

    return i;
  }

  public deletePrice(headAction, i) {
    if (headAction === true) {
      if (this.productID !== "" &&
        this.weights.on[this.keySelect][i].id !== null &&
        this.weights.on[this.keySelect][i].id !== undefined
      ) {
        let arr = JSON.parse(this.getValue().pricesDeleted);
        arr.push(this.weights.on[this.keySelect][i].id);
        this.setValue({ pricesDeleted: JSON.stringify(arr) });
      }
      if (this.weights.on[this.keySelect].length === 1) {
        this.weights.on[this.keySelect] = [];
      } else {
        this.weights.on[this.keySelect].splice(i, 1);
      }
      try {
        (this.parentForm.form.controls.price as FormGroup)
          .setControl(this.keySelect + this.identifier, new FormGroup(this.controlsArray(this.weights.on[this.keySelect])));
        console.log((this.parentForm.form.controls.price as FormGroup).controls[this.keySelect + this.identifier]);
      }
      catch (e) { console.error(e); }
    } else {
      if (this.productID !== "" &&
        this.weights.off[this.keySelect][i].id !== null &&
        this.weights.off[this.keySelect][i].id !== undefined
      ) {
        let arr = JSON.parse(this.getValue().pricesDeleted);
        arr.push(this.weights.off[this.keySelect][i].id);
        this.setValue({ pricesDeleted: JSON.stringify(arr) });
      }
      if (this.weights.off[this.keySelect].length === 1) {
        this.weights.off[this.keySelect] = [];
      } else {
        this.weights.off[this.keySelect].splice(i, 1);
      }

      try {
        (this.parentForm.form.controls.price as FormGroup)
          .setControl(this.keySelect + this.identifier, new FormGroup(this.controlsArray(this.weights.off[this.keySelect])));
        console.log((this.parentForm.form.controls.price as FormGroup).controls[this.keySelect + this.identifier]);
      }
      catch (e) { console.error(e); }
    }

    this.refreshSlider();
  }

  public deletePriceTrims(price) {
    let i = this.getNameTrim(price);
    //Para guardar el id por si es para actualizar
    if (this.productID !== "" &&
      this.trimWeights[this.keySelectTrim][i].id !== null &&
      this.trimWeights[this.keySelectTrim][i].id !== undefined
    ) {
      let arr = JSON.parse(this.getValue().pricesDeleted);
      arr.push(this.trimWeights[this.keySelectTrim][i].id);
      this.setValue({ pricesDeleted: JSON.stringify(arr) });
    }
    if (this.trimWeights[this.keySelectTrim].length === 1) {
      this.trimWeights[this.keySelectTrim] = [];
    } else {
      this.trimWeights[this.keySelectTrim].splice(i, 1);
    }

    //Para remover los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup)
        .controls[this.keySelectTrim + this.identifierTrim] as FormGroup)
        .setControl(this.keySelectTrim + this.identifierTrim, new FormGroup(this.controlsArray(this.trimWeights[this.keySelectTrim])));
    }
    catch (e) { console.error(e); }

    this.refreshSlider();
  }

  public deletePriceFilleted(price) {
    let i = this.getNameFilleted(price);
    //Para guardar el id por si es para actualizar
    if (this.productID !== "" &&
      this.weightsFilleted[i].id !== null &&
      this.weightsFilleted[i].id !== undefined
    ) {
      let arr = JSON.parse(this.getValue().pricesDeleted);
      arr.push(this.weightsFilleted[i].id);
      this.setValue({ pricesDeleted: JSON.stringify(arr) });
    }
    if (this.weightsFilleted.length === 1) {
      this.weightsFilleted = [];
    } else {
      this.weightsFilleted.splice(i, 1);
    }

    //Para remover los inputs
    try {
      (this.parentForm.form.controls.price as FormGroup)
        .setControl(this.nameFilleted, new FormGroup(this.controlsArray(this.weightsFilleted)));
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
    let price = isNaN(this.valueExample) == false ? Number(this.valueExample) : "";
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
        .addControl((index - 1).toString(), new FormControl(price, CustomValidators.validateInputRange));
    }
    catch (e) { console.error(e); }

    this.valueExample = 0;
    this.exampleValues = {
      min: this.options.floor,
      max: this.options.ceil
    };
    this.refreshSlider();
  }

  public addPricingTrim() {
    let price = isNaN(this.valueExample) == false ? Number(this.valueExample) : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price, options: this.options };
    let index = 0;
    this.trimWeights[this.keySelectTrim].push(it);
    index = this.trimWeights[this.keySelectTrim].length;
    this.refactorizeRanges(index - 1);

    //Para agregar los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelectTrim + this.identifierTrim] as FormGroup)
        .addControl((index - 1).toString(), new FormControl(price, CustomValidators.validateInputRange));
    }
    catch (e) { console.error(e); }

    this.valueExample = 0;
    this.exampleValues = {
      min: this.options.floor,
      max: this.options.ceil
    };
    this.refreshSlider();
  }

  public addPricingFilleted() {
    let price = isNaN(this.valueExample) == false ? Number(this.valueExample) : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price, options: this.options };
    let index = 0;
    this.weightsFilleted.push(it);
    index = this.weightsFilleted.length;
    this.refactorizeRangesFilleted(index - 1);

    //Para agregar los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.nameFilleted] as FormGroup)
        .addControl((index - 1).toString(), new FormControl(price, CustomValidators.validateInputRange));
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
      let value = "";
      if (arr[i].price && Number(arr[i].price) > 0) value = arr[i].price;
      d[i] = new FormControl(value, CustomValidators.validateInputRange);
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

  public refactorizeRangesFilleted(index) {
    let slides = this.weightsFilleted;

    for (let i = index; i < slides.length; i++) {
      this.refactorizeRangesFilletedIterate(i);
    }
    this.refreshSlider();
  }

  private refactorizeRangesFilletedIterate(index) {
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
      slides = this.weightsFilleted;

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

      this.weightsFilleted[index].options = newOptions1;
      if (this.weightsFilleted[index].min < range.minLimit)
        this.weightsFilleted[index].min = range.minLimit;

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

  public getControlTrim(key, price) {
    let i = this.getNameTrim(price);
    if (((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim] as FormGroup)
      .controls[i] === undefined) {
      console.log(key, i, (this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim]);
    }
    return ((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifierTrim] as FormGroup)
      .controls[i];
  }

  public getControlFilleted(key, price) {
    let i = this.getNameFilleted(price);
    if (((this.parentForm.form.controls.price as FormGroup).controls[this.nameFilleted] as FormGroup)
      .controls[i] === undefined) {
      console.log(key, i, (this.parentForm.form.controls.price as FormGroup).controls[this.nameFilleted]);
    }
    return ((this.parentForm.form.controls.price as FormGroup).controls[this.nameFilleted] as FormGroup)
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

  // public showPricing(res) {
  //   this.showPricingValue = res;
  // }

  private refreshSlider() {
    if (this.await_ === false) {
      this.await_ = true;
      setTimeout(() => {
        let r = {
          weights: JSON.stringify(this.weights),
          weightsTrim: JSON.stringify(this.trimWeights),
          weightsFilleted: JSON.stringify(this.weightsFilleted)
        };
        this.setValue(r);
        this.await_ = false;
      }, 500);
    }
    this.manualRefresh.emit();
    this.zone.run(function () { /*console.log("emit");*/ });
  }

  private setValue(value) {
    this.parentForm.form.patchValue({ price: value });
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

  private getValue() {
    return this.parentForm.form.value.price;
  }

}
