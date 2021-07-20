import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import PostMessage from "../../components/PostMessage/PostMessage";
import LikeDislikeMessage from "../../components/LikeMessage/LikeMessage";
import CommentMessage from "../../components/CommentMessage/CommentMessage";
const Home = () => {
  const [allMessages, setAllMessages] = useState([]);
  const history = useHistory();

  useEffect(() => {
    console.log("---------------use---------------------");
    console.log("useEffect FIre");
    console.log("------------------------------------");
    if (sessionStorage.getItem("test")) {
      const getMessages = async () => {
        const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

        try {
          const response = await api({
            url: "/messages/",
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
  const viewMessagesPost = (newMessages) => {
    setAllMessages(newMessages);
  };
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

  return (
    <div>
      <div className="grpm-home">C'est la home page</div>
      <PostMessage viewMessagesPost={viewMessagesPost} />
      {allMessages.map((element) => {
        return (
          <div key={element.id}>
            <div>{element.User.username}</div>
            <div>{element.createdAt}</div>
            <div>{element.title}</div>
            {element.attachment ? (
              <div style={{ width: "50%", height: "20em" }}>
                <img src={element.attachment} alt="img" style={{ width: "50%", height: "20em" }} />
              </div>
            ) : (
              <></>
            )}
            <div>{element.content}</div>
            <LikeDislikeMessage
              changeLike={changeLike}
              like={element.likes}
              dislike={element.dislikes}
              messageId={element.id}
            />
            <CommentMessage />
            <div>{element.comments}</div>
          </div>
        );
      })}
    </div>
  );
};
export default Home;
