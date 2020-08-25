const express = require("express");
const router = express.Router();
const { validationResult , check} = require("express-validator");


const Client = require("../../models/Client");

// @route   POST api/clients/list
// @desc    get all clients
// @access  Private
router.get("/list", (req, res) => {
  Client.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res
        .status(404)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// @route   POST api/clients/client
// @desc    add client
// @access  Private
router.post("/client/add", (req, res) => {
    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
  try {
   
        //create new client
        const newclient = new Client({
          //get fields
        chargeCompte: req.body.chargeCompte,
        profil: req.body.profil,
        active: req.body.active,
        raisonSociale: req.body.raisonSociale,
        nombreSite: req.body.nombreSite,
        multisite: req.body.multisite,
        groupe: req.body.groupe,
        dateDebut: req.body.dateDebut,
        effectif: req.body.effectif,

        secteurActivite: req.body.secteurActivite,
        matriculeFiscale: req.body.matriculeFiscale,
        registreCommerce : req.body.registreCommerce,
        chiffreAffaire : req.body.chiffreAffaire,
        tva: req.body.tva,
        timbre: req.body.timbre,
        logo: req.body.logo,

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
         emailTopnet: req.body.emailTopnet,
         email1: req.body.email1,
         email2: req.body.email2,
         email3: req.body.email3,
         lattidue : req.body.lattidue,
         nomComplet: req.body.nomComplet,
         products: req.body.products,
         contact: req.body.contact
       
        });
        newclient
          .save()
          .then((client) => res.json(client));
          //.catch((err) => console.log(err));

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
});

// @route   GET api/clients/client/id
// @desc    get client by id
// @access  Private
router.get("/:id", async (req, res) => {
 await Client.findById({ _id : req.params.id })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      req
        .status(404)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// @route   PUT api/clients/client/edit
// @desc    edit client
// @access  Private
router.put("/client/edit/:id", async (req, res) => {

    //Check errors in  the body
    const errors = validationResult(req);
    //Bad Request
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    console.log(req.params.id);
 await   Client.findOneAndUpdate({ _id: req.params.id } , 
  {
    $set: {
    clientName :req.body.clientName,
    clientState : req.body.clientState,
    clientLogo :req.body.clientLogo,
    clientCountryCode : req.body.clientCountryCode,
    clientProductIds: req.body.clientProductIds,
    clientAds: req.body.clientAds,
  },
  })
 .then((clientInput) => {
      console.log("client updated ", clientInput);
          res.end(JSON.stringify({ clientInput }, null, 5));  
          //res.status(202).json( clientInput );

      }).catch((error) => {
        res.status(500).send(error);
      });
 
});

router.delete("/client/delete/:id", function (req, res, next) {
  Client.find().remove({ _id: req.params.id }, function (err, obj) {
    if (err) throw err;
  });
});


router.get("/findClientByMatricule/:matricule", async (req,res,next)=>{

  await Client.findOne({matriculeFiscale: req.params.matriculeFiscale})
  .then((data)=>{
    console.log("client by mail", data);
    res.status(202).json(data);
  })
 .catch((error)=>{
      res.status(500).send(error);
  });
});

//get product by country code
router.get("/countrycode/:code", async (req, res, next) => {

  await Product.find({ country_code: req.params.code })
    .then((data) => {
      console.log("this is country code data" ,data);

      res.status(202).json(data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

module.exports = router;
