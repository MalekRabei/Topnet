var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator/check");
Property = require("../../models/Property");

//all properties
router.get("/", (req, res, next) => {
  Property.find({})
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//add Property
router.post("/add",
  [check("data", "Property name is required").isLength({ min: 1 })],
  async (req, res) => {
    console.log("adding property ", req.body.data)

    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    try {
      // creating new Property
      await Property.create({
        property: req.body.data,
      }).then(async (result) => {
        res.status(202).json({ result, msg: "Property Added Successfully" });
      });
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            msg: error.errmsg,
          },
        ],
      });
    }
  }
);


//update widget
router.put(
  "/update",
  [check("property", "Property name is required").isLength({ min: 1 })],
  async (req, res) => {
    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      await Property.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            property: req.body.property,
          },
        }
      ).then((data) => {
        res.status(202).json({ data, msg: "Property Updated Successfully" });
      });
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            msg: error.errmsg,
          },
        ],
      });
    }
  }
);

router.delete("/delete/:id", async (req, res) => {
  Property.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(202).send("Property Deleted Successfully !");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
