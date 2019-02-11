import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from 'ngx-toastr';
declare var jQuery: any;

@Component({
  selector: 'app-admin-logistic-managment',
  templateUrl: './admin-logistic-managment.component.html',
  styleUrls: ['./admin-logistic-managment.component.scss']
})
export class AdminLogisticManagmentComponent implements OnInit {
  orders: any = [];
  orderStatus: any = [];
  status: any;
  newStatus: any;
  orderNumber: any;
  user: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  rows:any =[];
  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();
    this.status = '0';
    this.getManagement();
  }

 


  getManagement(){
    this.productService.getData('api/shoppingcart/orderlogistic').subscribe(data => {
      console.log("Manag", data);
      this.rows = data;
    })

  }


}
