// Load zone.js for the server.
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'fs-extra';
import {join} from 'path';

import {enableProdMode} from '@angular/core';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import {renderModuleFactory} from './utils';
import {getPaths} from './static.paths';

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./server/main');

const BROWSER_FOLDER = join(process.cwd(), 'browser');

// Load the index.html file containing referances to your application bundle.
const index = readFileSync(join('browser', 'index.html'), 'utf8');

let previousRender = Promise.resolve();


getPaths().then((ROUTES: any[]) => {
  console.log('ROUTES', ROUTES);

  // create json folder
  const jsonPath = join(BROWSER_FOLDER, 'json');
  if (!existsSync(jsonPath)) {
    mkdirSync(jsonPath);
  }

  // Iterate each route path
  ROUTES.forEach(route => {
    const fullPath = join(BROWSER_FOLDER, route);

    // Make sure the directory structure is there
    if (!existsSync(fullPath)) {
      mkdirSync(fullPath);
    }

    // Writes rendered HTML to index.html, replacing the file if it already exists.
    previousRender = previousRender.then(_ => renderModuleFactory(AppServerModuleNgFactory, {
      document: index,
      url: route,
      extraProviders: [
        provideModuleMap(LAZY_MODULE_MAP)
      ]
    })).then((res: { output: string, data: object }) => {
      // write html file
      console.log('WRITE HTML FILE', join(route, 'index.html'));
      writeFileSync(join(fullPath, 'index.html'), res.output);

      // write json files from TransferState objects
      Object.keys(res.data).forEach(item => {
        // console.log('WRITE JSON FILE', join('json', item + '.json'));
        // writeFileSync(join(jsonPath, item + 'routes.json'), JSON.stringify(res.data[item]));
        console.log('WRITE JSON FILE', join('json', 'routes.json'));
        writeFileSync(join(jsonPath, 'routes.json'), JSON.stringify(res.data[item]));
      });
    });
  });
});
