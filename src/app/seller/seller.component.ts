import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from '../toast.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { CountriesService } from '../services/countries.service';
declare var jQuery: any;
import * as moment from 'moment';

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
  user: any = {
    'dataExtra': ''

  };
  selectedIncoterm: string = '';
  incoterms: any = [];
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
  paginationNumbers = [];
  public skip = 0;
  public limit = 20;
  public page = 1;
  public count = 0;

  constructor(private sanitizer: DomSanitizer, private auth: AuthenticationService, private toast: ToastrService,
    private router: Router, private fb: FormBuilder, private productService: ProductService, private product: ProductService,
    private countryService: CountriesService) { }

  ngOnInit() {
    this.getUsers();
    this.getIncoterms();
    this.getAllCities();
    this.getCountries();
    this.sellerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      firstMileCost: [''],
      email: ['', [Validators.email, Validators.required]],
      tel: [''],
      uploadTradeLicense: [''],
      fullBakingInfo: [''],
      sfsAgreementForm: [''],
      ifLocal: [''],
      incoterms: ['']
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
    console.log(this.user);
    this.sellerForm = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      firstMileCost: [this.user.firstMileCost],
      email: [this.user.email, [Validators.email, Validators.required]],
      tel: [this.user.dataExtra.tel],
      uploadTradeLicense: [this.user.dataExtra.uploadTradeLicense],
      fullBakingInfo: [this.user.dataExtra.fullBakingInfo],
      sfsAgreementForm: [''],
      ifLocal: [this.user.dataExtra.ifLocal],
      incoterms: [this.user.incoterms]
    });
  }
  getIncoterms() {
    this.auth.getData('incoterms').subscribe(
      result => {
        this.incoterms = result;
      }, error => {
        console.log(error);
      }
    )
  }

  getUsers() {
    this.showLoading = true;
    this.auth.getData(`api/v2/user?where={"role":1}&limit=${this.limit}&page=1&infoLoginLast=true`).subscribe(
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
    this.auth.getData(`api/v2/user?where={"role":1}&limit=${this.limit}&page=${this.page}&infoLoginLast=true`).subscribe(
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
        if (this.user.hasOwnProperty('incoterms') && this.user['incoterms'] !== null) {
          this.selectedIncoterm = this.user.incoterms.id;
        } else {
          this.selectedIncoterm = '';
        }
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
      'tel': data.tel,
      "companyName": this.user.dataExtra['companyName'],
      "companyType": this.user.dataExtra['companyType'],
      "country": this.user.dataExtra['country'],
      "Address": this.user.dataExtra['Address'],
      "City": this.user.dataExtra['City'],
      "contactNumber": this.user.dataExtra['contactNumber'],
      "iban": this.user.dataExtra['iban'],
      "swiftCode": this.user.dataExtra['swiftCode'],
      "currencyTrade": this.user.dataExtra['currencyTrade'],
      "iso": this.user.dataExtra['iso'],
      "productsIntered": this.user.dataExtra['productsIntered'],
      "licenseNumber": this.user.dataExtra['licenseNumber'],
      "trade": this.user.dataExtra['trade']
    };
    data['incoterms'] = this.selectedIncoterm;


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
    if (this.user.dataExtra['companyName'] !== '') {

      this.updateStore();


    } else {
      this.toast.error('Please fill all the required fields', 'Error', { positionClass: 'toast-top-right' });

    }
  }
  updateStore() {

    let storeFullData = {
      "companyName": this.user.dataExtra['companyName'],
      "companyType": this.user.dataExtra['companyType'],
      "location": this.user.dataExtra['country'],
      "Address": this.user.dataExtra['Address'],
      "City": this.user.dataExtra['City'],
      "ContactNumber": this.user.dataExtra['contactNumber'],
      "CorporateBankAccountNumber": this.user.dataExtra['iban'],
      "CurrencyofTrade": this.user.dataExtra['currencyTrade'],
      "FoodSafetyCertificateNumber": this.user.dataExtra['iso'],
      "ProductsInterestedSelling": this.user.dataExtra['productsIntered'],
      "TradeBrandName": this.user.dataExtra['productsIntered'],
      "TradeLicenseNumber": this.user.dataExtra['licenseNumber']
    }

    this.productService.updateData('store/' + this.store.id, storeFullData).subscribe(result => {
      // update sfs files
      console.log("Store Updated", result);
      this.editUser();
      // this.toast.success('Your store has been updated successfully!', 'Well Done', { positionClass: 'toast-top-right' });
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

  public getLastLogin(user) {
    let last = user.lastLogin ? user.lastLogin.dateTime : null;
    if (last) return 'Last Login: ' + moment(last).format('MM/DD/YY hh:mm a') + ',';
    return '';
  }

}
