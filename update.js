const fs = require('fs');
const readline = require('readline');
const slugify = require('slugify');
const { google } = require('googleapis');
const { join } = require('path');

const SHEET_ID = '1PGFoY15Wi0RFxjycqF_oXYKdjH8IM5k3_IxJLFI90aU';
const SHEET_NAME = 'Pages';
const SHEET_RANGE = 'A:L';
const JSON_FOLDER = join(process.cwd(), 'src/assets/json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) {
    return console.log('Error loading client secret file:', err);
  }
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), loadData);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) {
      return getNewToken(oAuth2Client, callback);
    }
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) {
        return console.error('Error while trying to retrieve access token', err);
      }
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err2) => {
        if (err2) {
          console.error(err2);
        }
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Outputs json file using data from spreadsheet:
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function loadData(auth) {
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!${SHEET_RANGE}`,
  }, (err, res) => {
    if (err) {
      return console.log('The API returned an error: ' + err);
    }
    const rows = res.data.values;
    if (rows.length) {
      const rowsNew = [];
      rows.map((row, rowIndex) => {
        if (rowIndex > 0) {
          let rowNew = {};
          row.map((field, fieldIndex) => {
            if (field.indexOf('\n') > -1) {
              field = field.split('\n');
              field = field.filter(v => v !== '');
            }
            rowNew[rows[0][fieldIndex]] = field;
          });
          rowsNew.push(rowNew);
        }
      });
      writeJson(rowsNew);
    } else {
      console.log('No data found.');
    }
  });
}

function writeJson(data) {
  if (!fs.existsSync(JSON_FOLDER)) {
    fs.mkdirSync(JSON_FOLDER);
  }
  fs.writeFile(`${JSON_FOLDER}/${SHEET_NAME.toLowerCase()}.json`, JSON.stringify(data, null, 2), (err2) => {
    if (err2) {
      console.error(err2);
    }
    console.log(`File created: ${JSON_FOLDER}/${SHEET_NAME.toLowerCase()}.json`);
  });
}
