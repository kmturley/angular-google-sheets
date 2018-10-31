import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SlugifyPipe } from '../shared/slugify.pipe';

import { environment } from '../../environments/environment';
import { ApiService } from '../shared/api.service';
import { Page } from '../page/page.component';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  pages: Array<Page>;
  params = { queryParams: {} };

  selectActivities: FormControl;
  selectIndustries: FormControl;
  selectLocations: FormControl;
  selectTechnologies: FormControl;
  selectYears: FormControl;

  activities: Array<string>;
  industries: Array<string>;
  locations: Array<string>;
  technologies: Array<string>;
  years: Array<string>;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private slugifyPipe: SlugifyPipe
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.selectActivities = new FormControl(params['activities'] || 'all');
      this.selectIndustries = new FormControl(params['industries'] || 'all');
      this.selectLocations = new FormControl(params['locations'] || 'all');
      this.selectTechnologies = new FormControl(params['technologies'] || 'all');
      this.selectYears = new FormControl(params['years'] || 'all');
      this.api.get(`${environment.API_URL}${environment.SHEET_ID}?includeGridData=true`, 'routes').subscribe(pages => {
        this.pages = pages.filter((page) => {
          // TODO make this more DRY
          this.activities = this.activities ? this.activities.concat(page.activities) : page.activities;
          this.industries = this.industries ? this.industries.concat(page.industries) : page.industries;
          this.locations = this.locations ? this.locations.concat(page.locations) : page.locations;
          this.technologies = this.technologies ? this.technologies.concat(page.technologies) : page.technologies;
          this.years = this.years ? this.years.concat(page.years) : page.years;
          this.activities = this.activities.filter((item, pos) => this.activities.indexOf(item) === pos);
          this.industries = this.industries.filter((item, pos) => this.industries.indexOf(item) === pos);
          this.locations = this.locations.filter((item, pos) => this.locations.indexOf(item) === pos);
          this.technologies = this.technologies.filter((item, pos) => this.technologies.indexOf(item) === pos);
          this.years = this.years.filter((item, pos) => this.years.indexOf(item) === pos);
          if (this.selectActivities.value !== 'all') {
            const results = page.activities.filter((activity) => {
              return this.slugifyPipe.transform(activity) === this.selectActivities.value;
            });
            if (results.length === 0) {
              return false;
            }
          }
          if (this.selectIndustries.value !== 'all') {
            const results = page.industries.filter((industry) => {
              return this.slugifyPipe.transform(industry) === this.selectIndustries.value;
            });
            if (results.length === 0) {
              return false;
            }
          }
          if (this.selectLocations.value !== 'all') {
            const results = page.locations.filter((location) => {
              return this.slugifyPipe.transform(location) === this.selectLocations.value;
            });
            if (results.length === 0) {
              return false;
            }
          }
          if (this.selectTechnologies.value !== 'all') {
            const results = page.technologies.filter((technology) => {
              return this.slugifyPipe.transform(technology) === this.selectTechnologies.value;
            });
            if (results.length === 0) {
              return false;
            }
          }
          if (this.selectYears.value !== 'all') {
            const results = page.years.filter((year) => {
              return this.slugifyPipe.transform(year) === this.selectYears.value;
            });
            if (results.length === 0) {
              return false;
            }
          }
          return page;
        });
      });
    });
  }

  onChange(type, val) {
    this.params.queryParams[type] = val;
    this.router.navigate([], this.params);
  }

  login() {
    window['gapi'].auth2.getAuthInstance().signIn();
  }
}
