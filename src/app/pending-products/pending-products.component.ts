import { NgModule, Pipe, Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProductService } from '../services/product.service';
import { CountriesService } from '../services/countries.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';
declare var jQuery:any;

@Component({
  selector: 'app-pending-products',
  templateUrl: './pending-products.component.html',
  styleUrls: ['./pending-products.component.scss']
})
export class PendingProductsComponent implements OnInit {
  pendingProducts:any =[];
  selectedProductID:any;
  deniedProductGroup: FormGroup;
	denialMessage: FormControl;
  
  constructor(private toast: ToastrService, private productService: ProductService) { }

  ngOnInit() {
    this.getPendingProducts();
    this.createForm();
  }

  createForm(){
    this.denialMessage = new FormControl('', Validators.required);    
    
    this.deniedProductGroup = new FormGroup({            
      denialMessage: this.denialMessage
    });
	}

  getPendingProducts(){
    this.productService.getPendingProducts().subscribe(
      result => {
        this.pendingProducts = result;
      },
      error => {
        console.log( error );
      }
    )
  }
  approveProduct( productID:string ){
    this.productService.patchStatus( productID, '5c0866f9a0eda00b94acbdc2', { message: '' } )
    .subscribe(
      result => {
        this.getPendingProducts();
        this.toast.success("Product Approved Successfully!",'Well Done',{positionClass:"toast-top-right"})
      },
      error => {
        this.getPendingProducts();
        this.toast.error("Something wrong happened, please try again", "Error",{positionClass:"toast-top-right"} );
      }
    )
  }
  deniedProduct(){
    let productID = this.selectedProductID;
    let message =   this.deniedProductGroup.value.denialMessage;
    
    this.productService.patchStatus( productID, '5c0866f2a0eda00b94acbdc1', { message: message } )
    .subscribe(
      result => {
        this.getPendingProducts();
        this.toast.success("Product Denied Successfully!",'Well Done',{positionClass:"toast-top-right"})
        jQuery('#deniedProducts').modal('hide');
      },
      error => {        
        this.toast.error("Something wrong happened, please try again", "Error",{positionClass:"toast-top-right"} );
      }
    )
  }
  showDeniedModal(productID:string){
		this.selectedProductID= productID;    
    jQuery('#deniedProducts').modal('show');
  }
}
