import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import {ProductService} from '../services/product.service';
@Component({
  selector: 'app-confirmation-email',
  templateUrl: './confirmation-email.component.html',
  styleUrls: ['./confirmation-email.component.scss']
})
export class ConfirmationEmailComponent implements OnInit {

	userId:any;
  constructor(private route: ActivatedRoute, private product:ProductService) { }

  ngOnInit() {
  	this.route.params.subscribe(params => {
      this.userId= this.route.snapshot.params['userid'];
   	})
   	let data={
		"verified": true
		}
  	this.product.updateData('user/'+this.userId, data).subscribe(
  		result=>{
  		},
  		e=>{
  			console.log(e)
  		}
  	)

  }

}
