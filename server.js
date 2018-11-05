
const https = require('https');
const fs = require('fs');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const port = 3000;
const options = {
  key: fs.readFileSync(path.resolve('server.key')),
  cert : fs.readFileSync(path.resolve('server.cert')),
}
const app = express();
const router = express.Router();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); //ici être plus restrictif, genre le lien de l'app mobile
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-with, content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
});
app.use(express.static(__dirname));

router.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));



//######################################################
//####                   Youtube                    ####
//######################################################
var readline = require('readline');
var {google} = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/google-apis-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.force-ssl']
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'google-apis-nodejs-quickstart.json';

app.post("/testRechercher", function(req, res) {
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);
      return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    //See full code sample for authorize() function code.
    console.log(req.body);
    authorize(JSON.parse(content), {'params': {'maxResults': '25',
                 'part': 'snippet',
                 'q': req.body.keyword,
                 'type': 'video'}}, res, searchListByKeyword);

  });
});


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, requestData, res, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  //var auth = new googleAuth();
  //var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  var oauth2Client = new OAuth2Client(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, requestData, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client, requestData, res);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, requestData, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client, requestData);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Remove parameters that do not have values.
 *
 * @param {Object} params A list of key-value pairs representing request
 *                        parameters and their values.
 * @return {Object} The params object minus parameters with no values set.
 */
function removeEmptyParameters(params) {
  for (var p in params) {
    if (!params[p] || params[p] == 'undefined') {
      delete params[p];
    }
  }
  return params;
}

/**
 * Create a JSON object, representing an API resource, from a list of
 * properties and their values.
 *
 * @param {Object} properties A list of key-value pairs representing resource
 *                            properties and their values.
 * @return {Object} A JSON object. The function nests properties based on
 *                  periods (.) in property names.
 */
function createResource(properties) {
  var resource = {};
  var normalizedProps = properties;
  for (var p in properties) {
    var value = properties[p];
    if (p && p.substr(-2, 2) == '[]') {
      var adjustedName = p.replace('[]', '');
      if (value) {
        normalizedProps[adjustedName] = value.split(',');
      }
      delete normalizedProps[p];
    }
  }
  for (var p in normalizedProps) {
    // Leave properties that don't have values out of inserted resource.
    if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
      var propArray = p.split('.');
      var ref = resource;
      for (var pa = 0; pa < propArray.length; pa++) {
        var key = propArray[pa];
        if (pa == propArray.length - 1) {
          ref[key] = normalizedProps[p];
        } else {
          ref = ref[key] = ref[key] || {};
        }
      }
    };
  }
  return resource;
}


function searchListByKeyword(auth, requestData, res) {
  var service = google.youtube('v3');
  var parameters = removeEmptyParameters(requestData['params']);
  parameters['auth'] = auth;
  service.search.list(parameters, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log ("creation obj");
    var obj = {
      success:true,
      data:response.data
    };

    res.send(obj); 
  });
}


//######################################################
//####                   Vimeo                      ####
//######################################################

var clientID = "52661bbe93423155c914afc02a3fef458e29975e";
var unautenticatedToken = "79745e50364d3998b30466e00e7d122e";
var clientSecret = "8HfB7YG/WAWcX/5Tz5Vrx7VuuYYCjn1YT35JgU6Pj7Ncr4RxVdTQxzu2CY2HfNqQEzvh4rqh/d6df0JZFZ25c5FlntePqIOuLsOwRfzLVSmjutwlDkMvyeNGs2UsbQ/w";

let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(clientID, clientSecret, unautenticatedToken);

app.post("/testRechercherVimeo", function(req, res) {
  client.request({
    method: 'GET',
    path: '/videos',
    query: {
      query : req.body.keyword,
      per_page : 25
    }
  }, function (error, body, status_code, headers) {
    if (error) {
      console.log(error);
    }
    console.log(body);
    res.send(body.data);
  })
});



//######################################################

app.use(router);

const server = https.createServer(options,app).listen(port, () => console.log(`Example app listening on port ${port}!`))


//faire en sorte que la page de test api fasse le get en question histoire de manipuler 
//la réponse dans la console FF/Chrome pour chercher comment on obtient les infos supplémentaires genthumbnail et titres