const express = require("express");
const User = require("../schema/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post('/signup', async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body);
    await user.save();
    const token = await user.generateAuthToken();
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
    res.status(500).send(error);
  }
});

router.post("/me/logoutall", auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
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
    res.status(500).send(error);
  }
});

router.post("/profile", auth, async (req, res) => {
  // update user profile
  let prof,result;
  try {

   ({ results: prof } = await updateProfile(req.body));
    result = JSON.parse(JSON.stringify(prof))[0];
    res.json(result);


  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
