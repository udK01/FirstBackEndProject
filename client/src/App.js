import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [backendData, setBackendData] = useState([{}]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [listChange, setListChange] = useState("");

  useEffect(() => {
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setBackendData(data));
    setListChange(false);
  }, [listChange]);

  const MAX = 10000;
  const MIN = 1;

  function handleSubmit(e) {
    e.preventDefault();
    let userData = { username: username, password: password };
    fetch("/api/login", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    setListChange(true);
  }

  function randomise() {
    setUsername(`randomUser${Math.floor(Math.random() * (MAX - MIN) + MIN)}`);
    setPassword(Math.floor(Math.random() * (MAX - MIN) + MIN));
  }

  function deleteField(x) {
    fetch("/api/delete", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(backendData[x]),
    });
    setListChange(true);
  }

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          ></input>
        </div>
        <div className="buttons">
          <button onClick={randomise}>Randomise</button>
          <button className="submitBtn">Submit</button>
        </div>
      </form>
      <div className="container">
        {backendData === null ? (
          <p>Loading...</p>
        ) : (
          backendData.map((user, i) => (
            <div className="row" key={i}>
              <div className="cell">{user.username}</div>
              <div className="cell">{user.password}</div>
              <button className="deleteBtn" onClick={() => deleteField(i)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
