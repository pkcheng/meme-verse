import { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [cookies, setCookie] = useCookies();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    await axios
      .post(`${process.env.SERVER_URL}/api/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.auth) {
          setCookie("meme-verse-jwt", res.data.token);
          router.push("/");
        } else {
          setMessage(res.data.message);
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
          <h3 className="mb-3">Login to Meme Verse</h3>
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
          <form className="w-50 mx-auto" onSubmit={handleLogin}>
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
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
