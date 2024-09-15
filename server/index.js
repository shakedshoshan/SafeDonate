// Load environment variables
require('dotenv').config();

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoute.js');
const { scrapeGoogle } = require('./scraper'); 
// const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('App connected to database');
    const server = app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
    console.error('Error connecting to database:', error);
  });

// Routes
app.get('/scrape/:associationNumber', async (req, res) => {
  const associationNumber = req.params.associationNumber;
  console.log('Starting scraping process for association number:', associationNumber);

  try {
    // Perform the scraping
      const results = await scrapeGoogle(associationNumber);
    
    // Return the results to the client
      res.json(results);
  } catch (error) {
      res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});
