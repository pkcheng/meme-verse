import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const Meme = ({ user }) => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState({});
  const [likedBy, setLikedBy] = useState([]);
  const [author, setAuthor] = useState({ username: "", displayname: "" });
  const [loading, setLoading] = useState(false);
  const { id } = router.query;

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

  const loadData = async () => {
    const authorId = null;
    await axios
      .get(`http://localhost:5000/api/meme/${id}`)
      .then((res) => {
        setLikedBy(res.data.likedBy);
        setImage(res.data.image);
        setTitle(res.data.title);
        authorId = res.data.createdBy;
      })
      .catch((err) => {
        console.log(err.response);
      });
    await axios
      .get(`http://localhost:5000/api/user/${authorId}`)
      .then((res) => {
        setAuthor(res.data);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  useEffect(async () => {
    if (id) {
      setLoading(true);
      await loadData();
      setLoading(false);
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
        <div className="row">
          <div className="col-lg-9 col-sm-12">
            <h4>{title}</h4>
            <div className="meme bg-white">
              <div className="text-center p-3">
                <img
                  style={{
                    width: "auto",
                    height: "auto",
                    maxWidth: "500px",
                    maxHeight: "500px",
                  }}
                  className="rounded"
                  src={image.link}
                />
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
                <button className="btn btn-right btn-light">
                  <i className="bi bi-share"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-12">
            <h4>Posted By</h4>
            <div className="meme bg-white p-3">
              <div className="profile-btn text-center mx-auto mb-2">
                <p className="text-white">
                  {author.username.charAt(0).toUpperCase()}
                </p>
              </div>
              <h5 className="text-center">{author.displayname}</h5>
              <div className="text-center">
                <Link href="/user">
                  <a className="nav-link pb-0">View Profile</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Meme;
