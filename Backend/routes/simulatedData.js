const express = require("express");
const SimulatedData = require("../schema/SimulatedData");
const auth = require("../middleware/auth");
const { JWT_KEY} = require('../config.js');
const Patient = require("../schema/Patient");

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/add', async (req, res) => {


  // Create a new data
  try {

   var date = new Date();
   var utcDate = new Date(date.toUTCString());
   utcDate.setHours(utcDate.getHours()-8);
   var usDate = new Date(utcDate);
   console.log(usDate);

    req.body = {...req.body,time :usDate}
    const data = new SimulatedData(req.body);
    await data.save();
    await Patient.updateRiskStatus(req.body.emailId, req.body.risk_factor,usDate);


    res.status(201).send({ message : "Simulated Data saved successfully for " + req.body.emailId });
  } catch (error) {
    console.log("error")
    res.status(400).send({ message:error.message});
  }
});

router.post('/delete', async (req, res) => {


  // Create a new data
  try {
    const data = await SimulatedData.delete(req);

    res.status(201).send({ message : "Simulated Data deleted successfully" });
  } catch (error) {
    console.log("error")
    res.status(400).send({ message:error.message});
  }
});



module.exports = router;
