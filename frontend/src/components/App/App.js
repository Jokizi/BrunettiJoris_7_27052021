/*import Header from "../Header/Header";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import api from "../../Config/Api";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Login from "../../container/Login/Login";
import Landing from "../../container/Landing/Landing";
import Register from "../../container/Register/Register";
import Home from "../../container/Home/Home";
import Footer from "../Footer/Footer";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkLogin, setCheckLogin] = useState(false);

  useEffect(() => {
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("test")));
    console.log("--------------isLoggedInisLoggedIn----------------------");
    console.log(isLoggedIn);
    console.log("------------------------------------");
    if (!isLoggedIn && token) {
      const getUser = async () => {
        try {
          await api({
            url: "/users/profile/",
            method: "get",
            headers: { Autorization: `Bearer ${token}` },
          });
          setIsLoggedIn(true);
          setCheckLogin(true);
          console.log("----------------isLoggedIn--------------------");
          console.log(isLoggedIn);
          console.log("------------------------------------");
        } catch (error) {
          setCheckLogin(true);
        }
      };
      getUser();
    } else {
      setCheckLogin(true);
    }
  }, [isLoggedIn]);

  return (
    <div>
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          {checkLogin && (
            <PrivateRoute
              exact
              path="/accueil"
              component={Home}
              isLoggedIn={isLoggedIn}
            />
          )}
          <Route
            path="/connexion"
            render={() =>
              isLoggedIn ? (
                <Redirect to="/accueil" />
              ) : (
                <Login setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
              )
            }
          ></Route>
          <Route
            path="/inscription"
            render={() =>
              isLoggedIn ? (
                <Redirect to="/accueil" />
              ) : (
                <Register
                  setIsLoggedIn={setIsLoggedIn}
                  isLoggedIn={isLoggedIn}
                />
              )
            }
          ></Route>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
*/

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
