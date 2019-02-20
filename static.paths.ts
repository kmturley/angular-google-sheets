const fs = require('fs');
const { join } = require('path');
const slugify = require('slugify');
const routes = ['/'];

const JSON_FOLDER = join(process.cwd(), 'browser/assets/json');

export function getPaths() {
  return new Promise((resolve, reject) => {
    fs.readFile(`${JSON_FOLDER}/pages.json`, (err, data) => {
      if (err) {
        return console.error(err);
      }
      const rows = JSON.parse(data);
      rows.forEach((rowItem, rowIndex) => {
        if (rowIndex > 0 && rowItem !== '') {
          routes.push(slugify(rowItem.name, { lower: true }));
        }
      });
      resolve(routes);
    });
  });
}
