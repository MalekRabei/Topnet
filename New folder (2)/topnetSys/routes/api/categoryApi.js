var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const { check, validationResult } = require("express-validator/check");

/*************** CATEGORY ***************/
Category = require("../../models/Category");
Product = require("../../models/Product");
ProductProperties = require("../../models/ProductProperties");
//get all categories
router.get("/", async (req, res, next) => {
  await Category.find({})
    .populate("subcategories")

    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});




router.get("/:id", async (req, res) => {
  Category.find({ _id: req.params.id })
    .then((data) => {
      res.status(202).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

router.get("/byid/:id", async (req, res, next) => {
  await Category.find({ _id: req.params.id })
    .populate("subcategories")
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//add category
router.post(
  "/add",
  [
    check("name", "Name is required").isLength({ min: 1 }),
    check("slug", "slug is required").isLength({ min: 1 }),
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
      await Category.create({
        _id: req.params.id,
        name: req.body.name,
        slug: req.body.slug.split(" ").join("-"),
      }).then(async (data) => {
        res.status(202).json({ data, msg: "Category Added Successfully" });
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
//update category
router.put(
  "/update",
  [
    check("name", "Name is required").isLength({ min: 1 }),
    check("slug", "slug is required").isLength({ min: 1 }),
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
      await Category.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            slug: req.body.slug.split(" ").join("-"),
          },
        }
      ).then((data) => {
        res.status(202).json({ data, msg: "Category Updated Successfully" });
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
//delete category
router.delete("/delete/:id", async (req, res) => {
  Category.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(202).send("Category Deleted Successfully !");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//subcategories of catory
router.get("/subcategories/:id", async (req, res) => {
  Subcategory.find({ category: req.params.id })
    .populate("category")
    .populate([
      {
        path: "products",
        model: ProductProperties,
        populate: {
          path: "product",
          model: Product,
        },
      },
    ])
    .then((data) => {
      res.status(202).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
//subcategories by sub id
router.get("/subcategoriesbyids/:id", async (req, res) => {
  Subcategory.find({ _id: req.params.id })
    .populate("category")
    .populate("products")
    .then((data) => {
      res.status(202).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

/*************** SUBCATEGORY ***************/
Subcategory = require("../../models/Subcategory");

router.get("/subcategories", (req, res, next) => {
  Subcategory.find({})
    .then((data) => {
      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});
router.get("/subcategory/:id", async (req, res) => {
  Subcategory.find({ _id: req.params.id })
    .then((data) => {
      res.status(202).send(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

//add subcategory
router.post(
  "/add/subcategory/:idcategory",
  [
    check("name", "Name is required").isLength({ min: 1 }),
    check("slug", "slug is required").isLength({ min: 1 }),
  ],
  async (req, res) => {
    // const category = await Category.findById(req.params.idcategory).populate(
    //   "subcategories"
    // );

    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      await Subcategory.create({
        name: req.body.name,
        slug: req.body.slug.split(" ").join("-"),
        category: req.params.idcategory,
        properties: req.body.properties,
      }).then(async (data) => {
        await Category.update(
          { _id: req.params.idcategory },
          { $push: { subcategories: data } }
        );
        res.status(202).json({ data, msg: "Subcategory Added Successfully" });
      });
    } catch (error) {
      return res.status(400).json({
        errors: [
          {
            errors: errors.array(),
          },
        ],
      });
    }
  }
);
//update subcategory
router.put(
  "/update/subcategory",
  [
    check("name", "Name is required").isLength({ min: 1 }),
    check("slug", "slug is required").isLength({ min: 1 }),
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
      await Subcategory.findOneAndUpdate(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            slug: req.body.slug.split(" ").join("-"),
            properties: req.body.properties,
          },
        }
      ).then((data) => {
        res.status(202).json({ data, msg: "Subcategory Updated Successfully" });
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
//delete subcategory
router.delete("/subcategory/delete/:id", async (req, res) => {
  Subcategory.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(202).send("Subcategory Deleted Successfully !");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
