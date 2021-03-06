import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
declare var jQuery: any;
import { environment } from '../../environments/environment';
import { CountriesService } from '../services/countries.service';

@Component({
	selector: 'app-administrator',
	templateUrl: './administrator.component.html',
	styleUrls: ['./administrator.component.scss']
})
export class AdministratorComponent implements OnInit {
	users: any;
	userLists: any = [];
	showEmailVerification: boolean = false;
	adminForm: FormGroup;
	admins: any;
	roles: any = [];
	countries: any = [];
	allCities: any = [];
	cities: any = [];
	constructor(
		private auth: AuthenticationService,
		private toast: ToastrService,
		private fb: FormBuilder,
		private countryService: CountriesService) {}

	ngOnInit() {
		this.getUsers();
		this.getAdmins();
		this.getAllCities();
		this.getCountries();
		jQuery('.users').select2();
		jQuery('.users').on('change', (e) => {
			const name = jQuery('.users option:selected').text();
			this.prepareUsers(e.target.value, name);
		});
		this.adminForm = this.fb.group({
			firstName: ['', Validators.required],
			lastName: ['', Validators.required],
			location: ['', Validators.required],
			email: ['', [Validators.email, Validators.required]],
			password: ['', Validators.required],
			rePassword: ['', Validators.required],
			tel: ['', Validators.required]
		});
	}
	getUsers() {
		this.auth.getData('user?where={"role":{">":0}}').subscribe(
			result => {
				this.users = result;
			},
			e => {
				console.log(e);
			}
		);
	}
	getAdmins() {
		this.auth.getData('api/user/admins').subscribe(
			result => {
				this.admins = result;
			},
			e => {
				console.log(e);
			}
		);
	}
	prepareUsers(id, name) {
		this.userLists.push({ id: id, name: name });
	}
	updateUser() {
		this.userLists.forEach((data) => {
			this.auth.editUser('user/' + data.id, 0).subscribe(
				result => {
					this.toast.success('User: ' + data.name + ' is administrator', 'Well Done', { positionClass: 'toast-top-right' });
					this.userLists = [];
					this.getAdmins();
				},
				e => {
					this.toast.error('Something wrong happened, try again', 'Error', { positionClass: 'toast-top-right' });
					console.log(e);
				}
			);
		});
	}
	deleteUser(id) {
		this.userLists.splice(id, 1);
	}
	register() {
		if (this.adminForm.get('password').value === this.adminForm.get('rePassword').value) {
			const dataExtra = {
				'country': this.adminForm.get('location').value,
				'tel': this.adminForm.get('tel').value
			};
			this.auth.register(this.adminForm.value, 0, dataExtra).subscribe(
				result => {
					this.toast.success('New Admin Added', 'Well Done', { positionClass: 'toast-top-right' });
					this.adminForm.reset();
					this.getAdmins();
					this.getUsers();
				},
				error => {
					this.toast.error('Something wrong happened, try again', 'Error', { positionClass: 'toast-top-right' });
					console.log(error);
				}
			);
		} else {
			this.toast.error('Passwords not match', 'Error', { positionClass: 'toast-top-right' });
		}

	}
	// save roles to after delete them
	newRole(i, e, id) {
		// if select something different to choose a role. add the value to the array
		if (e !== '') {
			this.roles.push({ index: i, val: e, id: id });
		} else {
			this.roles.splice(i, 1);
		}
		console.log(this.roles);
	}
	// remove admin privileges
	removePrivilege(i) {
		this.roles.forEach((data, index) => {
			if (data.index === i) {
				this.auth.editUser('user/' + data.id, data.val).subscribe(
					result => {
						this.toast.success('Administrator was changed', 'Well Done', { positionClass: 'toast-top-right' });
						this.userLists = [];
						console.log(index);
						this.roles.splice(index, 1);
						this.getUsers();
					},
					e => {
						this.toast.error('Something wrong happened, try again', 'Error', { positionClass: 'toast-top-right' });
						console.log(e);
					}
				);
			}
		});
	}
	updateTable() {
		this.getAdmins();
	}
	verifyEmail(email) {
		this.auth.getData(`user?where={"email":{"like":"${email}"}}`).subscribe(
			result => {
				console.log(result);
				// if return data it means that email is already used
				if (result && result['length'] > 0) {
					this.showEmailVerification = true;
				} else {
					this.showEmailVerification = false;
				}
			}, e => { this.showEmailVerification = false; }
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
