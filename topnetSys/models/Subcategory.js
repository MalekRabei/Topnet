const mongoose = require("mongoose");
const SubcategorySchema = new mongoose.Schema({
  name: { type: String  , required: true , unique: true }, 
  slug : {type: String  , required: true, unique: true} , 
  properties: { type: Array, required: false }, 
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'category', required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'productProperties', required: false }],

},{
  versionkey: false,
  timestamps: true
});

module.exports = Subcategory = mongoose.model("subcategory", SubcategorySchema);
