const randomUseragent = require('random-useragent');
const keywordDictionary = require('../models/keywordDictionary.js');

const checkCategory = (category) => {
    const trimmedCategory = category?.trim() || "כללי";
    const keywords = keywordDictionary[trimmedCategory];

    if (!keywords) {
        return keywordDictionary["כללי"];
    }
    return keywords
};

const getUserAgent = () => {
    const userAgent = randomUseragent.getRandom();

    if (typeof userAgent === 'string' && userAgent.includes('Chrome') && parseFloat(userAgent.split('Chrome/')[1]) > 80) {
        console.log("User agent from random")
        return userAgent;
    }
    else {
        console.log("User agent from List")
        return selectRandom();
    }
};

const selectRandom = () => {
    const userAgents = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36"
    ]
    var randomNumber = Math.floor(Math.random() * userAgents.length);
    return userAgents[randomNumber];
}

// Delay function to mimic human-like browsing behavior
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = { checkCategory, getUserAgent, delay };