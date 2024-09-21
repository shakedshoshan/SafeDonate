const express = require('express');
const donationController = require('../controllers/donationController')

const donationRouter = express.Router();

donationRouter.post('/donate', donationController.createDonation);

donationRouter.get('/:userId', donationController.getTotalDonationListOfUser);
donationRouter.get('/sum/:userId', donationController.getTotalDonationAmountOfUser);
donationRouter.get('/list/:associationNumber', donationController.getDonationListForAssociation);
donationRouter.get('/amount/:associationNumber', donationController.getDonationAmountForAssociation);
//donationRouter.get('/:userId/association/:associationNumber', donationController.getDonationsByUserForAssociation);
//donationRouter.get('/allDonationsData', donationController.getAllDonationsData);
//donationRouter.get('/allDonationsAmount', donationController.getTotalDonationsAmount);

donationRouter.delete('/deleteAllDonations', donationController.deleteAllDonations);

module.exports = donationRouter;