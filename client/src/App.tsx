import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import HomeContainer from "./containers/HomeContainer";
import LoginContainer from "./containers/LoginContainer";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={HomeContainer} exact />
        <Route path="/login" component={LoginContainer} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
