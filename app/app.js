'use strict'

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
app.use(helmet());

// Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// Cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Allow', 'GET');
    next();
});

//Routes Error
// 404
app.use(function(req, res, next) {
    return res.status(404).send('<h1>404</h1><h3>Page Not Found!</h3>');
});

// 500 - Any server error
app.use(function(err, req, res, next) {
    return res.status(500).send('<h1>500</h1><h3>'+err+'</h3>');
});

module.exports = app;