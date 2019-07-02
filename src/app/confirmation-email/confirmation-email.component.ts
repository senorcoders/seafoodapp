import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
@Component({
	selector: 'app-confirmation-email',
	templateUrl: './confirmation-email.component.html',
	styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {
	userId: any;
	code: string;
	verified: number = 0;
	
	constructor(private router:Router, private route: ActivatedRoute, private product: ProductService) {
	

	 }

	ngOnInit() {
	
				this.route.params.subscribe(params => {
								this.userId = this.route.snapshot.params['userid'];
								this.code = this.route.snapshot.params['code'];

								// this.product.updateData('user/'+this.userId, data).subscribe(
								this.product.getData( `api/verification/${this.userId}/${this.code}` ).subscribe(
									result => {
										console.log("resultado", result);
										if ( result['message'] === 'valid' ) {
											this.verified = 0;
										} else {
											this.verified = 1;
										}
										this.router.navigate(['/login'], {queryParams: {verified: true}});

									},
									e => {
										console.log(e);
									}
								);
						});
					}

}
