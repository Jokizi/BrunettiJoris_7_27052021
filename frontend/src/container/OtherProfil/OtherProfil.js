import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import api from "../../Config/Api";

const OtherProfil = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [infoPseudonyme, setInfoPseudonyme] = useState("");
  const [infoBio, setInfoBio] = useState("");
  const [messagesOtherUser, setMessagesOtherUser] = useState([]);
  const history = useHistory();

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

  return (
    <div>
      <div>
        <div>Pseudonyme : {infoPseudonyme}</div>
        <div>Description : {infoBio}</div>
      </div>
      {messagesOtherUser.map((element) => {
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
          </div>
        );
      })}
    </div>
  );
};
export default OtherProfil;
