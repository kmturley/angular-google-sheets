import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState
  ) { }

  get(url, id): Observable<any> {
    const key = makeStateKey(id);
    if (this.transferState.hasKey(key)) {
      const item = this.transferState.get(key, null);
      return of(item);
    } else {
      if (environment.production && isPlatformBrowser(this.platformId)) {
        url = `/assets/json/${id}.json`;
      }
      return this.http.get(url).pipe(
        map(data => {
          let items;
          if (environment.production && isPlatformBrowser(this.platformId)) {
            items = data;
          } else {
            items = data;
          }
          console.log('items', items);
          this.transferState.set(key, items);
          return items;
        })
      );
    }
  }

  post(url, data, id): Observable<any> {
    return this.http.post(url, data).pipe(
      map(items => {
        return items;
      })
    );
  }
}
