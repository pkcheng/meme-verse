import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import swal from "sweetalert";
import Link from "next/link";

const MemeCard = ({ id, user }) => {
  const router = useRouter();
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [createdBy, setCreatedBy] = useState("");
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    await axios.get(`${process.env.SERVER_URL}/api/meme/${id}`).then((res) => {
      if (res.data) {
        if (user) {
          setLike(res.data.likedBy.includes(user._id));
        }
        setLikeCount(res.data.likedBy.length);
        setImage(res.data.image);
        setCreatedBy(res.data.createdBy);
        setLoading(false);
      } else {
        window.location.reload();
      }
    });
  };

  const handleLike = async () => {
    if (user) {
      await axios.post(`${process.env.SERVER_URL}/api/likeMeme`, {
        userId: user._id,
        memeId: id,
      });
      setLike(!like);
      if (like) {
        setLikeCount(likeCount - 1);
      } else {
        setLikeCount(likeCount + 1);
      }
    } else {
      router.push("/login");
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.host}/meme/${id}`);
    swal("Link Copied", "Paste the link and share the meme with others!");
  };

  const handleDelete = async () => {
    await axios.delete(`${process.env.SERVER_URL}/api/meme/${id}`);
    window.location.reload();
  };

  useEffect(async () => {
    if (id) {
      await loadData();
    }
  }, [id]);

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
                    : like
                    ? "bi bi-hand-thumbs-up-fill"
                    : "bi bi-hand-thumbs-up"
                }
              ></i>
              &nbsp;
              {likeCount}
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
