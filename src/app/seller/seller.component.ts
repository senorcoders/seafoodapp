import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CountriesService } from '../services/countries.service';
declare var jQuery: any;

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit {
  users: any;
  showLoading: boolean = true;
  sellerForm: FormGroup;
  base: string = environment.apiURLImg;
  user: any;
  countries: any = [];
  allCities: any = [];
  cities: any = [];
  info: any;
  store: any = {
    name: '',
    description: '',
    location: '',
    type: '',
    productType: '',
    email: '',
    Address: '',
    City: '',
    zipCode: ''
  };
  hero: any;
  heroSlider: SafeStyle;
  fileHero: any = [];
  fileToUpload: any = [];
  buttonText: any;
  HsImg: any;
  importImg: any;
  salesImg: any;
  tradeImg: any;
  logo: any;
  storeEndpoint: any = 'api/store/user/';
  heroEndpoint: any = 'api/store/hero/';
  fileSfs: any = [];

  constructor(private sanitizer: DomSanitizer, private auth: AuthenticationService, private toast: ToastrService,
    private router: Router, private fb: FormBuilder, private productService: ProductService, private product: ProductService,
    private countryService: CountriesService) { }

  ngOnInit() {
    this.getUsers();
    this.getAllCities();
    this.getCountries();
    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required],
      firstMileCost: [''],
      email: ['', [Validators.email, Validators.required]],
      tel: [''],
      uploadTradeLicense: [''],
      fullBakingInfo: [''],
      sfsAgreementForm: [''],
      ifLocal: [''],
    });
  }
  getPersonalData() {
    this.info = this.auth.getLoginData();
    console.log('Info', this.info);
  }
  getStoreData(id) {
    this.auth.getData(this.storeEndpoint + id).subscribe(result => {
      const res: any = result;
      console.log(result);
      if (typeof res !== 'undefined' && res.length > 0) {
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        this.heroSlider = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.store.heroImage})`);
        this.buttonText = 'Update';
        this.HsImg = result[0]['SFS_HSCode'];
        this.importImg = result[0]['SFS_ImportCode'];
        this.salesImg = result[0]['SFS_SalesOrderForm'];
        this.tradeImg = result[0]['SFS_TradeLicense'];
      } else {
        this.buttonText = 'update';
      }
    });
  }
  userForm() {
    this.sellerForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      country: [this.user.country, Validators.required],
      firstMileCost: [this.user.firstMileCost],
      email: [this.user.email, [Validators.email, Validators.required]],
      tel: [this.user.dataExtra.tel],
      uploadTradeLicense: [this.user.dataExtra.uploadTradeLicense],
      fullBakingInfo: [this.user.dataExtra.fullBakingInfo],
      sfsAgreementForm: [''],
      ifLocal: [this.user.dataExtra.ifLocal],
    });
  }
  getUsers() {
    this.auth.getData('user?where={"role":1}').subscribe(
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
        this.getStoreData(id);
        this.userForm();
      },
      e => {
        console.log(e);
        this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
      }
    );
  }
  editUser() {
    const data = this.sellerForm.value;
    const dataExtra = {
			'country': data.location,
			'tel': data.tel
    };
    data.dataExtra = dataExtra;
    // this.sellerForm.controls['firstMileCost'].setValue(5);
    console.log(data);
    console.log(this.sellerForm.controls['firstMileCost'].value);
    this.product.updateData('user/' + this.user.id, data).subscribe(
      result => {
        this.toast.success('User has been edited', 'Well Done', { positionClass: 'toast-top-right' });
        jQuery('#editForm').modal('hide');

        this.sellerForm.reset();
        this.getUsers();
      },
      error => {
        this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
        console.log(error);
      }
    );
  }
  updateFile(id) {
    if (this.fileToUpload.length > 0) {
      this.productService.uploadFile('api/store/logo/' + id, 'logo', this.fileToUpload).subscribe(result => {
        this.toast.success('Your store\'s logo has been updated successfully!', 'Well Done', { positionClass: 'toast-top-right' });
        this.heroSlider = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData(id);
      }, error => {
        this.toast.error(error, 'Error', { positionClass: 'toast-top-right' });
      });
    }
    if (this.fileHero.length > 0) {
      this.productService.uploadFile(this.heroEndpoint + id, 'hero', this.fileHero).subscribe(result => {
        this.toast.success('Your store\'s hero has been updated successfully!', 'Well Done', { positionClass: 'toast-top-right' });
        this.heroSlider = this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData(id);
      }, error => {
        this.toast.error(error, 'Error', { positionClass: 'toast-top-right' });

      });
    }
  }
  storeSubmit() {
    if (this.store.name !== '' && this.store.description !== '' && this.store.location !== '') {

      this.updateStore();


    } else {
      this.toast.error('Please fill all the required fields', 'Error', { positionClass: 'toast-top-right' });

    }
  }
  updateStore() {
    const storeToUpdate = {
      name: this.store.name,
      description: this.store.description,
      location: this.store.location,
      type: this.store.type,
      productType: this.store.productType,
      email: this.store.email,
      Address: this.store.Address,
      City: this.store.City,
      zipCode: this.store.zipCode
    };

    this.productService.updateData('store/' + this.store.id, storeToUpdate).subscribe(result => {
      // update sfs files
      if (this.fileSfs && this.fileSfs.length > 0) {
        if (this.fileSfs[0] && this.fileSfs[0].length > 0) {
          this.updateSfs(result['id'], 'SFS_SalesOrderForm', 0);
        }
        if (this.fileSfs[1] && this.fileSfs[1].length > 0) {
          this.updateSfs(result['id'], 'SFS_TradeLicense', 1);
        }
        if (this.fileSfs[2] && this.fileSfs[2].length > 0) {
          this.updateSfs(result['id'], 'SFS_ImportCode', 2);
        }
        if (this.fileSfs[3] && this.fileSfs[3].length > 0) {
          this.updateSfs(result['id'], 'SFS_HSCode', 3);
        }
      }
      if (this.fileHero.length > 0 || this.fileToUpload.length > 0) {
        this.updateFile(this.store.id);
      } else {
        this.toast.success('Your store has been updated successfully!', 'Well Done', { positionClass: 'toast-top-right' });

      }

    });
  }
  updateSfs(id, file, index) {
    this.showLoading = true;
    this.productService.updateFile('image/store/sfs/' + file + '/' + id, this.fileSfs[index]).subscribe(result => {
      this.toast.success(file + ' file uploaded', 'Well Done', { positionClass: 'toast-top-right' });
      this.getStoreData(id);
      this.showLoading = false;
    }, error => {
      this.toast.error(error, 'Error', { positionClass: 'toast-top-right' });

    });
  }
  uploadSfsImages(id) {
    this.showLoading = true;
    this.productService.sfsFiles('api/store/sfs/' + id, 'sfs', this.fileSfs).subscribe(result => {
      this.toast.success('Sfs files uploaded', 'Well Done', { positionClass: 'toast-top-right' });
      this.getStoreData(id);
      this.showLoading = false;
    }, error => {
      this.toast.error(error, 'Error', { positionClass: 'toast-top-right' });

    });
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
  }
  handleFileHero(files: FileList) {
    this.fileHero = files;
  }
  handleFileSfs(files: FileList, i) {
    this.fileSfs[i] = files;
    console.log(this.fileSfs);
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
