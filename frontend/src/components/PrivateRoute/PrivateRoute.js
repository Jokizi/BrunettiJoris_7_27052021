import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isLoggedin, setIsLoggedin, myUserId, setCheckLogin, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Component myUserId={myUserId} setIsLoggedin={setIsLoggedin} setCheckLogin={setCheckLogin} {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    ></Route>
  );
};
export default PrivateRoute;
