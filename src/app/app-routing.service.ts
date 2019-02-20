import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Routes } from '@angular/router';
import { Observer, Observable } from 'rxjs';
import { SlugifyPipe } from './shared/slugify.pipe';

import { ApiService } from './shared/api.service';
import { environment } from '../environments/environment';

@Injectable()
export class AppRoutingService {
  public routes: Routes = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private api: ApiService,
    private slugifyPipe: SlugifyPipe
  ) { }

  getRoutes() {
    return new Promise((resolve, reject) => {
      this.api.get('/assets/json/pages.json', 'routes').subscribe(routes => {
        this.routes.push({
          pathMatch: 'full',
          path: '',
          loadChildren: './home/home.module#HomeModule',
          data: {
            name: 'Home'
          }
        });
        routes.forEach((route) => {
          this.routes.push({
            pathMatch: 'full',
            path: this.slugifyPipe.transform(route.name),
            loadChildren: './page/page.module#PageModule',
            data: {
              name: route.name
            }
          });
        });
        resolve(this.routes);
      });
    });
  }
}
