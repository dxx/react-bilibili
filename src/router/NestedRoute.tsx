import * as React from "react";
import { Route } from "react-router-dom";

const NestedRoute = (route) => (
  <Route path={route.path} exact={route.exact}
    /* 渲染路由对应的视图组件，将路由组件的props传递给视图组件 */
    render={(props) => <route.component {...props} router={route.routes} />}
  />
)

export default NestedRoute;
