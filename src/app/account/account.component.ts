import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../services/product.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl,SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  loggedIn:boolean = false;
  info:any;
  store:any = {
    name:"",
    description: "",
    location: "",
    type:"",
    productType:"",
    email:"",
    Address:"",
    City:"",
    zipCode:""
  };
  logo:any;
  storeEndpoint:any = "api/store/user/";
  heroEndpoint:any = 'api/store/hero/';
  buttonText:string;
  new:boolean = false;
  fileToUpload: any = [];
  base:string="https://apiseafood.senorcoders.com";
  hero:any;
  fileHero:any = [];
  heroSlider:SafeStyle;
  password:any = "";
  repassword:string;
  currentPassword:string;
  email:string;
  countries=[
    {name: "Afghanistan", code: "AF"},
    {name: "Åland Islands", code: "AX"},
    {name: "Albania", code: "AL"},
    {name: "Algeria", code: "DZ"},
    {name: "American Samoa", code: "AS"},
    {name: "AndorrA", code: "AD"},
    {name: "Angola", code: "AO"},
    {name: "Anguilla", code: "AI"},
    {name: "Antarctica", code: "AQ"},
    {name: "Antigua and Barbuda", code: "AG"},
    {name: "Argentina", code: "AR"},
    {name: "Armenia", code: "AM"},
    {name: "Aruba", code: "AW"},
    {name: "Australia", code: "AU"},
    {name: "Austria", code: "AT"},
    {name: "Azerbaijan", code: "AZ"},
    {name: "Bahamas", code: "BS"},
    {name: "Bahrain", code: "BH"},
    {name: "Bangladesh", code: "BD"},
    {name: "Barbados", code: "BB"},
    {name: "Belarus", code: "BY"},
    {name: "Belgium", code: "BE"},
    {name: "Belize", code: "BZ"},
    {name: "Benin", code: "BJ"},
    {name: "Bermuda", code: "BM"},
    {name: "Bhutan", code: "BT"},
    {name: "Bolivia", code: "BO"},
    {name: "Bosnia and Herzegovina", code: "BA"},
    {name: "Botswana", code: "BW"},
    {name: "Bouvet Island", code: "BV"},
    {name: "Brazil", code: "BR"},
    {name: "British Indian Ocean Territory", code: "IO"},
    {name: "Brunei Darussalam", code: "BN"},
    {name: "Bulgaria", code: "BG"},
    {name: "Burkina Faso", code: "BF"},
    {name: "Burundi", code: "BI"},
    {name: "Cambodia", code: "KH"},
    {name: "Cameroon", code: "CM"},
    {name: "Canada", code: "CA"},
    {name: "Cape Verde", code: "CV"},
    {name: "Cayman Islands", code: "KY"},
    {name: "Central African Republic", code: "CF"},
    {name: "Chad", code: "TD"},
    {name: "Chile", code: "CL"},
    {name: "China", code: "CN"},
    {name: "Christmas Island", code: "CX"},
    {name: "Cocos (Keeling) Islands", code: "CC"},
    {name: "Colombia", code: "CO"},
    {name: "Comoros", code: "KM"},
    {name: "Congo", code: "CG"},
    {name: "Congo, The Democratic Republic of the", code: "CD"},
    {name: "Cook Islands", code: "CK"},
    {name: "Costa Rica", code: "CR"},
    {name: "Cote DIvoire", code: "CI"},
    {name: "Croatia", code: "HR"},
    {name: "Cuba", code: "CU"},
    {name: "Cyprus", code: "CY"},
    {name: "Czech Republic", code: "CZ"},
    {name: "Denmark", code: "DK"},
    {name: "Djibouti", code: "DJ"},
    {name: "Dominica", code: "DM"},
    {name: "Dominican Republic", code: "DO"},
    {name: "Ecuador", code: "EC"},
    {name: "Egypt", code: "EG"},
    {name: "El Salvador", code: "SV"},
    {name: "Equatorial Guinea", code: "GQ"},
    {name: "Eritrea", code: "ER"},
    {name: "Estonia", code: "EE"},
    {name: "Ethiopia", code: "ET"},
    {name: "Falkland Islands (Malvinas)", code: "FK"},
    {name: "Faroe Islands", code: "FO"},
    {name: "Fiji", code: "FJ"},
    {name: "Finland", code: "FI"},
    {name: "France", code: "FR"},
    {name: "French Guiana", code: "GF"},
    {name: "French Polynesia", code: "PF"},
    {name: "French Southern Territories", code: "TF"},
    {name: "Gabon", code: "GA"},
    {name: "Gambia", code: "GM"},
    {name: "Georgia", code: "GE"},
    {name: "Germany", code: "DE"},
    {name: "Ghana", code: "GH"},
    {name: "Gibraltar", code: "GI"},
    {name: "Greece", code: "GR"},
    {name: "Greenland", code: "GL"},
    {name: "Grenada", code: "GD"},
    {name: "Guadeloupe", code: "GP"},
    {name: "Guam", code: "GU"},
    {name: "Guatemala", code: "GT"},
    {name: "Guernsey", code: "GG"},
    {name: "Guinea", code: "GN"},
    {name: "Guinea-Bissau", code: "GW"},
    {name: "Guyana", code: "GY"},
    {name: "Haiti", code: "HT"},
    {name: "Heard Island and Mcdonald Islands", code: "HM"},
    {name: "Holy See (Vatican City State)", code: "VA"},
    {name: "Honduras", code: "HN"},
    {name: "Hong Kong", code: "HK"},
    {name: "Hungary", code: "HU"},
    {name: "Iceland", code: "IS"},
    {name: "India", code: "IN"},
    {name: "Indonesia", code: "ID"},
    {name: "Iran, Islamic Republic Of", code: "IR"},
    {name: "Iraq", code: "IQ"},
    {name: "Ireland", code: "IE"},
    {name: "Isle of Man", code: "IM"},
    {name: "Israel", code: "IL"},
    {name: "Italy", code: "IT"},
    {name: "Jamaica", code: "JM"},
    {name: "Japan", code: "JP"},
    {name: "Jersey", code: "JE"},
    {name: "Jordan", code: "JO"},
    {name: "Kazakhstan", code: "KZ"},
    {name: "Kenya", code: "KE"},
    {name: "Kiribati", code: "KI"},
    {name: "Korea, Democratic People S Republic of", code: "KP"},
    {name: "Korea, Republic of", code: "KR"},
    {name: "Kuwait", code: "KW"},
    {name: "Kyrgyzstan", code: "KG"},
    {name: "Lao People S Democratic Republic", code: "LA"},
    {name: "Latvia", code: "LV"},
    {name: "Lebanon", code: "LB"},
    {name: "Lesotho", code: "LS"},
    {name: "Liberia", code: "LR"},
    {name: "Libyan Arab Jamahiriya", code: "LY"},
    {name: "Liechtenstein", code: "LI"},
    {name: "Lithuania", code: "LT"},
    {name: "Luxembourg", code: "LU"},
    {name: "Macao", code: "MO"},
    {name: "Macedonia, The Former Yugoslav Republic of", code: "MK"},
    {name: "Madagascar", code: "MG"},
    {name: "Malawi", code: "MW"},
    {name: "Malaysia", code: "MY"},
    {name: "Maldives", code: "MV"},
    {name: "Mali", code: "ML"},
    {name: "Malta", code: "MT"},
    {name: "Marshall Islands", code: "MH"},
    {name: "Martinique", code: "MQ"},
    {name: "Mauritania", code: "MR"},
    {name: "Mauritius", code: "MU"},
    {name: "Mayotte", code: "YT"},
    {name: "Mexico", code: "MX"},
    {name: "Micronesia, Federated States of", code: "FM"},
    {name: "Moldova, Republic of", code: "MD"},
    {name: "Monaco", code: "MC"},
    {name: "Mongolia", code: "MN"},
    {name: "Montserrat", code: "MS"},
    {name: "Morocco", code: "MA"},
    {name: "Mozambique", code: "MZ"},
    {name: "Myanmar", code: "MM"},
    {name: "Namibia", code: "NA"},
    {name: "Nauru", code: "NR"},
    {name: "Nepal", code: "NP"},
    {name: "Netherlands", code: "NL"},
    {name: "Netherlands Antilles", code: "AN"},
    {name: "New Caledonia", code: "NC"},
    {name: "New Zealand", code: "NZ"},
    {name: "Nicaragua", code: "NI"},
    {name: "Niger", code: "NE"},
    {name: "Nigeria", code: "NG"},
    {name: "Niue", code: "NU"},
    {name: "Norfolk Island", code: "NF"},
    {name: "Northern Mariana Islands", code: "MP"},
    {name: "Norway", code: "NO"},
    {name: "Oman", code: "OM"},
    {name: "Pakistan", code: "PK"},
    {name: "Palau", code: "PW"},
    {name: "Palestinian Territory, Occupied", code: "PS"},
    {name: "Panama", code: "PA"},
    {name: "Papua New Guinea", code: "PG"},
    {name: "Paraguay", code: "PY"},
    {name: "Peru", code: "PE"},
    {name: "Philippines", code: "PH"},
    {name: "Pitcairn", code: "PN"},
    {name: "Poland", code: "PL"},
    {name: "Portugal", code: "PT"},
    {name: "Puerto Rico", code: "PR"},
    {name: "Qatar", code: "QA"},
    {name: "Reunion", code: "RE"},
    {name: "Romania", code: "RO"},
    {name: "Russian Federation", code: "RU"},
    {name: "RWANDA", code: "RW"},
    {name: "Saint Helena", code: "SH"},
    {name: "Saint Kitts and Nevis", code: "KN"},
    {name: "Saint Lucia", code: "LC"},
    {name: "Saint Pierre and Miquelon", code: "PM"},
    {name: "Saint Vincent and the Grenadines", code: "VC"},
    {name: "Samoa", code: "WS"},
    {name: "San Marino", code: "SM"},
    {name: "Sao Tome and Principe", code: "ST"},
    {name: "Saudi Arabia", code: "SA"},
    {name: "Senegal", code: "SN"},
    {name: "Serbia and Montenegro", code: "CS"},
    {name: "Seychelles", code: "SC"},
    {name: "Sierra Leone", code: "SL"},
    {name: "Singapore", code: "SG"},
    {name: "Slovakia", code: "SK"},
    {name: "Slovenia", code: "SI"},
    {name: "Solomon Islands", code: "SB"},
    {name: "Somalia", code: "SO"},
    {name: "South Africa", code: "ZA"},
    {name: "South Georgia and the South Sandwich Islands", code: "GS"},
    {name: "Spain", code: "ES"},
    {name: "Sri Lanka", code: "LK"},
    {name: "Sudan", code: "SD"},
    {name: "Suriname", code: "SR"},
    {name: "Svalbard and Jan Mayen", code: "SJ"},
    {name: "Swaziland", code: "SZ"},
    {name: "Sweden", code: "SE"},
    {name: "Switzerland", code: "CH"},
    {name: "Syrian Arab Republic", code: "SY"},
    {name: "Taiwan, Province of China", code: "TW"},
    {name: "Tajikistan", code: "TJ"},
    {name: "Tanzania, United Republic of", code: "TZ"},
    {name: "Thailand", code: "TH"},
    {name: "Timor-Leste", code: "TL"},
    {name: "Togo", code: "TG"},
    {name: "Tokelau", code: "TK"},
    {name: "Tonga", code: "TO"},
    {name: "Trinidad and Tobago", code: "TT"},
    {name: "Tunisia", code: "TN"},
    {name: "Turkey", code: "TR"},
    {name: "Turkmenistan", code: "TM"},
    {name: "Turks and Caicos Islands", code: "TC"},
    {name: "Tuvalu", code: "TV"},
    {name: "Uganda", code: "UG"},
    {name: "Ukraine", code: "UA"},
    {name: "United Arab Emirates", code: "AE"},
    {name: "United Kingdom", code: "GB"},
    {name: "United States", code: "US"},
    {name: "United States Minor Outlying Islands", code: "UM"},
    {name: "Uruguay", code: "UY"},
    {name: "Uzbekistan", code: "UZ"},
    {name: "Vanuatu", code: "VU"},
    {name: "Venezuela", code: "VE"},
    {name: "Viet Nam", code: "VN"},
    {name: "Virgin Islands, British", code: "VG"},
    {name: "Virgin Islands, U.S.", code: "VI"},
    {name: "Wallis and Futuna", code: "WF"},
    {name: "Western Sahara", code: "EH"},
    {name: "Yemen", code: "YE"},
    {name: "Zambia", code: "ZM"},
    {name: "Zimbabwe", code: "ZW"}
];
  constructor(private sanitizer: DomSanitizer,private auth: AuthenticationService,private toast:ToastrService, public productService: ProductService) { }

  ngOnInit() {
    if(this.auth.isLogged()){
      this.loggedIn = true;
      this.getPersonalData();
    }
  }
  getPersonalData(){
    this.info = this.auth.getLoginData();
    this.getStoreData();
  }
  getStoreData(){
    this.productService.getData(this.storeEndpoint+this.info['id']).subscribe(result =>{
      let res:any = result;
      if(typeof res !== 'undefined' && res.length > 0){
        this.store = result[0];
        this.logo = result[0].logo;
        this.hero = result[0].heroImage;
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${this.store.heroImage})`);
        this.buttonText = "Update";
        this.new = false;
      }else{
        this.buttonText = "Create";
        this.new = true;
      }
    })
  }
  onSubmit(){
    console.log("To send", this.info);
    this.productService.updateData('user/'+this.info.id, this.info).subscribe(result => {
        console.log("Resultado", result);
        this.toast.success("Your account information has beed updated successfully!",'Well Done',{positionClass:"toast-top-right"})

    }, error =>{
      this.toast.error("An error has occured", "Error",{positionClass:"toast-top-right"} );
    });
  }
  storeSubmit(){
    if(this.store.name!="" && this.store.description != "" && this.store.location != ""){
      if(this.new){
        this.createStore();
      }else{
        this.updateStore();
      }

    }else{
      this.toast.error("Your store needs a name, a description and location", "Error",{positionClass:"toast-top-right"} );

    }  
  }
  updateStore(){
    let storeToUpdate = {
      name:this.store.name,
      description: this.store.description,
      location: this.store.location,
      type:this.store.type,
      productType:this.store.productType,
      email:this.store.email,
      Address:this.store.Address,
      City:this.store.City,
      zipCode:this.store.zipCode
    }

    this.productService.updateData('store/'+this.store.id, storeToUpdate).subscribe(result=>{
      if(this.fileHero.length > 0 || this.fileToUpload.length>0){
        this.updateFile(this.store.id);
      }else{
        this.toast.success("Your store has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})

      }

    })
  }
  createStore(){
    let myStore = {
      owner: this.info['id'],
      name:this.store.name,
      description: this.store.description,
      location: this.store.location
    }
      this.productService.postStoreForm(myStore, this.fileToUpload).subscribe(result => {
        if(this.fileHero.length > 0 || this.fileToUpload.length>0){
          this.uploadHero(result[0]['id']);
        }else{
          this.toast.success("Your store has been created successfully!",'Well Done',{positionClass:"toast-top-right"})

        }

      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

      })
  }
  handleFileInput(files: FileList) {
    this.fileToUpload = files;
    console.log("Files", files);
  }
  handleFileHero(files: FileList){
    this.fileHero = files;
    console.log("Files", files);

  }
  updatePassword(){
    
      if(this.repassword == this.password){
        this.productService.updatePassword(this.info.email,this.currentPassword,this.password).subscribe(
          result=>{
            this.toast.success('Password has been changed successfully!', "Error",{positionClass:"toast-top-right"} );
            this.currentPassword='';
            this.password="";
            this.repassword='';
          },error=>{
            console.log(error)
            this.toast.error('Something wrong happened. Maybe your current password is not the correct one', "Error",{positionClass:"toast-top-right"} );
          }
        )
      }
      else{
        this.toast.error('Password and Repeat password not matched', "Error",{positionClass:"toast-top-right"} );
      }
  }
  uploadHero(id){
    this.productService.uploadFile(this.heroEndpoint+id, "hero", this.fileHero).subscribe(result => {
      this.toast.success("Your store has been created successfully!",'Well Done',{positionClass:"toast-top-right"})
      this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
      this.getStoreData();
    }, error => {
      this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

    })
  }
  updateFile(id){
    if(this.fileToUpload.length>0){
      this.productService.uploadFile('api/store/logo/'+id, "logo", this.fileToUpload).subscribe(result => {
        this.toast.success("Your store's logo has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData();
      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );
      })
    }
    if(this.fileHero.length > 0){
      this.productService.uploadFile(this.heroEndpoint+id, "hero", this.fileHero).subscribe(result => {
        this.toast.success("Your store's hero has been updated successfully!",'Well Done',{positionClass:"toast-top-right"})
        this.heroSlider=this.sanitizer.bypassSecurityTrustStyle(`url(${this.base}${result[0].heroImage})`);
        this.getStoreData();
      }, error => {
        this.toast.error(error, "Error",{positionClass:"toast-top-right"} );

      })
    }
  }
}
