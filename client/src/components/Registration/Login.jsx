import axios from "axios";
import { React, useState } from "react";
import { Link } from "react-router-dom";
import VisibilityOffSharpIcon from "@material-ui/icons/VisibilityOffSharp";
import VisibilitySharpIcon from "@material-ui/icons/VisibilitySharp";

function Login(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [showIcon, setShowIcon] = useState(false);

  function handleChangeLoginUsername(event) {
    setUsername(event.target.value);
  }

  function handleChangeLoginPassword(event) {
    setPassword(event.target.value);
  }

  function handleShowIconOn() {
    setShowIcon(false);
    window.$("#loginInputPassword").attr("type", "password");
  }

  function handleShowIconOff() {
    setShowIcon(true);
    window.$("#loginInputPassword").attr("type", "text");
  }

  function handleLoginSubmit(event) {
    event.preventDefault();
    const userLoginData = {
      username: username,
      password: password,
    };
    axios
      .post("/api/login", { userLoginData })
      .then((response) => {
        if (response.data.verificationError) {
          setErrorMessage(response.data.verificationError);
        }
        if (response.data.fieldEmptyError) {
          setErrorMessage(response.data.fieldEmptyError);
        }
        if (response.data.loginVerified) {
          props.getResponseFromLogin(response.data.loginVerified);
        }
      })
      .catch((err) => {
        setErrorMessage("There is some error. Try again");
      });
  }

  return (
    <div className="loginContainer">
      <div className="container">
        <div className="row" id="loginUpperRow">
          <img
            className="loginImage"
            src="../images/chat.jpg"
            alt="symbolChat"
          />
          <h1 className="loginHeading">Login</h1>
        </div>
      </div>
      {errorMessage ? (
        <div className="errorMessageContainer">
          <p className="errorMessageDescription">{errorMessage}</p>
        </div>
      ) : null}
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="loginInputUsername"
            name="username"
            autoComplete="off"
            onChange={handleChangeLoginUsername}
            required
          />
        </div>
        <div className="form-group loginInputContainer">
          <label className="loginLabels" htmlFor="password">
            Password
          </label>
          <div>
            <input
              type="password"
              className="form-control"
              name="password"
              id="loginInputPassword"
              onChange={handleChangeLoginPassword}
              required
            />
            {showIcon ? (
              <VisibilitySharpIcon
                onClick={handleShowIconOn}
                className="loginVisibleIcon"
              />
            ) : (
              <VisibilityOffSharpIcon
                onClick={handleShowIconOff}
                className="loginVisibleIcon"
              />
            )}
          </div>
        </div>
        <button className="loginButtons" type="submit">
          Login
        </button>
        <hr className="loginLine" />
        <p className="loginRegisterLine">Don't have an Account ?</p>
        <Link className="loginRegisterButton" to="/register">
          Register
        </Link>
      </form>
    </div>
  );
}

export default Login;
