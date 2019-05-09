import { Component, OnInit } from '@angular/core';
import { FormGroupDirective, ControlContainer, FormControl, Validators, FormGroup } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthenticationService } from '../../services/authentication.service';
import { ToastrService } from '../../toast.service';

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
  public head = "on";
  public preparationOptions = [];
  public fishPreparation = [];
  public typesModal = [];
  public defaultTrimming = [];
  public hideTrimModal = true;
  public partsModal = [];
  public trimmingsModal = [];
  public store: any;
  public storeEndpoint = 'api/store/user/';
  public info: any;
  public existStore = true;
  public ProcessingParts = [];
  public trimmings = [];
  private identifier = "_arr";
  public treatments = [];

  constructor(public parentForm: FormGroupDirective, private productService: ProductService,
    private auth: AuthenticationService, private toast: ToastrService) { }

  ngOnInit() {
    this.createFormGroup();
    this.getMyData();
    this.getFishPreparation();
    this.getwholeFishWeight();
    this.reaised();
    this.getParts();
    this.getTrimmingModal();
  }

  getMyData() {
    this.info = this.auth.getLoginData();
    this.getStore();
  }

  getWholes() {
    this.productService.getData("wholefishweight").subscribe(it => {

    });
  }

  getStore() {
    this.productService.getData(this.storeEndpoint + this.info.id).subscribe(results => {
      this.store = results;
      this.getTrimmingByStore();
      this.getParts();
      this.getProcessingParts();
      if (this.store.length < 1) {
        this.existStore = false;
      }
    });
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
    this.productService.getData('storeTrimming/store/' + this.store[0].id).subscribe(
      res => {
        this.ProcessingParts = res as any;
      },
      e => {
        console.log(e);
      }
    );
  }

  private createFormGroup() {
    this.features = this.parentForm.form;
    this.features.addControl('features', new FormGroup({
      headOffWeight: new FormControl('0-1kg', Validators.required),
      headOnWeight: new FormControl('0-1kg', Validators.required),
      acceptableSpoilageRate: new FormControl('', Validators.required),
      raised: new FormControl('', Validators.required),
      treatment: new FormControl('', Validators.required),
      // preparation: new FormControl("", Validators.required),
      head: new FormControl(this.head, Validators.required),
      wholeFishAction: new FormControl(this.wholeFishAction, Validators.required),
      // price: new FormControl('0', Validators.required),
      priceShow: new FormControl(true, Validators.nullValidator)
    }));

    this.parentForm.form.controls.product.valueChanges.subscribe(it => {
      if (it.speciesSelected !== undefined && it.speciesSelected !== null) {
        if (it.speciesSelected === '5bda361c78b3140ef5d31fa4') {
          this.hideTrimModal = false;
        } else {
          this.hideTrimModal = true;
        }
      }

      // let value = it.speciesSelected;
      // if (value === '5bda361c78b3140ef5d31fa4') {
      //   this.preparationOptions = this.trimmings;
      //   this.wholeFishAction = true;
      //   this.setValue({ preparation: this.preparationOptions[0].id });

      // } else {
      //   this.preparationOptions = this.fishPreparation;
      //   this.setValue({ preparation: this.preparationOptions[0].id });
      // }

      // if (it.parentSelectedType == '5bda35c078b3140ef5d31f9a') {
      //   this.preparationOptions = [{ name: "Not Applicable", id: "Not Applicable" }];
      //   this.parentForm.form.get('preparation').disable();
      // }
    });

    this.parentForm.form.controls.features.valueChanges.subscribe(it => {
      this.wholeFishAction = it.wholeFishAction;
    });

    // this.checkPriceForm();
  }

  // private checkPriceForm() {
  //   if (this.parentForm.form.controls.price !== undefined) {
  //     this.parentForm.form.controls.price.valueChanges.subscribe(ig => {
  //       let keys = Object.keys(ig);
  //       keys = keys.filter(it => {
  //         if (
  //           it === 'headAction' ||
  //           it === 'weights' ||
  //           it === 'example' ||
  //           it.includes(this.identifier) === true
  //         ) return false;
  //         return ig[it] === true;
  //       });
  //       if (keys.length > 1) {
  //         this.head = 'both';
  //       }
  //     });
  //   } else {
  //     setTimeout(this.checkPriceForm.bind(this), 3000);
  //   }
  // }

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

  public controls() {
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

  private setValue(value) {
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
    this.productService.getData('storeTrimming/store/' + this.store[0].id).subscribe(
      result => {
        this.trimmingsModal = result as any;
      },
      e => {
        console.log(e)
      }
    )
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

}
