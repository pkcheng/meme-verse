import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import MemeCard from "../../components/MemeCard";

const Category = ({ user }) => {
  const router = useRouter();
  const [meme, setMeme] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState({ title: "" });
  const { id } = router.query;

  const loadData = async () => {
    await axios
      .get(`${process.env.SERVER_URL}/api/category/${id}`)
      .then((res) => {
        setCategory(res.data);
      });

    await axios
      .get(`${process.env.SERVER_URL}/api/memeByCategory/${id}`)
      .then((res) => {
        setMeme(res.data);
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
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">
                  <a>
                    <i className="bi bi-house-fill"></i>&nbsp;Home
                  </a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                <Link href="/category">
                  <a>Category</a>
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {category.title}
              </li>
            </ol>
          </nav>
          <h4 className="text-center mb-4">Category: {category.title}</h4>
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

export default Category;
