import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
  const [usernameLog, setUsernameLog] = useState("");
  const [passwordLog, setPasswordLog] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  Axios.defaults.withCredentials = true;

  const userLogin = () => {
    Axios.post("http://localhost:3001/api/login", {
      username: usernameLog,
      password: passwordLog,
    }).then((response) => {
        if(response.data.message){
            setLoginStatus(response.data.message);
        }else{
            setLoginStatus(response.data[0].username);
            navigate("/");
            window.location.reload(false);
        }
    });
  };

  useEffect(()=>{
    Axios.get("http://localhost:3001/api/login").then((response)=>{
        if(response.data.loggedIn === true){
        setLoginStatus(response.data.user[0].username);
        }
    });
  }, [])
  return (
    <div>
      <div>
        <h3>Login</h3>
        <input
          type="text"
          name="username"
          placeholder="Username..."
          onChange={(e) => {
            setUsernameLog(e.target.value);
          }}
        />
        <input
          type="text"
          name="password"
          placeholder="Password..."
          onChange={(e) => {
            setPasswordLog(e.target.value);
          }}
        />
        <button onClick={userLogin} href="/">
          Login
        </button>
      </div>
      <h3>{loginStatus}</h3>
    </div>
  );
}
