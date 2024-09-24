const express = require('express');
const scrapeController = require('../controllers/scrapeController');

const scrapeRouter = express.Router();

scrapeRouter.post('/search', scrapeController.scrapeOnline);

module.exports = scrapeRouter;