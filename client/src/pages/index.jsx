import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MBPIcon from "../images/MBP_logo.png";

export default function MainPage(props) {
  const navigate = useNavigate();
  const [usernameLog, setUsernameLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [loggedIn, setLoggedIn] = useState("");
  Axios.defaults.withCredentials = true;
  //const loginStatus = props.loginStatus;
  //const username = props.userName;

  const userLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: usernameLog,
      password: passwordLog,
    }).then((response) => {
      if (response.data.message) {
        setLoginStatus(response.data.message);
      } else {
        setLoginStatus(response.data[0].username);
        //setLoginStatus(true);
        //navigate("/");
        window.location.reload(true);
      }
    });
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/api/login").then((response) => {
      if (response.data.loggedIn === true) {
        setLoginStatus(response.data.user[0].username);
        setLoggedIn(true);
      }
    });
  }, []);
  if(loggedIn === true){
    return (
      <div>
        <div className="text-center my-5">
          <img src={MBPIcon} alt="MBPIcon" id="mbpiconmain" />
        </div>
        <div className="text-center my-5">
            <h3>Welcome {loginStatus}</h3>
        </div>
      </div>
    );
  }else{

  return (
    <div>
      <div>
        <div className="text-center my-5">
          <img src={MBPIcon} alt="MBPIcon" id="mbpiconmain" />
        </div>
        <div className="row text-center">
          <h3>Login</h3>
        </div>
        <div className="row mx-auto w-50">
          <input
            type="text"
            name="username"
            placeholder="Username..."
            onChange={(e) => {
              setUsernameLog(e.target.value);
            }}
          />
        </div>
        <div className="row mx-auto w-50">
          <input
            className=""
            type="password"
            name="password"
            placeholder="Password..."
            onChange={(e) => {
              setPasswordLog(e.target.value);
            }}
          />
        </div>
        <div className="row mx-auto w-50">
          <button onClick={userLogin} href="/" className="btn btn-outline-primary">
            Login
          </button>
        </div>
        <div className="row text-center">
          <h3>{loginStatus}</h3>
        </div>
        <div className="row text-center">
          <h6>
            Dont have an account?
            <Link
              className="m-1 btn btn-outline-primary"
              to="/signup"
              key="signup">
              Sign up
            </Link>
          </h6>
        </div>
        <div className="row text-center">
          <p>
            Or, <a href="/mallSearch">Continue as guest</a>
          </p>
        </div>
      </div>
    </div>
  );
        }
}
