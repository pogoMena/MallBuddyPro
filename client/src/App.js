import React, {Component} from "react";
import "./App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

//Pages
import MainPage from "./pages";
import NotFoundPage from "./pages/404";
import CreateUser from "./pages/createUser";



class App extends Component {
    render(){
        return (
          <Router>
            <Routes>
              <Route exact path="/" element={<MainPage />} />
              <Route exact path="/signup" element={<CreateUser />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Router>
        );
    }
}

export default App;