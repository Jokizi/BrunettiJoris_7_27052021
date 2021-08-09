import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import PostMessage from "../../components/PostMessage/PostMessage";
import LikeDislikeMessage from "../../components/LikeMessage/LikeMessage";
import CommentMessage from "../../components/CommentMessage/CommentMessage";
import DeleteMessage from "../../components/DeleteMessage/DeleteMessage";
import ModifyMessage from "../../components/ModifyMessage/ModifyMessage";

const UserProfil = ({ myUserId }) => {
  const [allMessages, setAllMessages] = useState([]);
  const history = useHistory();
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  useEffect(() => {
    if (sessionStorage.getItem("test")) {
      const getMessages = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

        try {
          const response = await api({
            url: "/user/messages",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          setAllMessages(response.data);
        } catch (error) {}
      };
      getMessages();
    } else {
      history.push("/");
    }
  }, [history]);
  const viewMessagesPost = (newMessagesUser) => {
    console.log("========messagesuser============================");
    console.log(newMessagesUser);
    console.log("====================================");
    setAllMessages(newMessagesUser);
  };

  // rendre dynamique l'affichage des likes message
  const changeLike = ({ messageId, like, dislike }) => {
    const displayLike = allMessages.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setAllMessages(displayLike);
  };

  // rendre dynamique l'affichage des commentaires
  const changeComment = ({ messageId, comments }) => {
    const displayComment = allMessages.filter((element) => {
      if (element.id === messageId) {
        element.comments = comments;
      }
      return element;
    });
    setAllMessages(displayComment);
  };
  // rendre dynamique la suppression de message
  const changeDeleteMessage = (messageId) => {
    const idToDelete = messageId;
    const displayMessages = allMessages.filter((element) => element.id !== idToDelete);
    setAllMessages(displayMessages);
  };

  return (
    <div>
      <div>Page de profil</div>
      <div>
        <PostMessage viewMessagesPost={viewMessagesPost} isProfil={true} />
      </div>
      {allMessages.map((element) => {
        const messageLikeByCurrentUser = element?.Likes?.filter((elt) => groupomaniaUser.id === elt.userId);
        return (
          <div key={element.id}>
            <div>{element.User.username}</div>
            <div>{element.createdAt}</div>
            <div>{element.title}</div>
            {element.attachment && (
              <div style={{ width: "50%", height: "20em" }}>
                <img src={element.attachment} alt="img" style={{ width: "50%", height: "20em" }} />
              </div>
            )}
            <div>{element.content}</div>
            <LikeDislikeMessage
              changeLike={changeLike}
              like={element.likes}
              dislike={element.dislikes}
              messageId={element.id}
              messageLikeByCurrentUser={messageLikeByCurrentUser}
            />
            <CommentMessage
              setAllMessages={setAllMessages}
              changeComment={changeComment}
              comments={element.comments}
              messageId={element.id}
              myUserId={myUserId}
            />
            <ModifyMessage
              messageId={element.id}
              title={element.title}
              attachment={element.attachment}
              content={element.content}
              myUserId={myUserId}
              idUserMessage={element.UserId}
              setAllMessages={setAllMessages}
            />
            <DeleteMessage
              changeDeleteMessage={changeDeleteMessage}
              messageId={element.id}
              myUserId={myUserId}
              idUserMessage={element.UserId}
            />
          </div>
        );
      })}
    </div>
  );
};
export default UserProfil;
