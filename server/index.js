// Load environment variables
require('dotenv').config();

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/userRoute.js');

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

     // Handle termination signals
     const shutdown = (signal) => {
      console.log(`Received ${signal}. Closing server...`);
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    };

    // Listen for termination signals
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
      shutdown('uncaughtException');
    });
  })
  .catch((error) => {
    console.log(error);
    console.error('Error connecting to database:', error);
    process.exit(1);
  });

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
