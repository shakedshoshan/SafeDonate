// Load environment variables
require('dotenv').config();

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoute.js');
const scrapeRouter = require('./routes/scrapeRoute.js');
const donationRounter = require('./routes/donationRoute.js');

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());

app.use('/users', userRouter);
app.use('/scrape', scrapeRouter);
app.use('/donations',donationRounter);

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

app.get('/', (req, res) => {
  res.send('Hello World!');
});
