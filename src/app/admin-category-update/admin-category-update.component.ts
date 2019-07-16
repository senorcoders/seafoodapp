import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { FormGroup, FormControl, Validators, Form, FormBuilder, FormArray } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import { prepareProfile } from 'selenium-webdriver/firefox';
declare var jQuery:any;

@Component({
  selector: 'app-admin-category-update',
  templateUrl: './admin-category-update.component.html',
  styleUrls: ['./admin-category-update.component.scss']
})
export class AdminCategoryUpdateComponent implements OnInit {  
  category_id: string;
  category: any;
  treatments: any;
  raiseds: any;
  variations: any;
  selectedFishPreparations: any;
  parentPreparations: any; // only top level preparation
  childsPreparations: any; // all preparartions what are not top level
  unitOfMeasures = [ { name: 'KG' }, { name: 'LBS'}, { name: 'Pieces' } ];
  currentChildPreparations = []; //current child prepraration in this category

  catForm: FormGroup;
  treatment:FormControl;
  fishPreparation: FormControl;
  unitOfMeasure: FormControl;
  name:FormControl;
  constructor(
    private auth: AuthenticationService, 
    private router:Router, private route: ActivatedRoute, 
    public formBuilder: FormBuilder,
    public category_service: CategoriesService,
    private toast:ToastrService,) { }

  ngOnInit() {    
    this.createCatForm();
    this.route.params.subscribe(params => {
      this.category_id = this.route.snapshot.params['category_id'];
      this.getTreatments();
      this.getRaised();
      this.getParentPreparations();
      this.getChildPreparations();
      this.getVariations();
      //this.getCateInfo();
      
    });
    
    /*let those = this;
    jQuery('.fishPreparation').select2({
      tags: true
    }).on("select2:select", function(event) {
      console.log( event.currentTarget );
      //those.addFishChildPreparation(event.currentTarget);
    });
    jQuery('.fishPreparationChild').select2({      
    })*/
  }
  

  getCateInfo() {
    this.category_service.getCategoryInfo( this.category_id ).subscribe(
      res => {
        this.category = res;
        //populate current fields in the category
        this.catForm.controls['name'].setValue(this.category.name);
        this.catForm.controls['raised'].setValue(this.category.raised);
        this.catForm.controls['treatment'].setValue(this.category.treatment);
        this.catForm.controls['unitOfMeasure'].setValue(this.category.unitOfMeasure);
        this.catForm.controls['fishPreparation'].setValue( Object.keys( this.category.fishPreparation ));

        // let's create the new controls for the fish preparation
        Object.keys( this.category.fishPreparation ).map( (parentPreparation) => {
          (<FormArray>this.catForm.get('fishPreparationChilds')).push( 
            this.addOtherFishPreparationChilds( parentPreparation, this.category.fishPreparation[parentPreparation] ) 
          );
            //getting information for current Variations
            this.category.fishPreparation[parentPreparation].map( childPreparation => {
              console.log( 'variations',this.category.variations );
              if( this.childsPreparations !== undefined ) {
                this.childsPreparations.map( childBD => {                
                  if ( childPreparation == childBD.id ) {
                    let value = '';
                    // now let's populate the current variations
                    if ( this.category.variations !== undefined ) {
                      this.category.variations.map( variation => {                     
                        if( variation.fishType.id == this.category.id && variation.fishPreparation.id === childPreparation ){
                          value = variation.variations;
                        }
                      });
                      (<FormArray>this.catForm.get('fishVariations')).push( this.addOtherFishVariation( this.category.id, childPreparation, value ) );
                      this.currentChildPreparations.push( { parent: parentPreparation, preparation: childBD } );
                    } else { // if didn't had variations yet
                    console.log('adding empty var');
                      (<FormArray>this.catForm.get('fishVariations')).push( this.addOtherFishVariation( this.category.id, childPreparation, '' ) );
                      this.currentChildPreparations.push( { parent: parentPreparation, preparation: childBD } );
                    }
                    
                  }
                } )

              }
              
            } );
          
        } )
        
      }, error => {
        console.log( error );
      }
    )
  }

  getTreatments() {
    this.category_service.get('treatment').subscribe(
      res => {
        this.treatments = res;
      }, error => {
        console.log( error );
      }
    )
  }

  getRaised() {
    this.category_service.get('raised').subscribe(
      res => {
        this.raiseds = res;
      }, error => {
        console.log( error );
      }
    )
  }

  getVariations() {
    this.category_service.get('wholeFishWeight').subscribe(
      res => {
        this.variations = res;
      }, error => {
        console.log( error );
      }
    )
  }

  createCatForm() {
    this.name = new FormControl('', [Validators.required]);
    this.unitOfMeasure = new FormControl('', [Validators.required]);
    this.catForm = this.formBuilder.group({
      name: this.name,
      unitOfMeasure: this.unitOfMeasure,
      raised: [ '', [Validators.required] ],
      treatment: ['', [Validators.required]],
      fishPreparation: ['', [Validators.required]],
      fishPreparationChilds: this.formBuilder.array([  ]),
      fishVariations: this.formBuilder.array([  ])
    })
  }

  addOtherFishPreparationChilds( parent_id, preparationChilds ): FormGroup {
    return this.formBuilder.group({
      fishPreparationChild: [ preparationChilds, Validators.required ],
      fishParent: [ parent_id, Validators.required ]      
    });
  }

  addOtherFishVariation( type, preparation_id, variations ): FormGroup {
    return this.formBuilder.group({
      type: [ type, Validators.required ],
      preparation: [ preparation_id, Validators.required ],
      variations: [ variations, Validators.required ]
    })
  }

  addFishChildPreparation(): void {
    console.log(this.catForm);
    let parentsPreparation = this.catForm.controls[ 'fishPreparation' ].value;
    let childPreparationControls = this.catForm.controls[ 'fishPreparationChilds' ].value;
    parentsPreparation.map( item => {
      let founded = false;
      childPreparationControls.map( childControl => {
        // check if the control is already created
        if( item == childControl.fishParent ){ 
          founded = true;
        }
      } );

      // if the control was not created, let's create it
      if ( !founded ) { 
        (<FormArray>this.catForm.get('fishPreparationChilds')).push( this.addOtherFishPreparationChilds( item, '' ) );
      }
    } );

    //now let's check if we have a control what is not in the fish preparation parent
    childPreparationControls.map( (childControl, index) => {      
      let founded = false;
      parentsPreparation.map( item => {
        // check if the control is already created
        if( item == childControl.fishParent ){ 
          founded = true;
        }
      } );

      //let's erase the item
      if ( !founded ) { 
        const control = <FormArray>this.catForm.controls.fishPreparationChilds;
        control.removeAt(index);
      }
    });
    
    
  }

  onSubmit(): void {
    console.log(this.catForm.value);
    this.category_service.saveCategorySetup( this.category_id, this.catForm.value ).subscribe(
      res => {
        this.showSuccess('Category Updated')
      }, error => {
        this.showError('Something happend, please reload the page')
        console.log( error );
      }
    )
  }

  getParentPreparations() {
    this.category_service.get('fishpreparation/parents/0').subscribe(
      res => {
        this.parentPreparations = res;
      }, error => {
        console.log( error );
      }
    )
  }

  getChildPreparations( ) {
    this.category_service.get('fishpreparation/childs' ).subscribe(
      res => {
        this.childsPreparations = res;
        this.getCateInfo();
      }, error => {
        console.log( error );
      }
    )
  }

  showError(e){
  	this.toast.error(e,"Error",{positionClass:"toast-top-center"})
  }
  showSuccess(s){
  	this.toast.success(s,"Well Done",{positionClass:"toast-top-center"})
  }

}
