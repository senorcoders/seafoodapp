import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { environment } from '../../environments/environment.prod';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-product-list',
	templateUrl: './product-list.component.html',
	styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

	products: any;
	showLoading: boolean = true;
	showData: boolean = false;
	API: any = environment.apiURLImg;
	searchText: any;
	page: number;
	image = [];
	paginationNumbers: any = [];
	pageNumbers: any;
	showPrvP: boolean = false;
	showNextP: boolean = false;
	showPagination: boolean = false;
	constructor(private product: ProductService, private route: ActivatedRoute, private sanitizer: DomSanitizer, private router: Router) { }

	ngOnInit() {
		this.route.params.subscribe(params => {
			this.page = this.route.snapshot.params['number'];
			this.getProducts(this.page, 12);
		});

	}
	getProducts(page, cant) {
		const data = {
			pageNumber: page,
			numberProduct: cant
		};
		this.product.listProduct(data).subscribe(
			res => {
				this.showPagination = true;
				this.paginationNumbers = [];
				this.products = res['productos']
				this.pageNumbers = parseInt(res['pagesNumber']);
				for (let i = 1; i <= this.pageNumbers; i++) {
					this.paginationNumbers.push(i);
				}
				if (res['productos'].length > 0) {
					this.showData = true;
				}
				else {
					this.showData = false;
				}
				this.nextProductsExist();
				this.previousProductExist();
				this.showLoading = false;
				// working on the images to use like background
				this.products.forEach((data, index) => {
					if (data.imagePrimary && data.imagePrimary !== '') {
						this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.imagePrimary})`);
					} else if (data.images && data.images.length > 0) {
						this.image[index] = this.sanitizer.bypassSecurityTrustStyle(`url(${this.API}${data.images[0].src})`);
					} else {
						this.image[index] = this.sanitizer.bypassSecurityTrustStyle('url(../../assets/default-img-product.jpg)');
					}
				});
			},
			e => {
				this.showPagination = false;
				console.log(e)
			}
		)
	}
	nextProductsExist() {
		if (this.page < this.pageNumbers) {
			this.showNextP = true;
		} else {
			this.showNextP = false;
		}
	}
	previousProductExist() {
		if (this.page > 1) {
			this.showPrvP = true;
		} else {
			this.showPrvP = false;
		}
	}
	goTo(page, option) {
		this.paginationNumbers = [];
		this.router.navigate([`/products-list/page/${page}`]);
	}
	nextPage() {
		this.paginationNumbers = [];
		this.page++;
		this.router.navigate([`/products-list/page/${this.page}`]);
	}
	previousPage() {
		this.paginationNumbers = [];
		if (this.page > 1) {
			this.page--;
			this.router.navigate([`/products-list/page/${this.page}`]);
		} else {
			this.router.navigate([`/products-list/page/${this.page}`]);
		}
	}
	search(search) {
		this.showLoading = true
		this.product.saveData(`api/fish/search/1/100`, { search: search }).subscribe(
			res => {
				console.log(res);
				this.products = res['fish']
				this.showLoading = false
				this.showPagination = false
				this.showData = true
			},
			e => {
				console.log(e)
				this.showLoading = false
				this.showPagination = false;
				this.showData = false;
			}
		)
	}
	clear() {
		this.getProducts(1, 12);
	}

}
