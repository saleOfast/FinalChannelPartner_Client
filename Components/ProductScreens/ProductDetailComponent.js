import React from "react";

const ProductDetailComponent = ({ head, value, imgSrc }) => {
  return (
    <div className="row_wrapper">
      <div className="row">
        <div className="col-xl-6 col-sm-6 col-sm-12 col-12">
          <div className="head">{head ? head : "------------"}</div>
        </div>
        {value ? (
          <div className="col-xl-6 col-sm-6 col-sm-12 col-12">
            <div className="value">{value ? value : "------------"}</div>
          </div>
        ) : null}
        {imgSrc ? (
          <div className="col-xl-6 col-sm-6 col-sm-12 col-12">
            <div className="" >
              <img width={"150px"} src={imgSrc} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetailComponent;
