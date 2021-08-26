import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function OutlinedChips({ myUserId }) {
  const classes = useStyles();
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("groupomania-token")));
    const getAllUsers = async () => {
      try {
        const response = await api({
          url: "/all/users",
          method: "get",
          headers: { Authorization: `Bearer ${token}` },
        });

        setAllUsers(response.data);
      } catch (error) {}
    };
    getAllUsers();
  }, []);

  const handleClick = (id) => {
    console.log("---------------id---------------------");
    console.log(id);
    console.log("------------------------------------");
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/utilisateur/profil", state: { id } });
    }
  };

  return (
    <div className={classes.root}>
      {allUsers.map((element) => {
        console.log("---------------element.id---------------------");
        console.log(element.id);
        console.log("------------------------------------");
        return (
          <Chip
            style={{ width: "20%", height: "5em" }}
            key={element.id}
            avatar={
              <Avatar style={{ width: "25%", height: "52px" }}>
                {<img src={element.avatar} style={{ width: "100%", height: "52px" }} />}
              </Avatar>
            }
            label={element.username}
            onClick={() => handleClick(element.id)}
            color="primary"
            variant="outlined"
          />
        );
      })}
    </div>
  );
}
