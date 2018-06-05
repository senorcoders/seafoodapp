import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-single-product',
  templateUrl: './single-product.component.html',
  styleUrls: ['./single-product.component.scss']
})
export class SingleProductComponent implements OnInit {
  productID:any;
  name:any;
  description:any;
  country: any;
  price:any;
  images: any = [];
  priceDesc:any;
  base:any = "http://138.68.19.227:7000";
  category:any;
  show:boolean = false;
  constructor(private route: ActivatedRoute, public productService: ProductService) { }

  ngOnInit() {
    this.productID= this.route.snapshot.params['id'];
    this.productService.getProductDetail(this.productID).subscribe(data => {
        console.log("Product", data);
        this.name = data['name'];
        this.description = data['description'];
        this.images = data['images'];
        this.price = data['price'].description;
        this.category = data['type'].name;
        this.show = true;
    }, error=>{
      console.log("Error", error)
    });
  }

}
