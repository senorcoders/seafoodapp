import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { TitleService } from '../title.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var jQuery: any;

@Component({
  selector: 'app-recent-purchases',
  templateUrl: './recent-purchases.component.html',
  styleUrls: ['./recent-purchases.component.scss']
})
export class RecentPurchasesComponent implements OnInit {
  user: any;
  items: any;
  storeID: string;
  dates = [];
  firstShipped:any = [];
  firstNoShipped:any = [];
  shipped: any;
  datesShipping = [];
  showMore: boolean = false;
  showLess: boolean = false;
  showMoreNoShipped: boolean = false;
  showLessNoShipped: boolean = false;
  showLoading: boolean = true;
  showProduct: boolean = false;
  showShipped: boolean = false;
  showDelivered: boolean = false;
  showCancelled: boolean = false;
  firstProducts: any;
  min = new Date();
  max = new Date();
  today = new Date();
  index: any;
  citemId: any;
	action: string;
  where: any;
  trackingForm:FormGroup;
  fileToUpload:any=[];
  invoice: FormControl;
  healthCert: FormControl;
  packingList: FormControl;
  awb: FormControl;
  certificateOrigin: FormControl;
  creditNote: FormControl;
  files:any;
  itemId: any;
  subindex: any;
  delivered:any = [];
  cancelled:any = [];
  label6:any = 'Select a file to attach...';
  label5:any = 'Select a file to attach...';
  label4:any = 'Select a file to attach...';
  label3:any = 'Select a file to attach...';
  label2:any = 'Select a file to attach...';
  label1:any = 'Select a file to attach...';




  constructor(private productS: ProductService, private toast: ToastrService, private auth: AuthenticationService,
    private titleS: TitleService) {
      this.titleS.setTitle('Orders');
      this.min.setDate(this.today.getDate());
      this.max.setDate(this.today.getDate() + 90);
     }

  ngOnInit() {
    this.createFormControl();
    this.createForm();

    this.user = this.auth.getLoginData();
    this.getStore();

 
  }


  getStore() {
    this.productS.getData('api/store/user/' + this.user.id).subscribe(
      result => {
        this.storeID = result[0].id;
        this.getPurchases();
        this.getPurchasesShipped();
        this.getDelivered();
        this.getCancelled();
      },
      e => {
        console.log(e);
      }
    );
  }
  getPurchases() {
    // this.productS.getData('api/store/fish/paid/'+this.storeID).subscribe(
    this.productS.getData(`api/store/orders/not-shipped/user/${this.user.id}`).subscribe(
      result => {
        console.log(result);
        if (result && result !== '') {
          this.items = result;
          this.firstNoShipped =result;

          this.showLoading = false;
          this.showProduct = true;
          // this.getFirstNoShipped();
          // this.getDates();
        } else {
          this.showProduct = false;
          this.showLoading = false;
        }
      },
      e => {
        this.showProduct = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getPurchasesShipped() {
    // this.productS.getData('api/store/fish/items/paid/' + this.storeID).subscribe(
    this.productS.getData(`api/store/orders/shipped/user/${this.user.id}`).subscribe(
      result => {
        console.log("Shipped", result);
        if (result && result !== '') {
          this.shipped = result;
          this.firstShipped = result;

          this.showShipped = true;
          // this.getFirstPurchases();
          this.getDatesShipped();
        } else {
          this.showShipped = false;
        }
      },
      e => {
        this.showShipped = false;
        this.showLoading = false;
        console.log(e);
      }
    );
  }
  getFirstPurchases() {
    this.firstShipped = [];
    this.shipped.forEach((data, index) => {
      if (index <= 10) {
        this.firstShipped[index] = data;
      }
    });
    if (this.shipped.length > 10) {
      this.showMore = true;
      this.showLess = false;
    } else {
      this.showMore = false;
      this.showLess = false;
    }
  }
  getAllPurchases() {
    this.showMore = false;
    this.showLess = true;
    this.firstShipped = this.shipped;

  }
  getFirstNoShipped() {
    this.firstNoShipped = [];
    this.items.forEach((data, index) => {
      if (index <= 3) {
        this.firstNoShipped[index] = data;
      }
    });
    if (this.items.length > 3) {
      this.showMoreNoShipped = true;
      this.showLessNoShipped = false;
    } else {
      this.showMoreNoShipped = false;
      this.showLessNoShipped = false;
    }
  }
  getAllNoShipped() {
    this.showMoreNoShipped = false;
    this.showLessNoShipped = true;
    this.firstNoShipped = this.items;
  }
  getDates() {
    this.items.forEach((data, index) => {
      // convert date
      const date = new Date(data.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let hours = date.getHours();
      const min = date.getMinutes();
      let minutes;
      if (min < 10) {
        minutes = '0' + min;
      } else {
        minutes = min;
      }
      let ampm = 'AM';
      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }
      this.dates[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }
  getDatesShipped() {
    this.shipped.forEach((data, index) => {
      // convert date
      const date = new Date(data.shoppingCart.paidDateTime);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      let hours = date.getHours();
      const min = date.getMinutes();
      let minutes;
      if (min < 10) {
        minutes = '0' + min;
      } else {
        minutes = min;
      }
      let ampm = 'AM';
      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }
      this.datesShipping[index] = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
    });
  }


  //Confirm order function
  confirmOrder(itemId: string, subindex?) {
		let index = this.index;
		let sellerETA = jQuery(`#epa${itemId}`).val();

		this.productS.updateData('api/itemshopping/' + itemId + '/5c017af047fb07027943a405',
		{ userEmail: this.user['email'], userID: this.user['id'], sellerExpectedDeliveryDate: sellerETA }).subscribe(
			res => {
				jQuery('#confirm').modal('hide');
        console.log(res);
          this.toast.success(res['message'], 'Alert', { positionClass: 'toast-top-right' });
          if(subindex != undefined){
            this.firstNoShipped[index].items[subindex].updateInfo = res['item'][0].updateInfo;

          }else{
            this.firstNoShipped[index].items[0].updateInfo = res['item'][0].updateInfo;

          }
				
			

			},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
			}
		);
		

		
  }
  

  //Show Modal for Confirm order
  showModal(id, action, index, where, subindex?) {
		let sellerETA = jQuery(`#epa${id}`).val()
    this.index = index;
    this.where = where;
    this.subindex = subindex;
		console.log("index Modal", this.index);

		if ((sellerETA !== '' && sellerETA !== undefined) || action === 'cancel') {
			this.citemId = id;
			this.action = action;

			jQuery('#confirm').modal('show');
		} else {
			this.toast.error('Please select a Expected Delivery Time before Confirm the order', 'Error', { positionClass: 'toast-top-right' });
		}
  }
  
  //Confirm action in the modal 
  confirm(val, action) {
		if (val) {
			console.log(action);
			if (action == "confirm") {
				this.confirmOrder(this.citemId);
			}
			else if (action == 'cancel') {
				this.cancelOrder(this.citemId);
			}
		}
		else {
			jQuery('#confirm').modal('hide');
		}
  }
  

  //Cancel an order
  cancelOrder(itemId: string) {
		const status = {
			'id': itemId,
			'status': '5c06f4bf7650a503f4b731fd'
		};

		this.productS.updateData(`api/itemshopping/${status.id}/${status.status}`,
			{ userEmail: this.user['email'], userID: this.user['id'] }).subscribe(res => {

				console.log(res, this.subindex);
				jQuery('#confirm').modal('hide');
        this.toast.success('Order Canceled', 'Well Done', { positionClass: 'toast-top-right' });
        if(this.where == 'pending'){
          if(this.subindex != undefined){
            console.log("indefinida");
            this.firstNoShipped[this.index].items.splice(this.subindex, 1);

          }else{
            console.log("Definida");
            this.firstNoShipped.splice(this.index, 1);

          }
        }else{
          if(this.subindex != undefined){
            this.firstShipped[this.index].items.splice(this.subindex, 1);

          }else{
            this.firstShipped.splice(this.index, 1);

          }

        }
			},
				e => {
					this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
				});
  }
  
  //Function to open calendar to confirm order
  selectDate(id, index, subindex?){
    this.index = index;
   let date = jQuery('#epa' + id).val();
   console.log("Item ID", id, date);
   if(subindex != undefined){
    this.confirmOrder(id, subindex);

   }else{
    this.confirmOrder(id);

   }

  }

  //Create form controls and shipping docs form

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

  //Validate each input fields of the form

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


  //Check if form is valid
  saveTracking(){
  
    if(this.trackingForm.valid){
      console.log("PDFs validos");
      console.log(this.trackingForm.value);
      this.sendToAPI();
    }else{
      this.validateAllFormFields(this.trackingForm);
    }
    }


    //Save docs in DATABASE
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
              
              jQuery('#shippingDocs').modal('hide');
              this.cleanLabels();
          }, error => {
            console.log(error);
            this.cleanLabels();
          })
        });
  
  
  
  
  }

  cleanLabels(){
    this.label1 = 'Select a file to attach...';
    this.label2 = 'Select a file to attach...';
    this.label3 = 'Select a file to attach...';
    this.label4 = 'Select a file to attach...';
    this.label5 = 'Select a file to attach...';
    this.label6 = 'Select a file to attach...';
  }
  //Get file on input change and change the name before upload it

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
      if(name == 'invoice'){
        this.label1 =  name + '.' + ext[1];
      }else if(name == 'healthCert'){
        this.label2 =  name + '.' + ext[1];
      }else if(name == 'packingList'){
        this.label3 =  name + '.' + ext[1];

      }else if(name == 'awb'){
        this.label4 =  name + '.' + ext[1];

      }else if(name == 'certificateOrigin'){
        this.label5 =  name + '.' + ext[1];

      }else {
        this.label6 = name + '.' + ext[1];
      }
    }
  }

  renameFilename(file, name) {
    return file.renameFilename = name + "." + file['name'].split('.').pop();
}
  
//Open shipping docs modal
openShippingModal(id, index){
  jQuery('#shippingDocs').modal('show');
  this.itemId = id;

}


//Get delivered orders

getDelivered(){
  this.productS.getData(`/api/store/${this.user.id}/order/status/5c017b3c47fb07027943a409`).subscribe(res => {
      console.log("Delivered Orders", res);
      let arr:any = res;
      if(arr.length > 0){
        this.delivered = res;
        this.showDelivered = true;
      }
  })
}

//Get cancelled orders

getCancelled(){
  this.productS.getData(`/api/store/${this.user.id}/order/status/5c06f4bf7650a503f4b731fd`).subscribe(res => {
      console.log("Delivered Orders", res);
      let arr:any = res;
      if(arr.length > 0){
        this.cancelled = res;
        this.showCancelled = true;
      }
  })
}


}
