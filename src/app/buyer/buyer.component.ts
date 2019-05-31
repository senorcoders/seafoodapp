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
			additionalItems: ['']

		});
	}
	userForm() {
		this.buyerForm = this.fb.group({
			firstName: [this.user.firstName, Validators.required],
			lastName: [this.user.lastName, Validators.required],
			country: [this.user.dataExtra.country, Validators.required],
			email: [this.user.email, [Validators.email, Validators.required]],
			tel: [this.user.dataExtra.tel],
			companyName: [this.user.dataExtra.companyName],
			TypeBusiness: [this.user.dataExtra.typeBusiness],
			Address: [this.user.dataExtra.Address],
			City: [this.user.dataExtra.City],
			vat: [this.user.dataExtra.vat],
			productsInterestedinBuying: [this.user.dataExtra.productsInterestedinBuying],
			additionalItems: [this.user.dataExtra.additionalItems]

		});
	}

	getUsers() {
    this.showLoading = true;
    this.auth.getData(`api/v2/user?where={"role":2}&limit=${this.limit}&page=1`).subscribe(
      result=> {
        let r = result as any;
        if(r.message=== 'ok'){
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
		const data = this.buyerForm.value;

		const dataExtra = {
			'country': data.location,
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
