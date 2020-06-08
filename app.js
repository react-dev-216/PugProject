const express = require('express');
const path = require('path');
const routes = require('./routes/index');
const frameguard = require('frameguard');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();

app.use(frameguard({ action: 'ALLOW-FROM', domain: 'benjerry.com'}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.use('/', routes);


module.exports = app;
