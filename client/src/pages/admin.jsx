import React, { useEffect, useState } from "react";
import Axios from "axios";

export default function Admin(props) {
  const [userList, setUsers] = useState([]);
  useEffect(() => {
    Axios.get("http://localhost:3001/api/get", {}).then((response) => {
      setUsers(response.data);
    });
  });

  const deleteUser = (id) => {
    Axios.post("http://localhost:3001/api/delete", {
      id: id
    });
  };

  const updateUser = (id) => {
    Axios.post("http://localhost:3001/api/update", {
      id: id,
    });
  };

  if (props.loginStatus === true) {
    if (props.userName === "admin1") {
      return (
        <div className="container">
          <div className="py-4">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Username</th>
                  <th scope="col">Password</th>
                  <th scope="col">Update</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {userList.map((val) => {
                  return (
                    <tr>
                      <th scope="row">{val.id}</th>
                      <td>{val.username}</td>
                      <td>{val.password}</td>
                      <td key={val.id}>update</td>
                      <td key={val.id}>delete</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  } else {
    return ("You shouldnt be able to see this");
  }
}
