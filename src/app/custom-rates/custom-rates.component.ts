import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { ToastrService } from '../toast.service';

declare var jQuery: any;

@Component({
  selector: 'app-custom-rates',
  templateUrl: './custom-rates.component.html',
  styleUrls: ['./custom-rates.component.scss']
})
export class CustomRatesComponent implements OnInit {

  public myform: FormGroup;
  private levels: any;

  public typeLevel0: any[] = [];
  public typeLevel1: any[] = [];
  public typeLevel2: any[] = [];
  public typeLevel3: any[] = [];
  public preparations: any[] = [];
  public action = "Save";
  public submitted = false;

  public customRates = [];
  public rate: any = {};
  public selectedRate = "";

  constructor(private productService: ProductService, private toast: ToastrService) {
    this.myform = new FormGroup({
      category: new FormControl("", Validators.required),
      specie: new FormControl("", Validators.required),
      subspecie: new FormControl("", Validators.required),
      preparation: new FormControl("", Validators.required),
      mode: new FormControl("", Validators.required),
      val: new FormControl("", Validators.required)
    });
  }

 ngOnInit() {
    this.getAllTypesByLevel();
    this.getFishPreparation();
    this.getCustomRates();
  }

  private getCustomRates() {
    this.productService.getData('customrates').subscribe(rs => {
      this.customRates = rs as any;
      console.log("rs", rs);
    });
  }

  private getAllTypesByLevel() {
    this.productService.getData(`getTypeLevel`).subscribe(
      result => {
        console.log(result, "levels");
        this.levels = result;
        this.typeLevel0 = result['level0'];
      }
    );
  }

  private getFishPreparation() {
    this.productService.getData('fishpreparation').subscribe(results => {
      let arr = results as any[];
      arr = arr.filter(it => {
        return !it.isTrimming;
      });
      this.preparations = arr;
      // this.getTrimming();
    });
  }

  public getOnChangeLevel(level: any, val) {

    if (val === '') {
      switch (level) {
        case 0:
          this.typeLevel1 = [];
          this.typeLevel2 = [];
          this.typeLevel3 = [];
          break;
        case 1:
          this.typeLevel2 = [];
          this.typeLevel3 = [];
          break;
        case 2:
          this.typeLevel3 = [];
          break;
      }
    } else {
      this.productService.getData(`fishTypes/${val}/ori_all_levels`).subscribe(
        result => {
          switch (level) {
            case 0:
              this.typeLevel1 = result['childs'][0].fishTypes;
              break;

            case 1:
              this.typeLevel2 = result['childs'][0].fishTypes;
              break;

            case 2:
              this.typeLevel3 = result['childs'][0].fishTypes;
              break;

          }
        })
    }
  }

  public editRate(r) {
    this.rate = r;
    this.myform.patchValue({
      category: r.category.id,
      specie: r.specie.id,
      subspecie: r.subspecie.id,
      preparation: r.preparation.id,
      mode: r.mode,
      val: r.value
    });
    this.action = "Update";
  }

  public showConfirmModal(rate_id) {
    this.selectedRate = rate_id;
    jQuery('#confirm').modal('show');
  }

  confirm(val) {
    if (val===true) {
      this.productService.deleteData("customrates/"+ this.selectedRate).subscribe(
        result => {
          this.selectedRate = '';
          jQuery('#confirm').modal('hide')
          this.getCustomRates();
        },
        e => {
          this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
          console.log(e)
        }
      )
    }
    else {
      jQuery('#confirm').modal('hide')
    }
  }

  public controls() {
    return this.myform.controls;
  }

  public onSubmit() {
    this.submitted = true;
    if (this.myform.valid === true) {
      let newRate = this.myform.value;
      newRate.value = (newRate.val).toFixed(2);
      newRate.id_concatenated = newRate.category + "." + newRate.specie + "." + newRate.subspecie + "." + newRate.preparation;
      if (this.action === "Save") {
        this.productService.saveData("customrates", newRate).subscribe(rs => {
          this.getCustomRates();
          this.finish();
        }, r => {
          this.toast.error('There is already a time with these categories');
        });
      } else {
        this.productService.patchData("customrates/" + this.rate.id, newRate).subscribe(rs => {
          this.getCustomRates();
          this.finish();
        }, r => {
          this.toast.error('There is already a time with these categories');
        });
      }
    }
  }

  private finish() {
    this.action = "Save";
    this.submitted = false;
    this.myform.reset();
    this.myform.patchValue({
      category: "",
      specie: "",
      subspecie: "",
      preparation: "",
      mode: "",
      val: ""
    });
    this.typeLevel1 = [];
    this.typeLevel2 = [];
    this.typeLevel3 = [];
  }

}
