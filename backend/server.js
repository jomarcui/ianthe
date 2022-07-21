const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const usersRoute = require('./routes/users');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection is established.')
});

app.use('/users', usersRoute);

app.listen(port, () => {
  console.log(`Server is running in port: ${port}`);
});