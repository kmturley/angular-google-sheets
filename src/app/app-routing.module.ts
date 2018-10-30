import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    imports: [RouterModule.forRoot(routeTemplates)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule { }
