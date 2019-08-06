import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {ProductService} from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { ToastrService } from '../toast.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
declare var jQuery:any;
@Component({
  selector: 'app-tracking-code',
  templateUrl: './tracking-code.component.html',
  styleUrls: ['./tracking-code.component.scss']
})
export class TrackingCodeComponent implements OnInit {
	itemId:any;
	trackingForm:FormGroup;
  fileToUpload:any=[];
  invoice: FormControl;
  healthCert: FormControl;
  packingList: FormControl;
  awb: FormControl;
  certificateOrigin: FormControl;
  creditNote: FormControl;
  files:any;
  constructor(private fb:FormBuilder, private route: ActivatedRoute, private productS:ProductService, private toast:ToastrService, private orderService:OrderService) { 
	  this.route.params.subscribe(params => {
		      this.itemId=(this.route.snapshot.params['item']);
		}) 
	}

 ngOnInit() {
    this.createFormControl();
    this.createForm();
  }

  createFormControl(){
    this.invoice = new FormControl('', Validators.required);
    this.healthCert = new FormControl('', Validators.required);
    this.packingList = new FormControl('', Validators.required);
    this.awb = new FormControl('', Validators.required);
    this.certificateOrigin = new FormControl('');
    this.creditNote = new FormControl('');
  }

  createForm(){
    this.trackingForm = new FormGroup({
        invoice: this.invoice,
        healthCert: this.healthCert,
        packingList: this.packingList,
        awb: this.awb,
        certificateOrigin: this.certificateOrigin,
        creditNote: this.creditNote

    }, {
      updateOn: 'submit'
    });
  }

  validateAllFormFields(formGroup: FormGroup) {         
    Object.keys(formGroup.controls).forEach(field => { 
      const control = formGroup.get(field);             
      if (control instanceof FormControl) {             
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        
        this.validateAllFormFields(control);            
      }
    });
  }

  saveTracking(){
  //   console.log(this.fileToUpload)
  //   this.orderService.uploadShippingImages( this.itemId, this.image0, this.image1, this.image2, this.image3, this.image4, this.image5, this.image6, this.image7, this.image8, this.image9 )
  //   .subscribe(
  //     result => {
  //       console.log( result );
  //       this.toast.success("Order marked as document fulfillment!",'Order Updated',{positionClass:"toast-top-right"});
  //     },
  //     error => {
  //       console.log( error );
  //     }
  //   )  
  if(this.trackingForm.valid){
    console.log("PDFs validos");
    console.log(this.trackingForm.value);
    this.sendToAPI();
  }else{
    this.validateAllFormFields(this.trackingForm);
  }
  }

  sendToAPI(){
    let data = [
        this.trackingForm.get('invoice').value,
        this.trackingForm.get('healthCert').value,
        this.trackingForm.get('packingList').value,
        this.trackingForm.get('awb').value,
        this.trackingForm.get('certificateOrigin').value,
        this.trackingForm.get('creditNote').value
      ]

    let numItems = data.length; 
    data.forEach((element, index) => {
      console.log(index, numItems);
      
        this.productS.uploadPDF(element, this.itemId).subscribe(res =>{
          console.log(res);
            this.toast.success("Order marked as document fulfillment!",'Upload Succesfully',{positionClass:"toast-top-right"});
          
          
        }, error => {
          console.log(error);
        })
      });




}
  handleFileInput(event, name) {
   

    if(event.target.files.length > 0) {
      let file = event.target.files;
      let ext = file[0].name.split(".");
      console.log("Nombre", name + '.' + ext[1]);

       var blob = file[0].slice(0, file[0].size, file[0].type); 
       console.log(blob);
       var newFile = new File([blob], name + '.' + ext[1], {type: file[0].type});

        console.log(newFile);
      // file[0].name=name;

      this.trackingForm.get(`${name}`).setValue(newFile);
    }
  }

  renameFilename(file, name) {
    return file.renameFilename = name + "." + file['name'].split('.').pop();
}

 

}
