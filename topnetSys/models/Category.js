const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema({
  name: { type: String  , required: true , unique: true  }, 
  slug : {type: String  , required: true , unique: true  } , 
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subcategory', required: false }],

},{
  versionkey: false,
  timestamps: true
});

module.exports = Category = mongoose.model("category", CategorySchema);
