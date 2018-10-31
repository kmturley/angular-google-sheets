"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var operators_1 = require("rxjs/operators");
var platform_server_1 = require("@angular/platform-server");
function _getPlatform(platformFactory, options) {
    var extraProviders = options.extraProviders ? options.extraProviders : [];
    return platformFactory([
        { provide: platform_server_1.INITIAL_CONFIG, useValue: { document: options.document, url: options.url } },
        extraProviders
    ]);
}
function _render(platform, moduleRefPromise) {
    return moduleRefPromise.then(function (moduleRef) {
        var transitionId = moduleRef.injector.get(platform_browser_1.ɵTRANSITION_ID, null);
        if (!transitionId) {
            throw new Error("renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure\nthe server-rendered app can be properly bootstrapped into a client app.");
        }
        var applicationRef = moduleRef.injector.get(core_1.ApplicationRef);
        return applicationRef.isStable.pipe((operators_1.first(function (isStable) { return isStable; })))
            .toPromise()
            .then(function () {
            var platformState = platform.injector.get(platform_server_1.PlatformState);
            // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
            var callbacks = moduleRef.injector.get(platform_server_1.BEFORE_APP_SERIALIZED, null);
            var data = null;
            if (callbacks) {
                for (var _i = 0, callbacks_1 = callbacks; _i < callbacks_1.length; _i++) {
                    var callback = callbacks_1[_i];
                    try {
                        data = callback();
                    }
                    catch (e) {
                        // Ignore exceptions.
                        console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
                    }
                }
            }
            var output = platformState.renderToString();
            platform.destroy();
            return {
                output: output,
                data: data
            };
        });
    });
}
function renderModule(module, options) {
    var platform = _getPlatform(platform_server_1.platformDynamicServer, options);
    return _render(platform, platform.bootstrapModule(module));
}
exports.renderModule = renderModule;
function renderModuleFactory(moduleFactory, options) {
    var platform = _getPlatform(platform_server_1.platformServer, options);
    return _render(platform, platform.bootstrapModuleFactory(moduleFactory));
}
exports.renderModuleFactory = renderModuleFactory;
//# sourceMappingURL=utils.js.map