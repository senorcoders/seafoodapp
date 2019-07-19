import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CategoriesService } from '../services/categories.service';
import { FormGroup, FormControl, Validators, Form, FormBuilder } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-fish-information-managment',
  templateUrl: './fish-information-managment.component.html',
  styleUrls: ['./fish-information-managment.component.scss']
})
export class FishInformationManagmentComponent implements OnInit {

  registerForm: FormGroup;
  type:FormControl;
  name: FormControl;
  parent:FormControl;

  selectedType: string;
  hasParent = false; // if selected type could have parents
  currentData: any;
  currentParents: any;

  constructor(
    private auth: AuthenticationService, 
    private router:Router, private route: ActivatedRoute,
    public formBuilder: FormBuilder,
    public category_service: CategoriesService,
    private toast:ToastrService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.name = new FormControl('', [Validators.required] );
    this.type = new FormControl('', [Validators.required] );
    this.parent = new FormControl('');

    this.registerForm = this.formBuilder.group({
      name: this.name,
      type: this.parent,
      parent: this.parent
    });
  }
  typeChange( newType ) {
    this.selectedType = newType;

    // if the selected type didn't have parent logic in the backend let's remove the parent field
    if ( !['fishpreparation', 'wholeFishWeight'].includes( this.selectedType ) ) {
      this.hasParent = false;
    } else {
      this.hasParent = true;
      // get the parents
      this.category_service.get('fishpreparation/parents/0').subscribe(
      res => {
          this.currentParents = res;
        }, error => {
          console.log( error );
        }
      )
    }

    this.category_service.get( `${this.selectedType}?where={"isActive": true}` ).subscribe(
      res => {
        this.currentData = res;
      }, error => {
        console.log( error );
      }
    )
  }

  onSubmit(): void {
    let bodyJSON = this.registerForm.value;
    
    if( !this.hasParent )
      delete bodyJSON.parent;

    delete bodyJSON.type;
    console.info('body', bodyJSON);
    this.category_service.post(  this.selectedType, this.registerForm.value ).subscribe(
      res => {
        this.typeChange( this.selectedType );
        this.showSuccess('Record created!!!');
      }, error => {
        this.showError('Something happend, please reload the page')
        console.log( error );
      }
    )
  }

  delete( id ) {
    this.category_service.delete( `api/${this.selectedType}/${id}` ).subscribe(
      res => {
        this.showSuccess( 'Record deleted' );
        this.typeChange( this.selectedType );
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
