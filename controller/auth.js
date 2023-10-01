const authServices = require("../services/auth");

const registerUser = async (req, res) => {
  const response = await authServices.registerUser(req);
  if (response.token && response.username) {
    return res
      .cookie("token", response.token, {
        httpOnly: true,
      })
      .cookie("username", response.username, {
        httpOnly: true,
      })
      .json({ registrationVerified: response.registrationVerified })
      .send();
  }
  return res.json(response);
};

const loginUser = async (req, res) => {
  const response = await authServices.loginUser(req);
  if (response.token && response.username) {
    return res
      .cookie("token", response.token, {
        httpOnly: true,
      })
      .cookie("username", response.username, {
        httpOnly: true,
      })
      .json({
        loginVerified: response.loginVerified,
        userActive: response.userActive,
      })
      .send();
  }
  return res.json(response);
};

const logoutUser = async (req, res) => {
  return res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .cookie("username", "", {
      httpOnly: true,
      expires: new Date(0),
    })
    .send();
};

const checkAuthenticatedUser = (req, res) => {
  if (!req.isVerified) {
    res.json({ unauthorizedMessage: "You are unauthorized" });
  } else {
    res.json({
      authorizedMessage: "You are authenticated",
      username: req.usernameCookie,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuthenticatedUser,
};
