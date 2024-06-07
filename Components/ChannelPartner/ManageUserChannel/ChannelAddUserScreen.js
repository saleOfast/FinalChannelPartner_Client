import React, { useEffect, useState } from "react";
import Link from "next/link";
import CameraIcon from "../../Svg/CameraIcon";
import { toast } from "react-toastify";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import { Button, Modal } from "react-bootstrap";

const ChannelAddUserScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [additionalFields, setAdditionalFields] = useState(false);
  const [userroles, setUserroles] = useState([]);
  const [divisionList, setDivisionList] = useState([]);
  const [departMentList, setDepartMentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [countrylist, setcountrylist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [errorData, setErrorData] = useState({});
  const [isLoading, setisLoading] = useState(false);
  const [citylist, setCitylist] = useState([]);
  const [errorToast, setErrorToast] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [userImage, setuserImage] = useState("");
  const [imgMode, setImgMode] = useState("3");
  const [imgFile, setImgFile] = useState("");
  const [oldFiles, setoldFiles] = useState({
    aadhar_card: null,
    pan_card: null,
    driving_license: null,
  });
  const [updtUId, setUpdtUId] = useState("");
  const [userInfo, setUserinfo] = useState({});
  const [uploadDocs, setuploadDocs] = useState({
    aadhar_card: null,
    pan_card: null,
    driving_license: null,
  });
  const [formFields, setFormFields] = useState({
    id: null,
    token: null,
    aadhar: null,
    pan: null,
    rera: null,
    cheque: null,
    name: "",
    email: "",
    mobile: "",
    isTokenVerified: false,
    isUploadVerified: false,
    isSubmitted: false,
    user_code: "",
    doc_verification: "",
    reject_reason:""
  });

  const inputFields = [
    { label: "Aadhar Card *", field: "aadhar" },
    { label: "PAN Card *", field: "pan" },
    { label: "RERA License *", field: "rera" },
    { label: "Bank Cancelled Cheque", field: "cheque" },
  ];

  const [show, setShow] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({
    reject_reason: "",
    doc_verification: 2,
    user_code: "",
  });

  const handleClose = () => {
    setShow(false);
  };

  function OpenAddModal() {
    handleShow();
  }

  const handleShow = () => setShow(true);

  async function getRolesList() {
    await fetchData("/db/role", setUserroles, errorToast, setErrorToast);
  }

  async function getDivisionList() {
    await fetchData("/db/divison", setDivisionList, errorToast, setErrorToast);
  }

  async function getDepartments() {
    await fetchData(
      "/db/department",
      setDepartMentList,
      errorToast,
      setErrorToast
    );
  }

  async function getUsersList() {
    await fetchData("/db/users", setUsersList, errorToast, setErrorToast);
  }

  async function getDesignation() {
    await fetchData(
      "/db/designation",
      setDesignationList,
      errorToast,
      setErrorToast
    );
  }

  const getCountryList = async () => {
    await fetchData(
      `/db/area/country?country_id=1`,
      setcountrylist,
      errorToast,
      setErrorToast
    );
  };

  const getState = async (id) => {
    await fetchData(
      `/db/area/states?cnt_id=${id}`,
      setStatelist,
      errorToast,
      setErrorToast
    );
  };

  const getcity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setCitylist(data.cityData),
      errorToast,
      setErrorToast
    );
  };

  async function getUserData(id) {
    if (!hasCookie("token")) return;

    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        pass: "pass",
      },
    };

    try {
      const response = await axios.get(`${Baseurl}/db/users?id=${id}`, header);
      const {
        data: { data: data1 },
      } = response;
      const { db_user_profile: data2 } = data1;

      setUpdtUId(data1?.user_id);
      setFormFields({
        ...formFields,
        name: data1?.user,
        email: data1?.email,
        mobile: data1?.contact_number,
        pan: data2?.pan_file,
        aadhar: data2?.aadhar_file,
        rera: data2?.rera_file,
        cheque: data2?.c_cheque_file,
        user_code: data1?.user_code,
        doc_verification: data1?.doc_verification,
        reject_reason:data1?.reject_reason
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const addUserHandler = async () => {
    if (!hasCookie("token")) return;
    setisLoading(true);
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const reqOptions = { ...userInfo, db_name };

    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        m_id: 77,
      },
    };

    try {
      const response = await axios.post(
        `${Baseurl}/db/users`,
        reqOptions,
        header
      );
      const userId = response.data.data.userProfileData.user_id;
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        if (uploadDocs.aadhar_card)
          AddUploadPicture(userId, "adh", uploadDocs.aadhar_card[0], 0);
        if (uploadDocs.pan_card)
          AddUploadPicture(userId, "pan", uploadDocs.aadhar_card[0], 0);
        if (uploadDocs.driving_license)
          AddUploadPicture(userId, "dl", uploadDocs.aadhar_card[0], 0);
        if (userImage) AddUploadPicture(userId, "lsUser", userImage[0], 0);
        setisLoading(false);
        router.push("/ManageUsers");
      }
    } catch (error) {
      if (error?.response?.data?.status === 422) {
        const taskObject = error.response.data.data.reduce((obj, item) => {
          const [key, value] = Object.entries(item)[0];
          obj[key] = value;
          return obj;
        }, {});
        setErrorData(taskObject);
      }
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      setisLoading(false);
    }
  };

  const updateUserhandler = async (doc_verify) => {
    
    if (!hasCookie("token")) return;
    if (doc_verify === 3 && updateInfo.reject_reason === "") {
      return toast.error("Please enter a reason");
    }

    setisLoading(true);
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        pass: "pass",
      },
    };

    try {
      const response = await axios.put(
        `${Baseurl}/db/users`,
        {
          doc_verification: doc_verify,
          reject_reason: updateInfo.reject_reason,
          user_code: id,
        },
        header
      );
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        setisLoading(false);
        router.push("/ManageChannerPartner");
      }
    } catch (error) {
      if (error?.response?.data?.status === 422) {
        const taskObject = error.response.data.data.reduce((acc, obj) => {
          const key = Object.keys(obj)[0];
          const value = Object.values(obj)[0];
          acc[key] = value;
          return acc;
        }, {});
        setErrorData(taskObject);
      }
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
      setisLoading(false);
    }
  };

  const AddUploadPicture = async (id, path, file, name) => {
    if (!hasCookie("token")) return;

    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const formdata = new FormData();
    formdata.append("path", path);
    formdata.append("user_id", id);
    formdata.append("file", file);
    formdata.append("_imageName", name || 0);

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
      },
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${Baseurl}/db/users/uploads`,
        requestOptions
      );
      const result = await response.text();
      toast.info(result.message);
    } catch (error) {
      console.log("error", error);
    }
  };

  const UploadImgFun = (e) => {
    const ImagesArray = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    userInfo.client_logo = ImagesArray[0];
    setuserImage(e.target.files);
    setImgFile(ImagesArray);
  };

  const checkCurrentImg = () => {
    if (imgFile) {
      setImgMode("1");
    } else {
      setImgMode("2");
    }
  };

  useEffect(() => {
    checkCurrentImg();
  }, [userInfo.user_image_file, imgFile]);

  useEffect(() => {
    getRolesList();
    getUsersList();
    getDivisionList();
    getDepartments();
    getDesignation();
    getCountryList();
  }, []);

  useEffect(() => {
    if (userInfo.state_id) {
      getcity(userInfo.state_id);
    }
  }, [userInfo.state_id]);

  useEffect(() => {
    if (userInfo.country_id) {
      getState(userInfo.country_id);
    }
  }, [userInfo.country_id]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      if (router.query.mode == "edit") {
        setEditMode(true);
      } else {
        setEditMode(false);
        setViewMode(true);
      }
      getUserData(id);
    }
  }, [router.isReady, id]);

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {" "}
          {editMode ? "EDIT" : viewMode ? "VIEW" : "ADD"} USER
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link href="/">Dashboard </Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/ManageUsers"> Manage User</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {editMode ? "EDIT" : viewMode ? "View" : "Add"} User
            </li>
          </ol>
        </nav>
      </div>

      <div className="main_content">
        <div className="Add_user_screen">
          <div className="d-block w-100">
            <section className="channel_partner_register">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 d-flex justify-content-between align-items-center">
                    <div className="my_profile d-flex align-items-center gap-3">
                      {/* <KeyboardBackspaceIcon /> */}
                      <span style={{ fontSize: "16PX", fontWeight: 600 }}>
                        Verification
                      </span>
                    </div>
                    <div className="logo">
                      <a href="#">
                        <img src="/DMS_IMAGES/kloudmart.png" alt="normal"/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="channel_partner_register p-5">
              <div className="container-fluid">
                <div className="row">
                  <div className="col col-xl-12 col-md-12 col-sm-12 ">
                    <form
                      className="px-2 body"
                      style={{ position: "relative" }}
                    >
                      <div className="row">
                        <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                          <label className="form-label">
                            Name <span className="error-message">*</span>
                          </label>
                          <input
                            className="form-control input-field"
                            type="text"
                            placeholder="Enter Name"
                            id="Name"
                            formcontrolname="Email"
                            name="Name"
                            value={formFields.name}
                            disabled={true}
                          />
                        </div>
                        <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                          <label className="form-label">
                            Email <span className="error-message">*</span>
                          </label>
                          <input
                            className="form-control input-field"
                            type="text"
                            placeholder="Enter Email"
                            id="Email"
                            formcontrolname="Email"
                            name="Email"
                            value={formFields.email}
                            disabled={true}
                          />
                        </div>
                        <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                          <label className="form-label">
                            Mobile No. <span className="error-message">*</span>
                          </label>
                          <input
                            className="form-control input-field"
                            formcontrolname="Name"
                            type="text"
                            placeholder="Enter Mobile No."
                            name="Mobile"
                            value={formFields.mobile}
                            disabled={true}
                          />
                        </div>
                        <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3"></div>
                        {inputFields.map((input, index) => (
                          <div
                            key={index}
                            className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3"
                          >
                            <div className="d-flex flex-column gap-1">
                              <label className="form-label">
                                {input.label}
                              </label>
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(e, input.field)
                                }
                                className="form-control input-field"
                                disabled={true}
                              />
                              {/* {formFields.isUploadVerified === false &&
                          formFields[input.field] && (
                            <img
                              src={URL.createObjectURL(formFields[input.field])}
                              alt={`${input.label} Preview`}
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          )} */}
                              {input.field === "aadhar" &&
                              formFields[input.field] ? (
                                <img
                                  src={`${filesUrl}/adh/images${
                                    formFields[input.field]
                                  }`}
                                  alt={`${input.label} Preview`}
                                  style={{
                                    maxWidth: "100px",
                                    maxHeight: "100px",
                                  }}
                                />
                              ) : (
                                input.field !== "aadhar" &&
                                formFields[input.field] && (
                                  <img
                                    src={
                                      `${filesUrl}` +
                                      `/${input.field}/images${
                                        formFields[input.field]
                                      }`
                                    }
                                    alt={`${input.label} Preview`}
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                )
                              )}
                            </div>
                          </div>
                        ))}
                        {
                          formFields.reject_reason && (
                            <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                          <label className="form-label">
                            Reject Reason
                          </label>                              
                          <input
                            className="form-control input-field"
                            formcontrolname="Name"
                            type="text"
                            name="Reject_reason"
                            value={formFields.reject_reason}
                            disabled={true}
                          />
                        </div>
                          )
                        }
                        

                        <div className="mt-3  md-text-center">
                          <div className="d-flex">
                            {(formFields.doc_verification=== 0 ||formFields.doc_verification=== 1)  && (
                              <>
                                <button
                                  className="btn btn-primary Add_btn me-3"
                                  type="button"
                                  onClick={() => {
                                    updateUserhandler(2);
                                  }}
                                >
                                  Accept
                                </button>
                                <button
                                  className="btn btn-primary Add_btn"
                                  type="button"
                                  onClick={OpenAddModal}
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                        <Modal
                          className="commonModal"
                          show={show}
                          onHide={handleClose}
                        >
                          <Modal.Header closeButton>
                            <Modal.Title> Reject Reason</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="add_user_form">
                              <div className="row">
                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                  <div className="input_box">
                                    <label htmlFor="email">
                                      Enter the reason
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="Enter Reason"
                                      className="form-control"
                                      onChange={(e) => {
                                        setUpdateInfo({
                                          ...updateInfo,
                                          reject_reason: e.target.value,
                                        });
                                      }}
                                      value={updateInfo.reject_reason}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="primary"
                              type="button"
                              onClick={() => {
                                updateUserhandler(3);
                              }}
                            >
                              Submit
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelAddUserScreen;
