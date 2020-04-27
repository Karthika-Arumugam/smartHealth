const express = require("express");
const SimulatedData = require("../schema/SimulatedData");
const auth = require("../middleware/auth");
const { JWT_KEY} = require('../config.js');

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/add', async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // Create a new data
  try {
    const user = jwt.verify(req.cookies.cookie, JWT_KEY);
    const data = new SimulatedData(req.body);
    await data.save();

    res.status(201).send({ message : "Simulated Data saved successfully" });
  } catch (error) {
    res.status(400).send({ message: "Unable to add data"});
  }
});


module.exports = router;
