import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const MemeCard = ({ id, user }) => {
  const router = useRouter();
  const [likedBy, setLikedBy] = useState([]);
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios.get(`http://localhost:5000/api/meme/${id}`).then((res) => {
      setLikedBy(res.data.likedBy);
      setImage(res.data.image);
    });
  };

  useEffect(async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  }, []);

  const handleLike = async () => {
    if (user) {
      await axios.post("http://localhost:5000/api/likeMeme", {
        userId: user._id,
        memeId: id,
      });
      await loadData();
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="col-lg-4 col-sm-12 col-md-6 mb-3">
      {loading ? (
        <div className="text-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <div className="meme bg-white">
          <Link href={`/meme/${id}`}>
            <div className="text-center p-3" style={{ cursor: "pointer" }}>
              <img
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "260px",
                  minHeight: "200px",
                  maxHeight: "200px",
                }}
                className="rounded"
                src={image.link}
              />
            </div>
          </Link>

          <div className="mt-2 btn-group w-100">
            <button className="btn btn-left btn-light" onClick={handleLike}>
              <i
                className={
                  !user
                    ? "bi bi-hand-thumbs-up"
                    : likedBy.includes(user._id)
                    ? "bi bi-hand-thumbs-up-fill"
                    : "bi bi-hand-thumbs-up"
                }
              ></i>
              &nbsp;
              {likedBy.length}
            </button>
            <button className="btn btn-right btn-light">
              <i className="bi bi-share"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeCard;
