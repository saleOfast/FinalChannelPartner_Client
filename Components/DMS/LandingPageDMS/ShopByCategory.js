import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';

const ShopByCategory = () => {
  const [categories, setCategories] = useState([]);

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
  return (
    <>
        <section className="shop_by_category">
    <div className="container">
      <div className="shop_by">
        <div className="text-wrapper-12">Shop By Category</div>
        <div className="text-wrapper-13">See All</div>
      </div>
      <div className="row pt-3">
        {categories?.map((_v, _x)=>
           <div className="col-3 mt-2">
           <div className="product d-flex flex-column gap-2">
             <img src={`${filesUrl}/category/images${_v.image}`} alt={``} />
             <span className="item">{_v.p_cat_name}</span>
           </div>
         </div>
        )}
       
      
      </div>
      
    </div>
  </section>
    </>
  )
}

export default ShopByCategory