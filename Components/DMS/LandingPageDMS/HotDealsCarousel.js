// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import Modal from "react-bootstrap/Modal";
// import axios from "axios";
// import { Baseurl, filesUrl } from "../../../Utils/Constants";
// import { hasCookie, getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import Button from "react-bootstrap/Button";
// import { useSelector } from "react-redux";
// import dynamic from "next/dynamic";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const HotDealsCarousel = () => {
//   const [bannerList, setBannerList] = useState([]);

//   const getbannerList = async () => {
//     if (hasCookie("token")) {
//       let token = getCookie("token");
//       let header = {
//         headers: {
//           Accept: "application/json",
//           Authorization: "Bearer ".concat(token),
//           pass: "pass",
//         },
//       };

//       try {
//         const response = await axios.get(Baseurl + `/db/banner`, header);
//         setBannerList(response.data.data);
//       } catch (error) {
//         if (error?.response?.data?.message) {
//           toast.error(error.response.data.message);
//         } else {
//           toast.error("Something went wrong!");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//     getbannerList();
//   }, []);

//   return (
//     <>
//       <section className="hot_deals">
//         <div className="container">
//           <div className="d-flex justify-content-between">
//             <h2>Hot Deals and Offers</h2>
//             <a href="#">See All</a>
//           </div>
//         </div>
//       </section>
//       <section className="Battling_Tiredness">
        
//         {bannerList.length > 0 && (
//           <div style={{ width: "100%", maxWidth: "100vw", overflow: "hidden" }}>
//             <Slider
//               autoplay={true}
//               autoplaySpeed={2000}
//               arrows={true}
//               prevArrow={
//                 <button type="button" className="slick-prev">
//                   Previous
//                 </button>
//               }
//               nextArrow={
//                 <button type="button" className="slick-next">
//                   Next
//                 </button>
//               }
//             >
//               {bannerList?.map((item, i) => (
//                 <div key={i}>
//                   <img
//                     src={`${filesUrl}/banner/images${item.banner_image}`}
//                     style={{
//                       maxHeight: "300px",
//                     }}
//                     className="d-block w-100 "
//                     alt="..."
//                   />
//                 </div>
//               ))}
//             </Slider>
//           </div>
//         )}
//       </section>
//     </>
//   );
// };

// export default HotDealsCarousel;



import React, { useEffect, useState } from "react";
import Link from "next/link";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HotDealsCarousel = () => {
  const [bannerList, setBannerList] = useState([]);

  const getbannerList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          pass: "pass",
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/banner`, header);
        setBannerList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    getbannerList();
  }, []);

  return (
    <>
      <section className="hot_deals">
        <div className="container">
          <div className="d-flex justify-content-between">
            <h2>Hot Deals and Offers</h2>
            <a href="#">See All</a>
          </div>
        </div>
      </section>
      <section className="Battling_Tiredness">
        {bannerList.length > 0 && (
          <div style={{ width: "100%", maxWidth: "100vw", overflow: "hidden" }}>
            <Slider
              autoplay={true}
              autoplaySpeed={2000}
              arrows={true}
              prevArrow={
                <button type="button" className="slick-prev">
                  Previous
                </button>
              }
              nextArrow={
                <button type="button" className="slick-next">
                  Next
                </button>
              }
            >
              {bannerList?.map((item, i) => (
                <div key={i} style={{ width: "100%", height: "300px", overflow: "hidden" }}>
                  <img
                    src={`${filesUrl}/banner/images${item.banner_image}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    className="d-block w-100"
                    alt="..."
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </section>
      <style jsx>{`
        .hot_deals .container {
          /* your other styles */
        }
        .hot_deals .d-flex {
          /* your other styles */
        }
        .hot_deals h2, .hot_deals a {
          /* your other styles */
        }
        .Battling_Tiredness {
          /* your other styles */
        }
        .slick-prev, .slick-next {
          /* your custom arrow styles if needed */
        }
      `}</style>
    </>
  );
};

export default HotDealsCarousel;
