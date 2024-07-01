import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import axios from "axios";
import { useRouter } from "next/router";

const ByCategory = () => {
  const [categories, setCategories] = useState([]);
  const router=useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass: "pass",
          },
        };

        try {
          const response = await axios.get(
            Baseurl + `/db/productCat/getAllList`,
            header
          );
          setCategories(response.data.data);
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.success(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    };

    fetchData();
  }, []);

  const clientLogo=hasCookie("clientLogo") ? JSON.parse( getCookie("clientLogo")) : null;

  return (
    <>
      <section className="shop_by_category px-1">
      <div className="container">
    <div className="shop_by">
      <div className="text-wrapper-12">Shop By Category</div>
      <div className="text-wrapper-13">See All</div>
    </div>
    <div className="row pt-3">
      {categories?.map((_v, _x) => (
        <div key={_x} className="col-3 mt-2">
          <div 
            className="product d-flex flex-column gap-2"
            onClick={()=>{
              router.push(`/dms/ShopByBrand?category_id=${_v.p_cat_id}`)
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div
              className="image-container"
              style={{
                width: '100%',
                height: '80px',
                overflow: 'hidden',
                padding:"5px"
              }}
            >
              <img
                src={`${filesUrl}/category/images${_v.image}`}
                alt={``}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                                    
                }}
              />
            </div>
            <span className="item fw-bold">{_v.p_cat_name}</span>
          </div>
        </div>
      ))}
      
      {categories?.map((_v, _x) => (
        <div key={_x} className="col-3 mt-2">
          <div 
            className="product d-flex flex-column gap-2"
            onClick={()=>{
              router.push(`/dms/ShopByBrand?category_id=${_v.p_cat_id}`)
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <div
              className="image-container"
              style={{
                width: '100%',
                height: '80px',
                overflow: 'hidden',
                padding:"5px"
              }}
            >
              <img
                src={`${filesUrl}/category/images${_v.image}`}
                alt={``}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'fill',
                                    
                }}
              />
            </div>
            <span className="item fw-bold">{_v.p_cat_name}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
      </section>
    </>
  );
};

export default ByCategory;
