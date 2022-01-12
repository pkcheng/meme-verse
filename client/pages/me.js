import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import MemeCard from "../components/MemeCard";

const Me = ({ user }) => {
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios
      .get(`http://localhost:5000/api/likedMeme/${user._id}`)
      .then((res) => {
        setMeme(res.data);
      });
  };

  useEffect(async () => {
    if (user) {
      setLoading(true);
      await loadData();
      setLoading(false);
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <>
          <h4 className="text-center mb-4">Liked by You</h4>
          <div className="row">
            {meme.map((m, index) => {
              return (
                <div className="col-lg-4 col-sm-12 col-md-6 mb-3" key={index}>
                  <MemeCard id={m._id} user={user} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default Me;
