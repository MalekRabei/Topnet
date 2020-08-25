var express = require("express");
multer = require("multer");
var router = express.Router();
const mongoose = require("mongoose");
var mkdirp = require('mkdirp');
const DIR = "./dashboard/public/Images/";
const fs = require("fs");
const storage =  multer.diskStorage({
  destination: (req, file, cb) => {   
    const reqPath= req.params.location.toLowerCase().split("$").join("/")
    console.log("destination-", file, "location ", reqPath);
    fs.exists(DIR+reqPath, exist => {
      if (!exist) {
       console.log("doesn exists ")
       return fs.mkdir(DIR+reqPath, {recursive:true}, (err)=>{
          if (err) console.log(`Error creating directory: ${err}`)
          return cb(null, DIR+reqPath)
        })
      }
      return cb(null, DIR+reqPath)
      })
     
  
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

router.post("/:location", upload.single("img"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  // console.log("upload.single  ", upload.single("productImg"));
  console.log("req", req.params.location);
});

module.exports = router;
