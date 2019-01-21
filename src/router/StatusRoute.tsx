import * as React from "react";
import { Route } from "react-router-dom";

const StatusRoute = (props) => (
  <Route render={({staticContext}) => {
    // 客户端无staticContext对象
    if (staticContext) {
      // 设置状态码
      staticContext.statusCode = props.code;
    }
    return props.children;
  }} />
);

export default StatusRoute;
