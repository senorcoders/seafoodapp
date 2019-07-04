import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
	public skip = 0;
	public limit = 20;
	public page = 1;
	public paginationNumbers = [];

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
			TypeBusiness: [''],
			Address: [''],
			City: [''],
			vat: [''],
			productsInterestedinBuying: [''],
			additionalItems: [''],
			cod: [false, Validators.required],
			limit: [1, Validators.nullValidator]
		});

	}
	userForm() {
		let cod = (this.user.cod !== undefined && this.user.cod !== null && this.user.cod.usage === true);
		console.log(cod);
		let limit = "";
		/*if (cod === true) {
			limit = parseFloat(this.user.cod.limit).toFixed(2);
			this.buyerForm.setControl("limit", new FormControl(Number(limit) <= 0 ? "" : limit, Validators.required));
		}*/
		this.buyerForm.patchValue({
			firstName: this.user.firstName,
			lastName: this.user.lastName,
			country: this.user.dataExtra.country,
			email: this.user.email,
			tel: this.user.dataExtra.tel,
			companyName: this.user.dataExtra.companyName,
			TypeBusiness: this.user.dataExtra.typeBusiness,
			Address: this.user.dataExtra.Address,
			City: this.user.dataExtra.City,
			vat: this.user.dataExtra.vat,
			productsInterestedinBuying: this.user.dataExtra.productsInterestedinBuying,
			additionalItems: this.user.dataExtra.additionalItems,
			cod,
			limit
		});
	}

	changeCOD() {
		console.log("changed");
		if (this.buyerForm.value.cod === true) {
			this.buyerForm.setControl("limit", new FormControl("", Validators.required));
		} else {
			this.buyerForm.setControl("limit", new FormControl("", Validators.nullValidator));
		}
	}

	getUsers() {
		this.showLoading = true;
		this.auth.getData(`api/v2/user?where={"role":2}&limit=${this.limit}&page=1`).subscribe(
			result => {
				let r = result as any;
				if (r.message === 'ok') {
					this.users = r.data;
					this.calcPagination(r.pageAvailables);
				}
				this.showLoading = false;
			},
			e => {
				this.showLoading = false;
				console.log(e);
			}
		);
	}

	getUsersWithPagination(index) {
		this.showLoading = true;
		this.users = [];
		this.page = index;
		this.auth.getData(`api/v2/user?where={"role":2}&limit=${this.limit}&page=${this.page}`).subscribe(
			result => {
				let data: any = result;
				if (data.message === 'ok') {
					this.users = data.data;
					// this.count = data.count;
					this.calcPagination(data.pageAvailables);
				}

				this.showLoading = false;
			},
			e => {
				console.log(e)
				this.showLoading = false;
			}
		)


	}

	private calcPagination(length) {
		this.paginationNumbers = [];
		for (let i = 0; i < length; i++) {
			this.paginationNumbers.push(i);
		}
	}

	public nextPage() {
		this.paginationNumbers = [];
		this.page++;
		this.getUsersWithPagination(this.page);
	}

	public previousPage() {
		this.paginationNumbers = [];
		if (this.page > 1) {
			this.page--;
		}
		this.getUsersWithPagination(this.page);
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
		console.log(this.buyerForm)
		const data = this.buyerForm.value;

		const dataExtra = {
			'country': data.country,
			'tel': data.tel,
			'Address': data.Address,
			'City': data.City,
			'companyName': data.companyName,
			'TypeBusiness': data.TypeBusiness,
			"vat": data.vat,
			'additionalItems': data.additionalItems,
			'productsInterestedinBuying': data.productsInterestedinBuying
		};
		data.dataExtra = dataExtra;
		const usage = data.cod;
		const limit = usage === true && isNaN(data.limit) === false ? Number(parseFloat(data.limit).toFixed(2)) : 0;
		data.updateCOD = { usage, limit };
		console.log('buyer', data);
		this.product.updateData('api/v2/user/update/' + this.user.id, data).subscribe(
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
				console.log(error);
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
