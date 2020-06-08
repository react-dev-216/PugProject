const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
// const csurf = require('csurf');
const cookieParser = require('cookie-parser');
const base64 = require('base-64');

const Rijndael = require('rijndael-js');
const padder = require('pkcs7-padding');
const crypto = require('crypto');

const Rfc2898DeriveBytes = require('../rfc2898DeriveBytes');

var app = express();

// AWS creds in ~/.aws/credentials file
const config = require('../config/config.js');
AWS.config.update({
    region: global.gConfig.AWS_config_region,
    endpoint: global.gConfig.AWS_config_endpoint
});

//DB call
var docClient = new AWS.DynamoDB.DocumentClient();

var playerEntry = require('../models/playerEntry');


//Middleware cookie and csrf setup

// const csrfMiddleware = csurf({
//   cookie: true
// });
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
// app.use(cookieParser());
// app.use(csrfMiddleware);


//TODO add csrfProtection
app.get('/', (req, res) => {
  res.render('home',
    { title: 'Boots on the Moooon' });
  // { title: 'Boots on the Moooon', token: req.csrfToken()});
});

app.get('/player/username', (req, res) => {
  res.status(200).json({ 'exists': 'false' });
});

app.get('/howto', (req, res) => {
  res.render('howto',{ title: 'Boots on the Moooon How To Play' });
});

app.get('/leaders', (req, res) => {
  var params = {
    TableName: 'BJ_BootsMoon_Players',
    IndexName: 'PlayerScoreIndex',
    KeyConditionExpression: "game = :game",
    ScanIndexForward: false,
    ExpressionAttributeValues: {
      ':game': 'BJ_BootsMoon_v1'
    }
  };
  docClient.query(params, function (err, data) {
    if (err) {
      console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
      console.log(data.Items);
      res.render('leaderboard', { title: 'Boots on the Moooon Leaderboard', players: data.Items });
    }
  });
});

app.post('/player/entry', (req, res) => {

  var encryptedToken = req.body.ts;
  var plainTextToken = req.body.plaintext;

  console.log("Encrypted text" + encryptedToken);

  var encBytesBuffer = Buffer.from(encryptedToken, 'base64');
  console.log("base64" + encBytesBuffer);

  // Get the saltbytes by extracting the first 32 bytes from the supplied cipherText bytes.
  var saltStringBytes = encBytesBuffer.slice(0, 32);
  console.log("Salt" + saltStringBytes);
  console.log(saltStringBytes.length);

  // Get the IV bytes by extracting the next 32 bytes from the supplied cipherText bytes.
  var ivStringBytes = encBytesBuffer.slice(32, 64);
  console.log(ivStringBytes);
  console.log(ivStringBytes.length);

  // Get the actual cipher text bytes by removing the first 64 bytes from the cipherText string.
  var cipherTextBytes = encBytesBuffer.slice(64);
  console.log("Encrypted String" + ivStringBytes);
  console.log(ivStringBytes.length);

  var keyBytes = new Rfc2898DeriveBytes("ady", 32, 1000);
  console.log("Key" + keyBytes.getBytes(32));

  const decipher = new Rijndael(keyBytes.getBytes(32), 'cbc');
  const decryptedPadded = decipher.decrypt(cipherTextBytes, 256, ivStringBytes);
  const decrypted = padder.unpad(decryptedPadded, 32);

  console.log("Decrypted" + decrypted.toString('utf8'));

  var arrResult = [];
  plainTextToken.split('|').forEach(function (x, i) {
    arrResult[i] = x;
  });
  
  if (arrResult.length > 0) {

    var params = {
      TableName: "BJ_BootsMoon_PlayersArchive",
      Item: {
        "game": "BJ_BootsMoon_v1",
        "email": arrResult[3],
        "first_name": arrResult[0],
        "last_name": arrResult[1],
        "username": arrResult[2],
        "score": Number(arrResult[4]),
        "user_created": Date.now()
      }
    };
    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to add Player", arrResult[3], ". Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).send("Error JSON " + JSON.stringify(err, null, 2));
      } else {
        console.log("Player Entry Archive Added ", arrResult[3]);
      }
    }); 

    params = {
      TableName: "BJ_BootsMoon_Players",
      Item: {
        "game": "BJ_BootsMoon_v1",
        "email": arrResult[3],
        "first_name": arrResult[1],
        "last_name": arrResult[2],
        "username": arrResult[0],
        "score": Number(arrResult[4]),
        "user_created": Date.now()
      }
    };
    docClient.put(params, function (err, data) {
      if (err) {
        console.error("Unable to add Player", arrResult[3], ". Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).send("Error JSON " + JSON.stringify(err, null, 2));
      } else {
        console.log("Player Entry Success", arrResult[3]);
        res.status(200).json({ 'result': 'success' });
      }
    });
  } else {
    console.error("Unable to add Player", ". No Data");
    res.status(500).send("Error - No Data sent");
  }

});

module.exports = app;
