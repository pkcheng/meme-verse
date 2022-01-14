import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const Navbar = ({ user, setUser }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cookies, removeCookie] = useCookies();

  const loadCurrentUser = async () => {
    const jwt = cookies["meme-verse-jwt"];
    if (
      typeof jwt !== "undefined" &&
      jwt !== "undefined" &&
      typeof user == "undefined"
    ) {
      await axios
        .post(`${process.env.SERVER_URL}/api/verify`, {
          token: jwt,
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  const validatePath = () => {
    if (
      typeof user !== "undefined" &&
      (router.pathname === "/login" || router.pathname === "/signup")
    ) {
      router.push("/");
    }
  };

  const handleSignOut = async () => {
    removeCookie("meme-verse-jwt");
    if (user.access_token) {
      await axios.post(
        `https://accounts.google.com/o/oauth2/revoke?token=${user.access_token}`
      );
    }
    setUser(null);
    window.location.reload();
  };

  useEffect(async () => {
    setLoading(true);
    await loadCurrentUser();
    setLoading(false);
    validatePath();
    console.log(user);
  }, [router.pathname, user]);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link href="/">
          <a className="navbar-brand">
            <img src="/logo.png" width={"50px"} height={"50px"} />
            &nbsp;
            <span style={{ fontFamily: "Bebas Neue" }}>Meme Verse</span>
          </a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item mx-2">
              <Link href="/">
                <a className="nav-link" aria-current="page">
                  Home
                </a>
              </Link>
            </li>

            {user ? (
              <li className="nav-item mx-2">
                <Link href="/post">
                  <a className="nav-link">Post</a>
                </Link>
              </li>
            ) : (
              ""
            )}
            <li className="nav-item mx-2">
              <Link href="/category">
                <a className="nav-link">Category</a>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link href="/trending">
                <a className="nav-link">Trending</a>
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link href="/about">
                <a className="nav-link">About</a>
              </Link>
            </li>
          </ul>
          {loading ? (
            <div className="spinner-grow text-light" role="status">
              <span className="sr-only"></span>
            </div>
          ) : user ? (
            <div className="dropdown">
              <button
                className="btn text-white profile-btn pt-0"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {user.username.charAt(0).toUpperCase()}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link href="/meme/me">
                    <a className="dropdown-item">Posted Meme</a>
                  </Link>
                  <Link href="/me">
                    <a className="dropdown-item">Liked Meme</a>
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/signup">
                <a
                  className={
                    router.pathname === "/signup"
                      ? "btn btn-warning"
                      : "btn btn-outline-warning"
                  }
                >
                  Sign Up
                </a>
              </Link>
              &nbsp;
              <Link href="/login">
                <a
                  className={
                    router.pathname === "/login"
                      ? "btn btn-light"
                      : "btn btn-outline-light"
                  }
                >
                  Log In
                </a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
