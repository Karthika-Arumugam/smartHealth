const express = require("express");
const SimulatedData = require("../schema/SimulatedData");
const auth = require("../middleware/auth");
const { JWT_KEY} = require('../config.js');

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/add', async (req, res) => {


  // Create a new data
  try {
    const data = new SimulatedData(req.body);
    await data.save();

    res.status(201).send({ message : "Simulated Data saved successfully" });
  } catch (error) {
    console.log("error")
    res.status(400).send({ message:error.message});
  }
});


module.exports = router;
