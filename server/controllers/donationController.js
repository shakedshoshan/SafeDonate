const Donation = require('../models/donationModel');

module.exports.createDonation = async function createDonation(req, res) {
    const { userId, associationNumber, amount } = req.body;

    try {
        if (!associationNumber || !amount) {
            return res.status(400).json({ message: 'error with associationNumber or donation amount' });
        }

        // create new donation
        const newDonation = await Donation.create({
            userId,
            association: associationNumber.toString(),
            amount,
        });
        //console.log("New Donation Created:", newDonation);
        return res.status(200).json({ newDonation });

    } catch (error) {
        // Log the error for debugging
        console.error("Error while creating donation:", error);
        return res.status(500).json({ message: 'Server donation error', error: error.message });
    }
}

module.exports.getTotalDonationListOfUser = async function getTotalDonationListOfUser(req, res) {

    const userId = req.params.userId;

    try {
        const donations = await Donation.find({ userId });

        if(!donations.length){
            return res.status(404).send({ message: 'No donations list found for this user' });
            //return res.status(200).send(0);
        }
        return res.status(200).send(donations);

    } catch (error) {
        res.status(500).json({ message: "Error calculating total donations", error });
    }
}

module.exports.getTotalDonationAmountOfUser = async function getTotalDonationAmountOfUser(req, res) {
    const userId = req.params.userId;
    console.log(userId)
    console.log("hi getTotalDonationListOfUser");
    try {
        const donations = await Donation.find({ userId });

        const totalAmount = donations.reduce((total, donation) => {
            return total + parseFloat(donation.amount);
        }, 0);

        res.status(200).json({ totalDonations: totalAmount });
    } catch (error) {
        res.status(500).json({ message: "Error calculating total donations", error });
    }
}


// Get Donation List for a specific association
module.exports.getDonationListForAssociation = async function getDonationListForAssociation(req, res) {

    const associationNumber = req.params.associationNumber;
    
    try {
        const donations = await Donation.find({ associationNumber });

        if (!donations.length) {
            return res.status(404).send({ message: 'No donation list found for this specific association' });
        }
        return res.status(200).send(donations);
    } catch (error) {
        console.error('Error fetching donations for association:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Get Donations Amount for a specific association
module.exports.getDonationAmountForAssociation = async function getDonationAmountForAssociation(req, res) {

    const { associationNumber } = req.params;
    
    try {
        const donations = await Donation.find({ associationNumber });

        if (!donations.length) {
            return res.status(404).send({ message: 'No donations amount found for this specific association' });
        }

        const totalAmount = donations.reduce((total, donation) => {
            return total + parseFloat(donation.amount);
        }, 0);

        res.status(200).json({ totalDonations: totalAmount });
   
    } catch (error) {
        console.error('Error fetching donations for association:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}

// Get all donations to a specific association by a specific user
module.exports.getDonationsByUserForAssociation = async function getDonationsByUserForAssociation(req, res) {
    const { userId, associationNumber } = req.param;

    try {
        const donations = await Donation.find({ userId, associationNumber });

        if(!donations.length){
            return res.status(404).send({ message: 'No donations found for this user and association' });
        }
        return res.status(200).send(donations);
        
    } catch (error) {
        console.error('Error fetching donations by user for association:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}


// Get all donations
module.exports.getAllDonations = async function getAllDonations(req, res) {
    try {
        const donations = await Donation.find({});
        return res.status(200).json({ count: donations.length, data: donations });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message })
    }
}

