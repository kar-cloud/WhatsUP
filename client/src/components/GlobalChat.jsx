import { React, useState, useEffect } from "react";
import OpenGlobalChat from "./OpenGlobalChat";
import axios from "axios";
import socketIOClient from "socket.io-client";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
const ENDPOINT = "/";

function GlobalChat(props) {
  const [globalMessages, setGlobalMessages] = useState([]);
  const [globalMessage, setGlobalMessage] = useState({
    body: "",
    sentBy: "",
  });
  const [sock, setSock] = useState();

  async function getChats() {
    await axios
      .get("/api/globalChats")
      .then((response) => {
        if (response.data) {
          setGlobalMessages(response.data.messages);
        } else {
          setGlobalMessages([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  if (sock && props.show === false) {
    sock.emit("forceDisconnect");
  }

  function openGlobalChat() {
    props.handleShow();
    if (sock) {
      sock.emit("forceDisconnect");
    }
    getChats();
    const socket = socketIOClient(ENDPOINT);
    setSock(socket);
    socket.emit("globalChat");
    socket.on("getGlobalMessage", (msg) => {
      setGlobalMessages((prevMessages) => {
        return [...prevMessages, msg];
      });
      getChats();
    });
  }

  async function sendGlobalMessage(event) {
    event.preventDefault();
    sock.emit("emitGlobalMessage", globalMessage);
    setGlobalMessages((prevMessages) => {
      return [...prevMessages, globalMessage];
    });
    await axios.post("/api/globalChats", { globalMessage });
    setGlobalMessage({
      body: "",
      sentBy: "",
    });
  }

  function handleGlobalChange(event) {
    setGlobalMessage({
      body: event.target.value,
      sentBy: props.currentUser,
    });
  }

  return (
    <div>
      <div className="container-fluid laptopSize">
        <div className="row" id="globalChatContainer">
          <div className="sideBoxGlobalChat">
            <div>
              <p className="globalChatSideBoxDescription">
                With this Global Chat you can chat with people all across the
                world... So what are you waiting for ??
                <br />
                <button
                  onClick={openGlobalChat}
                  className="globalChatOpenButton"
                >
                  Go to Global Chat
                </button>
              </p>
            </div>
          </div>
          <div
            className="globalMainChat"
            id={!props.show ? "emptyGlobalChat" : ""}
          >
            {props.show ? (
              <div className="globalChatExtra">
                <div
                  className="globalMainChatHeading"
                  style={{ marginBottom: "0rem" }}
                >
                  <p className="globalMainChatHeadingLine">Global Chat</p>
                </div>
                <div className="globalChatMessages">
                  {globalMessages.map((message, index) => {
                    return (
                      <OpenGlobalChat
                        key={index}
                        message={message}
                        currentUser={props.currentUser}
                      />
                    );
                  })}
                </div>
                <div className="globalChatSendMesage">
                  <form onSubmit={sendGlobalMessage}>
                    <div className="globalChatButtonFlex">
                      <div className="globalChatTextareaContainer">
                        <input
                          value={globalMessage.body}
                          onChange={handleGlobalChange}
                          placeholder="Type a Message"
                          className="globalChatTextarea"
                        />
                      </div>
                      <div className="globalChatSendButtonContainer">
                        <button className="globalChatSendButton">
                          <p className="globalChatSendButtonText">
                            Send
                            <SendRoundedIcon style={{ marginLeft: "6px" }} />
                          </p>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* For Mobile */}

      <div className="phoneSize">
        {!props.show ? (
          <div className="phoneGlobalChatBoxContainer">
            <p className="phoneGlobalChatBoxDescription">
              With this Global Chat you can chat with people all across the
              world... So what are you waiting for ??
              <br />
              <button
                onClick={openGlobalChat}
                className="phoneGlobalChatBoxButton"
              >
                Go to Global Chat
              </button>
            </p>
          </div>
        ) : (
          <div className="globalMainChat phoneChatGlobal">
            <div className="phoneGlobalChatExtra">
              <div className="phoneGlobalChatMessages">
                {globalMessages.map((message, index) => {
                  return (
                    <OpenGlobalChat
                      key={index}
                      message={message}
                      currentUser={props.currentUser}
                    />
                  );
                })}
              </div>
              <div className="phoneGlobalChatSendMesage">
                <form onSubmit={sendGlobalMessage}>
                  <div className="phoneGlobalChatButtonFlex">
                    <div className="phoneGlobalChatTextareaContainer">
                      <input
                        value={globalMessage.body}
                        onChange={handleGlobalChange}
                        placeholder="Type a Message"
                        className="phoneGlobalChatTextarea"
                      />
                    </div>
                    <div className="phoneGlobalChatSendButtonContainer">
                      <button className="phoneGlobalChatSendButton">
                        <p className="phoneGlobalChatSendButtonText">
                          <SendRoundedIcon
                            style={{
                              fontSize: "2rem",
                            }}
                          />
                        </p>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            {/* ) : null} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default GlobalChat;
