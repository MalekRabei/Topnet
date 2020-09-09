const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
  country_code: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  productImg: {
    type: String,
    required: true,
  },
  alt_pic: {
    type: String,
    required: true,
  },
},{
  versionkey: false,
  timestamps: true
});

module.exports = Product = mongoose.model("product", ProductSchema);
