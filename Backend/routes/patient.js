const express = require("express");
const Patient = require("../schema/Patient");
const SimulatedData = require("../schema/SimulatedData");
const User = require("../schema/User");
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
    let deviceName  = await User.getDeviceName(user.emailId);

    let heartRates = [];
    heartRatesData.forEach(element => {
      heartRates.push(element.heartRate)
    });
   
   

    let result = JSON.parse(JSON.stringify(patient));
    result = {...result, heartRates : heartRates, deviceName : deviceName };
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


router.post("/activateDevice", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // update user profile
  try {

    const user = jwt.verify(req.cookies.cookie, JWT_KEY);

    user = await Patient.activateDevice(user.emailId);

    if(!user)
      return res.status(400).json({ message: "Invalid credentials"});

    if(user)
      res.json({"deviceStatus" : true});
    else
      res.json({"deviceStatus" : false});
  } catch (error) {
    res.status(400).send({ message: "Server error! Unable to activate device"});
  }
});

router.post("/deactivateDevice", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // update user profile
  try {

    const user = jwt.verify(req.cookies.cookie, JWT_KEY);
    user = await Patient.deactivateDevice(user.emailId);

    if(!user)
      return res.status(400).json({ message: "Invalid credentials"});

    if(user)
      res.json({"deviceStatus" : false});
    else
      res.json({"deviceStatus" : true});
  } catch (error) {
    res.status(500).send({ message: "Server error! Unable to deactivate device"});
  }
});


router.get("/activeDeviceCount", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
 
  try {
    const result = await Patient.activeDevicesCount(req);

    if(!result)
      return res.status(400).json({ message: "Invalid details"});

  res.json(result);
  } catch (error) {
    res.status(400).send({ message: "Server error! Unable to get active devices count"});
  }
});



module.exports = router;
