
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
app.use(express.static(__dirname));

router.get('/', (req, res) => res.sendFile(__dirname+'/app/index.html'));

app.use(router);

const server = https.createServer(options,app).listen(port, () => console.log(`Example app listening on port ${port}!`))
