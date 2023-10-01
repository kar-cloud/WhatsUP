const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    const usernameCookie = req.cookies.username;
    if (!token) {
      next();
    } else {
      req.isVerified = jwt.verify(token, process.env.JWT_SECRET);
      req.usernameCookie = usernameCookie;
      next();
    }
    // will return the user id of the verified user
  } catch (err) {
    console.log(err);
    return res.status(401).json({ errorMessage: "You are Unauthorized" });
  }
};

module.exports = auth;
