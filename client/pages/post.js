import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import Select from "react-select";
import FileBase64 from "react-file-base64";

const Post = () => {
  const [imgPreview, setImgPreview] = useState(null);
  const [img, setImg] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [tag, setTag] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [categoryOp, setCategoryOp] = useState([]);
  const [tagOp, setTagOp] = useState([]);
  const [cookies, removeCookie] = useCookies();

  const handlePost = async (event) => {
    event.preventDefault();
    const jwt = cookies["meme-verse-jwt"];
    if (category === null) {
      setMessage("Please select category");
    } else if (img === null) {
      setMessage("Please upload an image");
    } else {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("image", img);
      let image = {};

      await axios
        .post("https://api.imgur.com/3/image", formdata, {
          headers: { Authorization: "Client-ID 7d177a2a11aa7b1" },
        })
        .then((res) => {
          image.id = res.data.data.id;
          image.link = res.data.data.link;
          image.deletehash = res.data.data.deletehash;
        });

      const headers = { Authorization: `Bearer ${jwt}` };
      await axios
        .post(
          "http://localhost:5000/api/meme",
          {
            title: title,
            image: image,
            category: category,
            tag: tag,
          },
          { headers: headers }
        )
        .then((res) => {});

      setLoading(false);
      window.location.reload();
    }
  };

  const loadData = () => {
    axios.get("http://localhost:5000/api/category").then((res) => {
      const options = res.data.map((c) => {
        return { value: c._id, label: c.title };
      });
      setCategoryOp(options);
    });

    axios.get("http://localhost:5000/api/tag").then((res) => {
      const options = res.data.map((c) => {
        return { value: c._id, label: c.title };
      });
      setTagOp(options);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <div className="mt-5 row">
        <div className="col-12">
          <div className="post-creator p-4 w-50 mx-auto">
            <h2 className="text-center mb-3">Post a meme</h2>
            <div className="text-center">
              <img
                src={
                  imgPreview
                    ? imgPreview
                    : "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/GHS-pictogram-unknown.svg/1200px-GHS-pictogram-unknown.svg.png"
                }
                className="rounded"
                style={{
                  width: "auto",
                  height: "auto",
                  maxWidth: "260px",
                  maxHeight: "200px",
                }}
              />
              <br />
              {loading ? (
                <div className="spinner-border mt-2" role="status">
                  <span className="sr-only"></span>
                </div>
              ) : (
                <p className="text-danger mt-2">{message}</p>
              )}
            </div>

            <form className="mt-3 w-75 mx-auto" onSubmit={handlePost}>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <Select
                  placeholder="Category"
                  instanceId="category-select"
                  options={categoryOp}
                  onChange={(c) => {
                    setCategory(c.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <Select
                  placeholder="Tag"
                  isMulti={true}
                  instanceId="tag-select"
                  options={tagOp}
                  onChange={(t) => {
                    setTag(t);
                    console.log(t);
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    setImgPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                />
              </div>
              <button type="submit" className="btn btn-dark w-100">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
