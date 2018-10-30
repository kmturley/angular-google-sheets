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
        CLIENT_ID: 'X.apps.googleusercontent.com',
        SCOPE: 'https://www.googleapis.com/auth/X',
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

    ng build --configuration=production --base-href https://angular-google-sheets.appspot.com
    ng run ng-universal-demo:server:production
    npm run webpack:server && npm run generate:prerender

To view the statically generated version locally use:

    npm run serve:prerender


## Directory structure

    /                               --> Frontend sources files
    /static.paths.ts                --> Static generation for Google Client API
    /app/app-routing.server.ts      --> Angular routing for Google Client API


## Contact

For more information please contact kmturley
