const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(fileUpload());

app.use('/', routes);

module.exports = app;
