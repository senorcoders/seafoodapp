import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
@Component({
	selector: 'app-order-purchase',
	templateUrl: './order-purchase.component.html',
	styleUrls: ['./order-purchase.component.scss']
})
export class OrderPurchaseComponent implements OnInit {
	item: any;
	date: any;
	itemId: any;
	showLoading: boolean = true;
	showProduct: boolean = false;
	showPopup: boolean = false;
	trackingForm: FormGroup;
	fileToUpload: any = [];
	showButton: boolean = true;
	showTrackingFile: boolean = false;
	API = environment.apiURLImg;
	constructor(
		private fb: 			FormBuilder,
		private route: 		ActivatedRoute,
		private productS: ProductService,
		private toast: 		ToastrService,
		private auth: 		AuthenticationService
	) {

		this.route.params.subscribe( params => {
			this.itemId = (this.route.snapshot.params['item']);
		} );
	}

	ngOnInit() {
		this.getItem();
	}
	getItem() {
		this.productS.getData('itemshopping/' + this.itemId).subscribe(
			result => {
				if (result && result !== '') {
					this.item = result;
					this.showLoading = false;
					this.showProduct = true;
					this.getDates(result['shoppingCart'].paidDateTime)
					// hide or show button
					if ( result['shippingStatus'] === 'shipped' ) {
						this.showButton = false;
					}
					// show or hide tracking image
					if (result['trackingFile'] != "") {
						this.showTrackingFile = true
					}
					else {
						this.showTrackingFile = false
					}
				} else {
					this.showLoading = false
					this.showProduct = false;
				}
			},
			e => {
				this.showProduct = false
				console.log(e)
			}
		)
	}

	cancelOrder() {
		let status = {
			"id": this.itemId,
			"status": "5c06f4bf7650a503f4b731fd"
		}

		//this.productS.updateData('api/itemshopping/status/' + this.itemId, status).subscribe( res => {
		this.productS.updateData(`api/itemshopping/${status.id}/${status.status}`, {}).subscribe(res => {

			console.log(res);
			this.toast.success('Order Canceled', 'Well Done', { positionClass: "toast-top-right" })
			this.showButton = false;

		},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })
			})
	}
	FulfillsOrder(){
		this.productS.updateData(`api/itemshopping/${this.itemId}/5c13f453d827ce28632af048`,{}).subscribe(
			res=>{
				this.toast.success('Order status changed', 'Well Done', { positionClass: "toast-top-right" })
				this.showButton=false;
				this.getItem();
			},
			e=>{
				console.log(e)
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })
			}
		)
	}
	confirmOrder() {

		this.productS.updateData('api/itemshopping/' + this.itemId + '/5c017af047fb07027943a405', {}).subscribe(
			res => {
				console.log(res);
				this.toast.success('Order Confirmed', 'Well Done', { positionClass: "toast-top-right" })
				this.getItem();

			},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })
			}
		)
	}
	setShipped() {
		this.productS.setShippedProduct('api/itemshopping/status/' + this.itemId).subscribe(
			result => {
				this.toast.success('Product Shipped', 'Well Done', { positionClass: "toast-top-right" })
				this.getItem();
				this.closeForm();
				this.showButton = false;
			},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })
			}
		)
	}
	// setPending(){
	// 	let data={
	// 		shippingStatus:"pending"
	// 	}
	// 	this.productS.updateData('itemshopping/'+this.itemId, data).subscribe(
	// 		result=>{
	// 			this.toast.success('Product Mark like pending','Well Done',{positionClass:"toast-top-right"})
	// 			this.getItem();
	// 		},
	// 		e=>{
	// 			this.toast.error('Something wrong happened, please try again','Error',{positionClass:"toast-top-right"})
	// 		}
	// 	)
	// }
	showPopupForm() {
		this.trackingForm = this.fb.group({
			code: ['']
		})
		this.showPopup = true;
	}
	handleFileInput(files: FileList) {
		this.fileToUpload = files;
	}
	sendTracking() {
		if (this.trackingForm.get('code').value != '' || this.fileToUpload != '') {
			if (this.fileToUpload != '') {
				this.uploadFile()
			}
			if (this.trackingForm.get('code').value != '') {
				let data = {
					trackingID: this.trackingForm.get('code').value,
				}
				this.productS.updateData('itemshopping/' + this.itemId, data).subscribe(
					result => {
						this.setShipped();
					},
					e => {
						console.log(e)
						this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: "toast-top-right" })

					}
				)
			}
			this.closeForm();
		}
		else {
			this.toast.error('You have to add a code or a code picture', 'Error', { positionClass: "toast-top-right" })
		}
	}
	uploadFile() {
		if (this.fileToUpload.length > 0) {
			this.productS.uploadFile('api/itemshopping/trackingfile/' + this.itemId, "file", this.fileToUpload).subscribe(result => {
				this.toast.success("Your tracking's Image has been upload successfully!", 'Well Done', { positionClass: "toast-top-right" })
			}, error => {
				this.toast.error("Something wrong happened, please try again", "Error", { positionClass: "toast-top-right" });
			})
		}
	}
	closeForm() {
		this.showPopup = false;
	}
	getDates(value) {
		let date = new Date(value)
		let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		let hours = date.getHours()
		let min = date.getMinutes();
		let minutes;
		if (min < 10) {
			minutes = "0" + min;
		}
		else {
			minutes = min
		}
		let ampm = "AM";
		if (hours > 12) {
			hours -= 12;
			ampm = "PM";
		}
		this.date = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm
	}
}
