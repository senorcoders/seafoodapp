import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { OrderService } from '../services/orders.service';
import { AuthenticationService } from '../services/authentication.service';
import { ToastrService } from '../toast.service';
import * as moment from 'moment';
import { environment } from '../../environments/environment';
declare var jQuery: any;

@Component({
  selector: 'app-admin-logistic-managment',
  templateUrl: './admin-logistic-managment.component.html',
  styleUrls: ['./admin-logistic-managment.component.scss']
})
export class AdminLogisticManagmentComponent implements OnInit {
  orders: any = [];
  orderStatus: any = [];
  status = "0";
  newStatus: any;
  public orderNumber = "";
  user: any;
  selectedStatus: string;
  selectedItemID: string;
  showNoData: boolean = false;
  rows: any = [];
  public useFilterDate = false;
   API:any = environment.apiURL;

  public date1 = new Date();
  public date2 = new Date();

  public page = 1;
  public limit = 20;
  public paginationNumbers = [];
  public type = "all";

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private toast: ToastrService,
    private auth: AuthenticationService) { }

 ngOnInit() {
    this.date2.setMonth(new Date().getMonth()+ 1);
    this.user = this.auth.getLoginData();
    this.status = '0';
    this.getManagement(true);
    this.getStatus();
  }

  getStatus() {
    this.orderService.getLogisticOrderStatus().subscribe(
      res => {
        this.orderStatus = res;
      },
      error => {
        console.log(error);
        this.toast.error('Something happend, please refresh the page', 'System Error', { positionClass: 'toast-top-right' });
      }
    );
  }


  getManagement(pagination?) {
    if(pagination)
      this.page = 1;
    this.productService.getData(`api/v2/shoppingcart/orderlogistic?page=${this.page}&limit=${this.limit}&type=${this.type}`).subscribe(data => {
      this.calcPagination(data["pageAvailables"]);
      console.log("Ordenes", data);
      this.rows = (data["data"] as any[]).map(it => {
        if (typeof it.paidDateTime === 'string' && it.paidDateTime !== "")
          it.paidDateTime = new Date(it.paidDateTime);

        return it; 
      });
    })

  }

  public getOrdersPage(page){
    this.page = page;
    this.getManagement();
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
    this.getManagement();
  }

  public previousPage() {
    this.paginationNumbers = [];
      if (this.page > 1) {
        this.page--;
      }
      this.getManagement();
  }

  updateStatus() {
    let selectedStatus: string;
    let statusName: string = this.selectedStatus;
    let itemID: string = this.selectedItemID;

    this.orderStatus.map(status => {
      if (status.status === statusName) {
        selectedStatus = status.id;
      }
    });
    this.orderService.updateStatus(selectedStatus, itemID, this.user).subscribe(
      result => {
        this.toast.success(`Item marked as ${statusName}!`, 'Status Change', { positionClass: 'toast-top-right' });
        jQuery('#confirmUpdateStatus').modal('hide');
        this.getManagement(true);
      },
      error => {
        console.log(error);
      }
    );
    console.log('status', selectedStatus);
    console.log('item', itemID);
  }

  noUpdate() {
    jQuery('#confirmUpdateStatus').modal('hide');
  }

  confirmUpdatestatus(selectedStatus, selectedItemID) {
    this.selectedStatus = selectedStatus;
    this.selectedItemID = selectedItemID;
    jQuery('#confirmUpdateStatus').modal('show');
  }

  public filterDateChange(){
  }

  //funcion solo para recargar el bind de los elementos
  public getOrders() { }

  public filter(item) {
    let status = true, statusItems = 0;
    //Comprobamos si todos los items son falsos
    if (this.status !== "0") {
      for (let i of item.items) {
        if (this.filterStatus(i) === false) {
          statusItems += 1;
        }
      }
      if (item.items.length === statusItems) status = false;
    }
    //Ahora hacemos filtros por date paid
    if(status === true && this.useFilterDate === true){
      let date = moment(item.paidDateTime);
      status = date.isBetween(this.date1, this.date2);
    }

    if (status === true && this.orderNumber !== "") status = item.orderNumber.toString().includes(this.orderNumber);
    return status;
  }

  public filterStatus(item) {
    let status = true;
    // if (item.orderStatus === null || item.orderStatus === undefined) return false;
    if (this.status !== "0") status = this.status === item.status;
    return status;
  }

  public clearFilters() {
    this.status = "0";
    this.orderNumber = "";
  }

  public mapDocs(doc) {
    let file = doc.split("/");
    if (file[3] != undefined) {
  
      return `<a download href="${this.API}api/itemshopping/${file[2]}/shipping-documents/${file[3]}/"><i class="fa fa-file-o" aria-hidden="true"></i> ${file[3]}</a>`
    }
  }




}
