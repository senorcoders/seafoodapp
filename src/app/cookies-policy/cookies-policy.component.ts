import { Component, OnInit } from '@angular/core';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-cookies-policy',
  templateUrl: './cookies-policy.component.html',
  styleUrls: ['./cookies-policy.component.scss']
})
export class CookiesPolicyComponent implements OnInit {

  constructor(private titleS: TitleService) {     this.titleS.setTitle('Cookies policy'); }

  ngOnInit() {
  }

}
