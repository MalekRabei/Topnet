var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const fs = require("fs");
const { validationResult , check} = require("express-validator");


const Abonnement = require("../../models/abonnement");

// @route   POST api/abonnement/list
// @desc    get all abonnements
// @access  Private
router.get("/list", (req, res) => {
    Abonnement.find({})
      .then((result) => {
        res.json(result);
      })
      .catch((err) => {
        res
          .status(404)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      });
  });
router.post(
    "/abonnement/add", async(req, res, next) => {
   // if (req.body.clientId && req.body.productId) {
           Abonnement.find()
            .and([{ clientId: req.body.clientId }, { productId: req.body.productId }])
            .exec()
            .then(result => {
             
                if (result.length === 0) {
                    const abonnement =new Abonnement({
                        _id: new mongoose.Types.ObjectId(),
                        clientId      : req.body.clientId,
                        productId     : req.body.productId,
                        debit         : req.body.debit,
                        fichier1recto : req.body.fichier1recto,
                        fichier1verso : req.body.fichier1verso,
                        fichier2recto : req.body.fichier2recto,
                        fichier2verso : req.body.fichier2verso,
                        fichier3recto : req.body.fichier3recto,
                        fichier3verso : req.body.fichier3verso,
                        modePaiement  : req.body.modePaiement,
                        telADSL       : req.body.telADSL,
                        etat          : req.body.etat
                    });


                    abonnement.save().then(result => {
                            console.log(result);
                            res.status(201).json({
                                createdabonnement: abonnement
                            });
                        })
                        .catch(
                            err => {
                                console.log(err)
                                res.status(500).json({
                                    error: err
                                });
                            });
               } else {
                    res.status(409).json({
                        message: "Duplicated clientId and productId"
                    })
                }
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            });
      /* } else {
        res.status(400).json({
            error: "missing clientId and/or productId"
        })
    }*/



})

router.get("/get",(req, res, next) => {
    
  
        Abonnement.findById(req.body.abonnementId)
        .select('_id clientId productId')
        .exec()
        .then( doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
            }
            else {
                res.status(404).json({
                   message : "No valid entry found for the given ID" 
                }) 
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });

    
})


router.post("/update",(req, res, next) => {
    const id = req.body.abonnementId;
    const clientId = req.body.clientId;
    const productId = req.body.productId;
    const debit = req.body.debit;
    const fichier1recto = req.body.fichier1recto;
    const fichier1verso = req.body.fichier1verso;
    const fichier2recto = req.body.fichier2recto;
    const fichier2verso = req.body.fichier2verso;
    const modePaiement = req.body.modePaiement;


    let updateOps = {};
    if(id){
        

    Abonnement
    .findById(id)
    .exec()
    .then( rslt => {
        if(rslt){
        console.log(updateOps);
        Abonnement.update({ 
            _id: id ,
            //clientId:clientId,
            //productId:productId,
          

        }, {$set :   {debit:debit,
            fichier1recto:fichier1recto,
            fichier1verso:fichier1verso,
            fichier2recto:fichier2recto,
            fichier2verso:fichier2verso,
            modePaiement:modePaiement}})
        .exec()
        .then(rst => {
            res.status(200).json({
                message : "abonnement updated sucessfully"
            });

        })
        .catch(err => {
            res.status(500).json({
                error : err
            });
        });
        }
        else{
            res.status(404).json({
                message : "No valid entry found for the given ID" 
             }) 
        }
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });     
    });
}
else {
    res.status(400).json({
        error : "missing abonnement"
    });
}
})
module.exports = router;