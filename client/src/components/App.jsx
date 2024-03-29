import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { React, useState, Fragment } from "react";
import Login from "./Registration/Login";
import Logout from "./Registration/Logout";
import Register from "./Registration/Register";
import Home from "./Registration/Home";
import Chatroom from "./Chatroom";
import Error404 from "./Registration/Error404";
import axios from "axios";

function App() {
  const [auth, setAuth] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/login" ||
    window.location.pathname === "/register" ||
    window.location.pathname === "/chatroom"
  ) {
    axios.get("/api/auth/authenticate").then((response) => {
      if (response.data.authorizedMessage) {
        if (auth === false) {
          setAuth(true);
          setCurrentUser(response.data.username);
        }
      }
      if (response.data.unauthorizedMessage) {
        if (auth === true) {
          setAuth(false);
        }
      }
    });
  }

  function getResponseFromRegister(response) {
    response === "User is verified" ? setAuth(true) : setAuth(false);
  }

  function getResponseFromLogin(response) {
    response === "User is verified" ? setAuth(true) : setAuth(false);
  }

  return (
    <Fragment>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            {auth ? <Redirect to="/chatroom" /> : <Home />}
          </Route>
          <Route path="/register">
            {auth ? (
              <Redirect to="/chatroom" />
            ) : (
              <Register getResponseFromRegister={getResponseFromRegister} />
            )}
          </Route>
          <Route path="/login">
            {auth ? (
              <Redirect to="/chatroom" />
            ) : (
              <Login getResponseFromLogin={getResponseFromLogin} />
            )}
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/chatroom">
            {!auth ? (
              <Redirect to="/login" />
            ) : (
              <Chatroom currentUser={currentUser} />
            )}
          </Route>
          <Route path="/*">
            <Error404 />
          </Route>
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
