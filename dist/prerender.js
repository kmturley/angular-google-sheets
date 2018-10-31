"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Load zone.js for the server.
require("zone.js/dist/zone-node");
require("reflect-metadata");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var core_1 = require("@angular/core");
// Faster server renders w/ Prod mode (dev mode never needed)
core_1.enableProdMode();
// Import module map for lazy loading
var module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
var utils_1 = require("./utils");
var static_paths_1 = require("./static.paths");
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
var _a = require('./server/main'), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
var BROWSER_FOLDER = path_1.join(process.cwd(), 'browser');
// Load the index.html file containing referances to your application bundle.
var index = fs_extra_1.readFileSync(path_1.join('browser', 'index.html'), 'utf8');
var previousRender = Promise.resolve();
static_paths_1.getPaths().then(function (ROUTES) {
    console.log('ROUTES', ROUTES);
    // create json folder
    var jsonPath = path_1.join(BROWSER_FOLDER, 'json');
    if (!fs_extra_1.existsSync(jsonPath)) {
        fs_extra_1.mkdirSync(jsonPath);
    }
    // Iterate each route path
    ROUTES.forEach(function (route) {
        var fullPath = path_1.join(BROWSER_FOLDER, route);
        // Make sure the directory structure is there
        if (!fs_extra_1.existsSync(fullPath)) {
            fs_extra_1.mkdirSync(fullPath);
        }
        // Writes rendered HTML to index.html, replacing the file if it already exists.
        previousRender = previousRender.then(function (_) { return utils_1.renderModuleFactory(AppServerModuleNgFactory, {
            document: index,
            url: route,
            extraProviders: [
                module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP)
            ]
        }); }).then(function (res) {
            // write html file
            console.log('WRITE HTML FILE', path_1.join(route, 'index.html'));
            fs_extra_1.writeFileSync(path_1.join(fullPath, 'index.html'), res.output);
            // write json files from TransferState objects
            Object.keys(res.data).forEach(function (item) {
                // console.log('WRITE JSON FILE', join('json', item + '.json'));
                // writeFileSync(join(jsonPath, item + 'routes.json'), JSON.stringify(res.data[item]));
                console.log('WRITE JSON FILE', path_1.join('json', 'routes.json'));
                fs_extra_1.writeFileSync(path_1.join(jsonPath, 'routes.json'), JSON.stringify(res.data[item]));
            });
        });
    });
});
//# sourceMappingURL=prerender.js.map