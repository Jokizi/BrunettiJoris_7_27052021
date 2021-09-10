import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import api from "../../Config/Api";
import Input from "../Input/Input";
import "./card-all-users.css";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    backgroundColor: "#f9f9f9",
    boxShadow: "5px 5px 5px 5px #dcdcde",
    borderRadius: "5px",
    paddingTop: "15px",
    paddingBottom: "15px",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

export default function OutlinedChips({ myUserId }) {
  const classes = useStyles();
  const history = useHistory();
  const [allUsers, setAllUsers] = useState([]);
  const [searchBarValue, setSearchBarValue] = useState("");

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

  const handleChange = (e) => {
    setSearchBarValue(e.target.value);
  };

  const handleClick = (id) => {
    if (id === myUserId) {
      history.push("/profil");
    } else {
      history.push({ pathname: "/utilisateur/profil", state: { id } });
    }
  };

  return (
    <div className={classes.root}>
      <div className="input-users">
        <Input label="Rechercher utilisateur" type="search" value={searchBarValue} onChange={handleChange} />
      </div>
      {allUsers
        .filter((element) => {
          return element.username.toLowerCase().includes(searchBarValue.toLowerCase());
        })
        .map((element) => {
          return (
            <Chip
              style={{
                width: "12%",
                height: "45px",
                color: "black",
                borderColor: "#fc930c",
                borderRadius: "50px",
                boxShadow: "3px 3px 3px 3px #b6a9a9",
                displayFlex: "flex",
                justifyContent: "start",
              }}
              key={element.id}
              avatar={
                <Avatar style={{ width: "20%", height: "35px", marginRight: "10px" }}>
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
