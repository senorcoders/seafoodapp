import { Component, OnInit } from '@angular/core';
declare var jQuery;
@Component({
  selector: 'app-homeve2',
  templateUrl: './homeve2.component.html',
  styleUrls: ['./homeve2.component.scss']
})
export class Homeve2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    jQuery('body').addClass('home-header');

  }

}
