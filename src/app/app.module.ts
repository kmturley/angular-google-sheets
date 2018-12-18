import { APP_INITIALIZER, NgModule, PLATFORM_ID } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../environments/environment';

import { ApiService } from './shared/api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppRoutingService } from './app-routing.service';
import { AuthService } from './shared/auth.service';
import { SharedModule } from './shared/shared.module';

import { AppComponent } from './app.component';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { NavigationComponent } from './navigation/navigation.component';

export function init(routeService: AppRoutingService, platformId: string) {
  if (environment.production && isPlatformBrowser(platformId)) {
    return () => true;
  } else {
    return () => routeService.getRoutes();
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'my-app'}),
    BrowserTransferStateModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: init,
      deps: [AppRoutingService, PLATFORM_ID],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    ApiService,
    AppRoutingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
