var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator/check");
const fs = require("fs");

Product = require("../../models/Product");

//all products
router.get("/", (req, res, next) => {
  Product.find({})
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//add product
router.post(
  "/add",
  [
    check("title", "Title is required").isLength({ min: 1 }),
    check("country_code", "Coutry Code is required").isLength({ min: 1 }),
    check("productImg", "Image is required").isLength({ min: 1 }),
    check("alt_pic", "Alt img is required").isLength({ min: 1 }),
  ],
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
      await Product.create({
        _id: req.params.id,
        title: req.body.title,
        country_code: req.body.country_code,
        active: req.body.active,
        productImg: req.body.productImg.toLowerCase().split(" ").join("-"),
        alt_pic: req.body.alt_pic,
      }).then((data) => {
        res.status(202).json({ data, msg: "Product Created Successfully" });
      });
    } catch (error) {
      console.log("error", error);
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
//update Product
router.put(
  "/update",
  [
    check("title", "Title is required").isLength({ min: 1 }),
    check("country_code", "Coutry Code is required").isLength({ min: 1 }),
    check("productImg", "Image is required").isLength({ min: 1 }),
    check("alt_pic", "Alt img is required").isLength({ min: 1 }),
  ],
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
      await Product.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            active: req.body.active,
            alt_pic: req.body.alt_pic,
            country_code: req.body.country_code,
            productImg: req.body.productImg.toLowerCase().split(" ").join("-"),
            title: req.body.title,
          },
        }
      ).then((data) => {
        res.status(202).json({ data, msg: "Product Updated Successfully" });
      });
    } catch (error) {
      console.log("error", error);
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

//delete product
router.delete("/delete/:id", async (req, res) => {
  Product.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(202).send("Product Deleted Successfully !");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//get product by country code
router.get("/countrycode", async (req, res, next) => {
  let rawdata = fs.readFileSync(__dirname + "/currentSiteJson.json");
  let currentSite = JSON.parse(rawdata);

  let country_code = await Site.find(
    { _id: currentSite._id },
    { _id: false, country_code: true }
  );
  await Product.find({ country_code: country_code[0].country_code })
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//get product by id
router.get("/:id", (req, res, next) => {
  Product.findOne({ _id: req.params.id })
    .then((data) => {
      console.log(data.title);
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
