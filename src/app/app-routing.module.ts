import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';

const routeTemplates: Routes = [
  {
    pathMatch: 'full',
    path: '',
    component: HomeComponent
  },
  {
    pathMatch: 'full',
    path: 'modules/page',
    loadChildren: './page/page.module#PageModule'
  }
];

@NgModule({
    imports: [RouterModule.forRoot(routeTemplates)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
