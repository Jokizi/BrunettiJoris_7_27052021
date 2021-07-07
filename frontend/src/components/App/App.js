import Header from "../Header/Header";
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "../../container/Login/Login";
import Landing from "../../container/Landing/Landing";
import Register from "../../container/Register/Register";
import Footer from "../Footer/Footer";

function App() {
  return (
    <div>
      <Header />
      <Router>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/connexion" component={Login} />
          <Route exact path="/inscription" component={Register} />
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
