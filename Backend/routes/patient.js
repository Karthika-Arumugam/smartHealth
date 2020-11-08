const express = require("express");
const Patient = require("../schema/Patient");
const SimulatedData = require("../schema/SimulatedData");
const User = require("../schema/User");
const auth = require("../middleware/auth");
const { JWT_KEY } = require('../config.js');
const { init, send } = require('../connectToEdge');

const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/dashboard', async (req, res) => {

  // get patient's dashboard

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }

  try {
    const user = jwt.verify(req.cookies.cookie, JWT_KEY);

    let patient = await Patient.getDashboard(user.emailId);
    let heartRatesData = await SimulatedData.getHeartrate(user.emailId);
    let deviceName = await User.getDeviceName(user.emailId);

    let heartRates = [];
    heartRatesData.forEach(element => {
      heartRates.push(element.heartRate)
    });



    let result = JSON.parse(JSON.stringify(patient));
    result = { ...result, heartRates: heartRates, deviceName: deviceName };
    res.json(result);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/riskStatus', async (req, res) => {

  // update patient's risk status

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }

  try {

    const user = jwt.verify(req.cookies.cookie, JWT_KEY);
    let patient = await Patient.updateRiskStatus(user.emailId, req.body.riskStatus);
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
  // activate device
  try {
    const token = jwt.verify(req.cookies.cookie, JWT_KEY);
    const user = await Patient.activateDevice(token.emailId);
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user) {

      //init Edge device connection  
      init();

      // get static patient info
      let patientDetails = await User.getProfile(user.emailId);
      patientDetails = patientDetails._doc;
      let isSmoker, isMale;

      isSmoker = (patientDetails.smokingyears) ? "Yes" : "No";
      if (patientDetails.gender) {
        isMale = (patientDetails.gender == "Male") ? 1 : 0;
      }

      // generate payload with patient static info, start simulator on edge
      const smokeYears = patientDetails.smokingyears.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      const payload = `{\"PatientID\": \"${patientDetails.emailId}\",\"Age\":${patientDetails.age},\"Sex\": ${isMale},\"years\" : ${smokeYears},\"Smoke\":\"${isSmoker}\",\"Enable\":"True" }`
      await send(payload);
      res.json({ "deviceStatus": true });
    }
    else
      res.json({ "deviceStatus": false });
  } catch (error) {
    res.status(400).send({ message: "Server error! Unable to activate device" });
  }
});

router.post("/deactivateDevice", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }

  try {

    const token = jwt.verify(req.cookies.cookie, JWT_KEY);
    // deactivate device status
    const user = await Patient.deactivateDevice(token.emailId);

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    if (user) {

      //init Edge device connection  
      init();

      // get static patient info
      let patientDetails = await User.getProfile(user.emailId);
      patientDetails = patientDetails._doc;
      let isSmoker, isMale;

      isSmoker = (patientDetails.smokingyears) ? "Yes" : "No";
      if (patientDetails.gender) {
        isMale = (patientDetails.gender == "Male") ? 1 : 0;
      }

      // generate payload with patient static info, start simulator on edge
      const smokeYears = patientDetails.smokingyears.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
      const payload = `{\"PatientID\": \"${patientDetails.emailId}\",\"Age\":${patientDetails.age},\"Sex\": ${isMale},\"years\" : ${smokeYears},\"Smoke\":\"${isSmoker}\",\"Enable\":"False" }`
      await send(payload);
      res.json({ "deviceStatus": false });
    }

    else
      res.json({ "deviceStatus": true });
  } catch (error) {
    res.status(500).send({ message: "Server error! Unable to deactivate device" });
  }
});


router.get("/activeDeviceCount", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }

  try {
    const result = await Patient.activeDevicesCount(req);

    if (!result)
      return res.status(400).json({ message: "Invalid details" });

    res.json(result);
  } catch (error) {
    res.status(400).send({ message: "Server error! Unable to get active devices count" });
  }
});

router.get("/morePatientInfo", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }

  try {
    const result = await Patient.moreInfo(req);

    if (!result)
      return res.status(400).json({ message: "Invalid details" });

    res.json(result);
  } catch (error) {
    res.status(400).send({ message: "Server error! Unable to get patient info" });
  }
});



module.exports = router;
