const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator/check");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const keys = require("../../config/keys");
const passport = require("passport");



//enable / disable user
router.put("/enableuser", async (req, res) => {
  console.log("enable user ** ", req.body);
  await User.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        enabled: req.body.enabled,
      },
    }
  )
    .then((data) => {
      res.status(202).json("updated");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

// @route POST api/auth
// @desc Authenticate User
// @access Public
router.post(
  "/auth",
  [
    check("email", "Please enter a valid Email").isEmail(),
    check("password", "Password is required").isLength({ min: 1 }),
  ],
  async (req, res) => {
    console.log(req.body);
    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      console.log("errors", errors);
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    //ParserBody
    console.log(req.body); // lezem middleware lel hkeya hedhi
    try {
      // See if user exists
      let user = await User.findOne({
        email,
      });
      if (!user) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials ",
            },
          ],
        });
      }
      //See if password matches
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              msg: "Invalid Credentials ",
            },
          ],
        });
      }
      //see if enabled 
      if (!user.enabled) {
        return res.status(400).json({
          errors: [
            {
              msg: "Your Account is Disabled ",
            },
          ],
        });
      }


      // Return Json WebToken
      const payload = {
        user: {
          id: user.id,
          name: user.name,
          cin : user.cin,
          telephone: user.telephone,
          role: user.role,
          avatar: user.avatar,
          permission: user.permission,
        },
      }; //l'emport
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
          });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).send("server Error");
    }
  }
);
// @route   POST api/users/register
// @desc    Register user
// @access  Private
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        cin : req.body.cin,
        dateNaissance: req.body.dateNaissance,
        telephone: req.body.telephone,
        avatar: req.body.avatar,
        password: "Topnet2020",
        role: req.body.role,
        adresse: req.body.adresse,
        enabled: req.body.enabled,
        permission: req.body.permission,
        user_created_date: req.body.user_created_date,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);
// READ (ALL)
router.get("/", (req, res) => {
  User.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// READ (ONE)
router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: `No such user.` });
    });
});
//update user permission
router.put("/updatePermission/:id", async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.body._id },
    {
      $set: {
        adresse: req.body.adresse,
        permission: req.body.permission,
      },
    }
  )
    .then((data) => {
      res.status(202).json("updated");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
// UPDATE
router.put("/:id", (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar,
        role: req.body.role,
        enabled: req.body.enabled,
      },
    },
    {
      runValidators: true,
      context: "query",
    }
  )
    .then((oldResult) => {
      User.findOne({ _id: req.params.id })
        .then((newResult) => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              name: newResult.name,
              email: newResult.email,
              avatar: newResult.avatar,
              role: newResult.role,
              enabled: newResult.enabled,
            },
          });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch((err) => {
      if (err.errors) {
        if (err.errors.name) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.name.message });
          return;
        }
        if (err.errors.email) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.email.message });
          return;
        }
        if (err.errors.avatar) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.avatar.message });
          return;
        }
        if (err.errors.role) {
          res
            .status(400)
            .json({ success: false, msg: err.errors.role.message });
          return;
        }
        // Show failed if all else fails for some reasons
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});
router.get("/current", auth, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
  });
});

// @route   GET api/users/profile
// @desc    Return profile of current user
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    console.log(" user ", req.user);
    const user = await User.findById(req.user.id).select("-password");
    console.log(user);
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route   POST api/users/profile
// @desc    edit user profile
// @access  Private
router.post("/profile", auth, (req, res) => {
  // Get fields

  try {
    const profileFields = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
      adresse: req.body.adresse,
      avatar: req.body.avatar,
      user_created_date: req.body.user_created_date,
      enabled: req.body.enabled,
    };

    User.findById(req.user.id).then((profile) => {
      if (profile) {
        // Update
        profile.name = req.body.name;
        profile.email = req.body.email;
        profile.role = req.body.role;
        profile.adresse = req.body.adresse;
        profile.avatar = req.body.avatar;
        profile.user_created_date = req.body.user_created_date;
        profile.enabled = req.body.enabled;

        profile.save().then((profile) => {
          res.end(JSON.stringify({ profile }, null, 5));
        });
      } else {
        res.sendStatus(404);
      }
    });
    console.log("profileFields: ", profileFields);
  } catch (err) {
    console.error("error : ", err.message);
    res.status(500).send("server error");
  }
});

// @route   GET api/users/verifpass
// @desc    verif if current password is equal to 'Topnet2020'
// @access  Private
router.get("/verifpass", auth, async (req, res) => {
  let pass = "Topnet2020";
  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(pass, user.password);
    return res.json(isMatch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// @route   POST api/users/updatepassword
// @desc    update password
// @access  Private
router.post("/updatepassword", auth, async (req, res) => {
  try {
    console.log("user apii REQ.BODY", req.body.password);
    //retrieve the new password
    let password = req.body.password;

    //hash the new password
    var salt = await bcrypt.genSalt(10);
    var hash = await bcrypt.hashSync(password, salt);

    //update the user with the new password
    user2 = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: { password: hash } }
    );
    return res.json(user2);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

// Show failed if all else fails for some reasons
/*    res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});*/
router.delete("/:id", (req, res) => {
  User.findOneAndDelete({
    _id: req.params.id,
  })
    .then((success) => res.json(success))
    .catch((err) => res.status(404).json(err));
});
/*
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
})
*/
router.post("/registerFreelancer", (req, res) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        cin : req.body.cin,
        telephone: req.body.telephone,
        password: "Topnet2020",
        role: req.body.role,
        adresse: req.body.adresse,
        enabled: req.body.enabled,
        permission: req.body.permission,
        user_created_date: req.body.user_created_date,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
