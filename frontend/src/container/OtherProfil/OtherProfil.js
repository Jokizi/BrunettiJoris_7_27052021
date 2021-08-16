import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";

const OtherProfil = ({ myUserId, setIsLoggedin, setCheckLogin }) => {
  const [infoPseudonyme, setInfoPseudonyme] = useState("");
  const [infoBio, setInfoBio] = useState("");
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
        } catch (error) {}
      };
      getInfos();
    } else {
      history.push("/");
    }
  }, [history]);

  return (
    <div>
      <div>Username : {infoPseudonyme}</div>
      <div>Description : {infoBio}</div>
    </div>
  );
};
export default OtherProfil;
