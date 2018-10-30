import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SlugifyPipe } from 'angular-pipes';

import { ApiService } from './shared/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppRoutingService } from './app-routing.service';
import { AuthService } from './shared/auth.service';

import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NavigationComponent } from './navigation/navigation.component';

export function init(routeService: AppRoutingService) {
  return () => routeService.getRoutes();
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserTransferStateModule,
    HttpClientModule,
    AppRoutingModule,
    TransferHttpCacheModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [AppRoutingService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    ApiService,
    AppRoutingService,
    SlugifyPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
