import { React, useState } from "react";
import axios from "axios";
import { Nav, Tab } from "react-bootstrap";
import GlobalChat from "./GlobalChat";
import PrivateChat from "./PrivateChat";

function Chatroom(props) {
  const [activeKey, setActiveKey] = useState("Global");
  const [show, setShow] = useState(true);

  function handleLogoutClick() {
    axios.get("/api/logout");
    setTimeout(function () {
      window.location.reload();
    }, 400);
  }

  function handleShow(socket) {
    setShow(true);
  }

  return (
    <div id="chatRoomBody">
      <Tab.Container
        id="controlled-tab-example"
        activeKey={activeKey}
        onSelect={setActiveKey}
      >
        <Nav
          variant="tabs"
          style={{
            borderBottom: "1px solid black",
            backgroundColor: "#556052",
          }}
        >
          <Nav.Item>
            <Nav.Link
              style={
                activeKey === "Global"
                  ? {
                      fontSize: "1.3rem",
                      border: "1px solid black",
                      borderBottom: "0",
                      backgroundColor: "#f8f8f8",
                    }
                  : {
                      fontSize: "1.3rem",
                      border: "0",
                      color: "white",
                    }
              }
              eventKey="Global"
            >
              Global
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              onClick={() => {
                setShow(false);
              }}
              className="privateNavbar"
              eventKey="Private"
              style={
                activeKey === "Private"
                  ? {
                      fontSize: "1.3rem",
                      border: "1px solid black",
                      borderBottom: "0",
                      backgroundColor: "#f8f8f8",
                    }
                  : {
                      fontSize: "1.3rem",
                      border: "0",
                      color: "white",
                    }
              }
            >
              Private
            </Nav.Link>
          </Nav.Item>
          <Nav.Item className="ml-auto">
            <Nav.Link
              to="/logout"
              onClick={handleLogoutClick}
              className="justify-content-end logoutButton"
              style={{
                fontSize: "1.2rem",
                color: "white",
              }}
            >
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="Global">
            <GlobalChat
              handleShow={handleShow}
              show={show}
              currentUser={props.currentUser}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="Private">
            <PrivateChat currentUser={props.currentUser} />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default Chatroom;
