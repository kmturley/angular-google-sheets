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
    console.log('getRoutes', environment.production, isPlatformBrowser(this.platformId));
    if (environment.production) {
      return new Promise((resolve, reject) => {
        this.getData(resolve);
      });
    } else {
      return new Promise((resolve, reject) => {
        this.loadGapi().subscribe((a) => {
          this.loadGapiAuth().subscribe((user: Object) => {
            localStorage.setItem('token', user['getAuthResponse']().access_token);
            this.getData(resolve);
          });
        });
      });
    }
  }

  getData(resolve) {
    return this.api.get(`${environment.API_URL}${environment.SHEET_ID}?includeGridData=true`, 'routes').subscribe(routes => {
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
  }

  private loadGapi(): Observable<void> {
    return Observable.create((observer: Observer<boolean>) => {
      const node = document.createElement('script');
      node.src = 'https://apis.google.com/js/api.js';
      node.type = 'text/javascript';
      node.charset = 'utf-8';
      document.getElementsByTagName('head')[0].appendChild(node);
      node.onload = () => {
        observer.next(true);
        observer.complete();
      };
    });
  }

  private loadGapiAuth(): Observable<Object> {
    return Observable.create((observer: Observer<Object>) => {
      window['gapi'].load('client:auth2', () => {
        const auth2 = window['gapi'].auth2.init({
          client_id: environment.CLIENT_ID,
          scope: environment.SCOPE
        });
        auth2.currentUser.listen((user: Object) => {
          observer.next(user);
          observer.complete();
        });
        auth2.signIn();
      });
    });
  }
}
