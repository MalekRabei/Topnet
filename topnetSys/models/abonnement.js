const mongoose = require('mongoose');

const abonnementSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    //clientId :  { type: mongoose.Schema.Types.ObjectId, ref : 'client',required:false},
    clientId :  { type: String , ref : 'client',required:false},
    productId : { type: mongoose.Schema.Types.ObjectId, ref : 'product',required:false},
    debit:      { type: String, required: false },
    fichier1recto: { type: String, required: false },
    fichier1verso: { type: String, required: false },
    fichier2recto: { type: String, required: false },
    fichier2verso: { type: String, required: false },
    fichier3recto: { type: String, required: false },
    fichier3verso: { type: String, required: false },
    modePaiement: { type: String, required: false },
    etat: { type: Boolean, required: false },
    telADSL:{type: String, required: false },

});

module.exports = mongoose.model('Abonnement', abonnementSchema);



