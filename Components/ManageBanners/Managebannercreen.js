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
const DynamicTable = dynamic(() => import("./ManagebannerScreenTab"), {
  ssr: false,
});
const Managebannercreen = () => {

  const returnyyyymmdd = (date) => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const sideView = useSelector((state) => state.sideView.value);
  const [show, setShow] = useState(false);
  const [bannerList, setBannerList] = useState([]);
  const [brandSingleData, setBrandSingleData] = useState("");
  const [brandInfo, setBrandInfo] = useState({
    banner_image: "",
    file: null,
    imagePreview: null,
    banner_id: "",
    banner_alt: "",
    banner_link: "",
    start_date: returnyyyymmdd(new Date()),
    end_date: returnyyyymmdd(new Date()),
    status: true,
    _imageName: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [disableShowConfirm, setdisableShowConfirm] = useState(false);
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [confirmText, setconfirmText] = useState("");
  const [currObj, setcurrObj] = useState({ banner_id: "", action: "" });
  const [loader,setLoader]=useState(false)

  const handleClose = () => {
    setShow(false);
    setBrandInfo({  banner_image: "",
    file: null,
    imagePreview: null,
    banner_id: "",
    banner_alt: "",
    banner_link: "",
    status: true,
    start_date: returnyyyymmdd(new Date()),
    end_date: returnyyyymmdd(new Date()),
    _imageName: "", });
  };

  const handleShow = () => setShow(true);

  const openEdtMdl = (value) => {
    console.log("value",value)
    setEditMode(true);
    setBrandInfo({
      ...brandInfo,
      banner_alt: value[0],
      banner_link: value[1],
      banner_image: value[2],
      imagePreview: `${filesUrl}`+`/banner/images${value[2]}`,
      start_date: value[3],
      end_date: value[4],
      status: value[5],
      banner_id: value[6],
    });
    setBrandSingleData(value[2]);
    handleShow();
  };

  function OpenAddModal() {
    setEditMode(false);
    handleShow();
  }

  function deleteConfirm(value) {
    setcurrObj({ banner_id: value, action: "delete" });
    setdeleteshowConfirm(true);
  }

  const getbannerList = async () => {
    setLoader(true)
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 255,
        },
      };

      try {
        const response = await axios.get(Baseurl + `/db/banner`, header);
        if(response?.status==200 || response?.status==201){
          setLoader(false)
          setBannerList(response?.data?.data);
        }
      } catch (error) {
        setLoader(false)
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
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
          Baseurl + `/db/banner?banner_id=${currObj.banner_id}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setdeleteshowConfirm(false);
          setcurrObj({ banner_id: "", action: "" });
          getbannerList();
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
    if (brandInfo.banner_alt == "") {
      return toast.error("Please enter the Banner Name");
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
      formData.append("banner_alt", brandInfo.banner_alt);
      formData.append("banner_link", brandInfo.banner_link);
      formData.append("start_date", brandInfo.start_date);
      formData.append("end_date", brandInfo.end_date);
      formData.append("status", brandInfo.status);

      try {
        const response = await axios.post(
          Baseurl + `/db/banner`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getbannerList();
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
      formData.append("banner_id", brandInfo.banner_id);
      if (brandInfo.file !== null) {
        formData.append("file", brandInfo.file);
        formData.append("_imageName", brandSingleData);
      }
      formData.append("banner_alt", brandInfo.banner_alt);
      formData.append("banner_link", brandInfo.banner_link);
      formData.append("start_date", brandInfo.start_date);
      formData.append("end_date", brandInfo.end_date);
      formData.append("status", brandInfo.status);
     

      try {
        const response = await axios.put(
          Baseurl + `/db/banner`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          handleClose();
          getbannerList();
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
    getbannerList();
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
          <h3 className="content_head">BANNER MASTER </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/setting">Home</Link>
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
                ADD Banner
              </button>
            </div>
            <DynamicTable
              title="Banner List"
              openEdtMdl={openEdtMdl}
              bannerList={bannerList}
              loader={loader}
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
                  <label htmlFor="email">Banner Name *</label>
                  <input
                    type="text"
                    placeholder="Enter Banner Name"
                    name="banner_alt"
                    id="banner_alt"
                    className="form-control"
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        banner_alt: e.target.value,
                      })
                    }
                    value={brandInfo.banner_alt ? brandInfo.banner_alt : ""}
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Banner Link</label>
                  <input
                    type="text"
                    placeholder="Enter Brand ALt"
                    name="link"
                    id="link"
                    className="form-control"
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        banner_link: e.target.value,
                      })
                    }
                    value={brandInfo.banner_link ? brandInfo.banner_link : ""}
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">Start Date</label>
                  <input
                    type="date"
                    placeholder="Enter Brand ALt"
                    name="start_date"
                    id="start_date"
                    className="form-control"
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        start_date: e.target.value,
                      })
                    }
                    value={brandInfo.start_date}
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="email">End Link</label>
                  <input
                    type="date"
                    placeholder="Enter Brand ALt"
                    name="end_date"
                    id="end_date"
                    className="form-control"
                    onChange={(e) =>
                      setBrandInfo({
                        ...brandInfo,
                        end_date: e.target.value,
                      })
                    }
                    value={brandInfo.end_date}
                  />
                </div>
              </div>
             
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="image">Upload Image *</label>
                  <input
                    className="form-control"
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

export default Managebannercreen;
