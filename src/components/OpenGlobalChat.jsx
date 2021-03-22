import React from "react";

function OpenGlobalChat(props) {
  return (
    <div>
      {props.message.sentBy === props.currentUser ? (
        <div>
          <div className="phoneGlobalChatTextSentContainer">
            <p className="phoneGlobalChatText">{props.message.body}</p>
            <div className="arrowSent"></div>
          </div>
        </div>
      ) : (
        <div className="phoneGlobalChatTextRecievedContainer">
          <div className="arrowRecieved"></div>
          <p className="phoneGlobalChatTextReceivedFrom">
            {props.message.sentBy}
          </p>
          <p className="phoneGlobalChatText">{props.message.body}</p>
        </div>
      )}
    </div>
  );
}

export default OpenGlobalChat;
