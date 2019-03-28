import { Component, OnInit } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'fish-form',
  templateUrl: './fish-form.component.html',
  styleUrls: ['./fish-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FishFormComponent implements OnInit {

  public product;

  constructor(private parentForm: FormGroupDirective) { }

  ngOnInit() {
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
      seafood_sku: new FormControl('', Validators.nullValidator),
      hsCode: new FormControl('', Validators.nullValidator),
      minimunorder: new FormControl('', Validators.nullValidator),
      maximumorder: new FormControl('', Validators.nullValidator),
    }))
  }

}
