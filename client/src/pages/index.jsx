import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function MainPage(props) {
    const loginStatus = props.loginStatus;
    const username = props.userName;

  if (loginStatus === true) {
    return(
      <div>
        <h3>Hey {username}, good to see you again!</h3>
        <p>Main page</p>
      </div>)
    
  } else {
    return (
      <div>
        <h3>Hey stranger, you should log in</h3>
        <p>Main page</p>
      </div>
    );
  }
}
