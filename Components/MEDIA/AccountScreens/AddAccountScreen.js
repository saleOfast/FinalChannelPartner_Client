import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { validPhone, validZip ,validEmail} from "../../../Utils/regex";


import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import moment from "moment";

const AddAccountScreen = () => {
  const router = useRouter();
  const { id } = router.query;

  const sideView = useSelector((state) => state.sideView.value);

  const [countrylist, setcountrylist] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [usersList, setUsersLsit] = useState([]);
  const [gstinLastDIgit,setGstinLastDIgit] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [billStates, setBillStates] = useState([]);
  const [shipStates, setShipStates] = useState([]);
  const [shipCities, setShipCities] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [billingCities, setBillingCities] = useState([]);
  const [loginDetails, setloginDetails] = useState({});
  const [iscollapse, setiscollapse] = useState(false);
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });



  const [selected, setSelected] = useState({
    parent_id: "",
    parent_name: "",
  });

  const [userInfo, setUserInfo] = useState({
    acc_name: "",
    acc_owner: null,
    account_type_id: "",
    parent_id: "0",
    website: "",
    contact_no: "",
    phone_no: null,
    contact_no_fill: "",
    mobile_no: "",
    ind_id: null,
    emp_name: "",
    desc: "",
    bill_cont: "",
    state_id:"",
    bill_state: "",
    bill_city: "",
    bill_pincode: "",
    ship_cont: "",
    ship_state: "",
    ship_city: "",
    volume_deal_percentage: "",
    ship_pincode: "",
    ship_address: "",
    assigned_to: null,
    bill_address: "",
    createdAt: "",
    phone_no_contact:"",
    updatedAt: "",
    star_rating: null,
    contact_person: "",
    bank_name: "",
    ifsc_code: "",
    micr_code: "",
    contact_person_finance: "",
    designation_finance: "",
    mobile_finance: "",
    email_finance: "",
    credit_limit: "",
    cin_number: "",
    tan_number: "",
    pan_number: "",
    gstin_number: "",
    service_tax_number: "",
    bank_ac_no: "",
    contact_email: "",
    debit_note: null,
    credit_note: null,
    volume_deal_agreement: null,
    email_id: "",
    db_acc_fields: [],
  });

  const getBillCity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setBillingCities(data.cityData),
      errorToast,
      setErrorToast
    );
  };
  const getShipCity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setShipCities(data.cityData),
      errorToast,
      setErrorToast
    );
  };

  const getCountryList = async () => {
    await fetchData(
      `/db/area/country?bill_cont=1`,
      setcountrylist,
      errorToast,
      setErrorToast
    );
  };

  const getShipState = async (id) => {
    await fetchData(
      `/db/area/states?cnt_id=${id}`,
      setShipStates,
      errorToast,
      setErrorToast
    );
  };

  const getBillState = async (id) => {
    await fetchData(
      `/db/area/states?cnt_id=${id}`,
      setBillStates,
      errorToast,
      setErrorToast
    );
  };

  async function getAccountType() {
    await fetchData(
      `/db/account/type?platform_id=5`,
      setAccountTypes,
      errorToast,
      setErrorToast
    );
  }

  async function getParentAccount() {
    await fetchData(
      `/db/account/tree`,
      setAccountsList,
      errorToast,
      setErrorToast
    );
  }

  async function getIndustriesList() {
    await fetchData(`/db/industry`, setIndustryList, errorToast, setErrorToast);
  }

  const submitHandler = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!userInfo?.email_id || !emailPattern.test(userInfo.email_id)) {
    toast.error("Invalid email address");
    return; 
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
          m_id: 312,
        },
      };

      let oppBody = { ...userInfo,platform_id:5};
      oppBody.acc_owner = loginDetails.user_id;
      try {
        const response = await axios.post(
          Baseurl + `/db/account`,
          oppBody,
          header
        );
        if (response.status === 204 || response.status === 200) {
          await postFieldsFunc(
            response.data.data.acc_id,
            oppBody.db_acc_fields
          );
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/media/Accounts");
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
      toast.error("Please fill the Mandatory fields");
    }
  };

  const UpdateHandler = async () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!userInfo?.email_id || !emailPattern.test(userInfo.email_id)) {
      toast.error("Invalid email address");
      return; 
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
          m_id: 314,
        },
      };
      userInfo.platform_id =5
      try {
        const response = await axios.put(
          Baseurl + `/db/account`,
          userInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          await postFieldsFunc(userInfo.acc_id, userInfo.db_acc_fields);
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/media/Accounts");
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
      toast.error("Please fill the Mandatory fields");
    }
  };

  const getAccountFieldList = async () => {
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
          Baseurl + `/db/field?nav_type=accounts`,
          header
        );
        setUserInfo({ ...userInfo, db_acc_fields: response.data.data });
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const createInputField = (e) => {
    e.preventDefault();
    const { field_lable, input_type, field_type, option, field_size } =
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
      //   showError('Please Enter Field Size');
      //   return false;
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
      let arr = JSON.parse(JSON.stringify(userInfo));
      if (arr.db_acc_fields == undefined) arr.db_acc_fields = [];
      arr.db_acc_fields.push(newFields);
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
        },
      };
      data?.map((item) => {
        item.acc_id = id;
      });
      try {
        const response = await axios.post(
          Baseurl + `/db/account/field`,
          data,
          header
        );
        if (response.status === 204 || response.status === 200) {
          // toast.success(response.data.message);
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
    if (newData.db_acc_fields[ind].field_type === "checkbox") {
      newData.db_acc_fields[ind].input_value = e.target.checked;
    } else {
      newData.db_acc_fields[ind].input_value = e.target.value;
    }
    setUserInfo(newData);
  };

  const getSingleData = async (id) => {
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
          Baseurl + `/db/account?acc_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
        setGstinLastDIgit(response.data.data.gstin_number.slice(-3));
        console.log("setget ",gstinLastDIgit)
        setSelected({
          ...selected,
          parent_id: response?.data?.data?.parent_id,
          parent_name: response?.data?.data?.parent_name,
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

  const getusersList = async () => {
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
        let url;
        if (loginDetails?.isDB == true) {
          url = Baseurl + "/db/users?mode=ul";
        } else {
          url = Baseurl + "/db/users";
        }
        const response = await axios.get(url, header);
        setUsersLsit(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  function SelectparentAcc(e, accountsList, obj = []) {
    let arrData = parentHandlerId(e, accountsList, (obj = []));
    const object = arrData.find((net) => net.acc_id == e.value);
    if (object) {
      setSelected({
        ...selected,
        parent_id: object.acc_id,
        parent_name: object.acc_name,
      });
      setUserInfo({
        ...userInfo,
        parent_id: e.value,
        parent_name: object.acc_name,
      });
    } else {
      setSelected({ ...selected, parent_name: "" });
      setUserInfo({ ...userInfo, parent_id: "0", parent_name: null });
    }
  }

  function parentHandlerId(e, dataList, obj = []) {
    let arr = [];
    dataList.map((item) => {
      arr.push({
        acc_id: item.acc_id,
        acc_name: item.acc_name,
      });
      if (item.children.length > 0) {
        return parentHandlerId(e, item.children, arr);
      }
    });

    return arr;
  }

  function checkChildrens(data, space = 0, i = 0) {
    space += 1;
    let spaces = "";
    for (let i = 0; i < space; i++) {
      spaces += "\u00A0";
    }
    if (data?.length > 0) {
      return data?.map(({ acc_id, acc_name, children }) => {
        return (
          <>
            {" "}
            <option key={acc_id} name={acc_name} value={acc_id}>
              {spaces} {acc_name}
            </option>
            {checkChildrens(children, space)}
          </>
        );
      });
    }
  }

  function checkLogin() {
    if (hasCookie("userInfo")) {
      let token = getCookie("userInfo");
      let data = JSON.parse(token);
      setloginDetails(data);
      setUserInfo({ ...userInfo, opp_owner: data.user_id });
    }
  }

  function copyAddress(e) {
    const value = e.target.checked;
    if (value) {
      setUserInfo({
        ...userInfo,
        ship_cont: userInfo?.bill_cont,
        ship_state: userInfo?.bill_state,
        ship_city: userInfo?.bill_city,
        ship_pincode: userInfo?.bill_pincode,
        ship_address: userInfo?.bill_address,
      });
    } else {
      setUserInfo({
        ...userInfo,
        ship_cont: "",
        ship_state: "",
        ship_city: "",
        ship_pincode: "",
        ship_address: "",
      });
    }
    setErrorData({
      ...errorData,
      ship_cont: "",
      ship_state: "",
      ship_city: "",
      ship_pincode: "",
    });
  }

  useEffect(() => {
    getCountryList();
    getAccountType();
    getParentAccount();
    getusersList();
    checkLogin();
    getIndustriesList();
  }, []);

  useEffect(() => {
    if (!userInfo.bill_cont) {
      return;
    } else {
      getBillState(userInfo.bill_cont);
    }
  }, [userInfo.bill_cont]);

  useEffect(() => {
    if (!userInfo.ship_cont) {
      return;
    } else {
      getShipState(userInfo.ship_cont);
    }
  }, [userInfo.ship_cont]);

  useEffect(() => {
    if (!userInfo.bill_state) {
      return;
    } else {
      getBillCity(userInfo.bill_state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.bill_state]);

  useEffect(() => {
    if (!userInfo.ship_state) {
      return;
    } else {
      getShipCity(userInfo.ship_state);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.ship_state]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    } else {
      if (userInfo !== undefined) {
        getAccountFieldList();
      }
    }

    if (router.query.vw) [setViewMode(true)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, id]);

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
    if (userInfo.email_id && !validEmail.test(userInfo.email_id)) {
      setErrorData({ ...errorData, email_id: "invalid Email" });
    } else {
      setErrorData({ ...errorData, email_id: "" });
    }
  }, [useDebounce(userInfo.email_id, 1000)]);


  
  useEffect(() => {
    if (userInfo.email_finance && !validEmail.test(userInfo.email_finance)) {
      setErrorData({ ...errorData, email_finance: "invalid Email" });
    } else {
      setErrorData({ ...errorData, email_finance: "" });
    }
  }, [useDebounce(userInfo.email_finance, 1000)]);


  const [stateCode, setStateCode] = useState("");

  // Update the state code when the billing state changes
  useEffect(() => {
    const selectedState = billStates.find(state => state.state_id === userInfo.bill_state);
    if (selectedState) {
      setStateCode(selectedState.state_code); // Assuming you have state_code in your billStates data
    } else {
      setStateCode("");
    }
  }, [userInfo.bill_state, billStates,setStateCode,stateCode]);



  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} ACCOUNT
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/media">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/media/Accounts"> Account List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? "View" : <>{editMode ? "Edit" : "Add"}</>} Account
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
                        errorData?.acc_name ? "input_box errorBox" : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="acc_name"> Name *</label>
                        <input
                          type="text"
                          placeholder="Enter Account Name"
                          name="name"
                          disabled={viewMode}
                          id="acc_name"
                          className={
                            errorData?.acc_name
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     acc_name: e.target.value,
                          //   });
                          //   setErrorData({ ...errorData, acc_name: "" });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            const isValid = /^[a-zA-Z\s]*$/.test(value); 
                  
                            if (isValid) {
                              setUserInfo({
                                ...userInfo,
                                acc_name: value,
                              });
                              setErrorData({ ...errorData, acc_name: "" });
                            } else {
                              setErrorData({
                                ...errorData,
                                acc_name: "Name cannot contain numbers",
                              });
                            }
                          }}
                          value={userInfo.acc_name ? userInfo.acc_name : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.acc_name ? errorData.acc_name : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.email_id ? "input_box errorBox" : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="Email"> Email *</label>
                        <input
                          type="email"
                          placeholder="Enter Email Id"
                          name="email"
                          disabled={viewMode}
                          id="Email"
                          className={
                            errorData?.email_id
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              email_id: e.target.value,
                            });
                            setErrorData({ ...errorData, email_id: "" });
                          }}
                          value={userInfo.email_id ? userInfo.email_id : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.email_id ? errorData.email_id : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.acc_owner
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="acc_owner">Owner *</label>
                      {loginDetails?.isDB == true ? (
                        <input
                          type="text"
                          name="opp_owner"
                          disabled
                          placeholder="Contact Owner Name"
                          id="opp_owner"
                          className="form-control"
                          value={loginDetails.user ? loginDetails.user : ""}
                        />
                      ) : (
                        <input
                          type="text"
                          name="opp_owner"
                          disabled
                          placeholder="Contact Owner Name"
                          id="opp_owner"
                          className="form-control"
                          value={loginDetails.user ? loginDetails.user : ""}
                        />
                      )}
                      <span className="errorText">
                        {" "}
                        {errorData?.acc_owner ? errorData.acc_owner : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.task_priority_id
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Type *</label>
                      <Select
                        id={userInfo.task_priority_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={accountTypes?.map((data, index) => {
                          return {
                            value: data?.account_type_id,
                            label: data?.account_type_name,
                          };
                        })}
                        value={accountTypes?.map((data, index) => {
                          if (
                            userInfo.account_type_id === data.account_type_id
                          ) {
                            return {
                              value: data?.account_type_id,
                              label: data?.account_type_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            account_type_id: e.value,
                          });
                          setErrorData({ ...errorData, account_type_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.account_type_id
                          ? errorData.account_type_id
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.task_priority_id
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Parent Account</label>
                      <Select
                        id={userInfo.task_priority_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={accountsList?.map((data, index) => {
                          return {
                            value: data?.acc_id,
                            label: data?.acc_name,
                          };
                        })}
                        value={accountsList?.map((data, index) => {
                          if (userInfo.parent_id == data.acc_id) {
                            return {
                              value: data?.acc_id,
                              label: data?.acc_name,
                            };
                          }
                        })}
                        onChange={(e) => SelectparentAcc(e, accountsList)}
                      />
                    </div>
                  </div>

                  {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box option_tree">
                      <p className="label_subs">Parent Account</p>
                      <div className="select_wrapper">
                        <label className={viewMode ? 'option_select disabled' : 'option_select'} htmlFor="parent_id">
                          {selected.parent_name ? selected.parent_name : 'Select parent'}
                        </label>
                        <select
                          name="parent_id" id="parent_id"
                          onChange={(e) => SelectparentAcc(e, accountsList)}
                          className='form-control'
                          disabled={viewMode}
                        >
                          <option value="0">Select parent</option>
                          {accountsList?.map(({ children, acc_id, acc_name }, i) => {
                            return (<>
                              <option key={acc_id} name={acc_name} value={acc_id}> {acc_name} </option>
                              {checkChildrens(children, acc_id, i)}
                            </>
                            )
                          })}
                        </select>
                      </div>

                    </div>
                  </div> */}

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Website">Website</label>
                      <input
                        type="text"
                        name="Website"
                        placeholder="Enter Website "
                        id="Website"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, website: e.target.value })
                        }

                      
                        value={userInfo.website ? userInfo.website : ""}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact_no
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="contact_no">Mobile No *</label>
                      <input
                        type="text"
                        name="contact_no"
                        placeholder="Enter Contact No."
                        id="contact_no"
                        disabled={viewMode}
                        className={
                          errorData?.contact_no ? "form-control is-invalid" : "form-control"
                        }
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   const isValid = /^\d{0,10}$/.test(value); // Allows only up to 10 digits
                        //   if (isValid) {
                        //     setUserInfo({
                        //       ...userInfo,
                        //       contact_no: value,
                        //     });
                        //     setErrorData({ ...errorData, contact_no: "" });
                        //   }
                        // }}
                        // onChange={(e) => {
                        //   const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digit characters
                        //   if (value.length <= 10) { // Ensure length does not exceed 10 digits
                        //     setUserInfo({
                        //       ...userInfo,
                        //       contact_no: value,
                        //     });
                        //     setErrorData({ ...errorData, contact_no: "" });
                        //   }
                        // }}

                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digit characters
                          if (value.length <= 10) {
                            setUserInfo({
                              ...userInfo,
                              contact_no: value,
                            });
                            setErrorData({ ...errorData, contact_no: "" });
                          } else {
                            setErrorData({ ...errorData, contact_no: "Mobile number cannot exceed 10 digits." });
                          }
                  
                          if (e.target.value !== value) {
                            setErrorData({ ...errorData, contact_no: "Mobile number can only contain digits." });
                          }
                        }}
                        value={userInfo.contact_no ? userInfo.contact_no : ""}
                      />

                      <span className="errorText">
                        {" "}
                        {errorData?.contact_no ? errorData.contact_no : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.phone_no ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="phone_no">Phone No</label>
                      <input
                        type="number"
                        name="phone_no"
                        placeholder="Enter Contact No."
                        id="phone_no"
                        disabled={viewMode}
                        className={
                          errorData?.phone_no
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   const isValid = /^\d{0,10}$/.test(value); // Allows only up to 10 digits
                        //   if (isValid) {
                        //     setUserInfo({
                        //       ...userInfo,  
                        //       phone_no: value,
                        //     });
                        //     setErrorData({ ...errorData, phone_no: "" });
                        //   }
                        // }}

                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digit characters
                          if (value.length <= 10) {
                            setUserInfo({
                              ...userInfo,
                              phone_no: value,
                            });
                            setErrorData({ ...errorData, phone_no: "" });
                          } else {
                            setErrorData({ ...errorData, phone_no: "Phone number cannot exceed 10 digits." });
                          }
                  
                          if (e.target.value !== value) {
                            setErrorData({ ...errorData, phone_no: "Phone number can only contain digits." });
                          }
                        }}
                        value={userInfo.phone_no ? userInfo.phone_no : null}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.phone_no ? errorData.phone_no : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ind_id ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Industry *</label>
                      <Select
                        id={userInfo.ind_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={industryList?.map((data, index) => {
                          return {
                            value: data?.ind_id,
                            label: data?.industry,
                          };
                        })}
                        value={industryList?.map((data, index) => {
                          if (userInfo.ind_id === data.ind_id) {
                            return {
                              value: data?.ind_id,
                              label: data?.industry,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ind_id: e.value });
                          setErrorData({ ...errorData, ind_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.ind_id ? errorData.ind_id : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Employee">Employee</label>
                      <input
                        type="text"
                        name="Employee"
                        id="Employee"
                        disabled={viewMode}
                        placeholder="Enter Employee"
                        // className="form-control"
                        // onChange={(e) =>
                        //   setUserInfo({ ...userInfo, emp_name: e.target.value })
                        // }
                        className={
                          errorData?.emp_name ? "form-control is-invalid" : "form-control"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          // Regex to allow only letters and spaces
                          const isValidEmployee = /^[a-zA-Z\s]*$/.test(value);
              
                          if (isValidEmployee || value === "") { // Allow empty value
                            setUserInfo({
                              ...userInfo,
                              emp_name: value,
                            });
                            setErrorData({ ...errorData, emp_name: "" });
                          } else {
                            setErrorData({
                              ...errorData,
                              emp_name: "Employee cannot contain numbers",
                            });
                          }
                        }}
                        value={userInfo.emp_name ? userInfo.emp_name : ""}
                      />
                          <span className="errorText">
          {errorData?.emp_name || ""}
        </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="StarRating">Star Rating</label>
                      <input
                        type="number"
                        name="StarRating"
                        id="StarRating"
                        disabled={viewMode}
                        placeholder="Enter Star Rating"
                        // className="form-control"
                        // onChange={(e) => {
                        //   const value = e.target.value;
                        //   const isValid = /^\d{0,1}$/.test(value); // Allows only up to 10 digits
                        //   if (isValid) {
                        //     setUserInfo({
                        //       ...userInfo,
                        //       star_rating: value,
                        //     });
                        //     setErrorData({ ...errorData, star_rating: "" });
                        //   }
                        // }}

                        className={
                          errorData?.star_rating ? "form-control is-invalid" : "form-control"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          const isValid = /^[0-5]?$/.test(value); // Allows only numbers 1 to 5
              
                          if (isValid) {
                            setUserInfo({
                              ...userInfo,
                              star_rating: value,
                            });
                            setErrorData({ ...errorData, star_rating: "" });
                          } else {
                            setErrorData({
                              ...errorData,
                              star_rating: "Rating must be between 0 and 5",
                            });
                          }
                        }}
                        value={userInfo.star_rating ? userInfo.star_rating : ""}
                      />
                         <span className="errorText">
          {errorData?.star_rating || ""}
        </span>
                    </div>
                  </div>

                  {editMode ? (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.assigned_to
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="task_name">Assign To </label>
                        <Select
                          id={userInfo.assigned_to}
                          defaultValue={""}
                          isDisabled={viewMode}
                          options={usersList?.map((data, index) => {
                            return {
                              value: data?.user_id,
                              label: data?.user,
                            };
                          })}
                          value={usersList?.map((data, index) => {
                            if (userInfo.assigned_to === data.user_id) {
                              return {
                                value: data?.user_id,
                                label: data?.user,
                              };
                            }
                          })}
                          onChange={(e) => {
                            setUserInfo({ ...userInfo, assigned_to: e.value });
                            setErrorData({ ...errorData, assigned_to: "" });
                          }}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.assigned_to ? errorData.assigned_to : ""}
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="acc_desc">Description</label>
                      <textarea
                        name="acc_desc"
                        placeholder="Enter Description"
                        id="acc_desc"
                        rows="2"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, desc: e.target.value })
                        }
                        value={userInfo.desc ? userInfo.desc : ""}
                      ></textarea>
                    </div>
                  </div> */}
                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">Contact Details </span>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact_person
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="contact_person"> Contact Person</label>
                        <input
                          type="text"
                          placeholder="Enter Contact Person"
                          name="contact_person"
                          disabled={true}
                          id="contact_person"
                          className={
                            errorData?.contact_person
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              contact_person: e.target.value,
                            });
                            setErrorData({ ...errorData, contact_person: "" });
                          }}
                          value={
                            userInfo.contact_person
                              ? userInfo.contact_person
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.contact_person
                            ? errorData.contact_person
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact_email
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="Email"> Email </label>
                        <input
                          type="text"
                          placeholder="Enter Email Id"
                          name="email"
                          disabled={true}
                          id="Email"
                          className={
                            errorData?.contact_email
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              contact_email: e.target.value,
                            });
                            setErrorData({ ...errorData, contact_email: "" });
                          }}
                          value={
                            userInfo.contact_email ? userInfo.contact_email : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.contact_email
                            ? errorData.contact_email
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.mobile_no
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="mobile_no">Mobile</label>
                      <input
                        type="text"
                        name="mobile_no"
                        placeholder="Enter Mobile No."
                        id="mobile_no"
                        disabled={true}
                        className={
                          errorData?.mobile_no
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            mobile_no: e.target.value,
                          });
                          setErrorData({ ...errorData, mobile_no: "" });
                        }}
                        value={userInfo.mobile_no ? userInfo.mobile_no : ""}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.mobile_no ? errorData.mobile_no : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.phone_no_contact ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="phone_no_contact">Phone</label>
                      <input
                        type="text"
                        name="phone_no_contact"
                        placeholder="Enter Phone No."
                        id="phone_no_contact"
                        disabled={true}
                        className={
                          errorData?.phone_no_contact
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            phone_no_contact: e.target.value,
                          });
                          setErrorData({ ...errorData, phone_no_contact: "" });
                        }}
                        value={userInfo.phone_no_contact ? userInfo.phone_no_contact : ""}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.phone_no_contact ? errorData.phone_no_contact : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">Billing & Shipping Address</span>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_cont
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing Country *</label>
                      <Select
                        id={userInfo.assigned_to}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={countrylist?.map((data, index) => {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,
                          };
                        })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.bill_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_cont: e.value });
                          setErrorData({ ...errorData, bill_cont: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_cont ? errorData.bill_cont : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_city
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing State *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billStates?.map((data, index) => {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,
                          };
                        })}
                        value={billStates?.map((data, index) => {
                          if (userInfo.bill_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_state: e.value });
                          setErrorData({ ...errorData, bill_state: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_state ? errorData.bill_state : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_city
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing City *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billingCities?.map((data, index) => {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,
                          };
                        })}
                        value={billingCities?.map((data, index) => {
                          if (userInfo.bill_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_city: e.value });
                          setErrorData({ ...errorData, bill_city: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_city ? errorData.bill_city : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_pincode
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="offc_no">Zip / Postal Code *</label>
                      <input
                        type="number"
                        placeholder="Zip / Postal Code"
                        name="pin-code"
                        disabled={viewMode}
                        id="offc_no"
                        className={
                          errorData?.bill_pincode
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          const isValid = /^\d{0,6}$/.test(value); // Allows only up to 10 digits
                          if (isValid) {
                            setUserInfo({
                              ...userInfo,
                              bill_pincode: value,
                            });
                            setErrorData({ ...errorData, bill_pincode: "" });
                          }
                        }}                        
                        value={
                          userInfo.bill_pincode ? userInfo.bill_pincode : ""
                        }
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_pincode ? errorData.bill_pincode : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="bill_address">Billing Address</label>
                      <textarea
                        type=""
                        placeholder="Enter Address"
                        name="bill_address"
                        id="bill_address"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            bill_address: e.target.value,
                          })
                        }
                        value={
                          userInfo?.bill_address ? userInfo.bill_address : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">Bank Details</span>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bank_name
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="bank_name"> Bank Name</label>
                        <input
                          type="text"
                          placeholder="Enter Bank Name"
                          name="bank_name"
                          disabled={viewMode}
                          id="bank_name"
                          className={
                            errorData?.bank_name
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     bank_name: e.target.value,
                          //   });
                          //   setErrorData({ ...errorData, bank_name: "" });
                          // }}

                          onChange={(e) => {
                            const newValue = e.target.value;
                            // Allow only alphabetic characters and spaces
                            if (/^[A-Za-z\s]*$/.test(newValue)) {
                              setUserInfo({
                                ...userInfo,
                                bank_name: newValue,
                              });
                              setErrorData({ ...errorData, bank_name: "" });
                            }
                          }}
                          value={userInfo.bank_name ? userInfo.bank_name : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.bank_name ? errorData.bank_name : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bank_ac_no
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="bank_ac_no"> Bank A/C No.</label>
                        <input
                          type="text"
                          placeholder="Enter Bank Account No."
                          name="bank_ac_no"
                          disabled={viewMode}
                          id="bank_ac_no"
                          className={
                            errorData?.bank_ac_no
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     bank_ac_no: e.target.value,
                          //   });
                          //   setErrorData({ ...errorData, bank_ac_no: "" });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Regex to allow only numbers
                            const isValidNumber = /^\d*$/.test(value);
                            
                            if (isValidNumber || value === "") {
                              setUserInfo({
                                ...userInfo,
                                bank_ac_no: value,
                              });
                              setErrorData({ ...errorData, bank_ac_no: "" });
                            } else {
                              setErrorData({
                                ...errorData,
                                bank_ac_no: "Invalid account number",
                              });
                            }
                          }}
                          value={userInfo.bank_ac_no ? userInfo.bank_ac_no : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.bank_ac_no ? errorData.bank_ac_no : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ifsc_code
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="ifsc_code">IFSC Code</label>
                        <input
                          type="text"
                          placeholder="Enter IFSC Code"
                          name="ifsc_code"
                          disabled={viewMode}
                          id="ifsc_code"
                          className={
                            errorData?.ifsc_code
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              ifsc_code: e.target.value,
                            });
                            setErrorData({ ...errorData, ifsc_code: "" });
                          }}
                          value={userInfo.ifsc_code ? userInfo.ifsc_code : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.ifsc_code ? errorData.ifsc_code : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.micr_code
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="micr_code">MICR Code</label>
                        <input
                          type="text"
                          placeholder="Enter MICR Code"
                          name="micr_code"
                          disabled={viewMode}
                          id="micr_code"
                          className={
                            errorData?.micr_code
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              micr_code: e.target.value,
                            });
                            setErrorData({ ...errorData, micr_code: "" });
                          }}
                          value={userInfo.micr_code ? userInfo.micr_code : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.micr_code ? errorData.micr_code : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.credit_limit
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="credit_limit">Credit Limit</label>
                        <input
                          type="text"
                          placeholder="Enter Credit Limit"
                          name="credit_limit"
                          disabled={viewMode}
                          id="credit_limit"
                          className={
                            errorData?.credit_limit
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     credit_limit: e.target.value,
                          //   });
                          //   setErrorData({ ...errorData, credit_limit: "" });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Validate that the value is a valid number (allow empty value)
                            const isValidNumber = /^\d*\.?\d*$/.test(value);
              
                            if (isValidNumber || value === "") {
                              setUserInfo({
                                ...userInfo,
                                credit_limit: value,
                              });
                              setErrorData({ ...errorData, credit_limit: "" });
                            } else {
                              setErrorData({
                                ...errorData,
                                credit_limit: "Invalid credit limit",
                              });
                            }
                          }}
                          value={
                            userInfo.credit_limit ? userInfo.credit_limit : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.credit_limit
                            ? errorData.credit_limit
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.cin_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="cin_number">CIN Number</label>
                        <input
                          type="text"
                          placeholder="Enter CIN Number"
                          name="cin_number"
                          disabled={viewMode}
                          id="cin_number"
                          className={
                            errorData?.cin_number
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              cin_number: e.target.value,
                            });
                            setErrorData({ ...errorData, cin_number: "" });
                          }}
                          value={userInfo.cin_number ? userInfo.cin_number : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.cin_number ? errorData.cin_number : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.tan_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="tan_number">TAN Number</label>
                        <input
                          type="text"
                          placeholder="Enter TAN Number"
                          name="tan_number"
                          disabled={viewMode}
                          id="tan_number"
                          className={
                            errorData?.tan_number
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              tan_number: e.target.value,
                            });
                            setErrorData({ ...errorData, tan_number: "" });
                          }}
                          value={userInfo.tan_number ? userInfo.tan_number : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.tan_number ? errorData.tan_number : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.pan_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="pan_number">PAN Number</label>
                        <input
                          type="text"
                          placeholder="Enter PAN Number"
                          name="pan_number"
                          disabled={viewMode}
                          id="pan_number"
                          className={
                            errorData?.pan_number
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              pan_number: e.target.value,
                            });
                            setErrorData({ ...errorData, pan_number: "" });
                          }}
                          value={userInfo.pan_number ? userInfo.pan_number : ""}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.pan_number ? errorData.pan_number : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.gstin_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="gstin_number">GSTIN Number</label>
                        <div className="input_box d-flex">
                          <input
                            type="text"
                            placeholder=""
                            name="state_code"
                            disabled={true}
                            value={userInfo.bill_state + userInfo.pan_number}
                            className="form-control"
                            style={{borderRight:0,borderTopRightRadius:0,borderBottomRightRadius:0,width:"70%" }}
                          />
                          <input
                            type="text"
                            placeholder=""
                            name="gstin_number"
                            disabled={viewMode}
                            id="gstin_number"
                            style={{borderLeft:0,borderTopLeftRadius:0,borderBottomLeftRadius:0,width:"30%"}}

                            // className={
                            //   errorData?.gstin_number
                            //     ? "form-control is-invalid"
                            //     : "form-control"
                            // }
                            className={errorData?.gstin_number ? "form-control is-invalid " : "form-control "}

                            onChange={(e) => {
                              const StateCode = userInfo.bill_state || '';
                              const PanNumber = userInfo.pan_number || '';
                              const newGstinNumber = StateCode + PanNumber + e.target.value;
                              setGstinLastDIgit(e.target.value);
                              setUserInfo({
                                ...userInfo,
                                gstin_number:newGstinNumber,
                              });
                              setErrorData({ ...errorData, gstin_number: "" });
                            }}
                            value={
                              // userInfo.gstin_number ? userInfo.gstin_number : ""
                              gstinLastDIgit ? gstinLastDIgit:""
                            }
                          />
                        </div>
                        <span className="errorText">
                          {" "}
                          {errorData?.gstin_number
                            ? errorData.gstin_number
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.service_tax_number
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="service_tax_number">
                          Service Tax Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Service Tax Number"
                          name="service_tax_number"
                          disabled={viewMode}
                          id="service_tax_number"
                          className={
                            errorData?.service_tax_number
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              service_tax_number: e.target.value,
                            });
                            setErrorData({
                              ...errorData,
                              service_tax_number: "",
                            });
                          }}
                          value={
                            userInfo.service_tax_number
                              ? userInfo.service_tax_number
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.service_tax_number
                            ? errorData.service_tax_number
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">Finance Section</span>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact_person_finance
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="contact_person_finance">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          placeholder="Enter  Contact Person"
                          name="contact_person_finance"
                          disabled={viewMode}
                          id="contact_person_finance"
                          className={
                            errorData?.contact_person_finance
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     contact_person_finance: e.target.value,
                          //   });
                          //   setErrorData({
                          //     ...errorData,
                          //     contact_person_finance: "",
                          //   });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Regex to allow only letters and spaces
                            const isValid = /^[a-zA-Z\s]*$/.test(value);
              
                            if (isValid || value === "") { // Allow empty value
                              setUserInfo({
                                ...userInfo,
                                contact_person_finance: value,
                              });
                              setErrorData({ ...errorData, contact_person_finance: "" });
                            } else {
                              setErrorData({
                                ...errorData,
                                contact_person_finance: "Contact Person cannot contain numbers",
                              });
                            }
                          }}
                          value={
                            userInfo.contact_person_finance
                              ? userInfo.contact_person_finance
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.contact_person_finance
                            ? errorData.contact_person_finance
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.designation_finance
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="designation_finance">Designation</label>
                        <input
                          type="text"
                          placeholder="Enter Designation"
                          name="designation_finance"
                          disabled={viewMode}
                          id="designation_finance"
                          className={
                            errorData?.designation_finance
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     designation_finance: e.target.value,
                          //   });
                          //   setErrorData({
                          //     ...errorData,
                          //     designation_finance: "",
                          //   });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Regex to allow only letters and spaces
                            const isValidText = /^[A-Za-z\s]*$/.test(value);
              
                            if (isValidText || value === "") { // Allow empty value
                              setUserInfo({
                                ...userInfo,
                                designation_finance: value,
                              });
                              setErrorData({ ...errorData, designation_finance: "" });
                            } else {
                              setErrorData({
                                ...errorData,
                                designation_finance: "Only letters and spaces are allowed",
                              });
                            }
                          }}
                          value={
                            userInfo.designation_finance
                              ? userInfo.designation_finance
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.designation_finance
                            ? errorData.designation_finance
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.mobile_finance
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="mobile_finance">Mobile</label>
                        <input
                          type="text"
                          placeholder="Enter Mobile No."
                          name="mobile_finance"
                          disabled={viewMode}
                          id="mobile_finance"
                          className={
                            errorData?.mobile_finance
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   const value = e.target.value;
                          //   const isValid = /^\d{0,10}$/.test(value); // Allows only up to 10 digits
                          //   if (isValid) {
                          //     setUserInfo({
                          //       ...userInfo,
                          //       mobile_finance: value,
                          //     });
                          //     setErrorData({ ...errorData, mobile_finance: "" });
                          //   }
                          // }}

                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, ''); // Remove non-digit characters
                            if (value.length <= 10) {
                              setUserInfo({
                                ...userInfo,
                                mobile_finance: value,
                              });
                              setErrorData({ ...errorData, mobile_finance: "" });
                            } else {
                              setErrorData({ ...errorData, mobile_finance: "Mobile number cannot exceed 10 digits." });
                            }
                  
                            if (e.target.value !== value) {
                              setErrorData({ ...errorData, mobile_finance: "Mobile number can only contain digits." });
                            }
                          }}
                          value={
                            userInfo.mobile_finance
                              ? userInfo.mobile_finance
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.mobile_finance
                            ? errorData.mobile_finance
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.email_finance
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="email_finance"> Email </label>
                        <input
                          type="text"
                          placeholder="Enter Email Id"
                          name="email_finance"
                          disabled={viewMode}
                          id="email_finance"
                          className={
                            errorData?.email_finance
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              email_finance: e.target.value,
                            });
                            setErrorData({ ...errorData, email_finance: "" });
                          }}
                     
                          value={
                            userInfo.email_finance ? userInfo.email_finance : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.email_finance
                            ? errorData.email_finance
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.credit_note
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Credit Note</label>
                      <Select
                        id={userInfo.credit_note}
                        isDisabled={viewMode}
                        defaultValue={""}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ].find(
                          (option) => option.value === userInfo.credit_note
                        )}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            credit_note: e.value,
                          });
                          setErrorData({ ...errorData, credit_note: "" });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.credit_note ? errorData.credit_note : ""}
                      </span>
                    </div>
                  </div>



                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.debit_note
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Debit Note</label>
                      <Select
                        id={userInfo.debit_note}
                        isDisabled={viewMode}
                        defaultValue={""}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ].find(
                          (option) => option.value === userInfo.debit_note
                        )}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            debit_note: e.value,
                          });
                          setErrorData({ ...errorData, debit_note: "" });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.debit_note ? errorData.debit_note : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.volume_deal_agreement
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Volume Deal Aggreement</label>
                      <Select
                        id={userInfo.volume_deal_agreement}
                        isDisabled={viewMode}
                        defaultValue={""}
                        options={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ]}
                        value={[
                          { value: "Yes", label: "Yes" },
                          { value: "No", label: "No" },
                        ].find(
                          (option) =>
                            option.value === userInfo.volume_deal_agreement
                        )}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            volume_deal_agreement: e.value,
                          });
                          setErrorData({
                            ...errorData,
                            volume_deal_agreement: "",
                          });
                        }}
                      />
                      <span className="errorText">
                        {errorData?.volume_deal_agreement
                          ? errorData.volume_deal_agreement
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.volume_deal_percentage
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <div className="input_box">
                        <label htmlFor="volume_deal_percentage">
                          Volume Deal Percentage
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Volume Percentage"
                          name="volume_deal_percentage"
                          disabled={viewMode}
                          id="volume_deal_percentage"
                          className={
                            errorData?.volume_deal_percentage
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          // onChange={(e) => {
                          //   setUserInfo({
                          //     ...userInfo,
                          //     volume_deal_percentage: e.target.value,
                          //   });
                          //   setErrorData({
                          //     ...errorData,
                          //     volume_deal_percentage: "",
                          //   });
                          // }}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Regex to allow only numbers, including decimal numbers
                            const isValidNumber = /^\d*\.?\d*$/.test(value);
                            
                            if (isValidNumber || value === "") {
                              setUserInfo({
                                ...userInfo,
                                volume_deal_percentage: value,
                              });
                              setErrorData({
                                ...errorData,
                                volume_deal_percentage: "",
                              });
                            } else {
                              setErrorData({
                                ...errorData,
                                volume_deal_percentage: "Invalid percentage",
                              });
                            }
                          }}
                          value={
                            userInfo.volume_deal_percentage
                              ? userInfo.volume_deal_percentage
                              : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.volume_deal_percentage
                            ? errorData.volume_deal_percentage
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 
              <div className="add_screen_head">
                <span className="text_bold">System Information </span>
              </div> */}

              {/* <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="email">Created On</label>
                      <input
                        type="datetime-local"
                        disabled
                        name="date"
                        id="date"
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            createdAt: e.target.value,
                          })
                        }
                        value={moment(userInfo?.createdAt).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="mod_date">Last Modified On</label>
                      <input
                        type="datetime-local"
                        disabled
                        placeholder="Enter Contact no."
                        name="mod_date"
                        id="mod_date"
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            updatedAt: e.target.value,
                          })
                        }
                        // value={userInfo.updated_on ? userInfo.updated_on : ""}
                        value={moment(userInfo?.updatedAt).format(
                          "YYYY-MM-DDTHH:mm"
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="add_screen_head">
                <span className="text_bold">Billing & Shipping Address</span>
              </div> */}
              {/* 
              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_cont
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing Country *</label>
                      <Select
                        id={userInfo.assigned_to}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={countrylist?.map((data, index) => {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,
                          };
                        })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.bill_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_cont: e.value });
                          setErrorData({ ...errorData, bill_cont: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_cont ? errorData.bill_cont : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_city
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing State *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billStates?.map((data, index) => {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,
                          };
                        })}
                        value={billStates?.map((data, index) => {
                          if (userInfo.bill_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_state: e.value });
                          setErrorData({ ...errorData, bill_state: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_state ? errorData.bill_state : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_city
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Billing City *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billingCities?.map((data, index) => {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,
                          };
                        })}
                        value={billingCities?.map((data, index) => {
                          if (userInfo.bill_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_city: e.value });
                          setErrorData({ ...errorData, bill_city: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_city ? errorData.bill_city : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.bill_pincode
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="offc_no">Zip / Postal Code *</label>
                      <input
                        type="number"
                        placeholder="Zip / Postal Code"
                        name="pin-code"
                        disabled={viewMode}
                        id="offc_no"
                        className={
                          errorData?.bill_pincode
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            bill_pincode: e.target.value,
                          });
                          setErrorData({ ...errorData, bill_pincode: "" });
                        }}
                        value={
                          userInfo.bill_pincode ? userInfo.bill_pincode : ""
                        }
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.bill_pincode ? errorData.bill_pincode : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="bill_address">Billing Address</label>
                      <textarea
                        type=""
                        placeholder="Enter Address"
                        name="bill_address"
                        id="bill_address"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            bill_address: e.target.value,
                          })
                        }
                        value={
                          userInfo?.bill_address ? userInfo.bill_address : ""
                        }
                      />
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="col-xl-12 col-md-12 col-sm-12 col-12 shift-right ">
                <div className="input_box">
                  <input
                    disabled={viewMode}
                    onChange={(e) => copyAddress(e)}
                    type="checkbox"
                    id="copyAddress"
                    name="copyAddress"
                    className="form-check-input me-2 "
                  />
                  <label htmlFor="copyAddress">
                    Make Shipping Address same as Billing Address
                  </label>
                </div>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ship_cont
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Shipping Country *</label>
                      <Select
                        id={userInfo.ship_cont}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={countrylist?.map((data, index) => {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,
                          };
                        })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.ship_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_cont: e.value });
                          setErrorData({ ...errorData, ship_cont: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.ship_cont ? errorData.ship_cont : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ship_state
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Shipping State *</label>
                      <Select
                        id={userInfo.ship_state}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={shipStates?.map((data, index) => {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,
                          };
                        })}
                        value={shipStates?.map((data, index) => {
                          if (userInfo.ship_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_state: e.value });
                          setErrorData({ ...errorData, ship_state: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.ship_state ? errorData.ship_state : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ship_state
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="task_name">Shipping City *</label>
                      <Select
                        id={userInfo.ship_state}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={shipCities?.map((data, index) => {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,
                          };
                        })}
                        value={shipCities?.map((data, index) => {
                          if (userInfo.ship_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_city: e.value });
                          setErrorData({ ...errorData, ship_city: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.ship_city ? errorData.ship_city : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.ship_address
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="zip_add">Zip / Postal Code *</label>
                      <input
                        type="number"
                        placeholder="Zip / Postal Code"
                        name="pin-code"
                        disabled={viewMode}
                        id="zip_add"
                        className={
                          errorData?.ship_pincode
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          const isValid = /^\d{0,6}$/.test(value); // Allows only up to 10 digits
                          if (isValid) {
                            setUserInfo({
                              ...userInfo,
                              ship_pincode: value,
                            });
                            setErrorData({ ...errorData, ship_pincode: "" });
                          }
                        }}
                        value={
                          userInfo.ship_pincode ? userInfo.ship_pincode : ""
                        }
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.ship_pincode ? errorData.ship_pincode : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Shippingaddress">Shipping Address</label>
                      <textarea
                        name="address"
                        id="Shippingaddress"
                        disabled={viewMode}
                        className="form-control"
                        placeholder="Enter Address"
                        rows="2"
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            ship_address: e.target.value,
                          })
                        }
                        value={
                          userInfo.ship_address ? userInfo.ship_address : ""
                        }
                      ></textarea>
                      <span className="errorText">
                        {" "}
                        {errorData?.ship_address ? errorData.ship_address : ""}
                      </span>
                    </div>
                  </div>

                  <div className="add_screen_head">
                    <span className="text_bold">Other Information </span>
                  </div>

                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="acc_desc">Description</label>
                          <textarea
                            name="acc_desc"
                            placeholder="Enter Description"
                            id="acc_desc"
                            rows="2"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({ ...userInfo, desc: e.target.value })
                            }
                            value={userInfo.desc ? userInfo.desc : ""}
                          ></textarea>
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
                          <label htmlFor="email">Created On</label>
                          <input
                            type="datetime-local"
                            disabled
                            name="date"
                            id="date"
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                createdAt: e.target.value,
                              })
                            }
                            value={moment(userInfo?.createdAt).format(
                              "YYYY-MM-DDTHH:mm"
                            )}
                          />
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="mod_date">Last Modified On</label>
                          <input
                            type="datetime-local"
                            disabled
                            placeholder="Enter Contact no."
                            name="mod_date"
                            id="mod_date"
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                updatedAt: e.target.value,
                              })
                            }
                            // value={userInfo.updated_on ? userInfo.updated_on : ""}
                            value={moment(userInfo?.updatedAt).format(
                              "YYYY-MM-DDTHH:mm"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    {console.log("userInfo", userInfo)}
                    {userInfo.db_acc_fields?.map(
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
                                name={field_name}
                                disabled={viewMode}
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
                                disabled={viewMode}
                                className="form-control"
                                value={input_value}
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
                  </div>

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
                        {/* <button onClick={AddFieldsFunc} className="btn btn-light me-3">Cancel</button> */}
                        <button
                          onClick={createInputField}
                          className="btn btn-success"
                        >
                          Create Field
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-end">
                  <div className="submit_btn">
                    {viewMode ? null : (
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
                    )}
                    {viewMode ? null : (
                      <>
                        <Link href="/media/Accounts">
                          <button className="btn btn-cancel m-3 ">
                            Cancel
                          </button>
                        </Link>
                        {editMode ? (
                          <button
                            disabled={isLoading}
                            className="btn btn-primary "
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
            {viewMode ? (
              <div className="col-xl-3 col-md-3 col-sm-12 col-12 sideCardAdd">
                <div className="opertunity_box">
                  <div className="task_card mb-4">
                    <div className="task_head">Opportunities List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.oppList?.map(
                          ({ opp_id, opp_name, amount }, i) => {
                            return (
                              <li key={opp_id} className="list-item">
                                <div className="opp_box">
                                  <Link
                                    href={`/media/OpportunityView?id=${opp_id}`}
                                  >
                                    <div className="name">{opp_name} </div>
                                  </Link>
                                  <div className="price">&#8377; {amount}</div>
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="card_footer d-flex justify-content-between">
                      <Link href={`/media/AddOpportunity?ac_id=${id}`}>
                        <div className="text_more">create</div>
                      </Link>
                      <Link href="/media/Opportunity">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>
                  <div className="task_card">
                    <div className="task_head">Contacts List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.contactList?.map(
                          ({ contact_id, first_name }, i) => {
                            return (
                              <li key={contact_id} className="list-item">
                                <div className="opp_box">
                                  <Link
                                    href={`/media/AddContact?id=${contact_id}&vw=mds`}
                                  >
                                    <div className="name">{first_name}</div>
                                  </Link>
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="card_footer d-flex justify-content-between">
                      <Link href={`/media/AddContact?ac_id=${id}`}>
                        <div className="text_more">create</div>
                      </Link>
                      <Link href="/media/Contacts">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>

                  <div className="task_card">
                    <div className="task_head">Lead List</div>
                    <div className="tasks_details">
                      <ul className="tasks_list">
                        {userInfo?.db_leads?.map(
                          ({ lead_id, lead_name }, i) => {
                            return (
                              <li key={lead_id} className="list-item">
                                <div className="opp_box">
                                  <Link
                                    href={`/media/LeadsView?id=${lead_id}&vw=mds`}
                                  >
                                    <div className="name">{lead_name}</div>
                                  </Link>
                                </div>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                    <div className="card_footer d-flex justify-content-between">
                      <Link href={`/media/AddLeads?ac_id=${id}`}>
                        <div className="text_more">create</div>
                      </Link>
                      <Link href="/media/ManageLeads">
                        <div className="text_more">view more</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAccountScreen;
