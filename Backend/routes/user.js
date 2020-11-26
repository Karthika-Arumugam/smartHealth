const express = require("express");
const User = require("../schema/User");
const Patient = require("../schema/Patient");
const auth = require("../middleware/auth");
const { JWT_KEY } = require('../config.js');

const jwt = require("jsonwebtoken");

const router = express.Router();

router.post('/signup', async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    // const token = await user.generateAuthToken();


    if (req.body.userGroup == "Patient") {
      const patient = new Patient({
        emailId: req.body.emailId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        gender: req.body.gender,
        phone: req.body.phone,
        currRiskStatus: 0,
        smokingyears: req.body.smokingyears,
        cigperday: req.body.cigperday,
        healthcareProvider: req.body.healthCareProvider,
        time: new Date()
      });

      await patient.save();
    }

    res.status(201).send(user);
  } catch (error) {
    res.status(401).json({ message: error.message });
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


    const cookie = jwt.sign({
      id: user._id,
      emailId: user.emailId,
      userGroup: user.userGroup
    }, JWT_KEY, { expiresIn: "3d" });
    res.cookie('cookie', cookie, { maxAge: 900000, httpOnly: false, path: '/' });

    res.send(user);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

router.get("/me", async (req, res) => {
  // View logged in user profile
  res.send(req.user);
});

router.post("/logout", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
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

router.post("/me/logoutall", async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/profile', async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // get user profile
  let prof, result;
  try {
    //const user = jwt.verify(req.cookies.cookie, JWT_KEY);
    prof = await User.getProfile(req.query.emailId);
    result = JSON.parse(JSON.stringify(prof));
    res.json(result);


  } catch (error) {
    res.status(400).send(error);
  }
});

router.post("/profile", async (req, res) => {

  if (!(req.cookies.cookie)) {
    return res.status(401).json({ message: "You are not logged in,please login to continue" });
  }
  // update user profile
  let profile, result;
  try {

    profile = await User.updateProfile(req.body);

    if (!profile)
      return res.status(400).json({ message: "Invalid credentials" });

    result = JSON.parse(JSON.stringify(profile));
    res.json({ message: "Profile updated successfully" });


  } catch (error) {
    return res.status(500).json({ message: "Unable to update profile" });
  }
});

router.get('/allHealthcare', async (req, res) => {
  // if (!(req.cookies.cookie)) {
  //     return res.status(401).json({ message: "You are not logged in,please login to continue" });
  //   }

  let healthcare, result;
  try {
    healthcare = await User.healthcareInfo(req);
    result = JSON.parse(JSON.stringify(healthcare));
    res.json(result);

  } catch (error) {
    res.status(400).send({ message: "Couldn't get healthcare information, please try again" });
  }
});

module.exports = router;
