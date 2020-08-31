const mongoose = require("mongoose");
const ProductPropertiesSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: false,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subcategory",
    required: false,
  },
  path: { type: String, required: true },
  properties: { type: Array, required: false },
},{
  versionkey: false,
  timestamps: true
});

module.exports = ProductProperties = mongoose.model(
  "productProperties",
  ProductPropertiesSchema
);
