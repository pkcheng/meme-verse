import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const CategoryIndex = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios.get("http://localhost:5000/api/category").then((res) => {
      setCategory(res.data);
    });
  };

  useEffect(async () => {
    setLoading(true);
    await loadData();
    setLoading(false);
  }, []);

  return (
    <>
      <div className="row">
        {loading ? (
          <div className="text-center">
            <div className="spinner-grow" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <>
            {category.map((c, index) => {
              return (
                <div
                  className="col-lg-4 col-md-6 col-sm-12 my-2 text-center p-3"
                  key={index}
                >
                  <Link href={`/category/${c._id}`}>
                    <a
                      className="btn btn-dark category-btn w-75 py-5"
                      style={{ borderRadius: "50px" }}
                    >
                      {c.title}
                    </a>
                  </Link>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default CategoryIndex;
