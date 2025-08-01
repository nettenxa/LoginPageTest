const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoUrl = process.env.MONGO_URI;

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// ใช้ PORT จาก .env หรือ fallback เป็น 5000
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log('Connected to database')
//   // console.log('MONGO_URI:', process.env.MONGO_URI);
// });
