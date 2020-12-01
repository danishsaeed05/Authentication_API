const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

//Import Routes from auth.js
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

//Connecting to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Successful connection to DB.')
);

//Middleware
app.use(express.json());
// Route MiddleWares. Api/user is prefix. Ex. api/user/register
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);


app.listen(3000, () => console.log("Server running on port 3000"));