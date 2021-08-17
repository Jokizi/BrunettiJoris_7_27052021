import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import PostMessage from "../../components/PostMessage/PostMessage";
import LikeDislikeMessage from "../../components/LikeMessage/LikeMessage";
import CommentMessage from "../../components/CommentMessage/CommentMessage";
import DeleteMessage from "../../components/DeleteMessage/DeleteMessage";
import ModifyMessage from "../../components/ModifyMessage/ModifyMessage";

const Home = ({ myUserId }) => {
  const [allMessages, setAllMessages] = useState([]);
  const [user, setUser] = useState({});
  const history = useHistory();
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));

  useEffect(() => {
    if (sessionStorage.getItem("groupomania-token")) {
      const getMessages = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));

        try {
          const response = await api({
            url: "/messages/",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          const userDataResponse = await api({
            url: "/users/profile/",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(userDataResponse.data);
          sessionStorage.setItem("groupomania-user", JSON.stringify(userDataResponse.data));
          setAllMessages(response.data);
        } catch (error) {}
      };
      getMessages();
    } else {
      history.push("/");
    }
  }, [history]);
  // rendre dynamique l'affichage des messages
  const viewMessagesPost = (newMessages) => {
    console.log("========newMessages============================");
    console.log(newMessages);
    console.log("====================================");
    setAllMessages(newMessages);
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

  const goToOtherProfil = (id) => {
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/utilisateur/profil", state: { id } });
    }
  };

  return (
    <div>
      <div className="grpm-home">C'est la home page</div>
      <div style={{ padding: "10px", border: "1px solid black" }}>
        <PostMessage viewMessagesPost={viewMessagesPost} />
      </div>

      {allMessages.map((element) => {
        const messageLikeByCurrentUser = element?.Likes?.filter((elt) => groupomaniaUser.id === elt.userId);

        return (
          <div style={{ padding: "10px", border: "1px solid black" }} key={element.id}>
            <div onClick={() => goToOtherProfil(element.UserId)}>{element.User.username}</div>
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
              getMessagesURI="/messages"
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
export default Home;
