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
  public weights:any = { on: { keys : [] }, off: { keys : []  } };
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
    step: 1
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

  constructor(public parentForm: FormGroupDirective, private productService: ProductService) { }

  ngOnInit() {
    this.createFormGroup();
    this.productService.getData("wholefishweight").subscribe(its => {
      let wholes = its as any[];
      //Agregamos los wholes antes
      for (let i of wholes) {
        (this.parentForm.form.controls.price as FormGroup).addControl(i.id, new FormControl('', Validators.nullValidator));
      }
      for (let i of wholes) {
        (this.parentForm.form.controls.price as FormGroup).addControl(i.id + "_off", new FormControl('', Validators.nullValidator));
      }
      this.wholesFish = its as any;
    })

  }

  private createFormGroup() {

    this.price = this.parentForm.form;
    this.price.addControl('price', new FormGroup({
      headAction : new FormControl(this.headAction, Validators.required),
      weights : new FormControl('', Validators.nullValidator),
      example : new FormControl('', Validators.nullValidator)
    }));

    //Para conocer el maximo y minimo del product
    this.parentForm.form.controls.product.valueChanges.subscribe(it => {
      // console.log(it);
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
        this.refreshSlider();
      }
    });


    //Para detectar los cambios en los checkboxs
    this.parentForm.form.controls.price.valueChanges.subscribe(it => {
      //cuando se agregan contoles de slide al formuario
      //Crea un bucle sin fin de cambios
      if (this.priceEnableChange === true) {
        //Para que los controles que se agreguen no probocen el bucle
        this.priceEnableChange = false;
        //El usuario tiene seleccionado el head on
        if (this.headAction === true) {
          this.weights.on = this.proccessWeights(this.weights.on, it);
        } else {
          this.weights.off = this.proccessWeights(this.weights.off, it);
        }
        // console.log(this.weights);
        this.refreshSlider();
      }

    });

    //Para mostrar el advance pricing
    this.parentForm.form.controls.features.valueChanges.subscribe(it => {
      if (it.head === 'both') {
        if (this.showPricingValue === false) this.showPricingValue = true;
      }
    });
  }

  public getNameWhole(id) {
    if (id.includes("_off") === true) {
      id = id.replace("_off", "");
    }
    return this.wholesFish.find(it => {
      return it.id === id;
    }).name;
  }

  private proccessWeights(data, weights) {
    let keys = Object.keys(weights);
    keys = keys.filter(it => {
      if (
        it === 'headAction' ||
        it === 'weights' ||
        it === 'example' ||
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
    console.log(keys);
    for (let k of keys) {
      if (data[k] === undefined) {
        data[k] = [{ min: 1, max: 2, price: 45 }];
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

  public selectKey(k) {
    this.keySelect = k;
    this.refreshSlider();
  }

  public deletePrice(on, i) {
    let index = 0;
    if (this.headAction === true) {
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
        .removeControl((index - 1).toString());
    }
    catch (e) { console.error(e); }

    this.refreshSlider();
  }

  public addPricing() {
    let price = isNaN(this.valueExample) == false ? this.valueExample : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price };
    let index = 0;
    if (this.headAction === true) {
      this.weights.on[this.keySelect].push(it);
      index = this.weights.on[this.keySelect].length;
    } else {
      this.weights.off[this.keySelect].push(it);
      index = this.weights.off[this.keySelect].length;
    }

    //Para agregar los inputs
    try {
      ((this.parentForm.form.controls.price as FormGroup).controls[this.keySelect + this.identifier] as FormGroup)
        .addControl((index - 1).toString(), new FormControl('', Validators.required));
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

  public getIdentifier(key, i) {
    return key + this.identifier;
  }

  public getControl(key, i) {
    return ((this.parentForm.form.controls.price as FormGroup).controls[key + this.identifier] as FormGroup)
      .controls[i];
  }

  public assingHead(r) {
    this.headAction = r;
    this.keySelect = '';
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
        let r = { weights: JSON.stringify(this.weights) };
        this.setValue(r);
        this.await_ = false;
      }, 500);
    }
    this.manualRefresh.emit();
  }

  private setValue(value) {
    this.parentForm.form.patchValue({ price: value })
  }

}
