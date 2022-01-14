import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

const Callback = () => {
  const router = useRouter();
  const [cookies, setCookie] = useCookies();

  useEffect(() => {
    let hash = window.location.hash;
    if (hash.indexOf("access_token") !== -1) {
      let token = hash.split("access_token=")[1];
      token = token.split("&")[0];
      axios
        .post(`${process.env.SERVER_URL}/api/googleLogin`, { token: token })
        .then((res) => {
          if (res.data.auth) {
            setCookie("meme-verse-jwt", res.data.token);
            router.push("/");
          }
        })
        .catch((err) => {
          router.push("/");
        });
    } else {
      router.push("/");
    }
  }, []);

  return <></>;
};

export default Callback;
