/**
 *
 * create by ligx
 *
 * @flow
 */
import type { RouterMap, } from '@lugia/lugiax';

import ReactDOM from 'react-dom';
import React, { Component, } from 'react';
import lugiax from '@lugia/lugiax-core';
import { Provider, } from 'react-redux';
import {
  ConnectedRouter,
  connectRouter,
  routerMiddleware,
} from 'connected-react-router/immutable';
import { Redirect, Route, StaticRouter, Switch, } from 'react-router'; // react-router v4
import Loadable from 'react-loadable';
import Loading from './Loading';

export { Route, Switch, StaticRouter, Redirect };

export function createApp(
  routerMap: RouterMap,
  history: Object,
  loading: Object = Loading
) {
  lugiax.resetStore(routerMiddleware(history), connectRouter(history));
  window.a = lugiax.getStore();
  const renderRoute = () => {
    if (!routerMap) {
      return null;
    }
    return Object.keys(routerMap).map(path => {
      const { component, } = routerMap[path];
      if (component) {
        return <Route exact path={path} component={component} />;
      }
      const { render, } = routerMap[path];

      return (
        <Route
          exact
          path={path}
          render={() => {
            const Target = Loadable({
              loader: render,
              loading,
            });
            return <Target />;
          }}
        />
      );
    });
  };

  class App extends Component<any, any> {
    render() {
      return (
        <Provider store={lugiax.getStore()}>
          <ConnectedRouter history={history}>
            <Switch>{renderRoute()}</Switch>
          </ConnectedRouter>
        </Provider>
      );
    }
  }

  return App;
}
export function render(App: Object, domId: string) {
  const dom = document.getElementById(domId);
  if (!dom) {
    return;
  }
  ReactDOM.render(<App />, dom);
}

export {};