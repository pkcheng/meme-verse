import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const CategoryIndex = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    await axios.get(`${process.env.SERVER_URL}/api/category`).then((res) => {
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
                  className="col-lg-4 col-md-6 col-sm-12 my-2 text-center p-1"
                  key={index}
                >
                  <Link href={`/category/${c._id}`}>
                    <div className="property-card mx-auto">
                      <div
                        className="property-image"
                        style={{
                          backgroundImage: `url(${c.image})`,
                        }}
                      >
                        <div className="property-image-title"></div>
                      </div>

                      <div className="property-description">
                        <h5 className="mt-1">{c.title}</h5>
                      </div>
                    </div>
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
