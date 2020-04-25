const express = require("express");
const User = require("../schema/User");
const Patient = require("../schema/Patient");
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/signup', async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();

    const patient = new Patient({emailId : req.body.emailId,  riskStatus: 0,  time : new Date()});
    await patient.save();

    
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/login", async (req, res) => {
  //Login a registered user
  try {
    const { emailId, password } = req.body;
    const user = await User.findByCredentials(emailId, password);
    if (!user) {
      return res
        .status(401)
        .send({ error: "Login failed! Check authentication credentials" });
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/me", auth, async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

router.post("/logout", auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/profile', auth, async (req, res) => {
  // get user profile
  let prof,result;
  try {
    prof  = await User.getProfile(req.body.emailId);
    result = JSON.parse(JSON.stringify(prof));
    res.json(result);
    

  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/profile", auth, async (req, res) => {
  // update user profile
  let profile ,result;
  try {
 
    profile= await User.updateProfile(req.body);

    if(!profile)
      return res.status(400).json({ message: "Invalid credentials"});

    result = JSON.parse(JSON.stringify(profile));
    res.json({ message: "Profile updated successfully"});


  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile"});
  }
});

router.post("/activateDevice", auth, async (req, res) => {
  // update user profile
  try {

    user = await User.activateDevice(req.body.emailId);

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

router.post("/deactivateDevice", auth, async (req, res) => {
  // update user profile
  try {

    user = await User.deactivateDevice(req.body.emailId);

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

module.exports = router;
