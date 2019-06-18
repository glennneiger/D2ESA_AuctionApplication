import React from 'react';
import { Route, Router } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import history from './history';
import Authorize from './secret/Auth';
import Loginapp from './pages/Login';

const authorizeLogin = new Authorize();
const { checkAuthenticated } = authorizeLogin;
export const makeMainRoutes = () => {

  return (
      <Router history={history} component={App}>
        <div>
          <Route path="/" render={(props) =>
             <App  authorizeLogin={authorizeLogin}  {...props} />} />

          <Route path="/home" render={(props) =>
              {
                if (!(checkAuthenticated())) {
                  history.replace('/');
                  return null
              }
            return <Home  authorizeLogin={authorizeLogin} {...props} />
          }
        } />
            </div>
      </Router>
  );
}
