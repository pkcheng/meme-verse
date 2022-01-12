import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";
import Link from "next/link";

const MemeCard = ({ id, user }) => {
  const router = useRouter();
  const [likedBy, setLikedBy] = useState([]);
  const [createdBy, setCreatedBy] = useState("");
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios.get(`http://localhost:5000/api/meme/${id}`).then((res) => {
      setLikedBy(res.data.likedBy);
      setImage(res.data.image);
      setCreatedBy(res.data.createdBy);
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.host}/meme/${id}`);
    swal("Link Copied", "Paste the link and share the meme with others!");
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/meme/${id}`);
    window.location.reload();
  };

  useEffect(async () => {
    if (id) {
      setLoading(true);
      await loadData();
      setLoading(false);
    }
  }, [id]);

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
    <>
      {loading ? (
        <div className="text-center">
          <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <div className="meme bg-white" style={{ position: "relative" }}>
          {user && createdBy === user._id ? (
            <>
              <button
                className="btn btn-light px-0 py-0"
                style={{ position: "absolute", right: "2px", top: "2px" }}
                id="memeDropDown"
                data-bs-toggle="dropdown"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
              <ul className="dropdown-menu" aria-labelledby="memeDropDown">
                <li>
                  <a className="dropdown-item" href="#" onClick={handleDelete}>
                    Delete
                  </a>
                </li>
              </ul>
            </>
          ) : (
            <></>
          )}

          <div className="text-center p-3">
            <Link href={`/meme/${id}`}>
              <img
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "260px",
                  minHeight: "200px",
                  maxHeight: "200px",
                  cursor: "pointer",
                }}
                className="rounded"
                src={image.link}
              />
            </Link>
          </div>

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
            <button className="btn btn-right btn-light" onClick={handleShare}>
              <i className="bi bi-share"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default MemeCard;
