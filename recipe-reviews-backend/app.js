const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewsRouter = require('./routes/reviews');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use('/reviews', reviewsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
