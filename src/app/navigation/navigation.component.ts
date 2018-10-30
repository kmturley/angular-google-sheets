import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { AppRoutingService } from '../app-routing.service';

@Component({
  selector: 'app-navigation',
  styleUrls: ['./navigation.component.scss'],
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {
  public routes: Array<any>;

  constructor(
    private router: Router,
    public routeService: AppRoutingService
  ) { }

  ngOnInit() {
    this.routes = this.routeService.routes;
    const routerConfig = this.router.config;
    routerConfig.pop(); // remove the default angular blank route
    this.routes.forEach(route => {
      routerConfig.push(route);
    });
    this.router.events
      .pipe(filter(event => event instanceof RoutesRecognized))
      .pipe(map((event: RoutesRecognized) => {
        return event.state.root.firstChild.data;
      }));
    console.log('routes', routerConfig);
    this.router.resetConfig(routerConfig);
  }

  onChange(locale) {
    this.router.navigate([`/${locale}`], {});
  }
}
