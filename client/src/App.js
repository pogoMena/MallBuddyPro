import React, { useEffect, useState } from "react";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  //Link,
  //Redirect,
} from "react-router-dom";

//Layout
import Navbar from "./layout/Navbar";

//Pages
import MainPage from "./pages";
import NotFoundPage from "./pages/404";
import CreateUser from "./pages/createUser";
import Login from "./pages/login";
import Admin from "./pages/admin";
import MallSearch from "./pages/mallSearch";
import ItemSearch from "./pages/itemSearch";
import Axios from "axios";
//import axios, { Axios } from "axios";

function App() {
  const [userName, setUserName] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [mallSelection, setMallSelection] = useState("");
  
  Axios.defaults.withCredentials = true;
  useEffect(() => {
    Axios.get("http://localhost:3001/api/login").then((response) => {
      if (response.data.loggedIn === true) {
        setUserName(response.data.user[0].username);
        setLoginStatus(true);
        console.log("in if");
      }else{
        setLoginStatus(false);
        console.log("in the else");
      }
    });
  }, []);

  return (
    <Router>
      <Navbar loginStatus={loginStatus} userName={userName} />
      <Routes>
        <Route
          exact
          path="/"
          element={<MainPage loginStatus={loginStatus} userName={userName} />}
        />
        <Route
          exact
          path="/signup"
          element={<CreateUser loginStatus={loginStatus} userName={userName} />}
        />
        <Route
          exact
          path="/login"
          element={<Login loginStatus={loginStatus} userName={userName} />}
        />
        <Route
          exact
          path="/admin"
          element={<Admin loginStatus={loginStatus} userName={userName} />}
        />
        <Route
          exact
          path="/mallSearch"
          element={
            <MallSearch
              loginStatusSent={loginStatus}
              userName={userName}
              setSelection={setMallSelection}
            />
          }
        />
        <Route
          exact
          path="/itemSearch"
          element={
            <ItemSearch
              loginStatus={loginStatus}
              userName={userName}
              selection={mallSelection}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
