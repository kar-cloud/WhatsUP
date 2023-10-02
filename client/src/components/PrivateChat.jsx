import { React, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import MyRequests from "./MyRequests";
import OpenConversation from "./OpenConversation";
import axios from "axios";
import ClearIcon from "@material-ui/icons/Clear";
import socketIOClient from "socket.io-client";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import AddIcon from "@material-ui/icons/Add";
const ENDPOINT = "/";

function PrivateChat(props) {
  const [showModal, setShowModal] = useState(false);
  const [showAfterRequest, setShowAfterRequest] = useState(false);
  const [usernameContact, setUsernameContact] = useState();
  const [friends, setFriends] = useState([]);
  const [requestsPending, setRequestsPending] = useState([]);
  const [chatWithFriend, setChatWithFriend] = useState();
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState({
    body: "",
    sentBy: "",
  });
  const [sock, setSock] = useState();
  const [messagesFromRoom, setMessagesFromRoom] = useState([]);
  const [friendRequest, setFriendRequest] = useState();

  useEffect(() => {
    if (room) {
      getMessages(room);
    }
    getRequests();
    getFriends();
  }, []);

  function getMessages(room) {
    const roomName = {
      room: room,
    };
    if (room) {
      axios
        .get("/api/chat/room/messages", { params: roomName })
        .then((response) => {
          if (response.data) {
            setMessagesFromRoom(response.data.messages);
          } else {
            setMessagesFromRoom([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const getRequests = () => {
    axios
      .get("/api/friend/user")
      .then((response) => {
        const data = response.data.recievedRequests;
        setRequestsPending([...data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getFriends = () => {
    axios
      .get("/api/friend/user")
      .then((response) => {
        const data = response.data.friends;
        setFriends([...data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleShowModal() {
    setShowModal(true);
  }

  function handleHideModal() {
    setShowModal(false);
  }

  function handleHideModalAfterRequest() {
    setShowAfterRequest(false);
  }

  function handleChangeUsernameContact(event) {
    setUsernameContact(event.target.value);
  }

  function handleSubmitModal(event) {
    event.preventDefault();
    handleHideModal();
    if (friends.find((friend) => friend === usernameContact)) {
      console.log("contact already exists");
    } else {
      const userContact = {
        usernameContact: usernameContact,
      };
      axios
        .post("/api/friend/sendRequest", { userContact })
        .then((response) => {
          if (response.data.requestError) {
            setFriendRequest(response.data.requestError);
          } else if (response.data.requestSuccess) {
            setFriendRequest(response.data.requestSuccess);
          }
          setShowAfterRequest(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  function whichFriendToChat(friend) {
    setChatWithFriend(friend);
  }

  function openChat(friend) {
    setMessagesFromRoom([]);
    if (sock) {
      sock.emit("forceDisconnect");
    }
    let roomData = props.currentUser + "--with--" + friend;
    let split = roomData.split("--with--"); // ['username2', 'username1']

    let unique = [...new Set(split)].sort((a, b) => (a < b ? -1 : 1)); // ['username1', 'username2']

    let updatedRoomName = `${unique[0]}--with--${unique[1]}`; // 'username1--with--username2'

    const roomName = {
      room: updatedRoomName,
    };
    axios
      .get("/api/chat/room/messages", { params: roomName })
      .then((response) => {
        if (response.data) {
          setMessagesFromRoom(response.data.messages);
        } else {
          setMessagesFromRoom([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    whichFriendToChat(friend);
    const socket = socketIOClient(ENDPOINT);
    setSock(socket);
    console.log(props)
    socket.emit("join", `${friend}--with--${props.currentUser}`);
    socket.on("your room", (room) => {
      getMessages(room);
      setRoom(room);
    });
    socket.on("onMessage", (msg) => {
      setMessagesFromRoom((prevMessages) => {
        return [...prevMessages, msg];
      });
    });
  }

  async function sendMessage(event) {
    event.preventDefault();
    const messageObject = {
      body: message,
      room: room,
    };
    const roomID = {
      roomName: room,
    };
    setMessagesFromRoom((prevMessages) => {
      return [...prevMessages, message];
    });
    await axios.post("/api/chat/message", { message, roomID });

    setMessage({
      body: "",
      sentBy: "",
    });
    sock.emit("emitMessage", messageObject);
  }

  function handleChange(event) {
    setMessage({
      body: event.target.value,
      sentBy: props.currentUser,
    });
  }

  function handleChatWithFriendValue() {
    setChatWithFriend();
  }

  return (
    <div>
      <div className="container-fluid laptopSize">
        <div className="row" id="privateChatContainer">
          <div className="sideBoxPrivateChat">
            <div className="privateChatExtraFlex">
              <div className="privateChatFriends">
                <div className="row">
                  <div className="col-lg-9">
                    <h3 className="privateChatFriendListHeading">
                      Friend list
                    </h3>
                  </div>
                  <div className="col-lg-3">
                    <button
                      onClick={handleShowModal}
                      className="addNewContactButton"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="pp">
                  {friends.length !== 0 ? (
                    friends.map((friend, index) => {
                      return (
                        <div
                          onClick={() => {
                            openChat(friend);
                          }}
                          className="privateChatFriendContainer"
                          key={index}
                        >
                          <p className="privateChatFriendName">{friend}</p>
                          <hr className="privateChatFriendNameHR" />
                        </div>
                      );
                    })
                  ) : (
                    <>
                      <p className="noRequestsPending">No Friends right now</p>
                      <hr />
                    </>
                  )}
                </div>
              </div>
              <div className="privateChatFriendRequestsFlexBox">
                <h3 className="privateChatPendingRequestsHeading">
                  Friend Requests
                </h3>
                <div className="privateChatRequestsPendingContainer">
                  {requestsPending.length !== 0 ? (
                    requestsPending.map((request, index) => {
                      return <MyRequests request={request} key={index} />;
                    })
                  ) : (
                    <>
                      <p className="noRequestsPending">
                        No Friend Requests right now
                      </p>
                      <hr />
                    </>
                  )}
                </div>
              </div>
            </div>
            <div>
              <Modal
                id="modalFriendRequest"
                show={showModal}
                onHide={handleHideModal}
              >
                <Modal.Body id="modalBodyRequest">
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-10">
                      <h1 className="modalFriendRequest">
                        Send Friend Request
                      </h1>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-2">
                      <ClearIcon
                        id="modalFriendRequestCloseButton"
                        onClick={handleHideModal}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  <form onSubmit={handleSubmitModal}>
                    <div className="form-group">
                      <label
                        className="modalFriendRequestLabel"
                        htmlFor="username"
                      >
                        Friend's Username
                      </label>
                      <input
                        type="text"
                        className="modalFriendRequestInput globalChatTextarea"
                        name="username"
                        onChange={handleChangeUsernameContact}
                        size="25"
                        required
                      ></input>
                    </div>
                    <button
                      type="submit"
                      className="modalFriendRequestButton globalChatSendButton"
                    >
                      <p className="globalChatSendButtonText">Send Request </p>
                    </button>
                  </form>
                </Modal.Body>
              </Modal>
              <Modal
                id="modalFriendRequestAfter"
                show={showAfterRequest}
                onHide={handleHideModalAfterRequest}
              >
                <Modal.Body>
                  <div className="row">
                    <div className="col-lg-10 col-sm-10 col-10">
                      <p className="modalFriendRequestSent">{friendRequest}</p>
                    </div>
                    <div className="col-lg-2 col-sm-2 col-2">
                      <ClearIcon
                        id="modalFriendRequestCloseButton"
                        onClick={handleHideModalAfterRequest}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                </Modal.Body>
              </Modal>
            </div>
          </div>
          <div className="privateMainChat">
            <div className="globalChatExtra">
              {chatWithFriend ? (
                <div
                  className="globalMainChatHeading"
                  style={{ marginBottom: "0rem" }}
                >
                  <p className="globalMainChatHeadingLine">{chatWithFriend}</p>
                </div>
              ) : null}
              <div className="globalChatMessages">
                {messagesFromRoom
                  ? messagesFromRoom.map((message, index) => {
                      return (
                        <OpenConversation
                          key={index}
                          message={message}
                          friend={chatWithFriend}
                        />
                      );
                    })
                  : null}
              </div>
              {chatWithFriend ? (
                <div className="globalChatSendMesage">
                  <form onSubmit={sendMessage}>
                    <div className="globalChatButtonFlex">
                      <div className="globalChatTextareaContainer">
                        <input
                          value={message.body}
                          onChange={handleChange}
                          placeholder="Type a Message"
                          className="globalChatTextarea"
                          size="56"
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
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* For Mobile */}

      <div className="phoneSize">
        {!chatWithFriend ? (
          <div className="phonePrivateListContainer">
            <div className="phonePrivateChatFriends">
              <div className="">
                <div className="row">
                  <div className="col-lg-9 col-sm-10 col-10">
                    <h3 className="phonePrivateChatFriendListHeading">
                      Friend list
                    </h3>
                  </div>
                  <div className="col-lg-3 col-sm-2 col-2">
                    <AddIcon
                      onClick={handleShowModal}
                      id="phoneAddNewContactButton"
                    />
                  </div>
                </div>
              </div>
              <div className="phonep">
                {friends.length !== 0 ? (
                  friends.map((friend, index) => {
                    return (
                      <div
                        onClick={() => {
                          openChat(friend);
                        }}
                        className="phonePrivateChatFriendContainer"
                        key={index}
                      >
                        <p className="phonePrivateChatFriendName">{friend}</p>
                        <hr className="phonePrivateChatFriendNameHR" />
                      </div>
                    );
                  })
                ) : (
                  <>
                    <p className="phoneNoRequestsPending">
                      No Friends right now
                    </p>
                    <hr />
                  </>
                )}
              </div>
            </div>
            <div className="phonePrivateChatFriends">
              <h3 className="phonePrivateChatPendingRequestsHeading">
                Friend Requests
              </h3>
              <div className="phonePrivateChatRequestsPendingContainer">
                {requestsPending.length !== 0 ? (
                  requestsPending.map((request, index) => {
                    return <MyRequests request={request} key={index} />;
                  })
                ) : (
                  <>
                    <p className="phoneNoRequestsPending">
                      No Friend Requests right now
                    </p>
                    <hr />
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="privateMainChat phoneChatGlobal">
            <div className="globalMainChatHeading">
              <div className="row">
                <div className="col-sm-9 col-9">
                  <p className="phonePrivateMainChatHeadingLine">
                    {chatWithFriend}
                  </p>
                </div>
                <div className="col-sm-3 col-3">
                  <ArrowBackIosIcon
                    id="privatebackButton"
                    onClick={handleChatWithFriendValue}
                  />
                </div>
              </div>
            </div>
            <div className="phoneGlobalChatExtra">
              <div className="phoneGlobalChatMessages">
                {messagesFromRoom
                  ? messagesFromRoom.map((message, index) => {
                      return (
                        <OpenConversation
                          key={index}
                          message={message}
                          friend={chatWithFriend}
                        />
                      );
                    })
                  : null}
              </div>
              <div className="phoneGlobalChatSendMesage">
                <form onSubmit={sendMessage}>
                  <div className="phoneGlobalChatButtonFlex">
                    <div className="phoneGlobalChatTextareaContainer">
                      <input
                        value={message.body}
                        onChange={handleChange}
                        placeholder="Type a Message"
                        className="phoneGlobalChatTextarea"
                      />
                    </div>
                    <div className="phoneGlobalChatSendButtonContainer">
                      <button className="globalChatSendButton">
                        <p className="globalChatSendButtonText">
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
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivateChat;
