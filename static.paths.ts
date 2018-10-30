import { environment } from './src/environments/environment.prod';

const request = require('request');
const routes = [];
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
      console.log('data', data);
      data.forEach((row) => {
        routes.push(row);
      });
      resolve(routes);
    });
  });
}
