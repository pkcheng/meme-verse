import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
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
  const [category, setCategory] = useState([]);
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
    await axios.get("http://localhost:5000/api/category").then((res) => {
      setCategory(res.data);
    });
  };

  useEffect(async () => {
    setLoading(true);
    await loadData();
    setTimeout(() => {
      setLoading(false);
    }, 250);
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
                <MemeCard id={topMeme._id} user={user} />
              </div>
              {/* Latest Meme */}
              <div className="col-lg-6 col-md-12 mb-3">
                <h4>Latest Meme</h4>
                <MemeCard id={latestMeme._id} user={user} />
              </div>
            </div>
            {/* Trending */}
            <div className="row mt-2">
              <h3>Trending</h3>
              {meme.map((m, index) => {
                return (
                  <div className="col-lg-4 col-sm-12 col-md-6 mb-3" key={index}>
                    <MemeCard id={m._id} user={user} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div className="col-lg-3 col-sm-12">
            <h4>Category</h4>
            <div className="meme bg-white p-3">
              <div className="row">
                {category.map((c, index) => {
                  return (
                    <div key={index} className="col-12 text-center">
                      <Link href={`/category/${c._id}`}>
                        <a
                          className="btn btn-dark w-75 my-1"
                          style={{ borderRadius: "15px" }}
                        >
                          {c.title}
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
