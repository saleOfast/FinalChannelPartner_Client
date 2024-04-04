import React from 'react'

const HotDealsCarousel = () => {
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
    <div className>
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
    </div>
  </section>
    </>
    
  )
}

export default HotDealsCarousel