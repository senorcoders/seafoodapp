import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
import { ToastrService } from '../toast.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {
  pendingcomments:any;
  acceptedComments:any;
  showPending=false;
  showLoading:boolean=true;
  showAcceptedComments:boolean=false
  constructor(private productService:ProductService, private toast:ToastrService) { }

 ngOnInit() {
  	this.getCommentsPending();
  	this.getCommentAccepted();
  }
  getCommentsPending(){
  	this.productService.getData('reviewsstore?where={"status":{"like":"pending"}}').subscribe(
  		result=>{
  			if(result && result['length']>0){
  				this.pendingcomments=result
  			}
  			else{
  				this.showPending=true
  			}
  			this.showLoading=false
  		},
  		e=>{
  			this.showPending=true
  			console.log(e)
  		}
  	)
  }
  acceptComment(id){
  	let data={
  		status:"accepted"
  	}
  	this.productService.updateData('reviewsstore/'+id,data).subscribe(
  		result=>{
			this.toast.success('Comment Accepted', 'Well Done',{positionClass:"toast-top-right"})
			this.getCommentsPending();			
  		},
  		e=>{
  			console.log(e)
			this.toast.error('Something wrong happened, try again', 'Error',{positionClass:"toast-top-right"})			
  		}
  	)
  }
  deleteComment(id){
	this.productService.deleteData('reviewsstore/'+id).subscribe(
  		result=>{
			this.toast.success('Comment Deleted', 'Well Done',{positionClass:"toast-top-right"})
			this.getCommentsPending();
			this.getCommentAccepted();			
  		},
  		e=>{
  			console.log(e)
			this.toast.error('Something wrong happened, try again', 'Error',{positionClass:"toast-top-right"})			
  		}
  	)
  }
  getCommentAccepted(){
	this.productService.getData('reviewsstore?where={"status":{"like":"accepted"}}').subscribe(
	  		result=>{
	  			console.log(result)
	  			if(result && result['length']>0){
	  				this.acceptedComments=result
	  				this.showAcceptedComments=true
	  			}
	  			else{
	  				this.showAcceptedComments=false
	  			}
	  		},
	  		e=>{
	  			this.showAcceptedComments=false
	  			console.log(e)
	  		}
	)
  }
}
