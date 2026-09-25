const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config");
const { HttpStatus } = require("../config/constants.js")

module.exports = async (request, response, next) => {
  try {
    //   get the token from the authorization header
    const token = await request.headers.authorization.split(" ")[1];

    if (!token) {
      return response.status(HttpStatus.UNAUTHORIZED).json({
        message: "Authorization header is required"
        });
    }

    //check if the token matches the supposed origin
    const decodedToken = await jwt.verify(token, JWT_SECRET);

    // retrieve the user details of the logged in user
    const user = await decodedToken;

    // pass the user down to the endpoints here
    request.user = user;

    // pass down functionality to the endpoint
    next();
  } catch (error) {
   response.status(HttpStatus.UNAUTHORIZED).json({
    message: "Invalid or expired token"
    });
  }
};
