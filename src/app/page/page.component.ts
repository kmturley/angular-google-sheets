import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../environments/environment';
import { ApiService } from '../shared/api.service';


@Component({
  selector: 'app-page',
  styleUrls: ['./page.component.scss'],
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  public page = Object;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.api.get(`${environment.API_URL}${environment.SHEET_ID}?includeGridData=true`, 'routes').subscribe(pages => {
        this.page = pages.filter((page) => {
          return page.name === data.name;
        })[0];
        console.log('PageComponent', data.name, this.page);
        // this.title.setTitle(this.page['name']);
        // this.meta.updateTag({ name: 'description', content: this.page['name'] });
      });
    });
  }


}
