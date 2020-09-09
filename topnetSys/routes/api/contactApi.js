const express = require("express");
const router = express.Router();
const { validationResult , check} = require("express-validator");
const mongoose = require("mongoose");

const Contact = require("../../models/Contact");

// @route   POST api/contact/list
// @desc    get all contact
// @access  Private
router.get("/list", (req, res) => {
  Contact.find({})
  .then((data) => {
    res.status(202).json(data);
  })
  .catch((error) => {
    res.status(500).send(error);
  });
});



//add contact
router.post(
    "/add",
    [
      check("nom", "Nom est obligatoire").isLength({ min: 1 }),
      check("prenom", "Prenom est obligatoire").isLength({ min: 1 }),
      check("cin", "CIN obligatoire").isLength({ min: 1 }),
      check("tel", "Telephone est obligatoire").isLength({ min: 1 }),

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
        await Contact.create({

            nom:req.body.nom,
            prenom:req.body.prenom,
        
            civilite:req.body.civilite,
            cin:req.body.cin,
            fonction:req.body.fonction,
            resident:req.body.resident,
        
        
            rue1: req.body.rue1,
            rue2: req.body.rue2,
            ville : req.body.ville,
            gouvernerat: req.body.gouvernerat,
            localite: req.body.localite,
            delegation : req.body.delegation,
            codePostal: req.body.codePostal,
            pays : req.body.pays,
            
            tel : req.body.tel,
            gsm: req.body.gsm,
            fax: req.body.fax,

            email1: req.body.email1,
            email2: req.body.email2,
            email3: req.body.email3,
        }).then((data) => {
          res.status(202).json({ data, msg: "Contact Created Successfully" });
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

  router.delete("/delete/:id", function (req, res, next) {
    Contact.find().remove({ _id: req.params.id }, function (err, obj) {
      if (err) throw err;
    });
  });

  
  module.exports = router;