import React from "react";

function OpenConversation(props) {
  return (
    <div>
      {props.message.sentBy !== props.friend ? (
        <div>
          <div className="phoneGlobalChatTextSentContainer">
            <p className="phoneGlobalChatText">{props.message.body}</p>
            <div className="arrowSent"></div>
          </div>
        </div>
      ) : (
        <div className="phoneGlobalChatTextRecievedContainer">
          <div className="arrowRecieved"></div>
          <p className="phoneGlobalChatText">{props.message.body}</p>
        </div>
      )}
    </div>
  );
}
export default OpenConversation;
