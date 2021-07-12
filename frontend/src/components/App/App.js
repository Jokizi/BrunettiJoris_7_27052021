import Header from "../Header/Header";
import { useState, useEffect } from "react";
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
    const token = JSON.parse(JSON.stringify(sessionStorage.getItem("TOKEN")));
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
          <Route exact path="/" component={Landing} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
