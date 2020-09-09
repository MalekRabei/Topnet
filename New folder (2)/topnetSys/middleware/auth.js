const jwt = require("jsonwebtoken");
const config = require("config");
//nahiweh hedha ? 
module.exports = function(req, res, next) {
  //Get Token from header
  //const token = req.header("x-auth-token");
  var tokenJWT = req.headers['authorization'];
  
  //Check if not token
  if (!tokenJWT) {
    return res.status(401).json({
      msg: "No Token, authorisation denied"
    });
  }
  //verify token
  try {
    var token = tokenJWT.replace(/^JWT\s/, '');
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({
      msg: "Token is not valid"
    });
  }
};
