import { environment } from './src/environments/environment.prod';

const request = require('request');
const slugify = require('slugify');
const routes = ['/'];
const req = request.defaults({
  headers: {
    'Authorization': `Bearer ${environment.TOKEN}`
  }
});

export function getPaths() {
  return new Promise((resolve, reject) => {
    req.get(`${environment.API_URL}${environment.SHEET_ID}?includeGridData=true`, (err, res, data) => {
      if (err) { return reject(err); }
      data = JSON.parse(data);
      if (data['error']) { return reject(data); }
      const rows = data['sheets'][0]['data'][0]['rowData'];
      rows.forEach((rowItem, rowIndex) => {
        if (rowIndex > 0 && rowItem['values'][0].formattedValue) {
          routes.push(slugify(rowItem['values'][0].formattedValue, { lower: true }));
        }
      });
      resolve(routes);
    });
  });
}
