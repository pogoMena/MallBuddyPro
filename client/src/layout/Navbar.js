import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

export default function Navbar(props) {
  const userName = props.userName;
  const loginStatus = props.loginStatus;
  const links = [];
  


  const userLogout = () => {
    Axios.post("http://localhost:3001/api/logout").then((response) => {
     
    console.log("I mean this much worked at least");
    console.log(response);
    window.location.reload(false);
    
    });
  };


  //All links
  const loginLink = (
    <Link className="btn btn-outline-light" to="/login">
      Login
    </Link>
  );
  const logoutLink = (
    <Link className="btn btn-outline-light" to="/" onClick={userLogout}>
      Logout
    </Link>
  );

  const adminLink = (
    <Link className="btn btn-outline-light" to="/admin">
      admin
    </Link>
  );
  const signUpLink = (
    <Link className="btn btn-outline-light" to="/signup">
      Sign up
    </Link>
  );
  const searchPageLink = (
    <Link className="btn btn-outline-light" to="/search">
      search
    </Link>
  );
/*
  useEffect(() => {
    Axios.get("http://localhost:3001/api/login").then((response) => {
      if (response.data.loggedIn === true) {
        setUserName(response.data.user[0].username);
        setLoginStatus(true);
      }
    });
  }, []);
  */

  if (loginStatus === true) {
    console.log("Logged in");
    if (userName === "admin1") {
      links.push(adminLink);
    }
      links.push(logoutLink);
    
  } else if (loginStatus === false) {
    console.log("not logged in");
    links.push(loginLink);
    links.push(signUpLink);
  }
  links.push(searchPageLink);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            MallBuddy Pro
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle Navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          {links}
        </div>
      </nav>
    </div>
  );
}
