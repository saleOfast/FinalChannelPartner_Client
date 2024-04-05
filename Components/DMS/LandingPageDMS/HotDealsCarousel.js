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
        console.log(response.data.data);
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
        {/* 
<div id="carouselExampleSlidesOnly" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
  <div className="carousel-inner">
    {bannerList?.map((item, i) => 
      <div className={"carousel-item" + (i === 0 ? " active" : "")} key={i}>
        <img src={`${filesUrl}/banner/images${item.banner_image}`} className="d-block w-100" alt="..." />
      </div>
    )}
  </div>
  <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="prev">
    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Previous</span>
  </button>
  <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleSlidesOnly" data-bs-slide="next">
    <span className="carousel-control-next-icon" aria-hidden="true"></span>
    <span className="visually-hidden">Next</span>
  </button>
</div> */}
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
                <div key={i}>
                  <img
                    src={`${filesUrl}/banner/images${item.banner_image}`}
                    style={{
                      maxHeight: "300px",
                    }}
                    className="d-block w-100 "
                    alt="..."
                  />
                </div>
              ))}
            </Slider>
          </div>
        )}
      </section>
    </>
  );
};

export default HotDealsCarousel;

{
  /* <div className>
      <div id="carouselExampleCaptions" className="carousel slide">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={0} className="active" aria-current="true" aria-label="Slide 1" />
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={1} aria-label="Slide 2" />
          <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={2} aria-label="Slide 3" />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className>
              <div className=" d-flex align-items-center">
                <img src="./DMS_IMAGES/banner_img.png" alt className="w-100" />
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className>
              <div className=" d-flex align-items-center">
                <img src="./DMS_IMAGES/banner_img.png" alt className="w-100" />
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className>
              <div className=" d-flex align-items-center">
                <img src="./DMS_IMAGES/banner_img.png" alt className="w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="carousel-item">
        <div className="row">
          <div className="col-4">
            <img src="./DMS_IMAGES/glucond_img1.png" alt />
          </div>
          <div className="col-8">
            <h1 className="text-wrapper-3">Battling Tiredness?</h1>
            <div className="overlap">
              <div className="d-flex align-items-center gap-1">
                <div className="text-wrapper-4">Try</div>
                <div className="text-wrapper-5">Glucon-D</div>
              </div>
              <div className="overlap-group">
                <div className="text-wrapper-6">In exciting new flavors</div>
              </div>
            </div>
            <div className="line" />
            <div className="overlap-wrapper">
              <div className="overlap-2">
                <div className="overlap-group-2">
                  <div className="text-wrapper-7">25%OFF</div>
                  <div className="text-wrapper-8">on pack of 3</div>
                </div>
              </div>
            </div>
            <div className="div-wrapper">
              <div className="text-wrapper-11">Shop Now</div>
            </div>
            <img className="img" src="img/line-125.svg" />
          </div>
        </div>
      </div>
      <div className="carousel-item">
        <div className="row">
          <div className="col-4">
            <img src="./DMS_IMAGES/glucond_img1.png" alt />
          </div>
          <div className="col-8">
            <h1 className="text-wrapper-3">Battling Tiredness?</h1>
            <div className="overlap">
              <div className="d-flex align-items-center gap-1">
                <div className="text-wrapper-4">Try</div>
                <div className="text-wrapper-5">Glucon-D</div>
              </div>
              <div className="overlap-group">
                <div className="text-wrapper-6">In exciting new flavors</div>
              </div>
            </div>
            <div className="line" />
            <div className="overlap-wrapper">
              <div className="overlap-2">
                <div className="overlap-group-2">
                  <div className="text-wrapper-7">25</div>
                  <div className="text-wrapper-8">on pack of 3</div>
                </div>
                <div className="overlap-3">
                  <div className="text-wrapper-9">%</div>
                  <div className="text-wrapper-10">OFF</div>
                </div>
              </div>
            </div>
            <div className="div-wrapper">
              <div className="text-wrapper-11">Shop Now</div>
            </div>
            <img className="img" src="img/line-125.svg" />
          </div>
        </div>
      </div>
    </div> */
}
