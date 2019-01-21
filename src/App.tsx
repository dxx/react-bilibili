import * as React from "react";
import Helmet from "react-helmet";
import { Redirect, Switch } from "react-router-dom";
import router, { NestedRoute, StatusRoute } from "./router";
import Context, { context } from "./context";

import "./assets/stylus/icon.styl";
import "./app.styl";

class App extends React.Component {
  public render() {
    return (
      <Context.Provider value={context}>
        <div className="view">
          <Helmet>
            <title>( ゜- ゜)つロ干杯~</title>
            <meta name="title" content="Bilibili-( ゜- ゜)つロ干杯~" />
            <meta name="keywords" content="React,服务端渲染" />
            <meta name="description" content="高仿Bilibili" />
          </Helmet>
          <Switch>
            {
              router.map((route, i) =>
                <NestedRoute {...route} key={i} />
              )
            }
            <Redirect from="/" to="/index" exact={true} />
            <StatusRoute code={404}>
              <div>
                <h1>Not Found</h1>
              </div>
            </StatusRoute>
          </Switch>
        </div>
      </Context.Provider>
    );
  }
}

export default App;
