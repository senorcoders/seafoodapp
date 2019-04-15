import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
declare var jQuery: any;
@Component({
  selector: 'app-verify-user',
  templateUrl: './verify-user.component.html',
  styleUrls: ['./verify-user.component.scss']
})
export class VerifyUserComponent implements OnInit {
  users: any;
  selectedUser: string;
  showLoading: boolean = true;
  isInfo: boolean = false;
  showPopup: boolean = false;
  singleUser: any;
  deniedUser: FormGroup;
  denialType: FormControl;
  denialMessage: FormControl;
  store: any;
  id: any;
  buyers: any = [];
  sellers: any = [];

  //Pagination
  private skip = 0;
  private limit = 20;
  public count = 20;
  public paginationNumbers = [];
  public page = 0;

  constructor(private auth: AuthenticationService, private toast: ToastrService) { }

  ngOnInit() {
    this.getPendingUsers();
    this.createForm();
  }

  createForm() {
    this.denialMessage = new FormControl('', Validators.required);
    this.denialType = new FormControl('', Validators.required);

    this.deniedUser = new FormGroup({
      denialType: this.denialType,
      denialMessage: this.denialMessage
    });
  }

  getPendingUsers() {

    this.buyers = [];
    this.sellers = [];

    this.auth.getData(`user-not-verified?limit=${this.limit}&skip=${this.skip}`).subscribe(
      result => {
        let data: any = result;
        if (result && result != '') {
          console.log(result);
          this.users = data.users;
          this.count = data.count;
          this.showLoading = false
          this.isInfo = true
          this.splitUsers();
          this.calcPagination();
        }
        else {
          this.showLoading = false;
          this.isInfo = false
        }
      },
      e => {
        console.log(e)
        this.showLoading = false;
        this.isInfo = false
      }
    )
    
  }

  getPendingUsersWithPagination(index) {

    this.buyers = [];
    this.sellers = [];
    this.skip = this.limit * index;
    this.page = index;
    this.auth.getData(`user-not-verified?limit=${this.limit}&skip=${this.skip}`).subscribe(
      result => {
        let data: any = result;
        if (result && result != '') {
          console.log(result);
          this.users = data.users;
          this.count = data.count;
          this.showLoading = false
          this.isInfo = true
          this.splitUsers();
          this.calcPagination();
        }
        else {
          this.showLoading = false;
          this.isInfo = false
        }
      },
      e => {
        console.log(e)
        this.showLoading = false;
        this.isInfo = false
      }
    )

    
  }

  private calcPagination() {
    this.paginationNumbers = []; console.log(this.count);
    let length = this.count / 20;
    console.log(length);
    if (length < 1) {
      length = 0;
    } else if (length % 1 !== 0){
      length = parseInt(length.toString());
      length += 1
    };

    this.paginationNumbers = []; console.log(length);
    for (let i = 0; i < length; i++) {
      this.paginationNumbers.push(i);
    }
  }

  splitUsers() {
    this.users.forEach(element => {
      if (element.role == 2) {
        this.buyers.push(element);
      } else {
        this.sellers.push(element);
      }
    });
  }
  confirm(val) {
    if (val) {
      this.auth.acceptUser(`user/status/${this.id}/accepted`).subscribe(
        result => {
          this.id = '';
          jQuery('#confirm').modal('hide')
          this.toast.success('User has been accepted', 'Well Done', { positionClass: "toast-top-right" })
          this.getPendingUsers();
        },
        e => {
          this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
          console.log(e)
        }
      )
    }
    else {
      jQuery('#confirm').modal('hide')
    }
  }
  refuse() {

    this.auth.deniedUser(`user/status/${this.selectedUser}/denied`, this.deniedUser.value).subscribe(
      result => {
        this.toast.success('User has been refuse', 'Well Done', { positionClass: "toast-top-right" })
        this.getPendingUsers();
        jQuery("#deniedUser").modal('hide');
      },
      e => {
        this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: "toast-top-right" })
        console.log(e)
      }
    )
  }
  showConfirmModal(user_id: string) {
    this.selectedUser = user_id;
    jQuery('#deniedUser').modal('show');
  }

  popUp(i, where) {
    if (where == 'buyer') {
      this.singleUser = this.buyers[i];
    } else {
      this.singleUser = this.sellers[i];
    }
    console.log(this.singleUser);
    if (this.singleUser.role == 1) {
      this.store = ""
      this.auth.getData(`store?where={"owner":"${this.singleUser.id}"}`).subscribe(
        result => {
          this.store = result[0];
          console.log(this.store);
          jQuery("#popUp").modal('show');
          this.showPopup = true;
        },
        e => {
          this.store = ""
          console.log(e)
        }
      )
    }
    else {
      jQuery("#popUp").modal('show');
      this.showPopup = true;
    }
  }
  getRole(role) {
    if (role == 0) {
      return "Administrator"
    }
    else if (role == 1) {
      return "Seller"
    }
    else {
      return "Buyer"
    }
  }
  confirmModal(id) {
    this.id = id;
    jQuery('#confirm').modal('show')
  }
}
