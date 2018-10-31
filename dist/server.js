"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("zone.js/dist/zone-node");
require("reflect-metadata");
var core_1 = require("@angular/core");
// Express Engine
var express_engine_1 = require("@nguniversal/express-engine");
// Import module map for lazy loading
var module_map_ngfactory_loader_1 = require("@nguniversal/module-map-ngfactory-loader");
var express = require("express");
var path_1 = require("path");
// Faster server renders w/ Prod mode (dev mode never needed)
core_1.enableProdMode();
// Express server
var app = express();
var PORT = process.env.PORT || 4000;
var DIST_FOLDER = path_1.join(process.cwd(), 'dist');
// * NOTE :: leave this as require() since this file is built Dynamically from webpack
var _a = require('./server/main'), AppServerModuleNgFactory = _a.AppServerModuleNgFactory, LAZY_MODULE_MAP = _a.LAZY_MODULE_MAP;
// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', express_engine_1.ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [
        module_map_ngfactory_loader_1.provideModuleMap(LAZY_MODULE_MAP),
    ]
}));
app.set('view engine', 'html');
app.set('views', path_1.join(DIST_FOLDER, 'browser'));
// Example Express Rest API endpoints
// app.get('/api/**', (req, res) => { });
// Server static files from /browser
app.get('*.*', express.static(path_1.join(DIST_FOLDER, 'browser'), {
    maxAge: '1y'
}));
// All regular routes use the Universal engine
app.get('*', function (req, res) {
    res.render('index', { req: req });
});
// Start up the Node server
app.listen(PORT, function () {
    console.log("Node Express server listening on http://localhost:" + PORT);
});
//# sourceMappingURL=server.js.map