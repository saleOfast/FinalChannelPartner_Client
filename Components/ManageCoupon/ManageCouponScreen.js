import React, { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
const DynamicTable = dynamic(() => import("./ManageCouponScreenTab"), {
  ssr: false,
});
const ManageCouponScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [show, setShow] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [couponInfo, setCouponInfo] = useState({
    coupon_name: "",
    use_type: "private",
    type: "percent",
    value: "",
    coupon_id:"",
    
  });
  const [editMode, setEditMode] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [currObj, setcurrObj] = useState({ coupon_id: "", action: "" });

  const handleClose = () => {
    setShow(false);
    setCouponInfo({ 
    coupon_name: "",
    use_type: "private",
    type: "percent",
    value: "",
    coupon_id:""
 });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true);
    setCouponInfo({
      ...couponInfo,
    coupon_name: value[0],
    value: value[1],
    type: value[2],
    use_type: value[3],
    coupon_id: value[4],
    });
    handleShow();
  };

  function OpenAddModal() {
    setEditMode(false);
    handleShow();
  }

  function deleteConfirm(value) {
    setcurrObj({ coupon_id: value, action: "delete" });
    setdeleteshowConfirm(true);
  }

  const getCouponList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 145,
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/coupon`, header);
        setCouponList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };


  async function deleteHandler() {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 149,
        },
      };

      try {
        const response = await axios.delete(
          Baseurl + `/db/coupon?coupon_id=${currObj.coupon_id}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
          setcurrObj({ coupon_id: "", action: "" });
          getCouponList();
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  }

  const addCouponHandler = async () => {
    if (couponInfo.coupon_name == "") {
      return toast.error("Please enter the Coupon name");
    }
    if (couponInfo.type == "") {
        return toast.error("Please enter the Coupon Type");
      }
    
      if (couponInfo.use_type == "") {
        return toast.error("Please enter the Coupon Use Type");
      }

      if (couponInfo.value == "") {
        return toast.error("Please enter the Coupon Value");
      }

    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 146,
        },
      };

      try {
        const response = await axios.post(
          Baseurl + `/db/coupon`,
          couponInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getCouponList();
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const updateHandler = async () => {
    if (couponInfo.coupon_name == "") {
        return toast.error("Please enter the Coupon name");
      }
      if (couponInfo.type == "") {
          return toast.error("Please enter the Coupon Type");
        }
      
        if (couponInfo.use_type == "") {
          return toast.error("Please enter the Coupon Use Type");
        }
  
        if (couponInfo.value == "") {
          return toast.error("Please enter the Coupon Value");
        }

    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 146,
        },
      };

     

      try {
        const response = await axios.put(
          Baseurl + `/db/coupon`,
          couponInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getCouponList();
        }
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
    getCouponList();
  }, []);

  return (
    <>

      <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"}
      />

      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">COUPON MASTER </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/crm">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Coupon Master
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="table_screen">
            <div className="top_btn_sec">
              <button
                className="btn btn-primary Add_btn"
                onClick={OpenAddModal}
              >
                <PlusIcon />
                ADD COUPON
              </button>
            </div>
            <DynamicTable
              title="Coupon List"
              openEdtMdl={openEdtMdl}
              couponList={couponList}
              deleteConfirm={deleteConfirm}
            />
          </div>
        </div>
      </div>

      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "EDIT" : "ADD"} COUPON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
  <div className="add_coupon_form">
    <div className="row">
      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
        <div className="input_box">
          <label htmlFor="coupon_name">Coupon Name *</label>
          <input
            type="text"
            placeholder="Enter Coupon Name"
            name="coupon_name"
            id="coupon_name"
            className="form-control"
            onChange={(e) => setCouponInfo({...couponInfo, coupon_name: e.target.value })}
            value={couponInfo.coupon_name? couponInfo.coupon_name : ""}
          />
        </div>
      </div>
      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
        <div className="input_box">
          <label htmlFor="value">Value *</label>
          <input
            type="number"
            placeholder="Enter Value"
            name="value"
            id="value"
            className="form-control"
            onChange={(e) => setCouponInfo({...couponInfo, value: e.target.value })}
            value={couponInfo.value? couponInfo.value : ""}
          />
        </div>
      </div>
      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
        <div className="input_box">
          <label htmlFor="type">Type</label>
          <select className="form-control " id="type" value={couponInfo.type} name="type" onChange={(e) => setCouponInfo({...couponInfo, type: e.target.value })}>
            <option value="percent">Percent</option>
            <option value="flat">Flat</option>
          </select>
        </div>
      </div>
      <div className="col-xl-12 col-md-12 col-sm-12 col-12">
        <div className="input_box">
          <label htmlFor="use_type">Use Type</label>
          <select className="form-control" id="use_type" value={couponInfo.use_type} name="use_type" onChange={(e) => setCouponInfo({...couponInfo, use_type: e.target.value })}>
            <option value="Public">Public</option>
            <option value="Private">Private</option>
          </select>
        </div>
      </div>
    </div>
  </div>
        </Modal.Body>
        <Modal.Footer>
          {editMode ? (
            <Button variant="primary" onClick={updateHandler}>
              UPDATE
            </Button>
          ) : (
            <Button variant="primary" onClick={addCouponHandler}>
              SUBMIT
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageCouponScreen;
