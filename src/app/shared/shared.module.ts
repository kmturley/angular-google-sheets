import { NgModule, ModuleWithProviders } from '@angular/core';
import { SlugifyPipe } from 'angular-pipes';

@NgModule({
  imports: [
  ],
  declarations: [
    SlugifyPipe
  ],
  exports: [
    SlugifyPipe
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ SlugifyPipe ]
    };
  }
}
