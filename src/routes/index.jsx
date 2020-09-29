import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { importPath } from "./loadable";
import NoMatch from "pages/404";
let router = [
  {
    path: "/",
    exact: true
  },
  {
    path: "/login",
    exact: true,
    component: importPath({
      loader: () =>
        import(
          /* webpackChunkName: "login", webpackPrefetch: true */
          "pages/login"
        )
    })
  },
  {
    path: "/home",
    exact: true,
    component: importPath({
      loader: () =>
        import(
          /* webpackChunkName: "PageHome", webpackPrefetch: true */
          "pages/home"
        )
    })
  }
];

const Routers = () => (
  <Switch>
    {router.map(({ component, path, exact }) => {
      return (
        <Route component={component}
            exact={exact}
            key={path}
            path={path}
            render={() => (
              path === "/" && (
                <Redirect to="/login"/>
              )
            )}
        />
      );
    })}
    <Route component={NoMatch}/>
  </Switch>
);

export default Routers;
