import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isLoggedin, myUserId, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? <Component myUserId={myUserId} {...props} /> : <Redirect to={{ pathname: "/" }} />
      }
    ></Route>
  );
};
export default PrivateRoute;
