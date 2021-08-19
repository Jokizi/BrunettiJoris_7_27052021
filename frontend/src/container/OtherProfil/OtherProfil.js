import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import LikeDislikeMessage from "../../components/LikeMessage/LikeMessage";
import CommentMessage from "../../components/CommentMessage/CommentMessage";

const OtherProfil = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [infoPseudonyme, setInfoPseudonyme] = useState("");
  const [infoBio, setInfoBio] = useState("");
  const [infoAvatar, setInfoAvatar] = useState("");
  const [messagesOtherUser, setMessagesOtherUser] = useState([]);

  const history = useHistory();
  const groupomaniaUser = JSON.parse(sessionStorage.getItem("groupomania-user"));
  useEffect(() => {
    if (history.location?.state?.id) {
      const getInfos = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
        try {
          const response = await api({
            url: history.location.state.id + "/profile/",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          setInfoAvatar(response.data.avatar);
          setInfoPseudonyme(response.data.username);
          setInfoBio(response.data.bio);
          try {
            const response = await api({
              url: "/view/" + history.location.state.id + "/messages",
              method: "get",
              headers: { Authorization: `Bearer ${token}` },
            });
            setMessagesOtherUser(response.data);
          } catch (error) {}
        } catch (error) {}
      };
      getInfos();
    } else {
      history.push("/");
    }
  }, [history]);
  const changeLike = ({ messageId, like, dislike }) => {
    const displayLike = messagesOtherUser.filter((element) => {
      if (element.id === messageId) {
        element.likes = like;
        element.dislikes = dislike;
      }
      return element;
    });
    setMessagesOtherUser(displayLike);
  };
  const changeComment = ({ messageId, comments }) => {
    const displayComment = messagesOtherUser.filter((element) => {
      if (element.id === messageId) {
        element.comments = comments;
      }
      return element;
    });
    setMessagesOtherUser(displayComment);
  };

  return (
    <div>
      <div>
        <div>
          Avatar :
          <img className="avatar-picture" src={infoAvatar} />
        </div>
        <div>Pseudonyme : {infoPseudonyme}</div>
        <div>Description : {infoBio}</div>
      </div>
      {messagesOtherUser.map((element) => {
        const messageLikeByCurrentUser = element?.Likes?.filter((elt) => groupomaniaUser.id === elt.userId);
        return (
          <div key={element.id}>
            <div>
              <img className="avatar-picture" src={element.User.avatar} />
              {element.User.username}
            </div>
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
              setMessagesOtherUser={setMessagesOtherUser}
              changeComment={changeComment}
              comments={element.comments}
              messageId={element.id}
              myUserId={myUserId}
              locationState={"/view/" + history.location.state.id + "/messages"}
            />
          </div>
        );
      })}
    </div>
  );
};
export default OtherProfil;
