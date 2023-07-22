const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    const profilePic = req.body.profilePic || "";
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
      profilePic: profilePic
    });

    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(400).json("User not found!");

    const validated = await bcrypt.compare(req.body.password, user.password);
    !validated && res.status(400).json("Password is incorrect!");

    const { password, ...others } = user._doc;

    // generate an access token
    const accessToken = jwt.sign(others, process.env.ACCESS_SECRET_TOKEN);
    res.status(200).json({user: others, accessToken: accessToken})

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
