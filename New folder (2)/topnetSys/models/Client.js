const mongoose = require('mongoose')

const ClientSchema = new mongoose.Schema({
    chargeCompte:{ type:Object,
    ref: User},
    dateDebut:{type:Date},
    profil:{type:String},
    raisonSociale:{type:String},
    nombreSite:{type:String},
    multisite:{type:Boolean},
    groupe:{type:Boolean},
    effectif:{type:String},
    secteurActivite:{type:String},
    registreCommerce:{type:String},

    matriculeFiscale:{type:String},

    chiffreAffaire : {type: String},
    tva:{type:Boolean},
    tvaFile:{type:String},

    timbre:{type:Boolean},
    timbreFile:{type:String},

    //coordonnée principale 
    ///adresse
    rue1:{type:String},
    rue2:{type:String},
    ville:{type:String},
    gouvernerat:{type:String},
    localite:{type:String},
    delegation:{type:String},
    codePostal:{type:String},
    pays : {type: String},

    tel:{type:String},
    gsm:{type:String},
    fax:{type:String},
    emailTopnet:{type:String},
    email1:{type:String},
    email2:{type:String},
    email3:{type:String},
    nomComplet: {
        type: String,
        //required: true
    },
    logo: {
        type: String,
    },
    contact:[
        {type:Object,
        ref: "contact"}
    ],
    products: [
        {
            type: Object,
            ref: "product",
       // required: true
    }
    ],

},{
    versionkey: false,
    timestamps: true
});

ClientSchema.set('toJSON', {
    transform: function(doc, ret) {
    //  delete ret['password'];
      return ret;
    }
  });

 /* ClientSchema.virtual("clientLogo").get(function() {
    return "http://localhost:5000/uploads/"+ this.clientLogo;
  });
*/
module.exports = Client = mongoose.model('Client', ClientSchema);