import React, { useEffect, useState } from "react";

import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import Button from "react-bootstrap/Button";
import moment from "moment";
import ProductDetailComponent from "./ProductDetailComponent";
import { useSelector } from "react-redux";

const ProductViewScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [dataList, setDataList] = useState({});
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);

  const getData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:42
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/product?p_id=${id}`,
          header
        );
        setDataList(response.data.data);
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
    if (!router.isReady) return;
    if (router.query.id) {
      getData(id);
    }
  }, [router.isReady, id]);

  return (
    <>
      {/*  <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={disableHandler}
                title={"Are You Sure you want to Disable ?"}
            /> */}

       <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">VIEW Product</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/TaskScreen">Home </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/Products">View Product </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Product
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="lead_box">
            <div className="row">
              <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                <div className="lead-info ">
                  <div className="header">View Product</div>
                  <div className="info_boxes">
                    <ProductDetailComponent
                      head="Product Name"
                      value={dataList?.p_name}
                    />
                    <ProductDetailComponent
                      head="Product Code"
                      value={dataList?.p_code}
                    />

                    <ProductDetailComponent
                      head="Product Category"
                      value={dataList?.db_p_cat?.p_cat_name}
                    />
                    <ProductDetailComponent
                      head="List Price"
                      value={dataList?.p_price}
                    />

                    <ProductDetailComponent
                      head="Description"
                      value={dataList?.p_desc}
                    />


                  </div>

                  <div className="header dashboard_head">
                    System Information
                  </div>
                  <div className="info_boxes">
                    <ProductDetailComponent
                      head="Created On"
                      value={moment(dataList?.createdAt).format("DD-MM-YYYY LT")}
                    />
                    <ProductDetailComponent
                      head="Last Modified On"
                      value={moment(dataList?.updateon).format("DD-MM-YYYY LT")}
                    />
                    <div className="btn-box text-end pb-4 pt-2">
                      <Link href={`/AddProduct?id=${id}`}>
                        <button className="btn btn-primary">Edit</button>
                      </Link>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductViewScreen;
