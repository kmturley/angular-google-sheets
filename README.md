# angular-google-sheets

Example project using:

* Angular 6.x
* Google Client API
* SCSS


## Installation

Install dependencies using:

    npm install

Create an file at src/environments/environment.ts containing your google API details:

    export const environment = {
        API_URL: 'https://sheets.googleapis.com/v4/spreadsheets/',
        CLIENT_ID: 'X.apps.googleusercontent.com',
        SCOPE: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        SHEET_ID: 'X',
        TOKEN: 'X',
        production: false,
    };


## Usage

Run the server:

    npm start

View the frontend at:

    http://localhost:4200/


## Deployment

In Chrome Dev tools, copy your Authorization Header Token from a request to your environment.prod.ts

Then run the command to build static:

    cd frontend
    npm install
    npm run build:prerender

Or to build with custom base url:

    ng build --prod --base-href https://kmturley.github.io/angular-google-sheets/dist/browser
    ng run angular-google-sheets:server:production
    npm run compile:server && npm run generate:prerender

To view the statically generated version locally use:

    npm run serve:prerender


## Directory structure

    /                               --> Frontend sources files
    /static.paths.ts                --> Static generation for Google Client API
    /app/app-routing.server.ts      --> Angular routing for Google Client API


## Contact

For more information please contact kmturley
