import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import MemeCard from "../../components/MemeCard";

const User = ({ user }) => {
  const router = useRouter();
  const [author, setAuthor] = useState({ displayname: "" });
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = router.query;

  const loadData = async () => {
    await axios.get(`http://localhost:5000/api/user/${id}`).then((res) => {
      setAuthor(res.data);
    });

    await axios
      .get(`http://localhost:5000/api/memeByAuthor/${id}`)
      .then((res) => {
        setMeme(res.data);
        console.log(res.data);
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
        <>
          <div className="row mb-3">
            <div className="col-12">
              <div
                className="profile-btn text-center mx-auto mb-2"
                style={{ width: "75px", height: "75px", lineHeight: "75px" }}
              >
                <p className="text-white">
                  {author.displayname.charAt(0).toUpperCase()}
                </p>
              </div>
              <h5 className="text-center">{author.displayname}</h5>
            </div>
          </div>
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

export default User;
