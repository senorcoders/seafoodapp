import { Component, OnInit, NgZone, EventEmitter } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { Options } from 'ng5-slider';

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
  public weights = { on: {}, off: {} };
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

  constructor(private parentForm: FormGroupDirective) { }

  ngOnInit() {
    this.createFormGroup();
  }

  private createFormGroup() {
    this.price = this.parentForm.form;
    this.price.addControl('price', new FormGroup({
      kg01: new FormControl(false, Validators.nullValidator),
      kg12: new FormControl(false, Validators.nullValidator),
      kg23: new FormControl(false, Validators.nullValidator),
      kg34: new FormControl(false, Validators.nullValidator),
      kg45: new FormControl(false, Validators.nullValidator),
      kg56: new FormControl(false, Validators.nullValidator),
      kg67: new FormControl(false, Validators.nullValidator),
      kg78: new FormControl(false, Validators.nullValidator),
      kg8m: new FormControl(false, Validators.nullValidator),
      kg01_off: new FormControl(false, Validators.nullValidator),
      kg12_off: new FormControl(false, Validators.nullValidator),
      kg23_off: new FormControl(false, Validators.nullValidator),
      kg34_off: new FormControl(false, Validators.nullValidator),
      kg45_off: new FormControl(false, Validators.nullValidator),
      kg56_off: new FormControl(false, Validators.nullValidator),
      kg67_off: new FormControl(false, Validators.nullValidator),
      kg78_off: new FormControl(false, Validators.nullValidator),
      kg8m_off: new FormControl(false, Validators.nullValidator),
      headAction: new FormControl(this.headAction, Validators.required),
      weights: new FormControl('', Validators.nullValidator),
      example: new FormControl('', Validators.nullValidator)
    }))

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
      //El usuario tiene seleccionado el head on
      if (this.headAction === true) {
        this.weights.on = this.proccessWeights(this.weights.on, it);
      } else {
        this.weights.off = this.proccessWeights(this.weights.off, it);
      }
      // console.log(this.weights);
      this.refreshSlider();
    });

    //Para mostrar el advance pricing
    this.parentForm.form.controls.features.valueChanges.subscribe(it => {
      if (it.head === 'both') {
        if (this.showPricingValue === false) this.showPricingValue = true;
      }
    });
  }

  private proccessWeights(data, weights) {
    let keys = Object.keys(weights);
    keys = keys.filter(it => {
      if (it === 'headAction' || it === 'weights' || it === 'example') return false;
      if (this.headAction === true) {
        if (it.includes('_off') === true) return false;
        else return weights[it];
      } else {
        if (it.includes('_off') === true) return weights[it];
        else return false;
      }
    });
    // console.log(keys);
    for (let k of keys) {
      if (data[k] === undefined) {
        data[k] = [{ min: 1, max: 2, price: 45 }];
      }
    }
    data.keys = keys;
    this.refreshSlider();
    return data;
  }

  public selectKey(k) {
    this.keySelect = k;
    this.refreshSlider();
  }

  public deletePrice(on, i) {
    console.log(on, i);
    if (this.headAction === true) {
      if (this.weights.on[this.keySelect].length === 1) {
        this.weights.on[this.keySelect] = [];
      } else {
        this.weights.on[this.keySelect].splice(i, 1);
      }
    } else {
      if (this.weights.off[this.keySelect].length === 1) {
        this.weights.off[this.keySelect] = [];
      } else {
        this.weights.off[this.keySelect].splice(i, 1);
      }
    }
    this.refreshSlider();
  }

  public addPricing() {
    let price = isNaN(this.valueExample) == false ? this.valueExample : 0;
    let it = { min: this.exampleValues.min, max: this.exampleValues.max, price };
    if (this.headAction === true) {
      this.weights.on[this.keySelect].push(it);
    } else {
      this.weights.off[this.keySelect].push(it);
    }
    this.valueExample = 0;
    this.exampleValues = {
      min: this.options.floor,
      max: this.options.ceil
    };
    this.refreshSlider();
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
