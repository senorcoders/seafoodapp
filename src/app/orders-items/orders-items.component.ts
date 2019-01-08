import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { AuthenticationService } from '../services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { environment } from '../../environments/environment';
import { OrderService } from '../services/orders.service';
@Component({
  selector: 'app-orders-items',
  templateUrl: './orders-items.component.html',
  styleUrls: ['./orders-items.component.scss']
})
export class OrdersItemsComponent implements OnInit {
  shoppingCartId: any;
  products: any;
  showLoading: boolean = true;
  showData: boolean = false;
  images = [];
  API = environment.apiURLImg;
  reviewForm: FormGroup;
  showForm: boolean = false;
  user: any;
  Stars = [];
  count: number = 0;
  total: any;
  constructor(private productService: ProductService, private router: ActivatedRoute, private auth: AuthenticationService,
    private fb: FormBuilder, private toast: ToastrService, private sanitizer: DomSanitizer, private orderService: OrderService) { }

  ngOnInit() {
    this.user = this.auth.getLoginData();
    this.router.params.subscribe(params => {
      this.shoppingCartId = this.router.snapshot.params['id'];
      this.getItems();
    });
  }
  getItems() {
    this.productService.getData(`api/items/${this.user.id}/${this.shoppingCartId}`).subscribe(
      result => {
        this.products = result;
        this.getTotal();
        console.log( 'Order', this.products );
        this.showLoading = false;
        this.showData = true;
        this.getImages();
      },
      e => { console.log( e ); }
    );
  }
  getImages() {
    this.products.forEach((data, index) => {
      if (data.fish.imagePrimary && data.fish.imagePrimary !== '') {
        this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.imagePrimary})`);
      } else if (data.fish.images && data.fish.images !== '') {
        this.images[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.fish.images[0].src})`);
      } else {
        this.images[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
      }
    });
  }
  ShowReviewForm(store) {
    this.showForm = true;
    for (let i = 0; i <= 4; i++) {
      this.Stars[i] = i + 1;
    }
    this.reviewForm = this.fb.group({
      buyer: [this.user.id],
      store: [store],
      comment: ['', Validators.required],
      status: ['pending'],
      stars: [this.count]
    });
  }
  sendReview() {
    this.productService.saveData('reviewsstore', this.reviewForm.value).subscribe(
      result => {
        this.toast.success('Your comment will be check by the admin', 'Well Done', { positionClass: 'toast-top-right' });
        this.reviewForm.reset();
        this.count = 0;
        this.closeForm();
      },
      e => {
        console.log(e);
        this.toast.error('Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' });
      }
    );
  }
  closeForm() {
    this.showForm = false;
  }
  getstar(i) {
    this.count = i;
    this.reviewForm.get('stars').setValue(this.count);
  }
  submitFavorite(fav, IdFish, IdFavorite) {
    if (fav) {
      this.removeFavorite(IdFavorite);
    } else {
      this.addFavorite(IdFish);
    }
  }
  addFavorite(id) {
    const data = {
      user: this.user.id,
      fish: id
    };
    this.productService.saveData('FavoriteFish', data).subscribe(
      result => {
        this.getItems();
      },
      e => {
        console.log(e);
      }
    );
  }
  removeFavorite(id) {
    this.productService.deleteData('FavoriteFish/' + id).subscribe(
      result => {
        this.getItems();
      },
      e => {
        console.log(e);
      }
    );
  }


  getTotalxItem(count, price) {
    return count * price;
  }

  getTotal() {
    let subtotal: number = 0;
    let itemsProcessed: number = 0;

    this.products.forEach(element => {
      itemsProcessed++;
      subtotal += this.getTotalxItem(element.quantity.value, element.price.value);
      subtotal += element.shipping + element.uaeTaxes + element.customs + element.sfsMargin ;
      if (itemsProcessed === this.products.length) {
        this.total =  subtotal.toFixed(4);
      }
    });
  }

  cancelOrder( itemID: string ) {
    this.orderService.updateStatus ( '5c017b5a47fb07027943a40c', itemID, this.user ).subscribe(
      res => {
        this.toast.success('The item was cancelled', 'Well Done', { positionClass: 'toast-top-right' });
        this.getItems();
      },
      error => {
        this.toast.error( 'Something wrong happened, Please try again', 'Error', { positionClass: 'toast-top-right' } );
        console.log( error );
      }
    );
  }

}

