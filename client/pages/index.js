import { useEffect, useState } from "react";
import axios from "axios";
import MemeCard from "../components/MemeCard";

export default function Home({ user }) {
  const [latestMeme, setLatestMeme] = useState({
    image: { base64: "" },
    likedBy: [],
  });
  const [topMeme, setTopMeme] = useState({
    image: { base64: "" },
    likedBy: [],
  });
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios.get("http://localhost:5000/api/latestMeme").then((res) => {
      setLatestMeme(res.data);
    });
    await axios.get("http://localhost:5000/api/topMeme").then((res) => {
      setTopMeme(res.data);
    });
    await axios.get("http://localhost:5000/api/meme").then((res) => {
      setMeme(res.data);
    });
  };
  useEffect(async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="text-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <div className="row">
          {/* Left Panel */}
          <div className="col-lg-9 col-sm-12">
            <div className="row">
              {/* Most Liked Meme */}
              <div className="col-lg-6 col-md-12 mb-3">
                <h4>Most Liked Meme</h4>
                <div className="meme bg-white">
                  <div className="text-center p-3">
                    <img
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "300px",
                        minHeight: "250px",
                        maxHeight: "250px",
                      }}
                      className="rounded"
                      src={topMeme.image.link}
                    />
                  </div>
                  <div className="mt-2 btn-group w-100">
                    <button className="btn btn-right btn-light">
                      <i className="bi bi-share"></i>
                    </button>
                  </div>
                </div>
              </div>
              {/* Latest Meme */}
              <div className="col-lg-6 col-md-12 mb-3">
                <h4>Latest Meme</h4>
                <div className="meme bg-white">
                  <div className="text-center p-3">
                    <img
                      style={{
                        width: "auto",
                        height: "auto",
                        maxWidth: "300px",
                        minHeight: "250px",
                        maxHeight: "250px",
                      }}
                      className="rounded"
                      src={latestMeme ? latestMeme.image.link : ""}
                    />
                  </div>
                  <div className="mt-2 btn-group w-100">
                    <button className="btn btn-right btn-light">
                      <i className="bi bi-share"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Trending */}
            <div className="row mt-2">
              <h3>Trending</h3>
              {meme.map((m, index) => {
                return <MemeCard key={index} id={m._id} user={user} />;
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-lg-3 col-sm-12">
            <h4 className="opacity-0">.</h4>
            <div className="meme bg-white p-3 text-center"></div>
          </div>
        </div>
      )}
    </>
  );
}
