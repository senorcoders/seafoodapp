import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.setHeight(event.target.innerHeight);
  }
  constructor() { }
  setHeight(h){
    document.getElementById("hero").style.height = h+"px";
  }
  ngOnInit() {
    this.setHeight(window.innerHeight);
  }

}
