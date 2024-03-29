import React from "react";
import DoneIcon from "@material-ui/icons/Done";
import ClearIcon from "@material-ui/icons/Clear";
import axios from "axios";

function MyRequests(props) {
  function addFriend(request) {
    const friend = {
      nowFriend: request,
    };
    axios
      .post("/api/friend/add", { friend })
      .then((response) => {
        console.log(response);
        setTimeout(function () {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function rejectFriend(request) {
    const friend = {
      requestF: request,
    };
    axios
      .post("/api/friend/reject", { friend })
      .then((response) => {
        console.log(response);
        setTimeout(function () {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div>
      <p className="privateChatRequestsPendingName">{props.request}</p>
      <div style={{ float: "right" }}>
        <DoneIcon
          onClick={() => {
            addFriend(props.request);
          }}
          id="privateChatRequestAccept"
        />
        <ClearIcon
          onClick={() => {
            rejectFriend(props.request);
          }}
          id="privateChatRequestReject"
        />
      </div>
      <hr className="privateChatRequestsPendingHR" />
    </div>
  );
}

export default MyRequests;
