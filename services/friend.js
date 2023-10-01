const { User, Room } = require("../schema/index");

const sendFriendRequest = async (req) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friendUsername = req.body.userContact.usernameContact;
    const foundFriend = await User.findOne({ username: friendUsername });
    if (!foundFriend) {
      return {
        requestError: "Friend request cannot be send",
      };
    } else if (foundFriend.username == req.usernameCookie) {
      return {
        requestError: "Friend request cannot be send",
      };
    } else {
      await User.updateOne(
        { username: req.usernameCookie },
        { $push: { sendRequests: foundFriend.username } }
      );
      await User.updateOne(
        { username: foundFriend.username },
        { $push: { recievedRequests: req.usernameCookie } }
      );
      return {
        requestSuccess: "Friend request has been sent",
      };
    }
  }
};

const getUserData = async (req) => {
  if (!req.isVerified) {
    return null;
  } else {
    const data = await User.findOne({ username: req.usernameCookie });
    if (data) {
      return data;
    } else {
      return null;
    }
  }
};

const addFriend = async (req) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friend = req.body.friend.nowFriend;
    try {
      await User.updateOne(
        { username: req.usernameCookie },
        {
          $pull: {
            recievedRequests: { $in: [friend] },
          },
        }
      );
      await User.updateOne(
        { username: req.usernameCookie },
        {
          $push: { friends: friend },
        }
      );
      await User.updateOne(
        { username: friend },
        {
          $pull: {
            sendRequests: { $in: [req.usernameCookie] },
          },
        }
      );
      await User.updateOne(
        { username: friend },
        {
          $push: { friends: req.usernameCookie },
        }
      );
    } catch (err) {
      console.log(err);
    }

    return { success: "Friend Request accepted successfully" };
  }
};

const rejectFriend = async (req) => {
  if (!req.isVerified) {
    return null;
  } else {
    const friend = req.body.friend.requestF;
    await User.updateOne(
      { username: req.usernameCookie },
      {
        $pull: {
          recievedRequests: { $in: [friend] },
        },
      }
    );
    await User.updateOne(
      { username: friend },
      {
        $pull: {
          sendRequests: { $in: [req.usernameCookie] },
        },
      }
    );
    return {
      requestSuccess: "Friend request has been rejected",
    };
  }
};

module.exports = {
  sendFriendRequest,
  getUserData,
  addFriend,
  rejectFriend,
};
