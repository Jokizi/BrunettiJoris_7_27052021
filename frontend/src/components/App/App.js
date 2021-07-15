
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Login from "../../container/Login/Login";
import Register from "../../container/Register/Register";
import Home from "../../container/Home/Home";
import Landing from "../../container/Landing/Landing";

import PrivateRoute from "../PrivateRoute/PrivateRoute";
import api from "../../Config/Api";

const App = () => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);

  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));

    if (!isLoggedin && token) {
      const getUser = async () => {
        try {
          await api({
            url: "/users/profile/",
            method: "get",
            headers: { Authorization: `Bearer ${token}` },
          });
          setIsLoggedin(true);
          setCheckLogin(true);
        } catch (error) {
          setCheckLogin(true);
        }
      };
      getUser();
    } else {
      setCheckLogin(true);
    }
  }, [isLoggedin]);
  return (
    <Router>
      <Header isLoggedin={isLoggedin} setIsLoggedin={setIsLoggedin} />

      <Switch>
        {checkLogin && (
          <PrivateRoute
            exact
            path="/accueil"
            component={Home}
            isLoggedin={isLoggedin}
          />
        )}
        <Route
          exact
          path="/"
          render={() =>
            isLoggedin ? (
              <Redirect to="/accueil" />
            ) : (
              <Landing setIsLoggedin={setIsLoggedin} isLoggedin={isLoggedin} />
            )
          }
        ></Route>
        <Route
          exact
          path="/connexion"
          render={() =>
            isLoggedin ? (
              <Redirect to="/accueil" />
            ) : (
              <Login setIsLoggedin={setIsLoggedin} isLoggedin={isLoggedin} />
            )
          }
        ></Route>
        <Route
          exact
          path="/inscription"
          render={() =>
            isLoggedin ? (
              <Redirect to="/accueil" />
            ) : (
              <Register setIsLoggedin={setIsLoggedin} isLoggedin={isLoggedin} />
            )
          }
        ></Route>
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
