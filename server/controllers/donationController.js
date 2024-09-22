const Donation = require('../models/donationModel');

// Create a new donation
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
        return res.status(200).json({ newDonation });

    } catch (error) {
        return res.status(500).json({ message: 'Error while creating donation:', error });
    }
}

// Get the list of donations made by a user
module.exports.getTotalDonationListOfUser = async function getTotalDonationListOfUser(req, res) {

    const userId = req.params.userId;
   
    try {
        const donations = await Donation.find({ userId });

        if(!donations || donations.length === 0){
            return res.status(200).send({ message: 'No donations found for this user', donations: [] });
        }
        return res.status(200).send(donations);

    } catch (error) {
        return res.status(500).json({ message: "Error fetching donation list", error });
    }
}

// Get the amount of donations made by a user
module.exports.getTotalDonationAmountOfUser = async function getTotalDonationAmountOfUser(req, res) {
    const userId = req.params.userId;
 
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
        const donations = await Donation.find({ association: associationNumber });

        if (!donations.length) {
            return res.status(404).send({ message: 'No donation list found for this specific association' });
        }
        return res.status(200).send(donations);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching donation list for association:', error });
    }
}

// Get the amount of donations for a specific association
module.exports.getDonationAmountForAssociation = async function getDonationAmountForAssociation(req, res) {

    const { associationNumber } = req.params;
    
    try {
        const donations = await Donation.find({ association: associationNumber });

        if (!donations.length) {
            return res.status(404).send({ message: 'No donations amount found for this specific association' });
        }

        const totalAmount = donations.reduce((total, donation) => {
            return total + parseFloat(donation.amount);
        }, 0);

        res.status(200).json({ totalDonations: totalAmount });
   
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching amount of donations for association:', error });
    }
}

// Get donations list to a specific association made by a specific user 
module.exports.getDonationsByUserForAssociation = async function getDonationsByUserForAssociation(req, res) {
    const { userId, associationNumber } = req.params;

    try {
        const donations = await Donation.find({ userId, association: associationNumber });

        if(!donations){
            return res.status(404).send({ message: 'No donations found for this user and association' });
        }
        return res.status(200).send(donations);
        
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching donations by user for association:', error });
    }
}


// Get all donations Data
module.exports.getAllDonationsData = async function getAllDonationsData(req, res) {
    try {
        const donations = await Donation.find();

        if (!donations || donations.length === 0) {
            return res.status(200).json({ message: "No donations found", associations: [] });
        }
        return res.status(200).json({ count: donations.length, data: donations });
        //const associations = [...new Set(donations.map(donation => donation.association))];

        //return res.status(200).json({ associations });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching donation list", error });
    }
}

// Get all donation amount
module.exports.getTotalDonationsAmount = async function getTotalDonationsAmount(req, res) {

    try {
        const donations = await Donation.find();

        // if (!donations || donations.length === 0) {
        //     return res.status(200).json({ message: "No donations found", totalAmount: 0 });
        // }
        if (!donations) {
            return res.status(200).json({ message: "No donations found"});
        }
        
        const totalAmount = donations.reduce((total, donation) => {
            return total + parseFloat(donation.amount);
        }, 0);

        return res.status(200).json({ totalAmount });

    } catch (error) {
        return res.status(500).json({ message: "Error calculating total donations sum", error });
    }
}

// Delete all donations
module.exports.deleteAllDonations = async function deleteAllDonations(req, res) {
    
    try {
        const result = await Donation.deleteMany({});
        return res.status(200).json({ message: 'All onations have been deleted', result});
    } catch(errot){
        return res.status(500).json({ message: 'Error deleting all donations', error});
    }
}

