const express = require("express");
const authRouter = express.Router();
const auth = require("../middleware/index");
const {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthenticatedUser,
} = require("../controller/index");

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/authenticate", auth, checkAuthenticatedUser);

module.exports = authRouter;
