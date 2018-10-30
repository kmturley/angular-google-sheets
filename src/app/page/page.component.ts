import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { environment } from '../../environments/environment';
import { ApiService } from '../shared/api.service';

export class Page {
  activities?: Array<string>;
  approach?: string;
  contacts?: Array<string>;
  goals?: string;
  images?: Array<string>;
  industries?: Array<string>;
  locations?: Array<string>;
  name?: string;
  results?: string;
  technologies?: Array<string>;
  years?: Array<string>;

  constructor(data: {
    name?: string,
    goals?: string,
    approach?: string,
    results?: string,
    images?: Array<string>,
    locations?: Array<string>,
    industries?: Array<string>,
    activities?: Array<string>,
    technologies?: Array<string>,
    contacts?: Array<string>,
    years?: Array<string>,
  }) {
    if (data.name) { this.name = data.name; }
    if (data.goals) { this.goals = data.goals; }
    if (data.approach) { this.approach = data.approach; }
    if (data.results) { this.results = data.results; }
    if (data.images) { this.images = data.images; }
    if (data.locations) { this.locations = data.locations; }
    if (data.industries) { this.industries = data.industries; }
    if (data.activities) { this.activities = data.activities; }
    if (data.technologies) { this.technologies = data.technologies; }
    if (data.contacts) { this.contacts = data.contacts; }
    if (data.years) { this.years = data.years; }
  }
}

@Component({
  selector: 'app-page',
  styleUrls: ['./page.component.scss'],
  templateUrl: './page.component.html'
})
export class PageComponent implements OnInit {
  public page: Page;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.api.get(`${environment.API_URL}${environment.SHEET_ID}?includeGridData=true`, 'routes').subscribe(pages => {
        this.page = pages.filter((page: Page) => {
          return page.name === data.name;
        })[0];
        console.log('PageComponent', data.name, this.page);
        this.title.setTitle(this.page['name']);
        this.meta.updateTag({ name: 'description', content: this.page['name'] });
      });
    });
  }

}
