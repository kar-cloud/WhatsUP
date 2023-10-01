const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../schema/index");

const registerUser = async (req) => {
  const userChatbox = req.body.userData;
  if (
    !userChatbox.username ||
    !userChatbox.password ||
    !userChatbox.confirmPassWord
  ) {
    return { fieldEmptyError: "Enter all the required fields" };
  }

  if (
    userChatbox.password.length < 8 ||
    userChatbox.confirmPassWord.length < 8
  ) {
    return {
      passwordLengthError: "Password should be min 8 characters",
    };
  }

  if (userChatbox.username.length > 25) {
    return {
      usernameLengthError: "Username can be max 25 characters",
    };
  }

  const user = await User.findOne({ username: userChatbox.username });
  if (user) {
    return { usernameError: "This username is already taken" };
  } else {
    if (userChatbox.password !== userChatbox.confirmPassWord) {
      return { passwordError: "Passwords do not match" };
    } else {
      const hash = await bcrypt.hash(userChatbox.password, 10);
      const newUser = new User({
        username: userChatbox.username,
        password: hash,
      });
      const savedUser = await newUser.save();

      // signing a token for authorization
      const token = jwt.sign(
        {
          user: savedUser._id,
        },
        process.env.JWT_SECRET
      );

      // sending the token
      return {
        token: token,
        username: savedUser.username,
        registrationVerified: "User is verified",
      };
    }
  }
};

const loginUser = async (req) => {
  const userChatboxLogin = req.body.userLoginData;
  if (!userChatboxLogin.username || !userChatboxLogin.password) {
    return { fieldEmptyError: "Enter all the required fields" };
  }
  const foundUser = await User.findOne({ username: userChatboxLogin.username });
  if (!foundUser) {
    return {
      verificationError: "Details cannot be verified..Try again",
    };
  }

  const checkPassword = await bcrypt.compare(
    userChatboxLogin.password,
    foundUser.password
  );

  if (!checkPassword) {
    return {
      verificationError: "Details cannot be verified..Try again",
    };
  }

  // signing a token
  const token = jwt.sign(
    {
      user: foundUser._id,
    },
    process.env.JWT_SECRET
  );

  // sending the token
  return {
    token: token,
    username: foundUser.username,
    loginVerified: "User is verified",
    userActive: foundUser.username,
  };
};

module.exports = {
  registerUser,
  loginUser,
};
