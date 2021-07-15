import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ component: Component, isLoggedin, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLoggedin ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/" }} />
        )
      }
    ></Route>
  );
};
export default PrivateRoute;

