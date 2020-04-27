const express = require("express");
const Patient = require("../schema/Patient");
const SimulatedData = require("../schema/SimulatedData");
const auth = require("../middleware/auth");
const { JWT_KEY} = require('../config.js');

const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/dashboard', async (req, res) => {

  // get patient's dashboard

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  
  try {
    const user = jwt.verify(req.cookies.cookie, JWT_KEY);

    let patient  = await Patient.getDashboard(user.emailId);
    let heartRatesData  = await SimulatedData.getHeartrate(user.emailId);

    let heartRates = [];
    heartRatesData.forEach(element => {
      heartRates.push(element.heartRate)
    });
   
   

    let result = JSON.parse(JSON.stringify(patient));
    result = {...result, heartRates : heartRates };
    res.json(result);

  } catch (error) {
    res.status(400).json({message : error.message});
  }
});

router.put('/riskStatus', async (req, res) => {

  // update patient's risk status

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  
  try {

    const user = jwt.verify(req.cookies.cookie, JWT_KEY);
    let patient  = await Patient.updateRiskStatus(user.emailId, req.body.riskStatus);
    let result = JSON.parse(JSON.stringify(patient));
    res.json(result);

  } catch (error) {
    res.status(400).send(error);
  }
});



module.exports = router;
