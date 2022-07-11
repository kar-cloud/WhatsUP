import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="homeBody">
      <div className="homeContainer">
        <img className="homeImage" src="../images/chat.jpg" alt="symbolChat" />
        <h1 className="homeHeading">Welcome To WhatsUp</h1>
        <div className="homeDescriptionContainer">
          <p className="homeDescription">
            Come and chat with your friends or chat globally with everyone in
            real time.
          </p>
        </div>
        <Link className="homeButtons" to="/login">
          Login
        </Link>
        <Link className="homeButtons" to="/register">
          Register
        </Link>
      </div>
    </div>
  );
}

export default Home;
