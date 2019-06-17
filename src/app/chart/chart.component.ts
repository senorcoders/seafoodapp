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
	allProductNames:any=[];
	allProductQuantities:any=[];
	showMessage:boolean=false;
  charts:any=[];
  constructor(private productService:ProductService) { }

 ngOnInit() {
  	this.getFishTypes();
  	this.getAllFish();
  	jQuery('.fishType').select2();
  	jQuery('.fishType').on('change', (e)=>{
  		this.name=jQuery(".fishType option:selected").text();
     	this.getFishTypeByID(e.target.value)
    })
  }
  getAllFish(){
  	this.productService.getData('api/fish/type/').subscribe(
  		result=>{
  			this.products=result
  			this.showMessage=false
  			this.getValSelled('Allproduct')
  		}
  	)
  }
  getFishTypeByID(e){
  	this.productService.getData('api/fish/type/'+e).subscribe(
  		result=>{
  			this.products=result
  			if(result['length']>0){
  				this.showMessage=false
  				this.getValSelled(this.name)
  			}
  			else{
  				this.showMessage=true;
  				this.productNames=[];
  				this.productQuantities=[]
  				this.generateChart('purchases');
  			}
  		}
  	)
  }
  getValSelled(val){
    if(val!="Allproduct"){
      //check if array has the current value
      if(!this.charts.includes(val)){
        this.charts.push(val)
      }
  	  //start the array empty
  		this.productNames=[];
  		this.productQuantities=[];
  		//convert json array into array
	  	this.products.forEach((data)=>{
	  		this.productQuantities.push(data.quantity[0].value);
	  		this.productNames.push(data.name)
	  	})
      //wait a second to angular generate the html to generate the chart. if i not do this. generateChart will send a error
      setTimeout(()=>{this.generateChart(val)},200)
  	}
  	else{
  		this.allProductNames=[];
  		this.allProductQuantities=[];
  		//convert json array into array
	  	this.products.forEach((data)=>{
	  		let total=0;
	  		//when type has a lot of quantity
	  		data.quantity.forEach((d)=>{
	  			total+=d.value;
	  		})
	  		this.allProductQuantities.push(total);
	  		this.allProductNames.push(data.type.name)
	  	})
	  	this.generateChart('all-purchases')
  	}
  }
  deleteChart(i){
    this.charts.splice(i,1)
  }
  getFishTypes(){
  	this.productService.getData('FishType').subscribe(
  		result=>{
  			this.fishTypes=result
  		}
  	)
  }
  generateChart(chart){
  	let ctx = document.getElementById(chart);
  	let labels;
  	let values;
  	let name;
  	if(chart!='all-purchases'){
		labels=this.productNames;
  		values=this.productQuantities;
  		name=this.name;
  	}else{
  		labels=this.allProductNames;
  		values=this.allProductQuantities;
  		name='Fish type'
  	}
	let myChart = new Chart(ctx, {
		  type: 'bar',
		  data: {
			  labels: labels,
			  datasets: [{
				  label: name,
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
