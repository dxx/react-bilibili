import * as React from "react";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import router from "./router";
import createStore from "./redux/store";
import Root from "./App";

const createApp = (context, url, store) => {
  const App: any = () => {
    return (
      <Provider store={store}>
        <StaticRouter context={context} location={url}>
          <Root />
        </StaticRouter>
      </Provider>
    )
  }
  return <App />;
}

export {
  createApp,
  createStore,
  router
};
