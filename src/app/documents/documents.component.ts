import { Component, OnInit } from '@angular/core';
import { IsLoginService } from '../core/login/is-login.service';
import { ProductService } from '../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
	role:any;
	documents:any=[]
  files:any;
  base=environment.apiURLImg;
  noDocument:boolean=false;
  constructor(private product:ProductService, private auth:IsLoginService, private toast:ToastrService) { }

  ngOnInit() {
  	this.auth.role.subscribe((role:number)=>{
      this.role=role
    })
    this.getDocuments();
  }
  handleFileInput(files:FileList){
  	this.files=files
  }
  goFile(link){
    window.open(this.base+link)
  }
  deleteFile(link){
    this.product.deleteData(link.slice(1)).subscribe(
      result=>{
        this.showSuccess('Document deleted')
        this.getDocuments()
      },
      e=>{
        this.showError('Something wrong happened, Please try again')
      }
    )
  }
  getDocuments(){
    this.product.getData('api/admin/files').subscribe(
      result=>{
        this.documents=result
        if(result && result!=''){
          this.noDocument=false
        }
        else{
          this.noDocument=true;
        }
      },
      e=>{
        console.log(e)
      }
    )
  }
  getName(link){
    let linkCut=link.split("/");
    let name=linkCut.slice(-2)[0]
    return name
  }
  saveDocument(){
  	if(this.files.length>0){
      this.product.uploadFile('api/admin/files','files',this.files).subscribe(
        result=>{
          this.showSuccess('Document has been uploaded')
          this.getDocuments()
        },
        e=>{
          console.log(e)
          this.showError('something wrong happened, try again')
        }
      )
  	}
  	else{
  		this.showError('Need to select a file')
  	}
  }
  showSuccess(s){
	this.toast.success(s, 'Well Done', { positionClass: "toast-top-right" })
  }
  showError(e){
	this.toast.error(e, 'Error', { positionClass: "toast-top-right" })
  }
}
