import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PageComponent } from './page.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: PageComponent, pathMatch: 'full'}
    ]),
    SharedModule
  ],
  declarations: [PageComponent]
})
export class PageModule { }
