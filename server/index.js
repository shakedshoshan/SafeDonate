// Load environment variables
require

// Import modules
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const authRouter = require('./routes/authRoute.js')
const userRouter = require('./routes/userRoute.js');
const scrapeRouter = require('./routes/scrapeRoute.js');
const donationRounter = require('./routes/donationRoute.js');

const connectToMongoDB  = require('./db/connectToMongoDB.js')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use('/users', userRouter);
app.use('/scrape', scrapeRouter);
app.use('/donations',donationRounter);

// Connect to MongoDB
app.listen(PORT, () => {
	connectToMongoDB();
	console.log(`Server Running on port ${PORT}`);
});
//const server = 
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log('App connected to database');
//     const server = app.listen(PORT, () => {
//       console.log(`App is listening to port: ${PORT}`);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//     console.error('Error connecting to database:', error);
//   });

// // Routes

// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
