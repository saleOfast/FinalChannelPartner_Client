import React, { useEffect, useState } from "react";
import Link from "next/link";
import PlusIcon from "../Svg/PlusIcon";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { Baseurl, filesUrl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
const DynamicTable = dynamic(() => import("./ManagebrandScreenTab"), {
  ssr: false,
});
const ManagebrandScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);
  const [show, setShow] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const [brandSingleData, setBrandSingleData] = useState("");
  const [brandInfo, setBrandInfo] = useState({
    brand_name: "",
    file: null,
    imagePreview: null,
    brand_id: "",
    _imageName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [confirmText, setconfirmText] = useState("");
  const [currObj, setcurrObj] = useState({ brand_id: "", action: "" });

  const handleClose = () => {
    setShow(false);
    setBrandInfo({ brand_name: "" });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    setEditMode(true);
    setBrandInfo({
      ...brandInfo,
      brand_name: value[0],
      file: value[1],
      brand_id: value[2],
      imagePreview: `${filesUrl}`+`/brand/images${value[1]}`
    });
    setBrandSingleData(value[1]);
    handleShow();
  };

  function OpenAddModal() {
    setEditMode(false);
    handleShow();
  }

  function deleteConfirm(value) {
    setcurrObj({ brand_id: value, action: "delete" });
    setdeleteshowConfirm(true);
  }

  const getBrandList = async () => {
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
        const response = await axios.get(Baseurl + `/db/brand`, header);
        setBrandList(response.data.data);
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
          Baseurl + `/db/brand?brand_id=${currObj.brand_id}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
          setcurrObj({ brand_id: "", action: "" });
          getBrandList();
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

  const addBrandHandler = async () => {
    if (brandInfo.brand_name == "") {
      return toast.error("Please enter the brand name");
    }
    if (brandInfo.file == null) {
      return toast.error("Please Upload an image");
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

      const formData = new FormData();
      formData.append("file", brandInfo.file);
      formData.append("brand_name", brandInfo.brand_name);

      try {
        const response = await axios.post(
          Baseurl + `/db/brand`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getBrandList();
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
    if (brandInfo.brand_name == "") {
      return toast.error("Please enter the brand name");
    }
    if (brandInfo.file == null) {
      return toast.error("Please Upload an image");
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

      const formData = new FormData();
      formData.append("brand_id", brandInfo.brand_id);
      formData.append("file", brandInfo.file);
      formData.append("brand_name", brandInfo.brand_name);
      formData.append("_imageName", brandSingleData);

      try {
        const response = await axios.put(
          Baseurl + `/db/brand`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getBrandList();
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

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBrandInfo({
          ...brandInfo,
          file: e.target.files[0],
          imagePreview: reader.result,
        });
      };
     
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    getBrandList();
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
          <h3 className="content_head">BRAND MASTER </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Brand Master
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
                ADD BRAND
              </button>
            </div>
            <DynamicTable
              title="Brand List"
              openEdtMdl={openEdtMdl}
              brandList={brandList}
              deleteConfirm={deleteConfirm}
            />
          </div>
        </div>
      </div>

      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "EDIT" : "ADD"} BRAND</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Brand Name *</label>
                  <input
                    type="text"
                    placeholder="Enter Brand Name"
                    name="email"
                    id="email"
                    className="form-control"
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        brand_name: e.target.value,
                      })
                    }
                    value={brandInfo.brand_name ? brandInfo.brand_name : ""}
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="image">Upload Image *</label>
                  <input
                    class="form-control"
                    name="image"
                    accept="image/*"
                    type="file"
                    id="image"
                    onChange={handleImageChange}
                    required
                  />
                  {brandInfo.imagePreview && (
                    <div className=" d-flex align-items-center justify-content-center">
                      <img
                        src={brandInfo.imagePreview}
                        alt="Preview"
                        style={{
                          width: "35%",
                          height: "35%",
                          marginTop: "10px",
                        }}
                      />
                    </div>
                  )}
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
            <Button variant="primary" onClick={addBrandHandler}>
              SUBMIT
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManagebrandScreen;
