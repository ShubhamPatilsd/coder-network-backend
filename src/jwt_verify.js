const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (jwt_token) => {
  //return

  try {
    return jwt.verify(jwt_token.toString(), process.env.JWT_KEY).id;
  } catch (err) {
    return null;
  }
};
