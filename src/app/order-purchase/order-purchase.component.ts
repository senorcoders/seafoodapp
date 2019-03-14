import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
declare var jQuery: any;
@Component({
	selector: 'app-order-purchase',
	templateUrl: './order-purchase.component.html',
	styleUrls: ['./order-purchase.component.scss']
})
export class OrderPurchaseComponent implements OnInit {
	user: any;
	item: any;
	items: any;
	date: any;
	itemId: any;
	orderId: string;
	showLoading: boolean = true;
	showProduct: boolean = false;
	showPopup: boolean = false;
	trackingForm: FormGroup;
	fileToUpload: any = [];
	showButton: boolean = true;
	showTrackingFile: boolean = false;
	API = environment.apiURLImg;
	citemId: any;
	action: string;
	today = new Date();
	min = new Date();
	max = new Date();
	index: any;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private productS: ProductService,
		private toast: ToastrService,
		private auth: AuthenticationService
	) {
		this.min.setDate(this.today.getDate());
		this.max.setDate(this.today.getDate() + 90);

		this.route.params.subscribe(params => {
			this.orderId = (this.route.snapshot.params['item']);
		});
	}

	ngOnInit() {
		this.user = this.auth.getLoginData();
		this.getItem();
	}

	private getItem() {
		this.productS.getData(`api/store/${this.user.id}/order/${this.orderId}`).subscribe(
			result => {
				console.log("Items", result);
				if (result && result !== '') {
					this.items = result;
					this.showLoading = false;
					this.showProduct = true;
				} else {
					this.showLoading = false;
					this.showProduct = false;
				}
			},
			e => {
				this.showProduct = false;
				console.log(e);
			}
		);
	}

	cancelOrder(itemId: string) {
		const status = {
			'id': itemId,
			'status': '5c06f4bf7650a503f4b731fd'
		};

		this.productS.updateData(`api/itemshopping/${status.id}/${status.status}`,
			{ userEmail: this.user['email'], userID: this.user['id'] }).subscribe(res => {

				console.log(res);
				jQuery('#confirm').modal('hide');
				this.toast.success('Order Canceled', 'Well Done', { positionClass: 'toast-top-right' });
				this.showButton = false;
				this.getItem();

			},
				e => {
					this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
				});
	}
 
	confirmOrder(itemId: string) {
		let index = this.index;
		let sellerETA = jQuery(`#epa${itemId}`).val();

		this.productS.updateData('api/itemshopping/' + itemId + '/5c017af047fb07027943a405',
		{ userEmail: this.user['email'], userID: this.user['id'], sellerExpectedDeliveryDate: sellerETA }).subscribe(
			res => {
				jQuery('#confirm').modal('hide');
				console.log(res);
					this.toast.success('Order Confirmed ', 'Well Done', { positionClass: 'toast-top-right' });
					this.items[index].status['id'] = res['item'][0].status['id'];
					this.items[index].status['status'] = res['item'][0].status['status'];
					this.items[index].updateInfo = res['item'][0].updateInfo;
				
			

			},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
			}
		);
		

		
	}



	setShipped(itemId: string) {
		this.productS.setShippedProduct('api/itemshopping/status/' + itemId).subscribe(
			result => {
				this.toast.success('Product Shipped', 'Well Done', { positionClass: 'toast-top-right' });
				this.getItem();
				this.closeForm();
				this.showButton = false;
			},
			e => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
			}
		);
	}

	showPopupForm() {
		this.trackingForm = this.fb.group({
			code: ['']
		});
		this.showPopup = true;
	}

	handleFileInput(files: FileList) {
		this.fileToUpload = files;
	}

	sendTracking(itemId: string) {
		if (this.trackingForm.get('code').value !== '' || this.fileToUpload !== '') {
			if (this.fileToUpload !== '') {
				this.uploadFile(itemId);
			}
			if (this.trackingForm.get('code').value !== '') {
				const data = {
					trackingID: this.trackingForm.get('code').value,
				};
				this.productS.updateData('itemshopping/' + itemId, data).subscribe(
					result => {
						this.setShipped(itemId);
					},
					e => {
						console.log(e);
						this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });

					}
				);
			}
			this.closeForm();
		} else {
			this.toast.error('You have to add a code or a code picture', 'Error', { positionClass: 'toast-top-right' });
		}
	}

	uploadFile(itemId: string) {
		if (this.fileToUpload.length > 0) {
			this.productS.uploadFile('api/itemshopping/trackingfile/' + itemId, 'file', this.fileToUpload).subscribe(result => {
				this.toast.success('Your tracking\'s Image has been upload successfully!', 'Well Done', { positionClass: 'toast-top-right' });
			}, error => {
				this.toast.error('Something wrong happened, please try again', 'Error', { positionClass: 'toast-top-right' });
			});
		}
	}

	closeForm() {
		this.showPopup = false;
	}

	getDates(value) {
		const date = new Date(value);
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
		this.date = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() + ' ' + hours + ':' + minutes + ' ' + ampm;
	}

	showModal(id, action, index) {
		let sellerETA = jQuery(`#epa${id}`).val()
		this.index = index;
		console.log("index Modal", this.index);

		if ((sellerETA !== '' && sellerETA !== undefined) || action === 'cancel') {
			this.citemId = id;
			this.action = action;

			jQuery('#confirm').modal('show');
		} else {
			this.toast.error('Please select a Expected Delivery Time before Confirm the order', 'Error', { positionClass: 'toast-top-right' });
		}
	}

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

	public stateValidForCancelnOrder(citem) {
		// console.log(citem);
		// console.log(citem.status.id !== '5c017ae247fb07027943a404' || citem.status.id !== '5c017af047fb07027943a405' || citem.status.id !== '5c06f4bf7650a503f4b731fd');
		// console.log(citem.status.id !== '5c017ae247fb07027943a404' && citem.status.id !== '5c017af047fb07027943a405' && citem.status.id !== '5c06f4bf7650a503f4b731fd');
		// return citem.status.id !== '5c017ae247fb07027943a404' && citem.status.id !== '5c017af047fb07027943a405' && citem.status.id !== '5c06f4bf7650a503f4b731fd';
		return citem.status.id === '5c017af047fb07027943a405';
	}
}

