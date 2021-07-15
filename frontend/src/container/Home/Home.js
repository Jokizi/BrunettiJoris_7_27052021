import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import PostMessage from "../../components/PostMessage/PostMessage";
const Home = () => {
  const [allMessages, setAllMessages] = useState([]);
  const history = useHistory();

  useEffect(() => {
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

  console.log("--------------allMessages----------------------");
  console.log(allMessages);
  console.log("------------------------------------");
  return (
    <div>
      <div className="grpm-home">C'est la home page</div>
      <PostMessage />
      {allMessages &&
        allMessages.map((element) => {
          console.log("----------------element--------------------");
          console.log(element);
          console.log("------------------------------------");
          return (
            <div key={element.id}>
              <div>{element.User.username}</div>
              <div>{element.createdAt}</div>
              <div>{element.title}</div>
              <div>{element.content}</div>
              <div>{element.likes}</div>
              <div>{element.dislikes}</div>
              <div>{element.comments}</div>
            </div>
          );
        })}
    </div>
  );
};
export default Home;
