import { useState } from "react";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";

const SignUp = () => {
  const [displayname, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cookies, setCookie] = useCookies();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axios
      .post("http://localhost:5000/api/register", {
        displayname: displayname,
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        if (err.response.data.code === 11000) {
          const key = Object.keys(err.response.data.keyValue)[0];
          const value = err.response.data.keyValue[key];
          setMessage(`${key}: ${value} already exist`);
        }
      });
    setLoading(false);
  };

  return (
    <>
      <div className="row text-center">
        <div className="col-12">
          <img
            src="logo.png"
            className="mb-3"
            width={"75px"}
            style={{ borderRadius: "25px" }}
          />
          <h3 className="mb-3">Create your account</h3>
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (
            <p className="text-danger">{message}</p>
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form className="w-50 mx-auto" onSubmit={handleSignUp}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="displayname"
                placeholder="Display Name"
                value={displayname}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-dark w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
