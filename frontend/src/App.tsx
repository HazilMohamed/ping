/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

import HomeContainer from "./containers/HomeContainer";
import LoginContainer from "./containers/LoginContainer";
import { getToken } from "./utils/Auth";

import AuthContext from "./utils/Context";

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  React.useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        token: null,
        login,
        logout,
      }}
    >
      <BrowserRouter>
        <Switch>
          {isLoggedIn ? (
            <Redirect from="/login" to="/" exact />
          ) : (
            <Redirect from="/" to="/login" exact />
          )}
          <Route path="/" component={HomeContainer} exact />
          <Route path="/login" component={LoginContainer} exact />
        </Switch>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
