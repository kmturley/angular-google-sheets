"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var environment_prod_1 = require("./src/environments/environment.prod");
var request = require('request');
var slugify = require('slugify');
var routes = ['/'];
var req = request.defaults({
    headers: {
        'Authorization': "Bearer " + environment_prod_1.environment.TOKEN
    }
});
function getPaths() {
    return new Promise(function (resolve, reject) {
        req.get("" + environment_prod_1.environment.API_URL + environment_prod_1.environment.SHEET_ID + "?includeGridData=true", function (err, res, data) {
            if (err) {
                return reject(err);
            }
            data = JSON.parse(data);
            if (data['error']) {
                return reject(data);
            }
            var rows = data['sheets'][0]['data'][0]['rowData'];
            rows.forEach(function (rowItem, rowIndex) {
                if (rowIndex > 0 && rowItem['values'][0].formattedValue) {
                    routes.push(slugify(rowItem['values'][0].formattedValue, { lower: true }));
                }
            });
            resolve(routes);
        });
    });
}
exports.getPaths = getPaths;
//# sourceMappingURL=static.paths.js.map