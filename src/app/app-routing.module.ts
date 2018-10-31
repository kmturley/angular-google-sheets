import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from './shared/shared.module';

const routeTemplates: Routes = [
  {
    pathMatch: 'full',
    path: 'modules/home',
    loadChildren: './home/home.module#HomeModule'
  },
  {
    pathMatch: 'full',
    path: 'modules/page',
    loadChildren: './page/page.module#PageModule'
  }
];

@NgModule({
    imports: [
      RouterModule.forRoot(routeTemplates),
      SharedModule.forRoot()
    ],
    exports: [
      RouterModule
    ],
    providers: []
})
export class AppRoutingModule { }
