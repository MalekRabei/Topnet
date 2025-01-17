const mongoose = require("mongoose");
const PropertySchema = new mongoose.Schema({
  property: {
    type: String,
    required: true,
  }
  
},{
  versionkey: false,
  timestamps: true
});

module.exports = Property = mongoose.model("property", PropertySchema);
