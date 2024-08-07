import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';
import { useRouter } from 'next/router';

const ByBrand = () => {
  const [brands, setBrands] = useState([]);
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
          const response = await axios.get(Baseurl + `/db/brand`, header);
          setBrands(response.data.data);
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
        <section className="By_brand">
    <div className="container">
      <div className="brands">
        <div className="text-wrapper-22">Shop By Brand</div>
        {/* <div className="text-wrapper-23">See All</div> */}
      </div>
      {/* slider */}
      <div className="content-wrapper">
        <div className="slider-container">
          <div className="slider-title-wrapper">
            <div className="slider-wrapper">
              {brands?.map((item, i)=> 
                <div 
                key={i} 
                className="slider-item"
                onClick={()=>{
                  router.push(`/dms/ShopByBrand?brand_id=${item.brand_id}`)
                }}
                >
                  <img src={`${filesUrl}/brand/images${item.brand_image}`} alt="sd"  />
                  </div>
              )} 
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    </>
  )
}

export default ByBrand