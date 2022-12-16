import React, {useEffect, useState } from "react";
import Axios from 'axios';




export default function CreateUser() {
    const [usernameReg, setUsernameReg] = useState("");
    const [passwordReg, setPasswordReg] = useState("");
    const [emailReg, setEmailReg] = useState("");
    const [creationStatus, setCreationStatus] = useState("");
    Axios.defaults.withCredentials = true;

    const submitUser = () => {
      Axios.post("http://localhost:3001/api/createuser", {
        username: usernameReg,
        password: passwordReg,
        email: emailReg
      }).then((response) => {
        setCreationStatus(response.data.message);
      });
    };

    return (
      <div>
        <div className="heading">
          <h3 className="w-25 mx-auto p-3">Sign Up</h3>
        </div>
        <div class="container">
          <div class="row">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Username..."
              onChange={(e) => {
                setUsernameReg(e.target.value);
              }}
            />
          </div>
          <div class="row">
            <label>Password:</label>
            <input
              type="text"
              name="password"
              placeholder="Password..."
              onChange={(e) => {
                setPasswordReg(e.target.value);
              }}
            />
          </div>
          <div class="row">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              placeholder="Email..."
              onChange={(e) => {
                setEmailReg(e.target.value);
              }}
            />
          </div>
          <button onClick={submitUser}>Submit</button>
          <h3>{creationStatus}</h3>
        </div>
      </div>
    );
}

  

