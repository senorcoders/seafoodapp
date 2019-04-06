import { Component, OnInit } from '@angular/core';
import { TitleService } from '../title.service';

@Component({
  selector: 'app-guides',
  templateUrl: './guides.component.html',
  styleUrls: ['./guides.component.scss']
})
export class GuidesComponent implements OnInit {

  constructor(private titleS: TitleService) {     this.titleS.setTitle('Guides'); }

  ngOnInit() {
  }

}
