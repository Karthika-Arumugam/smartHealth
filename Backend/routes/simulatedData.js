const express = require("express");
const SimulatedData = require("../schema/SimulatedData");
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/add', auth, async (req, res) => {
  // Create a new data
  try {
    const data = new SimulatedData(req.body);
    await data.save();

    res.status(201).send({ message : "Simulated Data saved successfully" });
  } catch (error) {
    res.status(400).send({ message: "Unable to add data"});
  }
});


module.exports = router;
