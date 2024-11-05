import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { validEmail, validPhone, validZip } from "../../../Utils/regex";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";

const AddPrintingCostScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const { ac_id } = router.query;

  const [countrylist, setcountrylist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  const [singleAccount, setSingleAccount] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [addInfo, setAddInfo] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [usersList, setUsersLsit] = useState([]);
  const [iscollapse, setiscollapse] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [contError, setContError] = useState({});
  const [errorToast, setErrorToast] = useState(false);
  const [loginDetails, setloginDetails] = useState({});
  const [mediaTypes, setMediaTypes] = useState([]);
  const [printMaterial, setPrintMaterial] = useState([]);

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DDTHH:mm");
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });

  const [userInfo, setUserInfo] = useState({
    pr_c_id: null,
    acc_id: null,
    acc_name:"",
    // status:'ACTIVE',
    m_t_id:null,
    pr_m_id:null
  });

  async function getAccountsList() {
    await fetchData(
      `/db/account?platform_id=5`,
      setAccountsList,
      errorToast,
      setErrorToast
    );
  }

  async function getCountryList() {
    await fetchData(
      `/db/area/country?bill_cont=1`,
      setcountrylist,
      errorToast,
      setErrorToast
    );
  }

  async function getState() {
    await fetchData(
      `/db/area/states?cnt_id=${userInfo.mailing_cont}`,
      setStatelist,
      errorToast,
      setErrorToast
    );
  }
  
  const getPrintingMaterial = async () => {
    await fetchData(
      `/db/media/printingMaterial/getPrintingMaterial`,
      setPrintMaterial,
      errorToast,
      setErrorData
    );
  };

  const getMediaTypes = async () => {
    await fetchData(
      `/db/media/mediaType/getMediaType`,
      setMediaTypes,
      errorToast,
      setErrorData
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

  const getusersList = async (data) => {
    let url;
    if (data?.isDB == true) {
      url = "/db/users?mode=ul";
    } else {
      url = "/db/users";
    }
    await fetchData(url, setUsersLsit, errorToast, setErrorToast);
  };

  function checkLogin() {
    if (hasCookie("userInfo")) {
      let token = getCookie("userInfo");
      let data = JSON.parse(token);
      setloginDetails(data);
      getusersList(data);
      setUserInfo({ ...userInfo, contact_owner: data.user_id });
    }
  }

  const getSingleData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 418,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingCost/getPrintingCost?pr_c_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };



  const submitHandler = async () => {
    const errors = {};
    if (!userInfo.acc_id) {
      errors.acc_name = "Account Name is required";
    }
    if (!userInfo.m_t_id) {
      errors.m_t_id = "Media Type is required";
    }
    if (userInfo.pr_c_cost === null || isNaN(userInfo.pr_c_cost) || userInfo.pr_c_cost <= 0) {
      errors.pr_c_cost = "Printing Cost/Sq. Ft. must be a positive number";
    }
  
    if (Object.keys(errors).length > 0) {
      setErrorData(errors);
      return; // Stop form submission
    }
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 417,
        },
      };

      console.log("userinfo is ",userInfo)

      // let oppBody = { ...userInfo };
      // oppBody.contact_owner = loginDetails.user_id;
      try {
        const response = await axios.post(
          Baseurl + `/db/media/printingCost/addPrintingCost`,
          userInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/media/PrintingCostMgmt");
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {};
          const array = error?.response?.data?.data;
          for (let i = 0; i < array.length; i++) {
            const key = Object.keys(array[i])[0];
            const value = Object.values(array[i])[0];
            taskObject[key] = value;
          }
          setErrorData(taskObject);
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    } else {
      toast.error("Please fill the Mandatory fileds");
    }
  };

  const UpdateHandler = async () => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 419,
        },
      };

      let newUserInfo = { ...userInfo, updated_on: DateNow,pr_c_id:Number(id)};
      let { status, ...newDataWithoutStatus } = newUserInfo;


      let newData = JSON.parse(JSON.stringify(newUserInfo));

      try {
        const response = await axios.put(
          Baseurl + `/db/media/printingCost/updatePrintingCost`,
          newDataWithoutStatus,
          header
        );

        if (response.status === 200 || response.status === 204) {
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/media/PrintingCostMgmt");
        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {};
          const array = error?.response?.data?.data;
          for (let i = 0; i < array.length; i++) {
            const key = Object.keys(array[i])[0];
            const value = Object.values(array[i])[0];
            taskObject[key] = value;
          }
          setErrorData(taskObject);
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    } else {
      toast.error("Please fill the Mandatory fileds");
    }
  };

  const getContactFieldList = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/field?nav_type=contact`,
          header
        );
        setUserInfo({
          ...userInfo,
          db_contact_fields: response.data.data,
          updated_on: DateNow,
          created_on: DateNow,
        });
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(timer);
      };
    }, [value, delay]);

    return debouncedValue;
  }

  useEffect(() => {
    if (userInfo.contact_no && !validPhone.test(userInfo.contact_no)) {
      setContError({ ...contError, contact_no: "invalid contact no." });
    } else {
      setContError({ ...contError, contact_no: "" });
    }
  }, [useDebounce(userInfo.contact_no, 1000)]);

  useEffect(() => {
    if (userInfo.email_id && !validEmail.test(userInfo.email_id)) {
      setContError({ ...contError, email_id: "invalid Email" });
    } else {
      setContError({ ...contError, email_id: "" });
    }
  }, [useDebounce(userInfo.email_id, 1000)]);

  useEffect(() => {
    getCountryList();
    getState();
    getAccountsList();
    checkLogin();
    getMediaTypes();
    getPrintingMaterial();
    getusersList();
    setUserInfo({
      ...userInfo,
      created_on: DateNow,
      updated_on: DateNow,
    });
  }, []);

  useEffect(() => {
    if (!userInfo.mailing_state) {
      return;
    } else {
      getcity(userInfo.mailing_state);
    }
  }, [userInfo.mailing_state]);

  useEffect(() => {
    if (!userInfo.mailing_cont) {
      return;
    } else {
      getState(userInfo.mailing_cont);
    }
  }, [userInfo.mailing_cont]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    } else {
      if (userInfo !== undefined) {
        getContactFieldList();
      }
    }
    if (router.query.vw) [setViewMode(true)];
  }, [router.isReady, id]);

  // useEffect(() => {
  //   if (userInfo.account_name !== null && !editMode) {
  //     // call the api with this acoount name
  //     getSingleAccountsList(userInfo.account_name);
  //   }
  // }, [userInfo.account_name]);

  useEffect(() => {
    // Accessing the accountName object when data changes
    if (userInfo) {
      const accountName = userInfo;
      // Access and use the properties of the accountName object as needed
    }
  }, [userInfo]);

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {" "}
          {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} PRINTING COST
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder ">
              <Link href="/media">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/media/PrintingCostMgmt"> Printing Cost List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? "View" : <>{editMode ? "Edit" : "Add"}</>} Printing
              Cost
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="Add_user_screen">
          <div className="row">
            <div
              className={
                viewMode
                  ? `col-xl-9 col-md-9 col-sm-12 col-12`
                  : `col-xl-12 col-md-12 col-sm-12 col-12`
              }
            >
              <div className="add_screen_head">
                <span className="text_bold">Fill Details</span> ( * Fields are
                mandatory)
              </div>
              <div className="add_user_form">
                <div className="row">

                

<div className="col-xl-3 col-md-3 col-sm-12 col-12">
  <div
    className={
      errorData?.account_name ? "input_box errorBox" : "input_box"
    }
  >
    <label htmlFor="task_name">Account Name *</label>
    <Select
      id={userInfo.task_status_id}
      defaultValue=""
      isDisabled={viewMode}
      options={accountsList?.filter((item)=>(item?.db_account_type?.platform_id==5 && item?.db_account_type?.account_type_name==
        "Printing Vendors"))?.map((data) => {
        return {
          value: data?.acc_id,
          label: data?.acc_name,
        };
      })}
      value={
        accountsList
          ?.filter((data) => data.acc_id === userInfo.acc_id)
          .map((data) => {
            return {
              value: data?.acc_id,
              label: data?.acc_name,
            };
          })[0] || null
      }
      onChange={(e) => {
        const selectedAccount = accountsList.find(account => account.acc_id === e.value);
        setUserInfo({
          ...userInfo,
          
          acc_name: selectedAccount.acc_name,
          
          acc_id: e.value,
        });
        setErrorData({ ...errorData, acc_name: "" });
      }}
    />
    <span className="errorText">
      {errorData?.acc_name ? errorData.acc_name : ""}
    </span>
  </div>
</div>

{
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Account ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={accountsList?.find(item=>item?.acc_id==userInfo?.acc_id)?.acc_code}
                          />
                        </div>
                      </div>
                  )
                }

{
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Printing Cost ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={userInfo?.pr_c_code}
                          />
                        </div>
                      </div>
                  )
                }
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.m_t_id ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="media_type">Media Type *</label>
                      <Select
                        id="media_type"
                        isDisabled={viewMode}
                        defaultValue={""}
                        options={mediaTypes?.map((item) => {
                          return {
                            value: item.m_t_id,
                            label: item.m_t_name,
                          };
                        })}
                        value={mediaTypes?.map((item) => {
                          if (userInfo?.m_t_id == item?.m_t_id) {
                            return {
                              value: item.m_t_id,
                              label: item.m_t_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            m_t_id: e.value,
                          });
                          setErrorData({ ...errorData, m_t_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.m_t_id ? errorData.m_t_id : ""}
                      </span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.pr_m_id ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="media_type">Printing Material</label>
                      <Select
                        id="media_type"
                        isDisabled={viewMode}
                        defaultValue={""}
                        options={printMaterial?.map((item) => {
                          return {
                            value: item.pr_m_id,
                            label: item.pr_m_name,
                          };
                        })}
                        value={printMaterial?.map((item) => {
                          if (userInfo?.pr_m_id == item?.pr_m_id) {
                            return {
                              value: item.pr_m_id,
                              label: item.pr_m_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            pr_m_id: e.value,
                          });
                          setErrorData({ ...errorData, pr_m_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.pr_m_id ? errorData.pr_m_id : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="pr_c_cost">Printing Cost/Sq. Ft. *</label>
                      <input
                        type="number"
                        name="pr_c_cost"
                        placeholder="Enter Mounting Cost/Sq. Ft."
                        id="pr_c_cost"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) =>{
                          const value = parseFloat(e.target.value) || null;

                          setUserInfo({
                            ...userInfo,
                            pr_c_cost: value,
                          })
                        }}
                        value={userInfo.pr_c_cost ? userInfo.pr_c_cost : ""}
                      />
                      <span className="errorText">
                        {errorData?.pr_c_cost ? errorData.pr_c_cost : ""}
                      </span>
                    </div>
                  </div>

                  {
                      id && (
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="mo_c_cost">
                            Status
                          </label>
                          <input
                            type="text"
                            name="status"
                            placeholder="Status"
                            id="status"
                            disabled={true}
                            className="form-control"
                            value={userInfo.status}
                          />
                            <span className="errorText">
                            {errorData?.status
                              ? errorData.status
                              : ""}
                          </span>
                        </div>
                      </div>
                      )
                    }

                 


                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">System Information </span>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="created_on">Created On</label>
                      <input
                        type="datetime-local"
                        name="per_cont"
                        id="per_cont"
                        disabled
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            created_on: e.target.value,
                          })
                        }
                        value={moment(userInfo?.created_on).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="last_modified">Last Modified On</label>
                      <input
                        type="datetime-local"
                        name="per_cont"
                        id="per_cont"
                        disabled
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            updated_on: e.target.value,
                          })
                        }
                        value={moment(userInfo?.updated_on).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="add_user_form">
                <div className="row">                
                  <div className="text-end">
                    <div className="submit_btn">
                      {viewMode ? null : (
                        <>
                          <Link href="/media/PrintingCostMgmt">
                            <button className="btn btn-cancel m-3 ">
                              Cancel
                            </button>
                          </Link>
                          {editMode ? (
                            <button
                              disabled={isLoading}
                              className="btn btn-primary"
                              onClick={UpdateHandler}
                            >
                              {isLoading ? "Loading..." : "Update"}
                            </button>
                          ) : (
                            <button
                              disabled={isLoading}
                              className="btn btn-primary"
                              onClick={submitHandler}
                            >
                              {isLoading ? "Loading..." : "Save & Submit"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrintingCostScreen;
