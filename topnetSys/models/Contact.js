const mongoose = require('mongoose')
const ContactSchema = new mongoose.Schema({
    nom: {
        type: String,
    },
    prenom:{type:String},

    civilite:{type:String},
    cin:{type:String},
    fonction:{type:String},
    resident:{type:String},


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
    email1:{type:String},
    email2:{type:String},
    email3:{type:String},
 
   
},{
    versionkey: false,
    timestamps: true
});

module.exports = Contact = mongoose.model('contact', ContactSchema);