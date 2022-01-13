import axios from "axios";
import { useState, useEffect } from "react";
import MemeCard from "../components/MemeCard";

const Trending = ({ user }) => {
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    await axios
      .get(`${process.env.SERVER_URL}/api/trendingMeme`)
      .then((res) => {
        setMeme(res.data);
        setLoading(false);
      });
  };

  useEffect(async () => {
    await loadData();
  }, []);

  return (
    <>
      <h4 className="text-center mb-3">Trending Meme</h4>
      {loading ? (
        <div className="text-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <div className="row">
          {meme.map((m, index) => {
            return (
              <div className="col-lg-4 col-sm-12 col-md-6 mb-3" key={index}>
                <MemeCard id={m._id} user={user} />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Trending;
