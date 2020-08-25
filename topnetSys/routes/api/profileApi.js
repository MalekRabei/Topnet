var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");

const auth = require("../../middleware/auth");

const User = require("../../models/User");


// @route   GET api/profile/profile
// @desc    Return profile of current user
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    console.log(" user ", req.user);
    const user = await User.findById(req.user.id).select("-password")
    .then( user => {
      console.log(user);
    res.json(user);})
    .catch(err => console.log(err));

    
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});



// @route   POST api/profile/profile
// @desc    edit user profile
// @access  Private
router.put(
  '/profile', auth, (req, res) => {
    // Get fields
    console.log("profile", req.body);
    User.find({ _id: req.user.id}).then( result =>
      console.log(result)
    )
    User.findOneAndUpdate(
      { _id: req.user.id },
      {
        $set: {
            name: req.body.name,
            email: req.body.email,
            cin: req.body.cin,
            adresse: req.body.adresse,
            telephone : req.body.telephone,
            adresse : req.body.adresse,
            role: req.body.role,
            avatar: req.body.avatar,
        },
      }).then(profile => {
                  res.end(JSON.stringify({ profile }, null, 5));  
          console.log("profile updated ", profile);
         // res.status(202).json({ profile, msg: " Updated Successfully" });
        }).catch((error) => {
          res.status(500).send(error);
        })
     
  }
);

module.exports = router;
