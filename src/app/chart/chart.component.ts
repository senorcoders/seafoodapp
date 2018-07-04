import { Component, OnInit } from '@angular/core';
import {ProductService} from '../services/product.service';
declare var Chart:any;
declare var jQuery:any;

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
	fishTypes:any;
	name:string;
	products:any;
	productNames:any=[];
	productQuantities:any=[];
	showMessage:boolean=false;

  constructor(private productService:ProductService) { }

  ngOnInit() {
  	this.getFishTypes();
  	jQuery('.fishType').select2();
  	jQuery('.fishType').on('change', (e)=>{
  		this.name=jQuery(".fishType option:selected").text();
     	this.getFishTypeByID(e.target.value)
    })
  }
  getFishTypeByID(e){
  	this.productService.getData('api/fish/type/'+e).subscribe(
  		result=>{
  			this.products=result
  			if(result['length']>0){
  				this.showMessage=false
  				this.getValSelled()
  			}
  			else{
  				this.showMessage=true;
  				this.productNames=[];
  				this.productQuantities=[]
  				this.generateChart();
  			}
  		}
  	)
  }
  getValSelled(){
  	//start the array empty
  	this.productNames=[];
  	this.productQuantities=[];
  	//convert json array into array
  	this.products.forEach((data)=>{
  		this.productQuantities.push(data.quantity[0].value);
  		this.productNames.push(data.name)
  	})
  	this.generateChart()
  }
  getFishTypes(){
  	this.productService.getData('FishType').subscribe(
  		result=>{
  			this.fishTypes=result
  		}
  	)
  }
  generateChart(){
  	let ctx = document.getElementById("purchases");
  	let labels=this.productNames;
  	let values=this.productQuantities;
	let myChart = new Chart(ctx, {
		  type: 'bar',
		  data: {
			  labels: labels,
			  datasets: [{
				  label: this.name,
				  data: values,
				  backgroundColor: [
					  'rgba(255, 99, 132, 0.2)',
					  'rgba(54, 162, 235, 0.2)',
					  'rgba(255, 206, 86, 0.2)',
					  'rgba(75, 192, 192, 0.2)',
					  'rgba(153, 102, 255, 0.2)',
					  'rgba(255, 159, 64, 0.2)'
				  ],
				  borderColor: [
					  'rgba(255,99,132,1)',
					  'rgba(54, 162, 235, 1)',
					  'rgba(255, 206, 86, 1)',
					  'rgba(75, 192, 192, 1)',
					  'rgba(153, 102, 255, 1)',
					  'rgba(255, 159, 64, 1)'
				  ],
				  borderWidth: 1
			  }]
		  },
		  options: {
			  scales: {
				  yAxes: [{
					  ticks: {
						  beginAtZero: true
					  }
				  }]
			  }
		  }
	  });
  }
}
