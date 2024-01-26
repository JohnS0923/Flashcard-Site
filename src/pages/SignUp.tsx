import { useState } from "react";
import "../style/main.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { setGlobalVariable } from "../variable/globalVar";

function SignUp() {
  const navigate = useNavigate();

  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const signUp = () => {
    if (!fName || !lName || !email || !username || !password) {
      setErrorMsg("Please fill in all the required fields.");
      return;
    }
    if (username.length < 1) {
      setErrorMsg("Username must be at least 5 characters long.");
      return;
    }

    if (password.length < 1) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    const dataToSend = {
      email: email,
      firstName: fName,
      lastName: lName,
      username: username,
      password: password,
    };
    axios
      .post(`https://localhost:7119/Flashcard/SignUp`, dataToSend)
      .then((res) => {
        // console.log(res.data);
        // console.log(res.data.userId);

        setGlobalVariable(res.data.userId);
        navigate("../");
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error, e.g., display an error message to the user
      });
    //make api call
    setErrorMsg("");
  };

  return (
    <>
      <div className="signup-container">
        <h1 className="title">Sign Up</h1>
        <p>{errorMsg}</p>
        <form>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              value={fName}
              onChange={(e) => setFName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              value={lName}
              onChange={(e) => setLName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="exampleInputText" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputText"
              aria-describedby="textHelp"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-primary" onClick={signUp}>
            Submit
          </button>
        </form>
      </div>
      <NavLink to="../login" className="login-text">
        <p>Have An Account? Click Here To Login</p>
      </NavLink>
    </>
  );
}

export default SignUp;
