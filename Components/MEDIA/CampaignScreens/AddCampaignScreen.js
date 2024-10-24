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
import { Delete } from "@mui/icons-material";
import { costingDetailArray1,costingDetailArray2,marginInfoArray } from "./Array";
import { Button, Modal, Form } from 'react-bootstrap';


const AddCampaignScreen = () => {
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
  const [campaignStatusList, setCampaignStatusList] = useState([]);
  const [proofOfConList, setProofOfConList] = useState([]);
  const [busiessTypeList, setBusinessTypeList] = useState([]);
  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DDTHH:mm");
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });
  const [show,setShow] =useState(false)
  const [prevCmpStatusId,setPrevCmpStatisId]=useState()

  const [userInfo, setUserInfo] = useState({
    campaign_id: null,
    campaign_name: "",
    acc_id: "",
    contact: "",
    campaign_brand: "",
    cmpn_s_id: null,
    campaign_start_date: "",
    campaign_end_date: "",
    campaign_duration: 0,
    cmpn_p_id: null,
    proof_attachment: null,
    cmpn_b_t_id: null,
    client_display_cost: 0,
    client_mounting_cost: 0,
    client_printing_cost: 0,
    total_client_cost: 0,
    total_sales_order_value: 0,
    total_credit_note_value: 0,
    total_receipt_from_client: 0,
    total_client_outstanding: 0,
    total_ndp_days: 0,
    total_sales_invoice_value: 0,
    total_vendor_display_cost: 0,
    total_vendor_mounting_cost: 0,
    total_vendor_printing_cost: 0,
    total_vendor_cost: 0,
    total_purchase_order_value: 0,
    total_debit_note_value: 0,
    total_vendor_payment: 0,
    total_vendor_outstanding: 0,
    total_ndp_value: 0,
    overall_margin: 0,
    display_margin: 0,
    mounting_margin: 0,
    printing_margin: 0,
    overall_margin_percentage: 0,
    display_margin_percentage: 0,
    mounting_margin_percentage: 0,
    printing_margin_percentage: 0,
    createdAt: DateNow,
    updatedAt: DateNow,
    gst: false,
    cgst: false,
    sgst: false,
    sales_order_pdf:"",
    s_o_po_number:"",
    s_o_po_date:"",
    s_o_po_value:"",
    s_o_po_remarks:"",
  });

  async function getAccountsList() {
    await fetchData(
      `/db/account?platform_id=5&all=true`,
      setAccountsList,
      errorToast,
      setErrorToast
    );
  }

  async function getCampaignStatusList() {
    await fetchData(
      `/db/media/campaign/campaignStatus/getCampaignStatus`,
      setCampaignStatusList,
      errorToast,
      setErrorToast
    );
  }

  async function getProofOfConList() {
    await fetchData(
      `/db/media/campaign/campaignProof/getCampaignProof`,
      setProofOfConList,
      errorToast,
      setErrorToast
    );
  }

  const handleRemoveFile = () => {

    setUserInfo((prevState) => ({
      ...prevState,
      proof_attachment: null,
    }));


  };



  async function getBusinessTypeList() {
    await fetchData(
      `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
      setBusinessTypeList,
      errorToast,
      setErrorToast
    );
  }

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
      // setUserInfo({ ...userInfo, contact_owner: data.user_id });
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
          m_id: 430,
        },
      };

      try {
        const response = await axios.get(
          Baseurl +
            `/db/media/campaign/campaignManagement/getCampaign?campaign_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
        setPrevCmpStatisId(response?.data?.data?.cmpn_s_id)
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const validate = () => {
    const errors = {};
    if (!userInfo.campaign_name.trim())
      errors.campaign_name = "Campaign Name is required";
    if (!userInfo.acc_id) errors.acc_id = "Client Name is required";
    if (!userInfo.cmpn_s_id) errors.cmpn_s_id = "Campaign Status is required";

    if (!userInfo.campaign_brand.trim())
      errors.campaign_brand = "Campaign Brand is required";
    if (!userInfo.campaign_start_date.trim())
      errors.campaign_start_date = "Campaign Start Date is required";
    if (!userInfo.campaign_end_date.trim())
      errors.campaign_end_date = "Campaign End Date is required";
    if (!userInfo.cmpn_p_id)
      errors.cmpn_p_id = "Proof of Confirmation is required";
    if (!userInfo.cmpn_b_t_id) errors.cmpn_b_t_id = "Business Type is required";
    // if (!userInfo.proof_attachment)
    //   errors.proof_attachment = "Proof Attachment is required";

    setErrorData(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async () => {
    if (validate()) {
      if (hasCookie("token")) {
        setisLoading(true);

        let token = getCookie("token");
        let db_name = getCookie("db_name");

        const formData = new FormData();

        Object.keys(userInfo).forEach((key) => {
          if (userInfo[key] instanceof File) {
            formData.append(key, userInfo[key]);
          } else {
            formData.append(key, userInfo[key]);
          }
        });

        formData.append("contact_owner", loginDetails.user_id);

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 429,
          },
        };

        // let oppBody = { ...userInfo };
        // oppBody.contact_owner = loginDetails.user_id;
        try {
          formData.delete("campaign_id");

          const response = await axios.post(
            Baseurl + `/db/media/campaign/campaignManagement/addCampaign`,
            formData,
            header
          );
          if (response.status === 204 || response.status === 200) {
            // await postFieldsFunc(
            //   response.data.data.contact_id,
            //   userInfo.db_contact_fields
            // );
            toast.success(response.data.message);
            setisLoading(false);
            router.push("/media/Campaigns");
          }
        } catch (error) {
          console.log("error is ", error, "msg", error.message);
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
    } else {
      toast.error("Please fill the Mandatory fileds");
    }
  };

  const UpdateHandler = async () => {
    if (validate()) {
      if (hasCookie("token")) {
        setisLoading(true);
        let token = getCookie("token");
        let db_name = getCookie("db_name");
  
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 431,
          },
        };
  
        // Create a FormData instance
        const formData = new FormData();
  
        // Create new user info with updated_on field
        let newUserInfo = { ...userInfo, updated_on: new Date().toISOString() };
  
        // Append all userInfo properties to formData
        Object.keys(newUserInfo).forEach((key) => {
          if (newUserInfo[key] instanceof File) {
            formData.append(key, newUserInfo[key]);
          } else {
            formData.append(key, newUserInfo[key]);
          }
        });
  
        try {
          const response = await axios.put(
            Baseurl + `/db/media/campaign/campaignManagement/updateCampaign`,
            formData,
            header
          );
  
          if (response.status === 200 || response.status === 204) {
            await postFieldsFunc(newUserInfo.contact_id, newUserInfo.db_contact_fields);
            toast.success(response.data.message);
            setisLoading(false);
            router.push("/media/Campaigns");
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
        
    } else {
      toast.error("Please fill the Mandatory fields");
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

  useEffect(() => {
    getProofOfConList();
    getCampaignStatusList();
    getBusinessTypeList();
    getAccountsList();
    checkLogin();
    getusersList();
    setUserInfo({
      ...userInfo,
      created_on: DateNow,
      updated_on: DateNow,
    });
  }, []);

  const handleDateChange = (e) => {
    setErrorData({ ...errorData, campaign_end_date: "" });
    setErrorData({ ...errorData, campaign_start_date: "" });

    const { id, value } = e.target;
    let updatedUserInfo = { ...userInfo, [id]: value };

    // Calculate duration if both dates are selected
    if (
      updatedUserInfo.campaign_start_date &&
      updatedUserInfo.campaign_end_date
    ) {
      const startDate = new Date(updatedUserInfo.campaign_start_date);
      const endDate = new Date(updatedUserInfo.campaign_end_date);

      // Calculate the difference in time
      const timeDiff = endDate - startDate;
      // Convert time difference to days
      const duration = timeDiff / (1000 * 60 * 60 * 24);

      // Ensure duration is non-negative (in case of invalid date selection)
      updatedUserInfo.campaign_duration = duration >= 0 ? duration : 0;
    }

    setUserInfo(updatedUserInfo);
  };

  const handleFileChange = (event) => {
    console.log("file is hter oa",event.target.files,"single ",event.target.files[0])
    const file = event.target.files[0];
    // if (file && file.type !== "application/pdf") {
    //   toast.error("Only PDF files are allowed");
    //   event.target.value = "";
    // } else {
    //   setUserInfo({
    //     ...userInfo,
    //     proof_attachment: file,
    //   });
    // }

    if (file) {
      console.log("file is ", file);
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, PNG, and JPEG files are allowed");
        event.target.value = "";
      } else {
      
        setUserInfo({
          ...userInfo,
          proof_attachment: file,
        });
      }
    }
  };

  const handleCostingInputChange = (e, fieldType) => {
    const { id, value } = e.target;
    let isValid = true;

    switch (fieldType) {
      case "currency":
        isValid = /^\d*(\.\d{0,2})?$/.test(value); // Allow digits and up to two decimal places
        break;
      case "number":
        isValid = /^\d*$/.test(value); // Allow only digits
        break;
      default:
        break;
    }

    if (isValid) {
      setUserInfo((prevState) => {
        const updatedInfo = { ...prevState, [id]: value };

        // Calculate Total Client Cost
        updatedInfo.total_client_cost =
  parseFloat(updatedInfo.client_display_cost || 0) +
  parseFloat(updatedInfo.client_mounting_cost || 0) +
  parseFloat(updatedInfo.client_printing_cost || 0);

updatedInfo.total_vendor_cost =
  parseFloat(updatedInfo.total_vendor_display_cost || 0) +
  parseFloat(updatedInfo.total_vendor_mounting_cost || 0) +
  parseFloat(updatedInfo.total_vendor_printing_cost || 0);

updatedInfo.overall_margin =
  parseFloat(updatedInfo.total_client_cost || 0) -
  parseFloat(updatedInfo.total_vendor_cost || 0);

updatedInfo.display_margin =
  parseFloat(updatedInfo.client_display_cost || 0) -
  parseFloat(updatedInfo.total_vendor_display_cost || 0);

updatedInfo.mounting_margin =
  parseFloat(updatedInfo.client_mounting_cost || 0) -
  parseFloat(updatedInfo.total_vendor_mounting_cost || 0);

updatedInfo.printing_margin =
  parseFloat(updatedInfo.client_printing_cost || 0) -
  parseFloat(updatedInfo.total_vendor_printing_cost || 0);

// Calculate margin percentages
updatedInfo.overall_margin_percentage =
  (updatedInfo.overall_margin / updatedInfo.total_client_cost) * 100;

updatedInfo.display_margin_percentage =
  (updatedInfo.display_margin / updatedInfo.client_display_cost) * 100;

updatedInfo.mounting_margin_percentage =
  (updatedInfo.mounting_margin / updatedInfo.client_mounting_cost) * 100;

updatedInfo.printing_margin_percentage =
  (updatedInfo.printing_margin / updatedInfo.client_printing_cost) * 100;

        return updatedInfo;
      });
    }
  };

  const handleMarginInfoChange = (e, fieldType) => {
    const { id, value } = e.target;
    let isValid = true;

    switch (fieldType) {
      case "currency":
        isValid = /^\d*(\.\d{0,2})?$/.test(value); // Allow digits and up to two decimal places
        break;
      case "percentage":
        isValid = /^\d{0,3}$/.test(value); // Allow only digits
        break;
      default:
        break;
    }

    if (isValid) {
      setUserInfo((prevState) => {
        const updatedInfo = { ...prevState, [id]: value };

        return updatedInfo;
      });
    }
  };

  const salesOrderUploadHandler = async () => {

      if (hasCookie("token")) {
        setisLoading(true);
        let token = getCookie("token");
        let db_name = getCookie("db_name");
  
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            pass:"pass"
          },
        };
  
        // Create a FormData instance
        const formData = new FormData();
  
        formData.append("campaign_id", userInfo?.campaign_id);
        formData.append("pdf", userInfo?.sales_order_pdf);
        formData.append("s_o_po_number", userInfo?.s_o_po_number);
        formData.append("s_o_po_date", userInfo?.s_o_po_date);
        formData.append("s_o_po_value", userInfo?.s_o_po_value);
        formData.append("s_o_po_remarks", userInfo?.s_o_po_remarks);
  
        try {
          const response = await axios.put(
            Baseurl + `/db/media/campaign/campaignManagement/uploadPOPdf`,
            formData,
            header
          );
  
          if (response.status === 200 || response.status === 204) {
            toast.success(response?.data?.message);
            setisLoading(false);
            setShow(false)
          }
        } catch (error) {
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
          setisLoading(false);
        }
      }     
        
    
  };

  const handlePoUpload=(e)=>{
    const fileInput = e.target;
        const file = fileInput.files[0];
        const allowedFileTypes = ["application/pdf"];
        if (file && allowedFileTypes.includes(file.type)) {
          setUserInfo({ ...userInfo, sales_order_pdf: file});
        } else {
          toast.warning("Please upload a valid PDF, JPEG, JPG, or PNG file.");
          // Clear the file input value to prevent upload
          fileInput.value = "";
        }
  }
  
  useEffect(()=>{
    if(userInfo?.cmpn_s_id=="4"){
      setShow(true)
    }
  },[userInfo?.cmpn_s_id=="4"])

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

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {" "}
          {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} CAMPAIGN
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder ">
              <Link href="/media">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/media/Campaigns"> Campaigns </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? "View" : <>{editMode ? "Edit" : "Add"}</>} Campaigns
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="Add_user_screen">
          <div className="row">
            {/* <div
              className={
                viewMode
                  ? `col-xl-9 col-md-9 col-sm-12 col-12`
                  : `col-xl-12 col-md-12 col-sm-12 col-12`
              }
            > */}
            <div className={`col-xl-12 col-md-12 col-sm-12 col-12`}>
              <div className="add_screen_head">
                <span className="text_bold">Fill Details</span> ( * Fields are
                mandatory)
              </div>
              <div className="add_user_form">
                <div className="row">
                {
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Campaign ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={userInfo?.campaign_code}
                          />
                        </div>
                      </div>
                  )
                }
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.campaign_name
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_name">Campaign Name *</label>
                      <input
                        type="text"
                        id="campaign_name"
                        className="form-control"
                        disabled={viewMode}
                        placeholder="Enter Campaign Name"
                        value={userInfo?.campaign_name}
                        onChange={(e) => {
                          setErrorData({ ...errorData, campaign_name: "" });
                          const value = e.target.value;
                          // Allow only alphabetic characters
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setUserInfo({ ...userInfo, campaign_name: value });
                          }
                        }}
                      />
                      <span className="errorText">
                        {errorData?.campaign_name
                          ? errorData.campaign_name
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.account_name
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="client_name">Client Name *</label>
                      <Select
                        id="client_name"
                        defaultValue={""}
                        placeholder="Enter Client Name"
                        isDisabled={viewMode}
                        options={accountsList?.filter((item)=>item?.db_account_type?.account_type_name=="Direct Clients")?.map((data, index) => {
                          return {
                            value: data?.acc_id,
                            label: data?.acc_name,
                          };
                        })}
                        value={accountsList?.map((data, index) => {
                          if (userInfo.acc_id === data.acc_id) {
                            return {
                              value: data?.acc_id,
                              label: data?.acc_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({
                            ...userInfo,
                            acc_id: e.value,
                            contact: accountsList?.find(
                              (item) => item?.acc_id == e.value
                            )?.contact_no,
                          });
                          setErrorData({ ...errorData, acc_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.acc_id ? errorData.acc_id : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.cmpn_s_id
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="client_name">Campaign Status *</label>
                      <Select
                        id="client_name"
                        defaultValue={""}
                        placeholder="Select Campaign Status"
                        isDisabled={viewMode}
                        options={campaignStatusList?.map((data, index) => {
                          return {
                            value: data?.cmpn_s_id,
                            label: data?.cmpn_s_name,
                          };
                        })}
                        value={campaignStatusList?.map((data, index) => {
                          if (userInfo.cmpn_s_id === data.cmpn_s_id) {
                            return {
                              value: data?.cmpn_s_id,
                              label: data?.cmpn_s_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, cmpn_s_id: e.value });
                          setErrorData({ ...errorData, cmpn_s_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.cmpn_s_id ? errorData.cmpn_s_id : ""}
                      </span>
                    </div>
                  </div>
                  <Modal className="commonModal" show={show} onHide={() => {
                      setUserInfo({ ...userInfo, cmpn_s_id: prevCmpStatusId });
                      setShow(false);
                    }}>
                      <Modal.Header closeButton>
                        <Modal.Title>Sales Order Upload</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {/* PDF Upload */}
                        <Form.Group controlId="fileUpload">
                          <Form.Label>Sales Order PDF *</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handlePoUpload(e)}
                          />
                        </Form.Group>

                        {/* Sales Order PO Number */}
                        <Form.Group controlId="poNumber">
                          <Form.Label>PO Number *</Form.Label>
                          <Form.Control
                            type="text"
                            value={userInfo.s_o_po_number || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_number: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Date */}
                        <Form.Group controlId="poDate">
                          <Form.Label>PO Date *</Form.Label>
                          <Form.Control
                            type="date"
                            value={userInfo.s_o_po_date || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_date: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Value */}
                        <Form.Group controlId="poValue">
                          <Form.Label>PO Value *</Form.Label>
                          <Form.Control
                            type="number"
                            value={userInfo.s_o_po_value || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_value: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Remarks */}
                        <Form.Group controlId="poRemarks">
                          <Form.Label>PO Remarks *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={userInfo.s_o_po_remarks || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_remarks: e.target.value })}
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={() => {
                          // Perform validation
                          const { sales_order_pdf, s_o_po_number, s_o_po_date, s_o_po_value, s_o_po_remarks } = userInfo;

                          if (!sales_order_pdf || !s_o_po_number || !s_o_po_date || !s_o_po_value || !s_o_po_remarks) {
                            return toast.error("Please fill all mandatory fields", { autoClose: 2500 });
                          }

                          // If all validations pass, handle the submission
                          salesOrderUploadHandler();
                        }}>
                          SUBMIT
                        </Button>
                      </Modal.Footer>
                    </Modal>



                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.contact ? "input_box errorBox" : "input_box"
                      }
                    >
                      <label htmlFor="contact">Contact *</label>
                      <input
                        type="text"
                        id="contact"
                        className="form-control"
                        disabled
                        value={userInfo.contact}
                      />
                      <span className="errorText">
                        {errorData?.contact ? errorData.contact : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.campaign_brand
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_brand">Campaign Brand *</label>
                      <input
                        type="text"
                        id="campaign_brand"
                        className="form-control"
                        disabled={viewMode}
                        placeholder="Enter Campaign Brand"
                        value={userInfo?.campaign_brand}
                        onChange={(e) => {
                          setErrorData({ ...errorData, campaign_brand: "" });
                          const value = e.target.value;
                          // Allow only alphabetic characters
                          if (/^[a-zA-Z\s]*$/.test(value)) {
                            setUserInfo({ ...userInfo, campaign_brand: value });
                          }
                        }}
                      />
                      <span className="errorText">
                        {errorData?.campaign_brand
                          ? errorData.campaign_brand
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.campaign_start_date
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_start_date">
                        Campaign Start Date *
                      </label>
                      <input
                        type="date"
                        disabled={viewMode}
                        className="form-control"
                        id="campaign_start_date"
                        min={new Date().toISOString().split("T")[0]}
                        onPaste={(e) => e.preventDefault()}
                        onKeyDown={(e) => e.preventDefault()}
                        value={moment(userInfo.campaign_start_date).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={handleDateChange}
                      />
                      <span className="errorText">
                        {errorData?.campaign_start_date
                          ? errorData.campaign_start_date
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.campaign_end_date
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_end_date">
                        Campaign End Date *
                      </label>
                      <input
                        type="date"
                        disabled={viewMode}
                        className="form-control"
                        id="campaign_end_date"
                        min={new Date().toISOString().split("T")[0]}
                        onPaste={(e) => e.preventDefault()}
                        onKeyDown={(e) => e.preventDefault()}
                        value={moment(userInfo.campaign_end_date).format(
                          "YYYY-MM-DD"
                        )}
                        onChange={handleDateChange}
                      />
                      <span className="errorText">
                        {errorData?.campaign_end_date
                          ? errorData.campaign_end_date
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.campaign_duration
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_duration">
                        Campaign Duration *
                      </label>
                      <input
                        type="text"
                        id="campaign_duration"
                        className="form-control"
                        disabled
                        value={`${userInfo?.campaign_duration} days` || "0days"}
                      />
                      <span className="errorText">
                        {errorData?.campaign_duration
                          ? errorData.campaign_duration
                          : ""}
                      </span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.cmpn_p_id
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="client_name">
                        Proof of Confirmation *
                      </label>
                      <Select
                        id="client_name"
                        defaultValue={""}
                        placeholder="Select Proof of Confirmation"
                        isDisabled={viewMode}
                        options={proofOfConList?.map((data, index) => {
                          return {
                            value: data?.cmpn_p_id,
                            label: data?.cmpn_p_name,
                          };
                        })}
                        value={proofOfConList?.map((data, index) => {
                          if (userInfo.cmpn_p_id === data.cmpn_p_id) {
                            return {
                              value: data?.cmpn_p_id,
                              label: data?.cmpn_p_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, cmpn_p_id: e.value });
                          setErrorData({ ...errorData, cmpn_p_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.cmpn_p_id ? errorData.cmpn_p_id : ""}
                      </span>
                    </div>
                  </div>

                   <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.proof_attachment
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="campaign_brand">Proof Attachment *</label>
                      {editMode && userInfo?.proof_attachment ? (
                        <div className="file-preview">
                          <span>{userInfo.proof_attachment}</span>
                          <button
                            type="button"
                            className="remove-file-button"
                            onClick={handleRemoveFile}
                            style={{ marginLeft: '10px' }}
                          >
                            &#x2715; 
                          </button>
                        </div>
                      ) : (
                        <input
                          type="file"
                          id="proof_attachment"
                          // accept="application/pdf"
                          accept=".pdf,image/jpeg,image/png"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Campaign Brand"
                          onChange={handleFileChange}
                        />
                      )}
                      <span className="errorText">
                        {errorData?.proof_attachment
                          ? errorData.proof_attachment
                          : ""}
                      </span>
                    </div>
                  </div> 

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div
                      className={
                        errorData?.cmpn_b_t_id
                          ? "input_box errorBox"
                          : "input_box"
                      }
                    >
                      <label htmlFor="client_name">Business Type *</label>
                      <Select
                        id="client_name"
                        defaultValue={""}
                        placeholder="Select Business Type "
                        isDisabled={viewMode}
                        options={busiessTypeList?.map((data, index) => {
                          return {
                            value: data?.cmpn_b_t_id,
                            label: data?.cmpn_b_t_name,
                          };
                        })}
                        value={busiessTypeList?.map((data, index) => {
                          if (userInfo.cmpn_b_t_id === data.cmpn_b_t_id) {
                            return {
                              value: data?.cmpn_b_t_id,
                              label: data?.cmpn_b_t_name,
                            };
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, cmpn_b_t_id: e.value });
                          setErrorData({ ...errorData, cmpn_b_t_id: "" });
                        }}
                      />
                      <span className="errorText">
                        {" "}
                        {errorData?.cmpn_b_t_id ? errorData.cmpn_b_t_id : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            {
              id ?(
                <>
                      <div className="add_screen_head">
                <span className="text_bold">Costing Details </span>
              </div>
              <div className="add_user_form">
                <div className="row ">
                  {costingDetailArray1?.map((item) => (
                    <div
                      className="col-xl-3 col-md-3 col-sm-12 col-12"
                      key={item.id}
                    >
                      <div
                        className={
                          errorData?.[item?.id]
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor={item?.id}>{item?.label} </label>
                        <input
                          type="text"
                          id={item?.id}
                          className="form-control"
                          // disabled={item?.id==="total_client_cost"}
                          disabled={
                            viewMode || item?.id === "total_client_cost" ||
                            item?.id === "total_vendor_cost"
                          }
                          placeholder={`Enter ${item?.label}`}
                          value={userInfo?.[item?.id]}
                          onChange={(e) =>
                            handleCostingInputChange(e, item?.fieldType)
                          }
                        />
                        <span className="errorText">
                          {errorData?.[item?.id] ? errorData?.[item?.id] : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="add_user_form">
                <div className="row ">
                  {costingDetailArray2?.map((item) => (
                    <div
                      className="col-xl-3 col-md-3 col-sm-12 col-12"
                      key={item.id}
                    >
                      <div
                        className={
                          errorData?.[item?.id]
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor={item?.id}>{item?.label} </label>
                        <input
                          type="text"
                          id={item?.id}
                          className="form-control"
                          // disabled={item?.id==="total_client_cost"}
                          disabled={
                            viewMode || item?.id === "total_client_cost" ||
                            item?.id === "total_vendor_cost"
                          }
                          placeholder={`Enter ${item?.label}`}
                          value={userInfo?.[item?.id]}
                          onChange={(e) =>
                            handleCostingInputChange(e, item?.fieldType)
                          }
                        />
                        <span className="errorText">
                          {errorData?.[item?.id] ? errorData?.[item?.id] : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="add_screen_head">
                <span className="text_bold">Margin Information </span>
              </div>
              <div className="add_user_form">
                <div className="row ">
                  {marginInfoArray?.map((item) => (
                    <div
                      className="col-xl-3 col-md-3 col-sm-12 col-12"
                      key={item.id}
                    >
                      <div
                        className={
                          errorData?.[item?.id]
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="campaign_brand">{item?.label} </label>
                        <input
                          type="number"
                          id={item?.id}
                          className="form-control"
                          disabled={true}
                          placeholder={`Enter ${item?.label}`}
                          value={userInfo?.[item?.id]}
                          onChange={(e) =>
                            handleMarginInfoChange(e, item?.fieldType)
                          }
                        />
                        <span className="errorText">
                          {errorData?.[item?.id] ? errorData?.[item?.id] : ""}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
                </>
              ) : null
            }
              

              

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
                          </>
                        )}

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
                          <Link href="/media/Campaigns">
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

export default AddCampaignScreen;
