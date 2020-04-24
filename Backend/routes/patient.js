const express = require("express");
const Patient = require("../schema/Patient");
const auth = require("../middleware/auth");

const router = express.Router();

router.get('/dashboard', auth, async (req, res) => {

  // get patient's dashboard
  
  try {

    let patient  = await Patient.getDashboard(req.query.emailId);
    let result = JSON.parse(JSON.stringify(patient));
    res.json(result);

  } catch (error) {
    res.status(400).send(error);
  }
});

router.put('/riskStatus', auth, async (req, res) => {

  // update patient's risk status
  
  try {

    let patient  = await Patient.updateRiskStatus(req.query.emailId, req.body.riskStatus);
    let result = JSON.parse(JSON.stringify(patient));
    res.json(result);

  } catch (error) {
    res.status(400).send(error);
  }
});



module.exports = router;
