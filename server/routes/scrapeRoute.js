const express = require('express');
const scrapeController = require('../controllers/scrapeController');

const scrapeRouter = express.Router();

scrapeRouter.get('/:associationNumber', scrapeController.scrapeOnline);

module.exports = scrapeRouter;