const express = require('express');

const planetsRouter = require('./planets/planets.router');
const launchesRouter  = require('./launches/launches.router');

const api = express.Router();

//We created this file so that we could have a vaersion of our api.
api.use('/planets',planetsRouter);
api.use('/launches',launchesRouter);

module.exports = api;