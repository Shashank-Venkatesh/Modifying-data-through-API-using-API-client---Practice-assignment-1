// imprt req modules
const express = require('express');
const { resolve } = require('path');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

//Initialize express app
const app = express();
const port = process.env.PORT || 5001;

//Middile ware
app.use(bodyparser.json());

//Connection for Mongodb atlas
mongoose.connect(process.env.Mongo_uri)
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.log("MongoDB connection Error", err));

//Define MongoDB schema and model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  price: {
    type: Number,
    required: true
  }
});

//create user model

const User = mongoose.model('User', userSchema);

//Routes

//Post
app.post('/api/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const newItem = new User({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully", newItem });
  }
  catch (error) {
    res.status(500).json({ error: "server error" });
  }
});

//GET

app.get("/api/menu", async (req, res) => {
  try {
    const Users = await User.find();
    res.status(200).json(Users);
  }
  catch (error) {
    res.status(500).json({ error: "server error" });
  };
})

app.listen(port, () => {
  console.log("port running at", port)
})
