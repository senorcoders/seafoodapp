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
    kg8m: '8+ KG'
  };
  public keySelect = '';
  public options: Options = {
    floor: 0,
    ceil: 0,
    step: 1
  };

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
    }))

    //Para conocer el maximo y minimo del product
    this.parentForm.form.controls.product.valueChanges.subscribe(it => {
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
        this.refreshSlider();
      }
    });


    //Para detectar los cambios en los checkboxs
    this.parentForm.form.controls.price.valueChanges.subscribe(it => {
      //El usuario tiene seleccionado el head on
      if (this.headAction === true) {
        this.weights.on = this.proccessWeights(this.weights.on, it);
      }

      this.refreshSlider();
    });
  }

  private proccessWeights(data, weights) {
    let keys = Object.keys(weights);
    keys = keys.filter(it => {
      return weights[it];
    });
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
    console.log(this.weights);
    this.refreshSlider();
  }

  public deletePrice(on, i) {
    console.log(on, i);
    if (this.headAction === true) {
      if (this.weights.on[this.keySelect].length === 1) {
        this.weights.on[this.keySelect] = [];
      }else{
        this.weights.on[this.keySelect].splice(i, 1);
      } 
    } else {
      // this.weights.off[this.keySelect].push(it);
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
  }

  public controls() {
    return (this.parentForm.form.controls.price as FormGroup).controls;
  }

  private refreshSlider() {
    this.manualRefresh.emit();
  }

}
