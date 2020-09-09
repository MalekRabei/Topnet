const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    cin: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
      
    },
    adresse: {
          type:Array,
          required:true,
        unique: false
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    user_created_date: {
        type: Date,
        default: Date.now
    }, 
    enabled: {
        type: Boolean,
        default: false 
    },
    permission: {
        type: Array,
        default: false 
    }, 
    description : {
        type:String,
        required:false 
    }
},{
    versionkey: false,
    timestamps: true
});

module.exports = User = mongoose.model('user', UserSchema);