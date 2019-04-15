import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CountriesService } from '../services/countries.service';
declare var jQuery: any;

@Component({
	selector: 'app-buyer',
	templateUrl: './buyer.component.html',
	styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {
	users: any;
	showLoading: boolean = true;
	buyerForm: FormGroup;
	user: any;
	countries: any = [];
	allCities: any = [];
	cities: any = [];
	constructor(private auth: AuthenticationService, private toast: ToastrService,
		private router: Router, private fb: FormBuilder, private product: ProductService,
		private countryService: CountriesService
	) { }

	ngOnInit() {
		this.getUsers();
		this.getAllCities();
    	this.getCountries();
		this.buyerForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			country: ['', Validators.required],
			email: ['', [Validators.email, Validators.required]],
			tel: [''],
			companyName: [''],
			fullBakingInfo: [''],
			TypeBusiness: [''],
			Address: [''],
			City: ['']

		});
	}
	userForm() {
		this.buyerForm = this.fb.group({
			firstName: [this.user.firstName, Validators.required],
			lastName: [this.user.lastName, Validators.required],
			country: [this.user.country, Validators.required],
			email: [this.user.email, [Validators.email, Validators.required]],
			tel: [this.user.dataExtra.tel],
			companyName: [this.user.companyName],
			fullBakingInfo: [this.user.dataExtra.fullBakingInfo],
			TypeBusiness: [this.user.dataExtra.TypeBusiness],
			Address: [this.user.dataExtra.Address],
			City: [this.user.dataExtra.City]

		});
	}
	getUsers() {
		this.auth.getData('user?where={"role":2}').subscribe(
			result => {
				this.users = result;
				this.showLoading = false;
			},
			e => {
				this.showLoading = false;
				console.log(e);
			}
		);
	}
	deleteUser(id) {
		this.product.deleteData('api/user/' + id).subscribe(
			result => {
				this.toast.success('User has been deleted', 'Well Done', { positionClass: 'toast-top-right' });
				this.getUsers();
			},
			e => {
				this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
				console.log(e);
			}
		);
	}
	showEditForm(id) {
		this.auth.getData('user/' + id).subscribe(
			result => {
				this.user = result;
				this.userForm();
			},
			e => {
				console.log(e);
				this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
			}
		);
	}
	editUser() {
		const data = this.buyerForm.value;

		const dataExtra = {
			'country': data.location,
			'tel': data.tel,
			'Address': data.Address,
			'City': data.City,
			'companyName': data.companyName,
			'TypeBusiness': data.TypeBusiness
		};
		data.dataExtra = dataExtra;
		console.log('buyer', data);
		this.product.updateData('user/' + this.user.id, data).subscribe(
			result => {
				this.toast.success('User has been edited', 'Well Done', { positionClass: 'toast-top-right' });
				jQuery('#editForm').modal('hide');
				console.log('hide form');
				this.buyerForm.reset();
				this.getUsers();

			},
			error => {
				this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
				console.log(error);
			}
		);
	}
	getAllCities() {
		this.countryService.getAllCities().subscribe(
		  result => {
			this.allCities = result;
			this.cities = result;
		  },
		  error => {
			console.log( error );
		  }
		);
	  }

	  getCountries() {
		this.countryService.getCountries().subscribe(
		  result => {
			this.countries = result;
		  },
		  error => {
			console.log(error);
		  }
		);
	  }

	  /*getCities() {
		this.countryService.getCities( this.country.value ).subscribe(
		  result => {
			this.cities = result[0].cities;
			this.myform.controls['city'].setValue(this.cities[0]['code']);

		  },
		  error => {

		  }
		);
	  }*/
}
