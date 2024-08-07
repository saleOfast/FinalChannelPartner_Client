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

  const getSingleAccountsList = async (acc_id) => {
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
          Baseurl + `/db/account?acc_id=${acc_id}`,
          header
        );
        setSingleAccount(response?.data?.data);
        // setUserInfo({
        //     ...userInfo,
        //     mailing_cont: response?.data?.data?.ship_cont,
        //     mailing_state: response? .data?.data?.ship_state,
        //     mailing_city: response? .data?.data?.ship_city,
        //     mailing_address: response? .data?.data?.ship_address,
        //     mailing_pincode: response? .data?.data?.ship_pincode,
        // })
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          account_name: response?.data?.data?.acc_id,
          contact_no: response?.data?.data?.contact_no,
          mailing_cont: response?.data?.data?.ship_cont,
          mailing_state: response?.data?.data?.ship_state,
          mailing_city: response?.data?.data?.ship_city,
          mailing_address: response?.data?.data?.ship_address,
          mailing_pincode: response?.data?.data?.ship_pincode,
        }));
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
    if (ac_id) {
      getSingleAccountsList(ac_id);
    }
  }, [ac_id]);

  const getSingleData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 29,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/contacts?c_id=${id}`,
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
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 319,
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
          await postFieldsFunc(
            response.data.data.contact_id,
            userInfo.db_contact_fields
          );
          toast.success(response.data.message);
          setisLoading(false);
          // router.push("/media/Contacts");
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

  // const submitHandler = async () => {
  //   if (hasCookie("token")) {
  //     setisLoading(true);
  //     let token = getCookie("token");
  //     let db_name = getCookie("db_name");

  //     let header = {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer ".concat(token),
  //         db: db_name,
  //         m_id: 319,
  //       },
  //     };

  //     let oppBody = { ...userInfo };
  //     oppBody.contact_owner = loginDetails.user_id;
  //     try {
  //       const response = await axios.post(
  //         Baseurl + `/db/contacts`,
  //         oppBody,
  //         header
  //       );
  //       if (response.status === 204 || response.status === 200) {
  //         await postFieldsFunc(
  //           response.data.data.contact_id,
  //           userInfo.db_contact_fields
  //         );
  //         toast.success(response.data.message);
  //         setisLoading(false);
  //         // router.push("/media/Contacts");
  //       }
  //     } catch (error) {
  //       if (error?.response?.data?.status === 422) {
  //         const taskObject = {};
  //         const array = error?.response?.data?.data;
  //         for (let i = 0; i < array.length; i++) {
  //           const key = Object.keys(array[i])[0];
  //           const value = Object.values(array[i])[0];
  //           taskObject[key] = value;
  //         }
  //         setErrorData(taskObject);
  //       }
  //       if (error?.response?.data?.message) {
  //         toast.error(error.response.data.message);
  //       } else {
  //         toast.error("Something went wrong!");
  //       }
  //       setisLoading(false);
  //     }
  //   } else {
  //     toast.error("Please fill the Mandatory fileds");
  //   }
  // };

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
          m_id: 321,
        },
      };

      let newUserInfo = { ...userInfo, updated_on: DateNow };

      let newData = JSON.parse(JSON.stringify(newUserInfo));

      try {
        const response = await axios.put(
          Baseurl + `/db/contacts`,
          newData,
          header
        );

        if (response.status === 200 || response.status === 204) {
          await postFieldsFunc(newData.contact_id, newData.db_contact_fields);
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/media/Contacts");
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

  const createInputField = (e) => {
    e.preventDefault();
    const { field_lable, input_type, field_type, field_size, option } =
      newFields;

    const showError = (errorMessage) => {
      toast.error(errorMessage);
    };

    const validateField = () => {
      if (!field_lable) {
        showError("Please enter the Field Name");
        return false;
      } else if (!input_type) {
        showError("Please select the Input Type");
        return false;
      } else if (input_type === "input" && !field_type) {
        showError("Please select the Field Type");
        return false;
      }
      // else if (input_type === 'input' && !field_size  && field_type !== 'checkbox' && field_type !== 'date') {
      //     showError('Please Enter Field Size');
      //     return false;
      // }
      else if (input_type === "select" && !option) {
        showError("Please select input Options");
        return false;
      }
      return true;
    };

    if (validateField()) {
      const inputReq = {
        ...newFields,
        field_name: field_lable.replaceAll(" ", "_"),
        navigate_type: userInfo.navigate_type,
        // field_order: inputsData.length + 1
      };
      let arr = userInfo;
      arr.db_contact_fields.push(newFields);
      setUserInfo(arr);
      setiscollapse(!iscollapse);
      setNewFields({
        field_lable: null,
        input_type: null,
        field_type: null,
        option: null,
        field_size: null,
      });
    }
  };

  async function postFieldsFunc(id, data) {
    if (hasCookie("token")) {
      setisLoading(true);
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
      data?.map((item) => {
        item.contact_id = id;
      });

      try {
        const response = await axios.post(
          Baseurl + `/db/contacts/field`,
          data,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false);
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
    }
  }

  const AddFieldsFunc = (e) => {
    e.preventDefault();
    setiscollapse(true);
  };

  const inputClass = (value) => {
    const inputClasses = {
      text: "form-control",
      date: "form-control",
      email: "form-control",
      number: "form-control",
      checkbox: "form-check-input ms-3",
    };
    return inputClasses[value] || "";
  };

  const updateFieldInfo = (e, ind) => {
    let newData = JSON.parse(JSON.stringify(userInfo));

    if (newData.db_contact_fields[ind].field_type === "checkbox") {
      newData.db_contact_fields[ind].input_value = e.target.checked;
    } else {
      newData.db_contact_fields[ind].input_value = e.target.value;
    }

    // newData.db_contact_fields[ind].input_value = e.target.value
    setUserInfo(newData);
    console.log("here", e.target.value);
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

  useEffect(() => {
    if (userInfo.account_name !== null && !editMode) {
      // call the api with this acoount name
      getSingleAccountsList(userInfo.account_name);
    }
  }, [userInfo.account_name]);

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

                  {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.account_name
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Account Name *</label>
                      <Select
                        id={userInfo.task_status_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={accountsList?.map((data, index) => {
                          return {
                            value: data?.acc_id,
                            label: data?.acc_name,
                          };
                        })}
                        value={accountsList?.map((data, index) => {
                          if (userInfo.account_name === data.acc_id) {
                            return {
                              value: data?.acc_id,
                              label: data?.acc_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, account_name:e.value,acc_id:e.value });
                          setErrorData({ ...errorData, account_name: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.account_name ? errorData.account_name : ""}
                      </span>
                    </div>
                  </div> */}

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
      options={accountsList?.map((data) => {
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
        setErrorData({ ...errorData, account_name: "" });
      }}
    />
    <span className="errorText">
      {errorData?.account_name ? errorData.account_name : ""}
    </span>
  </div>
</div>







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

                  {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.status ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="site_status">Status</label>
                      <Select
                        id="site_status"
                        isDisabled={viewMode}
                        defaultValue=""
                        options={[
                          { value: "active", label: "Active" },
                          { value: "inactive", label: "Inactive" },
                        ]}
                        value={{
                          value: userInfo?.status,
                          label:
                            userInfo?.status === "active"
                              ? "Active"
                              : "Inactive",
                        }}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            status: e.value,
                          });
                          setErrorData({ ...errorData, status: "" });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.status ? errorData.status : ""}
                      </span>
                    </div>
                  </div> */}


<div className="col-xl-3 col-md-3 col-sm-12 col-12">
  <div
    className={
      errorData?.status ? "input_box errorBox" : "input_box"
    }
  >
    <label htmlFor="site_status">Status</label>
    <Select
      id="site_status"
      isDisabled={viewMode}
      defaultValue={{ value: "active", label: "Active" }}  
      options={[
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ]}
      value={
        userInfo?.status
          ? {
              value: userInfo.status,
              label: userInfo.status === "active" ? "Active" : "Inactive",
            }
          : { value: "active", label: "Active" }
      }
      onChange={(e) => {
        setUserInfo({
          ...userInfo,
          status: e.value,
        });
        setErrorData({ ...errorData, status: "" });
      }}
    />
    <span className="errorText">
      {errorData?.status ? errorData.status : ""}
    </span>
  </div>
</div>

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
                  {userInfo.db_contact_fields?.map(
                    (
                      {
                        option,
                        field_name,
                        field_lable,
                        field_type,
                        input_type,
                        input_value,
                      },
                      ind
                    ) => (
                      <div
                        className="col-xl-3 col-md-3 col-sm-12 col-12"
                        key={ind}
                      >
                        <div className="input_box">
                          <label htmlFor={field_name + ind}>
                            {" "}
                            {field_lable}{" "}
                          </label>
                          {input_type === "input" ? (
                            <input
                              type={field_type}
                              className={inputClass(field_type)}
                              id={field_name + ind}
                              disabled={viewMode}
                              name={field_name}
                              placeholder={field_lable}
                              onChange={(e) => updateFieldInfo(e, ind)}
                              checked={input_value == "1" ? true : false}
                              value={input_value}
                            />
                          ) : null}
                          {input_type === "select" ? (
                            <select
                              onChange={(e) => updateFieldInfo(e, ind)}
                              name={field_name}
                              id={field_name + ind}
                              className="form-control"
                              value={input_value}
                              disabled={viewMode}
                            >
                              <option value="">Select {field_lable}</option>
                              {option?.split(",").map((data, i) => (
                                <option value={data} key={i}>
                                  {data}
                                </option>
                              ))}
                            </select>
                          ) : null}
                        </div>
                      </div>
                    )
                  )}

                  {/* <div className="btn-box">
                                <button
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    onClick={postFieldsFunc} 
                                    >
                                    {isLoading ? 'Loading...' : 'Save & Submit'}
                                </button>
                            </div> */}

                  {iscollapse && (
                    <div className="addFieldsForm py-5">
                      <div className="row">
                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                          <div className="input_box">
                            <label htmlFor="newFieldName">Field Name</label>
                            <input
                              type="text"
                              className="form-control"
                              id="newFieldName"
                              disabled={viewMode}
                              placeholder="Field Name"
                              onChange={(e) =>
                                setNewFields({
                                  ...newFields,
                                  field_lable: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                          <div className="input_box">
                            <label htmlFor="newFieldType">Field Type</label>
                            <select
                              name="newFieldType"
                              className="form-control"
                              disabled={viewMode}
                              id="newFieldType"
                              onChange={(e) =>
                                setNewFields({
                                  ...newFields,
                                  input_type: e.target.value,
                                })
                              }
                            >
                              <option>Select Field Type</option>
                              <option value="input">Input Box</option>
                              <option value="select">Select Box</option>
                            </select>
                          </div>
                        </div>

                        {newFields.input_type === "input" && (
                          <>
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="newInputType">Input Type</label>
                                <select
                                  name="newInputType"
                                  className="form-control"
                                  disabled={viewMode}
                                  onChange={(e) =>
                                    setNewFields({
                                      ...newFields,
                                      field_type: e.target.value,
                                    })
                                  }
                                  id="newInputType"
                                >
                                  <option>Select Input Type</option>
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="checkbox">Checkbox</option>
                                  <option value="number">Number</option>
                                  <option value="date">Date</option>
                                </select>
                              </div>
                            </div>
                            {/* <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                            <div className="input_box">
                                                                <label htmlFor='field_size'>Field Size</label>
                                                                <input
                                                                    type='number'
                                                                    name="field_size"
                                                                    disabled={viewMode}
                                                                    className='form-control'
                                                                    placeholder='Enter field size'
                                                                    id="field_size"
                                                                    onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value })}
                                                                />
                                                            </div>
                                                        </div> */}
                          </>
                        )}
                        {/* {
                                                    newFields.input_type === 'input' && (newFields?.field_type==="text" ||  newFields?.field_type==="email" || newFields?.field_type==="number") && (
                                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                    <div className="input_box">
                                                        <label htmlFor='field_size'>Field Size</label>
                                                        <input
                                                        type='number'
                                                        name="field_size"
                                                        className='form-control'
                                                        placeholder='Enter field size'
                                                        id="field_size"
                                                        onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value })}
                                                        />
                                                    </div>
                                                    </div>
                                                    )
                                                } */}

                        {newFields.input_type === "select" && (
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor="newKeywords">
                                Select Keywords
                              </label>
                              <input
                                type="text"
                                name="newKeywords"
                                disabled={viewMode}
                                className="form-control"
                                placeholder="e.g. Name, age, gender"
                                id="newKeywords"
                                onChange={(e) =>
                                  setNewFields({
                                    ...newFields,
                                    option: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="btn-row my-4">
                        {/* <button onClick={"AddFieldsFunc"} className="btn btn-light me-3">Cancel</button> */}
                        <button
                          onClick={createInputField}
                          className="btn btn-success"
                        >
                          Create Field
                        </button>
                      </div>
                    </div>
                  )}
                  <div className="text-end">
                    <div className="submit_btn">
                      {/* {viewMode ? null : (
                        <div className="add_screen_head">
                          <span className="text_bold">
                            <button
                              className="btn btn-primary "
                              onClick={AddFieldsFunc}
                            >
                              {" "}
                              Add More Fields
                            </button>{" "}
                          </span>
                        </div>
                      )} */}
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

            <div className="col-xl-3 col-md-3 col-sm-12 col-12 sideCardAdd">
              {viewMode ? (
                <div className="opertunity_box">
                  <div className="task_card mb-4">
                    <div className="task_head">Lead List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.db_leads?.map(
                          ({ lead_id, lead_name }, i) => {
                            return (
                              <li key={lead_id} className="list-item">
                                <div className="opp_box">
                                  <Link href={`/media/LeadsView?id=${lead_id}`}>
                                    <div className="name">{lead_name}</div>
                                  </Link>
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="card_footer">
                      <Link href="/media/ManageLeads">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}

              {viewMode ? (
                <div className="opertunity_box">
                  <div className="task_card mb-4">
                    <div className="task_head">Account List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.db_leads
                          ?.reduce((acc, lead) => {
                            if (
                              !acc.some(
                                (account) =>
                                  account.acc_id === lead.db_account.acc_id
                              )
                            ) {
                              acc.push(lead.db_account);
                            }
                            return acc;
                          }, [])
                          .map((account, i) => (
                            <li key={i} className="list-item">
                              <div className="opp_box">
                                <Link
                                  href={`/media/AddAccount?id=${account.acc_id}&vw=mds`}
                                >
                                  <div className="name">{account.acc_name}</div>
                                </Link>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="card_footer">
                      <Link href="/media/Accounts">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}

              {viewMode ? (
                <div className="opertunity_box">
                  <div className="task_card mb-4">
                    <div className="task_head">Opportunity List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.db_leads
                          ?.reduce((acc, lead) => {
                            if (
                              !acc.some(
                                (opportunity) =>
                                  opportunity.opp_id ===
                                  lead.db_opportunity.opp_id
                              )
                            ) {
                              acc.push(lead.db_opportunity);
                            }
                            return acc;
                          }, [])
                          .map((opportunity, i) => (
                            <li key={i} className="list-item">
                              <div className="opp_box">
                                <Link
                                  href={`/media/OpportunityView?id=${opportunity.opp_id}`}
                                >
                                  <div className="name">
                                    {opportunity.opp_name}
                                  </div>
                                </Link>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="card_footer">
                      <Link href="/media/Opportunity">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrintingCostScreen;
