import React, { useState } from "react";
import axios from "axios";
import VisibilityOffSharpIcon from "@material-ui/icons/VisibilityOffSharp";
import VisibilitySharpIcon from "@material-ui/icons/VisibilitySharp";

function Register(props) {
  const [userName, setUsername] = useState();
  const [passWord, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [showIconPassword, setShowIconPassword] = useState(false);
  const [showIconConfirmPassword, setShowIconConfirmPassword] = useState(false);

  function handleChangeUsername(event) {
    setUsername(event.target.value);
  }

  function handleChangePassword(event) {
    setPassword(event.target.value);
  }

  function handleChangeConfirmPassword(event) {
    setConfirmPassword(event.target.value);
  }

  function handleShowIconOnPassword() {
    setShowIconPassword(false);
    window.$("#registerInputPassword").attr("type", "password");
  }

  function handleShowIconOffPassword() {
    setShowIconPassword(true);
    window.$("#registerInputPassword").attr("type", "text");
  }

  function handleShowIconOnConfirmPassword() {
    setShowIconConfirmPassword(false);
    window.$("#registerInputConfirmPassword").attr("type", "password");
  }

  function handleShowIconOffConfirmPassword() {
    setShowIconConfirmPassword(true);
    window.$("#registerInputConfirmPassword").attr("type", "text");
  }

  function handleRegister(event) {
    event.preventDefault();
    const userData = {
      username: userName,
      password: passWord,
      confirmPassWord: confirmPassword,
    };
    axios
      .post("/api/register", { userData })
      .then((response) => {
        if (response.data.fieldEmptyError) {
          setErrorMessage(response.data.fieldEmptyError);
        }
        if (response.data.usernameError) {
          console.log("error");
          setErrorMessage(response.data.usernameError);
        }
        if (response.data.passwordError) {
          setErrorMessage(response.data.passwordError);
        }
        if (response.data.passwordLengthError) {
          setErrorMessage(response.data.passwordLengthError);
        }
        if (response.data.usernameLengthError) {
          setErrorMessage(response.data.usernameLengthError);
        }
        if (response.data.registrationVerified) {
          props.getResponseFromRegister(response.data.registrationVerified);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    setTimeout(function () {
      window.location.reload();
    }, 1550);
  }

  return (
    <div className="registerContainer">
      <div className="container">
        <div className="row" id="registerUpperRow">
          <img
            className="registerImage"
            src="../images/chat.jpg"
            alt="symbolChat"
          />
          <h1 className="registerHeading">Register</h1>
        </div>
      </div>
      {errorMessage ? (
        <div className="errorMessageContainer">
          <p className="errorMessageDescription">{errorMessage}</p>
        </div>
      ) : null}

      <form onSubmit={handleRegister}>
        <div className="form-group registerInputContainer">
          <label htmlFor="username" className="registerLabels">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            name="username"
            id="registerInputUsername"
            placeholder="For ex: Jim"
            maxLength="25"
            autoComplete="off"
            onChange={handleChangeUsername}
            required
          />
        </div>
        <div className="form-group registerInputContainer">
          <label htmlFor="password" className="registerLabels">
            Password
          </label>
          <div>
            <input
              type="password"
              className="form-control"
              name="password"
              minLength="8"
              autoComplete="off"
              id="registerInputPassword"
              onChange={handleChangePassword}
              required
            />
            {showIconPassword ? (
              <VisibilitySharpIcon
                onClick={handleShowIconOnPassword}
                className="loginVisibleIcon"
              />
            ) : (
              <VisibilityOffSharpIcon
                onClick={handleShowIconOffPassword}
                className="loginVisibleIcon"
              />
            )}
          </div>
        </div>
        <div className="form-group registerInputContainer">
          <label htmlFor="confirmPassword" className="registerLabels">
            Confirm Password
          </label>
          <div>
            <input
              type="password"
              minLength="8"
              className="form-control"
              name="confirmPassword"
              autoComplete="off"
              id="registerInputConfirmPassword"
              onChange={handleChangeConfirmPassword}
              required
            />
            {showIconConfirmPassword ? (
              <VisibilitySharpIcon
                onClick={handleShowIconOnConfirmPassword}
                className="loginVisibleIcon"
              />
            ) : (
              <VisibilityOffSharpIcon
                onClick={handleShowIconOffConfirmPassword}
                className="loginVisibleIcon"
              />
            )}
          </div>
        </div>
        <button className="registerButton" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
