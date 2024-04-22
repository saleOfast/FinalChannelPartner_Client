import React, { useEffect, useState } from "react";
import Link from "next/link";
import CameraIcon from "../../Svg/CameraIcon";
import { toast } from "react-toastify";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import { Baseurl, filesUrl } from "../../../Utils/Constants";

const AddUserScreen = () => {
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
    aadhar: null,
    pan: null,
    rera: null,
    cheque: null,
  });
  const [updtUId, setUpdtUId] = useState("");
  const [userInfo, setUserinfo] = useState({});
  const [uploadDocs, setuploadDocs] = useState({
    aadhar: null,
    pan: null,
    rera: null,
    cheque: null,
    aadharPreview:null,
    panPreview:null,
    reraPreview:null,
    chequePreview:null,
  });

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
      setUserinfo({
        user: data1?.user,
        user_l_name: data1?.user_l_name,
        email: data1?.email,
        contact_number: data1?.contact_number,
        db_name: data1?.db_name,
        isDB: data1?.isDB,
        user_status: data1?.user_status,
        user_code: data1?.user_code,
        role_id: data1?.role_id,
        country_id: data1?.country_id,
        state_id: data1?.state_id,
        city_id: data1?.city_id,
        address: data1?.address,
        pincode: data1?.pincode,
        gst: data1?.gst,
        organisation: data1?.organisation,
        user_profle_id: data1?.user_profle_id,
        div_id: data2?.div_id,
        dep_id: data2?.dep_id,
        des_id: data2?.des_id,
        report_to: data1?.report_to,
        aadhar_no: data2?.aadhar_no,
        pan_no: data2?.pan_no,
        dl_no: data2?.dl_no,
        user_image_file: data2?.user_image_file,
        bank_name: data2?.bank_name,
        account_holder_name: data2?.account_holder_name,
        account_no: data2?.account_no,
        bank_ifsc_code: data2?.bank_ifsc_code,
        branch: data2?.branch,
        isCRM:data1?.db_user_platforms[0].actions,
        isDMS:data1?.db_user_platforms[1].actions,
        isSALES:data1?.db_user_platforms[2].actions,
        isCHANNEL:data1?.db_user_platforms[3].actions
      });

      setoldFiles({
        ...oldFiles,
        aadhar: data2?.aadhar_file,
        pan: data2?.pan_file,
        rera: data2?.rera_file,
        cheque: data2?.c_cheque_file,
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const addUserHandler = async () => {
    if (!hasCookie("token")) return;
    const db_name = getCookie("db_name");
    setisLoading(true);
    const token = getCookie("token");
    const reqOptions = { ...userInfo, db_name };

    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
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
          AddUploadPicture(userId, "adh", uploadDocs.aadhar[0], 0);
        if (uploadDocs.pan_card)
          AddUploadPicture(userId, "pan", uploadDocs.pan[0], 0);
        if (uploadDocs.rera)
          AddUploadPicture(userId, "rera", uploadDocs.rera[0], 0);
        if (uploadDocs.cheque)
        AddUploadPicture(userId, "cheque", uploadDocs.cheque[0], 0);
        if (userImage) AddUploadPicture(userId, "lsUser", userImage[0], 0);
        setisLoading(false);
        router.push("/CHANNEL/ActivePartners");
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

  const updateUserhandler = async () => {
    if (!hasCookie("token")) return;

    setisLoading(true);
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        m_id: 79,
      },
    };

    if (userInfo.user === "") {
      toast.error("Please Enter the Name");
      return;
    }

    try {
      const response = await axios.put(`${Baseurl}/db/users`, userInfo, header);
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        if (uploadDocs.aadhar)
          AddUploadPicture(
            updtUId,
            "adh",
            uploadDocs.aadhar[0],
            oldFiles.aadhar
          );
        if (uploadDocs.pan)
          AddUploadPicture(updtUId, "pan", uploadDocs.pan[0], oldFiles.pan);
        if (uploadDocs.rera)
          AddUploadPicture(updtUId, "rera", uploadDocs.rera[0], oldFiles.rera);
        if (uploadDocs.cheque)
          AddUploadPicture(
            updtUId,
            "cheque",
            uploadDocs.cheque[0],
            oldFiles.cheque
          );
        if (userImage)
          AddUploadPicture(
            updtUId,
            "lsUser",
            userImage[0],
            userInfo.user_image_file
          );
        setisLoading(false);
        router.push("/CHANNEL/ActivePartners");
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

  const handleImageChange = (e, type, previewType) => {
    if (e.target.files[0]) {

      const reader = new FileReader();
      reader.onloadend = () => {
        setoldFiles({
          ...oldFiles,
          [type]:null
        })
        setuploadDocs((prevUploadDocs) => ({
          ...prevUploadDocs,
          [type]: e.target.files[0],
          [previewType]: reader.result,
        }));
      };
      
      reader.readAsDataURL(e.target.files[0]);
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
    <div className={`main_Box w-100 pe-5 `} style={{marginTop:"-50px"}}>

      <div className="main_content w-100">
        <div className="Add_user_screen">
          {viewMode ? null : (
            <div className="add_screen_head">
              <span className="text_bold"> Fill Details</span> ( * Fields are
              mandatory){" "}
            </div>
          )}
          <div className="add_user_form addUserPage">
            <div className="row profilePic">
              <div className="col-xl-10 col-md-10 col-sm-12 col-12">
                <div className="row">
                  <div className="col-xl-5 col-md-5 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.role_id ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="profilelevel">User Profile *</label>
                      <select
                        className={
                          errorData?.role_id
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="profilelevel"
                        id="profilelevel"
                        disabled={viewMode}
                        onChange={(e) => {
                          setUserinfo({
                            ...userInfo,
                            role_id: parseInt(e.target.value),
                          });
                          setErrorData({ ...errorData, role_id: "" });
                        }}
                        value={userInfo.role_id ? userInfo.role_id : ""}
                      >
                        <option value="">Select User Profile </option>
                        {userroles?.map(({ role_id, role_name }) => {
                          return (
                            <option key={role_id} value={role_id}>
                              {role_name}
                            </option>
                          );
                        })}
                      </select>
                      <span className="errorText">
                        {" "}
                        {errorData?.role_id ? errorData.role_id : ""}
                      </span>
                    </div>
                  </div>

                </div>
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.user ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="firstName">Name *</label>
                      <input
                        type="text"
                        placeholder="Enter User Name"
                        name="name"
                        id="firstName"
                        className={
                          errorData?.user
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          setUserinfo({ ...userInfo, user: e.target.value });
                          setErrorData({ ...errorData, user: "" });
                        }}
                        disabled={viewMode}
                        value={userInfo.user ? userInfo.user : ""}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.user ? errorData.user : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.user ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="firstName">Last Name *</label>
                      <input
                        type="text"
                        placeholder="Enter User Name"
                        name="name"
                        id="firstName"
                        className={
                          errorData?.user
                            ? "form-control is-invalid"
                            : "form-control"  
                        }
                        onChange={(e) => {
                          setUserinfo({ ...userInfo, user_l_name: e.target.value });
                          setErrorData({ ...errorData, user_l_name: "" });
                        }}
                        disabled={viewMode}
                        value={userInfo.user_l_name ? userInfo.user_l_name : ""}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.user_l_name ? errorData.user_l_name : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="contact_no">Contact No </label>
                      <input
                        type="number"
                        placeholder="Enter Contact No."
                        name="contact-no"
                        id="contact_no"
                        className={
                          errorData?.contact_number
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        disabled={viewMode}
                        onChange={(e) => {
                          setUserinfo({
                            ...userInfo,
                            contact_number: e.target.value,
                          });
                          setErrorData({ ...errorData, contact_number: "" });
                        }}
                        value={
                          userInfo.contact_number ? userInfo.contact_number : ""
                        }
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.contact_number
                          ? errorData.contact_number
                          : ""}
                      </span>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.email ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="contact_no">Email * </label>
                      <input
                        type="email"
                        placeholder="Enter Email Id."
                        name="email"
                        id="email"
                        className={
                          errorData?.email
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        disabled={viewMode}
                        onChange={(e) => {
                          setUserinfo({ ...userInfo, email: e.target.value });
                          setErrorData({ ...errorData, email: "" });
                        }}
                        value={userInfo.email ? userInfo.email : ""}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.email ? errorData.email : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="address">Address </label>
                      <input
                        name="address"
                        id="address"
                        rows="3"
                        className="form-control"
                        disabled={viewMode}
                        onChange={(e) =>
                          setUserinfo({ ...userInfo, address: e.target.value })
                        }
                        value={userInfo.address ? userInfo.address : ""}
                      ></input>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="pan_card">Organisation </label>
                    <input
                      type="text"
                      placeholder="Enter Organisation Name."
                      name="organisation"
                      id="organisation"
                      disabled={viewMode}
                      className="form-control"
                      onChange={(e) =>
                        setUserinfo({
                          ...userInfo,
                          organisation: e.target.value,
                        })
                      }
                      value={userInfo.organisation ? userInfo.organisation : ""}
                    />
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="pan_card">GST Number </label>
                    <input
                      type="text"
                      placeholder="Enter GST No."
                      name="gst"
                      id="gst"
                      disabled={viewMode}
                      className="form-control"
                      onChange={(e) =>
                        setUserinfo({
                          ...userInfo,
                          gst: e.target.value,
                        })
                      }
                      value={userInfo.gst ? userInfo.gst : ""}
                    />
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div
                  className={
                    errorData?.report_to ? "input_box errorBox" : "input_box"
                  }
                >
                  <label htmlFor="task_name">Report/Assign To *</label>
                  <Select
                    id={userInfo.des_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                    options={usersList?.map((data, index) => {
                      return {
                        value: data?.user_id,
                        label: data?.user,
                      };
                    })}
                    value={usersList?.map((data, index) => {
                      if (userInfo.report_to === data.user_id) {
                        return {
                          value: data?.user_id,
                          label: data?.user,
                        };
                      }
                    })}
                    onChange={(e) => {
                      setUserinfo({ ...userInfo, report_to: e.value });
                      setErrorData({ ...errorData, report_to: "" });
                    }}
                  />
                  <span className="errorText">
                    {" "}
                    {errorData?.report_to ? errorData.report_to : ""}
                  </span>
                </div>
              </div>

                </div>
              </div>
              <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                <div className="img_sec">
                  <label htmlFor="uploadImg" title="Upload Logo">
                    {imgMode === "1" ? (
                      <img src={imgFile} alt="logo" width="100%" />
                    ) : null}
                    {imgMode === "2" ? (
                      <>
                        {" "}
                        {userInfo.user_image_file ? (
                          <img
                            src={`${filesUrl}/lsUser/images${userInfo.user_image_file}`}
                            alt="logo"
                            width="100%"
                          />
                        ) : (
                          <>
                            <div className="img_holder">
                              <img src="/images/add_user_avatar.png" alt="" />
                              <div className="icon">
                                <CameraIcon />
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    ) : null}
                  </label>
                  <input
                    type="file"
                    id="uploadImg"
                    accept="image/png, image/gif, image/jpeg"
                    onChange={UploadImgFun}
                    disabled={viewMode}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              

              

              <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                <div className="d-flex flex-column gap-1">
                  <label className="form-label">Aadhar Card </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleImageChange(e,"aadhar",'aadharPreview')
                    }}
                    className="form-control input-field"
                    disabled={viewMode}
                  />
                  {oldFiles?.aadhar && (
                    <img
                      src={`${filesUrl}/adh/images${oldFiles.aadhar}`}
                      alt={`Aadhar Card Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                  {uploadDocs?.aadharPreview && (
                    <img
                      src={uploadDocs.aadharPreview}
                      alt={`Aadhar Card Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                <div className="d-flex flex-column gap-1">
                  <label className="form-label">PAN Card </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleImageChange(e,'pan','panPreview')
                    }}
                    className="form-control input-field"
                    disabled={viewMode}
                  />
                  {oldFiles?.pan && (
                    <img
                      src={`${filesUrl}/pan/images${oldFiles.pan}`}
                      alt={`PAN CARD Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                  {uploadDocs?.panPreview && (
                    <img
                      src={uploadDocs.panPreview}
                      alt={` PAN Card Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                <div className="d-flex flex-column gap-1">
                  <label className="form-label">RERA License </label>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleImageChange(e,'rera','reraPreview')
                    }}
                    className="form-control input-field"
                    disabled={viewMode}
                  />
                  {oldFiles?.rera && (
                    <img
                      src={`${filesUrl}/rera/images${oldFiles.rera}`}
                      alt={`RERA License Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                   {uploadDocs?.reraPreview && (
                    <img
                      src={uploadDocs.reraPreview}
                      alt={`RERA License Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                <div className="d-flex flex-column gap-1">
                  <label className="form-label">Bank Cancelled Cheque</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      handleImageChange(e,'cheque','chequePreview')
                    }}
                    className="form-control input-field"
                    disabled={viewMode}
                  />
                  {oldFiles?.cheque && (
                    <img
                      src={`${filesUrl}/cheque/images${oldFiles.cheque}`}
                      alt={`Bank Cancelled Cheque Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                  {uploadDocs?.chequePreview && (
                    <img
                      src={uploadDocs.chequePreview}
                      alt={`Bank Cancelled Cheque Preview`}
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                      }}
                    />
                  )}
                </div>
              </div>
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.mailing_cont
                        ? "input_box errorBox"
                        : "input_box"
                    }
                  >
                    <label htmlFor="task_name"> Country</label>
                    <Select
                      id={userInfo.country_id}
                      defaultValue={""}
                      isDisabled={viewMode}
                      options={countrylist?.map((data, index) => {
                        return {
                          value: data?.country_id,
                          label: data?.country_name,
                        };
                      })}
                      value={countrylist?.map((data, index) => {
                        if (userInfo.country_id === data.country_id) {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,
                          };
                        }
                      })}
                      onChange={(e) =>
                        setUserinfo({ ...userInfo, country_id: e.value })
                      }
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.country_id ? errorData.country_id : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.state_id ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="task_name"> State</label>
                    <Select
                      id={userInfo.state_id}
                      defaultValue={""}
                      isDisabled={viewMode}
                      options={statelist?.map((data, index) => {
                        return {
                          value: data?.state_id,
                          label: data?.state_name,
                        };
                      })}
                      value={statelist?.map((data, index) => {
                        if (userInfo.state_id === data.state_id) {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,
                          };
                        }
                      })}
                      onChange={(e) =>
                        setUserinfo({ ...userInfo, state_id: e.value })
                      }
                    />
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.state_id ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="task_name"> City </label>
                    <Select
                      id={userInfo.city_id}
                      defaultValue={""}
                      isDisabled={viewMode}
                      options={citylist?.map((data, index) => {
                        return {
                          value: data?.city_id,
                          label: data?.city_name,
                        };
                      })}
                      value={citylist?.map((data, index) => {
                        if (userInfo.city_id === data.city_id) {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,
                          };
                        }
                      })}
                      onChange={(e) =>
                        setUserinfo({ ...userInfo, city_id: e.value })
                      }
                    />
                  </div>
                </div>
            </div>
            
            

            <div className="text-end">
              <div className="submit_btn">
                <Link href="/CHANNEL/ActivePartners">
                  <button className="btn btn-cancel me-2 ">Cancel</button>
                </Link>
                {editMode ? (
                  <button
                    disabled={isLoading}
                    className="btn btn-primary"
                    onClick={updateUserhandler}
                  >
                    {isLoading ? "Loading..." : "Update"}
                  </button>
                ) : viewMode ? null : (
                  <button
                    disabled={isLoading}
                    className="btn btn-primary"
                    onClick={addUserHandler}
                  >
                    {isLoading ? "Loading..." : "Save & Submit"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserScreen;
