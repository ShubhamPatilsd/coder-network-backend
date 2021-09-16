const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (jwt_token) => {
  //return

  try {
    console.log(jwt.verify(jwt_token.toString(), process.env.JWT_KEY));
    return jwt.verify(jwt_token.toString(), process.env.JWT_KEY).data;
  } catch (err) {
    return null;
  }
};
