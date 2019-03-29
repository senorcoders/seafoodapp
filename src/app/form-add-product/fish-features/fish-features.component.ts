import { Component, OnInit } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'fish-features',
  templateUrl: './fish-features.component.html',
  styleUrls: ['./fish-features.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  providers: [NgClass, NgIf]
})
export class FishFeaturesComponent implements OnInit {

  features;
  public wholeFishAction = true;
  public wholeFishs = [];
  public raised = [];

  constructor(private parentForm: FormGroupDirective, private productService: ProductService) { }

  ngOnInit() {
    this.createFormGroup();
    this.getwholeFishWeight();
    this.reaised();
  }

  private createFormGroup() {
    this.features = this.parentForm.form;
    this.features.addControl('features', new FormGroup({
      headOffWeight: new FormControl('', Validators.nullValidator),
      headOnWeight: new FormControl('', Validators.nullValidator),
      acceptableSpoilageRate: new FormControl('', Validators.nullValidator),
      raised: new FormControl('', Validators.nullValidator),
    }))
  }

  private getwholeFishWeight() {
    this.productService.getData("fishpreparation").subscribe(it => {
      this.wholeFishs = it as any;
      console.log(it);
    });
  }

  private reaised(){
    this.productService.getData("raised").subscribe(it => {
      this.raised = it as any;
    });
  }

  public controls() {
    return (this.parentForm.form.controls.features as FormGroup).controls;
  }

  public assingWholeFish(re) {
    this.wholeFishAction = re;
  }

}
