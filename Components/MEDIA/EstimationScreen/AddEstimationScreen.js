import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
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
import { data } from "autoprefixer";
import ConfirmBox from "../../Basics/ConfirmBox";
import { ButtonGroup, Table } from "react-bootstrap";
import DeleteIcon from "../../Svg/DeleteIcon";
import EditIcon from "../../Svg/EditIcon";
import ModelEditAgencySite from "./ModelEditAgencySite";
import { DMPCArray,additionalInfoArray,TotalCostArray1,TotalCostArray2,marginInfoArray } from "./Array";
import SalesOrderManagement from "./SalesOrderManagement";
import PurchaseOrderManagement from "./PurchaseOrderManagement";
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ModelAssetSite1 from "./ModelAssetSite1";
import ModelAssetSite2 from "./ModelAssetSite2";
import ModelClientCostAsset from "./ModelClientCostAsset";
import ModelVendorCostAsset from "./ModelVendorCostAsset";
import ModelAgencySite from "./ModelAgencySite";
import ModelAgencySiteUpload from "./ModelAgencySiteUpload";
import ModelClientCostAgency from "./ModelClientCostAgency";
import ModelVendorCostAgency from "./ModelVendorCostAgency";
import ModelSalesOrder from "./ModelSalesOrder";
import ModelPurchaseOrder from "./ModelPurchaseOrder";
import SiteBookingHistory from "./SiteBookingHistory";
import AssetSites from "./AssetSites";
import AgencySites from "./AgencySites";
import ModelGenerateCard from "./ModelGenerateCard";
import JobCardManagement from "./JobCardManagement";
import UpdateNDPModel from "./UpdateNDPModel";
 

const AddEstimationScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const { ac_id } = router.query;

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };
  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DDTHH:mm");
  const [userInfo, setUserInfo] = useState({
    estimate_type: "",
    campaign_id: null,
    est_s_id:null,
    campaign_name: "",
    acc_id: "",
    package_offer: "",
    contact: "",
    campaign_brand: "",
    cmpn_s_id: null,
    campaign_start_date: "",
    campaign_end_date: "",
    estimate_date: getTodayDate(),
    campaign_duration: 0,
    cmpn_p_id: null,
    proof_attachment: null,
    cmpn_b_t_id: null,
    package_cost_display: 0,
    package_cost_printing: 0,
    package_cost_mounting: 0,
    // client_display_cost: 0,
    total_agency_commision: 0,
    // client_mounting_cost: 0,
    // client_printing_cost: 0,
    agency_commission_mounting: 0,
    total_client_cost: 0,
    total_sales_order_value: 0,
    total_credit_note_value: 0,
    total_receipt_from_client: 0,
    total_client_outstanding: 0,
    agency_commission_display: 0,
    total_ndp_days: 0,
    total_sales_invoice_value: 0,
    total_vendor_display_cost: 0,
    total_vendor_mounting_cost: 0,
    total_vendor_printing_cost: 0,
    total_vendor_cost: 0,
    total_purchase_order_value: 0,
    agency_commission_printing: 0,
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
  });
  const [editMode, setEditMode] = useState(false);
  const [estimatesList, setEstimatesList] = useState([]);
  const [isAddLoading, setisAddLoading] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [usersList, setUsersLsit] = useState([]);
  const [iscollapse, setiscollapse] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [contError, setContError] = useState({});
  const [errorToast, setErrorToast] = useState(false);
  const [loginDetails, setloginDetails] = useState({});
  const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
  const [assetDeleteShowConfirm,setAssetDeleteShowConfirm]=useState(false);
  const [busiessTypeList, setBusinessTypeList] = useState([]);
  const [isAgency, setIsAgency] = useState(false);
  const [assetSiteLists, setAssetSiteLists] = useState([]);
  const [agencySiteLists, setAgencySiteLists] = useState([]);
  const [agencySiteData, setAgencySiteData] = useState([]);
  const [estimateStatusList, setEstimateStatusList] = useState([]);
  const [getAgencyData, setGetAgencyData] = useState(false);
  const [stateList, setStatelist] = useState([]);
  const [cityList, setCitylist] = useState([]);
  const [stateId, setStateId] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [deleteSiteAgencyId, setDeleteSiteAgencyId] = useState("");
  const [deleteSiteAssetId, setDeleteSiteAssetId] = useState("");
  const [show, setShow] = useState(false);
  
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });



  // buttons
  const userInfoCheck=JSON.parse(getCookie("userInfo"));
  const isNewOrReopen=userInfo?.est_s_id=="1" || userInfo?.est_s_id=="4"
  const isApproved = userInfo?.est_s_id=="2"
  const isSentForApproval = userInfo?.est_s_id=="4"
  const isDB=userInfoCheck?.isDB
  const isasset =busiessTypeList?.find(
    (item) =>
      item?.cmpn_b_t_id ==
      userInfo?.db_media_campaign?.cmpn_b_t_id
  )?.cmpn_b_t_name == "Asset"           
  const isagency =busiessTypeList?.find(
    (item) =>
      item?.cmpn_b_t_id ==
      userInfo?.db_media_campaign?.cmpn_b_t_id
  )?.cmpn_b_t_name == "Agency";

  const [siteLists, setSiteLists] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show6, setShow6] = useState(false);
  const [showVendorAsset, setShowVendorAsset] = useState(false);
  const [showVendorAgency, setShowVendorAgency] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);
  const [showSalesOrder,setShowSalesOrder] =useState(false)
  const [showPurchaseOrder,setShowPurchaseOrder] =useState(false)
  const [ mediaSidebarInfo,setmediaSidebarInfo]=useState([])
  const [estimateApprovals, setEstimateApprovals] = useState();
  const [showGenerateCard, setShowGenerateCard] = useState(false);
  const [showNDP, setShowNDP] = useState(false);

  const handleClose1 = () => {
    setShow1(false);
    setStateId("");
    setCityIds([]);
  };
  const handleClose2 = () => {
    setShow2(false);
  };
  const handleClose5 = () => {
    setShow5(false);
  };
  const handleClose3 = () => {
    setShow3(false);
  };
  const handleClose4 = () => {
    setShow4(false);
  };
  const handleClose6 = () => {
    setShow6(false);
  };
  const handleVendorAssetClose = () => {
    setShowVendorAsset(false);
  };
  const handleVendorAgencyClose = () => {
    setShowVendorAgency(false);
  };
  const handleCloseSalesOrder =()=>{
    setShowSalesOrder(false)
  }
  const handleClosePurchaseOrder =()=>{
    setShowPurchaseOrder(false)
  }

  const handleCloseGenerateCard = () => {
    setShowGenerateCard(false);
  };

  const handleCloseNDPModel = () => {
    setShowNDP(false);
  };

  const getSiteList = async () => {
    if (!stateId) {
      return toast.warning("Please Select State");
    }
    if (cityIds.length < 1) {
      return toast.warning("Please Select City");
    }

    const params = { city_id: cityIds };
    const queryString = new URLSearchParams(params).toString();

    await fetchData(
      `/db/media/siteManagement/getSite?${queryString}`,
      setSiteLists,
      errorToast,
      setErrorToast
    );

    handleClose1();
    setShow2(true);
  };

  const getState = async () => {
    await fetchData(
      `/db/area/states?cnt_id=101`,
      setStatelist,
      errorToast,
      setErrorToast
    );
  };

  const getCity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setCitylist(data.cityData),
      errorToast,
      setErrorToast
    );
  };

  const handleSelectSite = (site_id) => {
    setSelectedSites((prevSelected) =>
      prevSelected.includes(site_id)
        ? prevSelected.filter((id) => id !== site_id)
        : [...prevSelected, site_id]
    );
  };

  const addAssetInSite = async (formattedSites) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:439
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimationAssetBusiness/addEstimationAssetBusiness`,
          {
            estimate_id: id,
            sites: formattedSites,
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setisLoading(false);
          handleClose2();
          setSelectedSites();
          getSingleData(id)
          getAssetSites()
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  const getContactList =()=>{
    console.log("getContactList called")
  }

  const sentForApproval = async (estimate_id) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:444
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimation/sendMailForApproval/`,
          {
            estimate_id: estimate_id,
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getContactList()
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  const getSidebarInfo = async () => {
    await fetchData(
      `/db/permission?id=${userInfoCheck?.role_id}&pf=MEDIA`,
      setmediaSidebarInfo,
      errorToast,
      setErrorToast
    );
  };

  const accept_rejectApproval = async (estimate_id,status) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:443
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimation/approveEstimate`,
          {
            estimate_id: estimate_id,
            approval:status
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getContactList()
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  const getEstimateApprovals = async () => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          pass:"pass"
        },
      };

      try {
        const { data } = await axios.get(
          Baseurl + `/db/settings/generalSettings`,
          header
        );
        setEstimateApprovals(data?.data[2]?.setting_value.split(",").map(Number)); 
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    getCity(stateId);
  }, [stateId]);

  // buttons

  

  async function getAccountsList() {
    await fetchData(
      // `/db/account?platform_id=5`,
      `/db/media/campaign/campaignManagement/getCampaign`,
      setEstimatesList,
      errorToast,
      setErrorToast
    );
  }
  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    if (
      editMode &&
      userInfo?.db_media_campaign?.cmpn_b_t_id &&
      !userInfo?.cmpn_b_t_id
    ) {
      setUserInfo({
        ...userInfo,
        cmpn_b_t_id: userInfo?.db_media_campaign.cmpn_b_t_id,
      });
    }
    const selectedBusiness = busiessTypeList.find(
      (data) => data.cmpn_b_t_id === userInfo?.cmpn_b_t_id
    );

    console.log(
      "data is ",
      data.cmpn_b_t_id,
      "user if s",
      userInfo?.cmpn_b_t_id
    );

    if (selectedBusiness?.cmpn_b_t_name === "Agency") {
      setIsAgency(true);
    } else {
      setIsAgency(false);
    }
  }, [userInfo, busiessTypeList, editMode]);


  async function getBusinessTypeList() {
    await fetchData(
      `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
      setBusinessTypeList,
      errorToast,
      setErrorToast
    );
  }

  async function getEstimateStatusList() {
    await fetchData(
      `/db/media/estimationStatus/getEstimationStatus`,
      setEstimateStatusList,
      errorToast,
      setErrorToast
    );
  }

  const filteredStatusList = !id 
  ? estimateStatusList.filter((item) => item.est_s_id === 1)
  : estimateStatusList.filter((item) => item.est_s_id !== 1);

  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${id}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  async function getAgencySites() {
    await fetchData(
      `/db/media/estimationAgencyBusiness/getSitesForAgencyEstimates?estimate_id=${id}`,

      setAgencySiteLists,
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
      // getusersList(data);
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
          m_id: 436,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/estimation/getEstimation?estimate_id=${id}`,
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

  const validate = () => {
    const errors = {};
    if (userInfo.campaign_id === null || userInfo.campaign_id === "") {
      errors.campaign_id = "Campaign Name is required";
    }

    // if(!userInfo.est_s_id){
    //   errors.est_s_id = "Enter Estimate Approval Status";
    // }
   
    if (isAgency) {
      console.log(userInfo)
      if (userInfo.agency_commission_display==null)
        errors.agency_commission_display =
          "Agency commission display is required";
      if (userInfo.agency_commission_mounting==null  )
        errors.agency_commission_mounting =
          "Agency commission mounting is required";
      if (userInfo.agency_commission_printing==null )
        errors.agency_commission_printing =
          "Agency commission printing is required";
    }
    if (!userInfo.package_offer)
      errors.package_offer = "Package offer is required";

    if(userInfo.package_offer=="Yes"){
      if (userInfo.package_cost_display==null )
        errors.package_cost_display = "Package cost display is required";
      if (userInfo.package_cost_mounting==null )
        errors.package_cost_mounting = "Package cost mounting  is required";
      if (userInfo.package_cost_printing==null )
        errors.package_cost_printing = "Package cost printing  is required";
    }
   
    if (!userInfo.estimate_date)
      errors.estimate_date = "Estimate Date is required";
    if (!userInfo.estimate_type.trim())
      errors.estimate_type = "Estimate Type is required"; // Ensure estimate_type is not empty

    setErrorData(errors);
    return Object.keys(errors).length === 0;
  };

  const submitHandler = async () => {
    if (validate()) {
      if (hasCookie("token")) {
        setisAddLoading(true);
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 435,
          },
        };

        let oppBody = { ...userInfo };
        oppBody.contact_owner = loginDetails.user_id;
        oppBody.submitted_date=new Date().toISOString().split("T")[0]
        try {
          const response = await axios.post(
            Baseurl + `/db/media/estimation/addEstimation`,
            oppBody,
            header
          );
          if (response.status === 204 || response.status === 200) {
            // await postFieldsFunc(
            //   response.data.data.contact_id,
            //   userInfo.db_contact_fields
            // );
            toast.success(response.data.message);
            setisAddLoading(false);
            router.push("/media/Estimations");
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
            toast.error("Something went wrong2!");
          }
          setisAddLoading(false);
        }
      }
    } else {
      toast.error("Please fill the Mandatory fileds");
    }
  };

  const UpdateHandler = async () => {
    if (validate()) {
      if (hasCookie("token")) {
        setisAddLoading(true);
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 437,
          },
        };
        let newUserInfo;

        if (!isAgency) {
          newUserInfo = {
            ...userInfo,
            updated_on: DateNow,
            agency_commission_display: 0,
            agency_commission_mounting: 0,
            agency_commission_printing: 0,
          };
        } else {
          newUserInfo = { ...userInfo, updated_on: DateNow };
        }

        let newData = JSON.parse(JSON.stringify(newUserInfo));

        try {
          const response = await axios.put(
            Baseurl + `/db/media/estimation/updateEstimation`,
            newData,
            header
          );

          if (response.status === 200 || response.status === 204) {
            // await postFieldsFunc(newData.contact_id, newData.db_contact_fields);
            toast.success(response.data.message);
            setisAddLoading(false);

            router.push("/media/Estimations");
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
          setisAddLoading(false);
        }
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

  // async function postFieldsFunc(id, data) {
  //   if (hasCookie("token")) {
  //     setisAddLoading(true);
  //     let token = getCookie("token");
  //     let db_name = getCookie("db_name");
  //     let header = {
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: "Bearer ".concat(token),
  //         db: db_name,
  //         pass: "pass",
  //       },
  //     };
  //     data?.map((item) => {
  //       item.contact_id = id;
  //     });

  //     try {
  //       const response = await axios.post(
  //         Baseurl + `/db/contacts/field`,
  //         data,
  //         header
  //       );
  //       if (response.status === 204 || response.status === 200) {
  //         toast.success(response.data.message);
  //         setisAddLoading(false);
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
  //       setisAddLoading(false);
  //     }
  //   }
  // }

  const AddFieldsFunc = (e) => {
    e.preventDefault();
    setiscollapse(true);
  };

  useEffect(() => {
    getAgencySites();
  }, [setGetAgencyData, getAgencyData]);

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

  const deleteAssetSite = async (site_id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id:437
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimationAssetBusiness/addEstimationAssetBusiness`,
          {
            estimate_id: id,
            sites: [
              {
                site_id: deleteSiteAssetId,
                status: false,
              },
            ],
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setAssetDeleteShowConfirm(false)
          getAssetSites();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
          setDeleteSiteAssetId('')
        } else {
          toast.error("Something went wrong!");
        }
        setisAddLoading(false);
      }
    }
  };

  const deleteAgencySite = async () => {
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
        const response = await axios.delete(
          Baseurl +
            `/db/media/estimationAgencyBusiness/deleteSitesForAgencyEstimates?site_id=${deleteSiteAgencyId}`,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAgencySites();
          setdeleteshowConfirm(false);
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
          setDeleteSiteAgencyId("");
        } else {
          toast.error("Something went wrong!");
          setdeleteshowConfirm(false);
        }
        setisAddLoading(false);
      }
    }
  };

  useEffect(() => {
    getBusinessTypeList();
    getEstimateStatusList()
    getEstimateApprovals()
    getAccountsList();
    getSidebarInfo()
    checkLogin();
    // getusersList();
    setUserInfo({
      ...userInfo,
      created_on: DateNow,
      updated_on: DateNow,
    });
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      event.target.value = "";
    } else {
      setUserInfo({
        ...userInfo,
        proof_attachment: file,
      });
    }
  };

  const handleDMPCInfoChange = (e, fieldType) => {
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
        updatedInfo.total_selling_cost =
          parseFloat(updatedInfo.display_selling_cost || 0) +
          parseFloat(updatedInfo.mounting_selling_cost || 0) +
          parseFloat(updatedInfo.printing_selling_cost || 0);

        updatedInfo.total_buying_cost =
          parseFloat(updatedInfo.display_buying_cost || 0) +
          parseFloat(updatedInfo.mounting_buying_cost || 0) +
          parseFloat(updatedInfo.printing_buying_cost || 0);

        return updatedInfo;
      });
    }
  };

  const handleTotalCostInfoChange = (e, fieldType) => {
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
        updatedInfo.total_client_cost_with_tax =
          parseFloat(updatedInfo.total_client_cost_without_tax || 0) +
          parseFloat(updatedInfo.client_tax || 0);

        updatedInfo.total_vendor_cost_with_tax =
          parseFloat(updatedInfo.total_vendor_cost_without_tax || 0) +
          parseFloat(updatedInfo.vendor_tax || 0);

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
    getAssetSites();
  }, [router.isReady, id]);

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
    getAgencySites();
  }, [router.isReady, id]);

  useState(() => {
    getAgencySites();
  }, [show]);

  

  

  return (
    <>
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">
            {" "}
            {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} Estimation
          </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fw-bolder ">
                <Link href="/media">Home</Link>
              </li>
              <li className="breadcrumb-item fw-bolder">
                <Link href="/media/Estimations"> Estimations </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {viewMode ? "View" : <>{editMode ? "Edit" : "Add"}</>}{" "}
                Estimation
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="Add_user_screen">
            <div className="row">
              <div className={`col-xl-12 col-md-12 col-sm-12 col-12`}>
                <div className="add_screen_head d-flex justify-content-between">
                  <span className="text_bold">Fill Details ( * Fields are
                    mandatory)</span> 
                    {
                      id && (
                        <ButtonGroup>
                      {/* Asset */}
                      {
                        (isasset &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[4]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isasset && isDB && isNewOrReopen) && (
                          <Button  key="offer-asset-site" variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }} onClick={() => {
                            getState();
                            setShow1(true);
                          }} >
                            Offer Site
                          </Button>
                        )
                      }
                      
                      {
                        (isasset &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[5]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isasset && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }} onClick={() => {
                            getState();
                            setShow5(true);
                          }} >
                            Client Cost Sheet
                          </Button>
                        )
                      }

                      {
                        (isasset &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[6]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isasset && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}  onClick={() => {
                            getState();
                            setShowVendorAsset(true);
                          }} >
                          Vendor Cost Sheet
                          </Button>
                        )
                      }

                      

                      {/* Asset */}

                      {/* Agency */}

                      {
                        (isagency &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[4]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isagency && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}  onClick={() => {
                            setShow3(true);
                          }}  >
                          Offer Site
                          </Button>
                        )
                      }

                      
                      {
                        (isagency &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[4]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isagency && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}  onClick={() => {
                            setShow4(true);
                          }}  >
                          Upload Site
                          </Button>
                        )
                      }
                      
                      {
                        (isagency &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[5]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isagency && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}  onClick={() => {
                            getState();
                              setShow6(true);
                          }}  >
                          Client Cost Sheet
                          </Button>
                        )
                      }
                      
                      {
                        (isagency &&
                          mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[6]?.actions == 1 &&
                          isNewOrReopen) ||
                        (isagency && isDB && isNewOrReopen) && (
                          <Button variant="transparent" style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}    onClick={() => {
                            getState();
                            setShowVendorAgency(true);
                        }}  >
                        Vendor Cost Sheet
                        </Button>
                        )
                      }
                      



                      {/* Agency */}

                      <DropdownButton
                        as={ButtonGroup}
                        variant="transparent"
                        id="bg-nested-dropdown"
                        
                        style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}
                      >
                        {
                          (mediaSidebarInfo[0]?.children?.find(
                            (item) => item?.menu_id == 433
                          )?.children[0]?.children[9]?.actions == 1 &&
                            isNewOrReopen) ||
                          (isDB && isNewOrReopen) && (
                            <Dropdown.Item eventKey="1" onClick={() => {
                              sentForApproval(id);
                            }} >Send For Approval</Dropdown.Item>
                          )
                        }

                        { (mediaSidebarInfo[0]?.children?.find(
                  (item) => item?.menu_id == 433
                )?.children[0]?.children[8]?.actions == 1 &&
                  estimateApprovals?.indexOf(userInfo?.role_id) !== -1 &&
                  isSentForApproval) ||
                (userInfo?.isDB == true && isSentForApproval)
                             &&(
                              <>
                                   <Dropdown.Item eventKey="2" onClick={() => {
                              accept_rejectApproval(id, "true");
                            }} >Accept</Dropdown.Item>
                        

                      <Dropdown.Item eventKey="3" onClick={() => {
                        accept_rejectApproval(id, "false");
                      }} >Reject</Dropdown.Item>
                              </>
                             )
                        }
                        
                       

                      {
                        (mediaSidebarInfo[0]?.children?.find(
                          (item) => item?.menu_id == 433
                        )?.children[0]?.children[7]?.actions == 1 &&
                          isApproved) ||
                        (userInfo?.isDB === true && isApproved) && (
                          <Dropdown.Item as={Link} href={`/media/PorformaInvoice?est_id=${id}`} eventKey="4">Invoice</Dropdown.Item>
                        )
                      }

                        <Dropdown.Item eventKey="5" onClick={() => {
                          setShowSalesOrder(true)
                        }} >Sales Order</Dropdown.Item>

                        <Dropdown.Item eventKey="6" onClick={() => {
                          setShowPurchaseOrder(true)
                        }} >Purchase Order</Dropdown.Item>

                        <Dropdown.Item eventKey="7" onClick={() => {
                          setShowGenerateCard(true)
                        }} >Generate Job Card</Dropdown.Item>

                        <Dropdown.Item eventKey="8" onClick={() => {
                          setShowNDP(true)
                        }} >Update NDP</Dropdown.Item>

                      </DropdownButton>
                    </ButtonGroup>
                      )
                    }
                    

                </div>
                <div className="add_user_form">
                  <div className="row">
                  {
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Estimation ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={userInfo?.estimation_code}
                          />
                        </div>
                      </div>
                  )
                }
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.estimate_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="estimate_date">Estimate Date*</label>
                        <input
                          type="date"
                          className="form-control"
                          id="estimate_date"
                          disabled={viewMode}
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={moment(userInfo?.estimate_date).format(
                            "YYYY-MM-DD"
                          )}
                          onChange={(e) => {
                            setErrorData({ ...errorData, estimate_date: "" });
                            setUserInfo({
                              ...userInfo,
                              estimate_date: e.target.value,
                            });
                          }}
                        />
                        <span className="errorText">
                          {errorData?.estimate_date
                            ? errorData.estimate_date
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.estimate_type
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="estimate_type">Estimate Type *</label>
                        <input
                          type="text"
                          id="estimate_type"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Estimate Type"
                          value={userInfo?.estimate_type || ""}
                          onChange={(e) => {
                            setErrorData({ ...errorData, estimate_type: "" });
                            // Regular expression to match only alphabetic characters and spaces
                            const regex = /^[A-Za-z\s]*$/;
                            const value = e.target.value;

                            if (regex.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                estimate_type: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.estimate_type
                            ? errorData.estimate_type
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.estimate_approval_status ? "input_box errorBox" : "input_box"}>
                  <label htmlFor="estimate_approval_status">Estimate Approval Status *</label>
                  <Select
                          id="client_name"
                          defaultValue={""}
                          placeholder="Select Estimate Approval Status  "
                          options={ filteredStatusList?.map((data)=>{
                            return{
                              value: data?.est_s_id,
                              label: data?.est_s_name,
                            }
                          })
                          }
                          value={estimateStatusList?.map((data, index) => {
                            if (userInfo.est_s_id === data.est_s_id) {
                              return {
                                value: data?.est_s_id,
                                label: data?.est_s_name,
                              };
                            }
                          })}
                          onChange={(e) => {
                            setUserInfo({ ...userInfo, est_s_id: e.value });
                            setErrorData({ ...errorData, est_s_id: "" });
                          }}
                        />
                  <span className="errorText">{errorData?.est_s_id ? errorData.est_s_id : ""}</span>
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
                        <label htmlFor="campaign_name">Campaign Name *</label>
                        <Select
                          id="campaign_name"
                          defaultValue={""}
                          placeholder="Enter Campaign"
                          isDisabled={viewMode}
                          options={estimatesList?.map((data, index) => {
                            return {
                              value: data?.campaign_id,
                              label: data?.campaign_name,
                            };
                          })}
                          value={estimatesList?.map((data, index) => {
                            if (userInfo.campaign_id === data.campaign_id) {
                              return {
                                value: data?.campaign_id,
                                label: data?.campaign_name,
                              };
                            }
                          })}
                          onChange={(e) => {
                            setErrorData({ ...errorData, campaign_id: "" });
                            const campaign = estimatesList?.find(
                              (item) => item?.campaign_id == e.value
                            );
                            setUserInfo({
                              ...userInfo,
                              campaign_id: e.value,
                              campaign_start_date:
                                campaign?.campaign_start_date,
                              campaign_end_date: campaign?.campaign_end_date,
                              campaign_duration: campaign?.campaign_duration,
                              cmpn_b_t_id: campaign?.cmpn_b_t_id,
                              display_selling_cost:campaign?.client_display_cost,
                              printing_selling_cost:campaign?.client_printing_cost,
                              mounting_selling_cost:campaign?.client_mounting_cost,
                              total_selling_cost:campaign?.client_printing_cost+campaign?.client_mounting_cost+campaign?.client_display_cost,

                              display_buying_cost:campaign?.total_vendor_display_cost,
                              printing_buying_cost:campaign?.total_vendor_printing_cost,
                              mounting_buying_cost:campaign?.total_vendor_mounting_cost,
                              total_buying_cost:campaign?.total_vendor_printing_cost+campaign?.total_vendor_mounting_cost+campaign?.total_vendor_display_cost,

                              overall_margin:campaign?.overall_margin,
                              display_margin:campaign?.display_margin,
                              mounting_margin:campaign?.mounting_margin,
                              printing_margin:campaign?.printing_margin,

                              overall_margin_percentage:campaign?.overall_margin_percentage,
                              display_margin_percentage:campaign?.display_margin_percentage,
                              mounting_margin_percentage:campaign?.mounting_margin_percentage,
                              printing_margin_percentage:campaign?.printing_margin_percentage,

                            });
                            setErrorData({ ...errorData, campaign_id: "" });
                          }}
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.campaign_id ? errorData.campaign_id : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.estimate_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="campaign_start_date">
                          Campaign Start Date*
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="campaign_start_date"
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={
                            id
                              ? moment(
                                  estimatesList?.find(
                                    (item) =>
                                      item?.campaign_id == userInfo?.campaign_id
                                  )?.campaign_start_date
                                ).format("YYYY-MM-DD")
                              : moment(userInfo?.campaign_start_date).format(
                                  "YYYY-MM-DD"
                                )
                          }
                          disabled
                          onChange={(e) => {
                            setErrorData({
                              ...errorData,
                              campaign_start_date: "",
                            });
                            setUserInfo({
                              ...userInfo,
                              campaign_start_date: e.target.value,
                            });
                          }}
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
                          errorData?.estimate_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="campaign_end_date">
                          Campaign End Date*
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          disabled
                          id="campaign_end_date"
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          // value={moment(userInfo?.campaign_end_date).format(
                          //   "YYYY-MM-DD"
                          // )}

                          value={
                            id
                              ? moment(
                                  estimatesList?.find(
                                    (item) =>
                                      item?.campaign_id == userInfo?.campaign_id
                                  )?.campaign_end_date
                                ).format("YYYY-MM-DD")
                              : moment(userInfo?.campaign_end_date).format(
                                  "YYYY-MM-DD"
                                )
                          }
                          onChange={(e) => {
                            setErrorData({
                              ...errorData,
                              campaign_end_date: "",
                            });
                            setUserInfo({
                              ...userInfo,
                              campaign_end_date: e.target.value,
                            });
                          }}
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
                          // value={`${userInfo?.campaign_duration} days` || "0days"}
                          value={
                            id
                              ? estimatesList?.find(
                                  (item) =>
                                    item?.campaign_id == userInfo?.campaign_id
                                )?.campaign_duration
                              : userInfo?.campaign_duration || "0days"
                          }
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
                          isDisabled
                          options={busiessTypeList?.map((data, index) => {
                            return {
                              value: data?.cmpn_b_t_id,
                              label: data?.cmpn_b_t_name,
                            };
                          })}
                          value={busiessTypeList?.map((data, index) => {
                            if (
                              id &&
                              data.cmpn_b_t_id ==
                                userInfo?.db_media_campaign?.cmpn_b_t_id
                            ) {
                              return {
                                value: data?.cmpn_b_t_id,
                                label: data?.cmpn_b_t_name,
                              };
                            } else if (
                              userInfo.cmpn_b_t_id === data.cmpn_b_t_id
                            ) {
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

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.package_offer
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="package_offer">Package Offer *</label>
                        <Select
                          id="package_offer"
                          className="react-select"
                          classNamePrefix="select"
                          isDisabled={viewMode}
                          options={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                          ]}
                          value={[
                            { value: "Yes", label: "Yes" },
                            { value: "No", label: "No" },
                          ].find(
                            (option) => option.value === userInfo.package_offer
                          )}
                          onChange={(selectedOption) => {
                            setErrorData({ ...errorData, package_offer: "" });
                            setUserInfo({
                              ...userInfo,
                              package_offer: selectedOption
                                ? selectedOption.value
                                : null,
                            });
                          }}
                          placeholder="Select Package Offer"
                        />
                        <span className="errorText">
                          {errorData?.package_offer
                            ? errorData.package_offer
                            : ""}
                        </span>
                      </div>
                    </div>

                    {
                      userInfo?.package_offer =="Yes" && (
                          <>
                              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.package_cost_display
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="package_cost_display">
                          Package Cost Display *
                        </label>
                        <input
                          type="text"
                          id="package_cost_display"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Display Currency"
                          value={userInfo?.package_cost_display}
                          // onChange={(e) => {
                          //   const value = e.target.value;
                          //   // Allow only numeric characters and decimal point
                          //   if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                          //     setUserInfo({ ...userInfo, package_cost_display: value });
                          //   }
                          // }}

                          onChange={(e) => {
                            setErrorData({
                              ...errorData,
                              package_cost_display: "",
                            });
                            const value = e.target.value;
                            const regex = /^\d*\.?\d*$/;
                            if (regex.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                package_cost_display: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.package_cost_display
                            ? errorData.package_cost_display
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.package_cost_mounting
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="package_cost_mounting">
                          Package Cost Mounting *
                        </label>
                        <input
                          type="text"
                          id="package_cost_mounting"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Mounting Currency"
                          value={userInfo?.package_cost_mounting}
                          onChange={(e) => {
                            setErrorData({
                              ...errorData,
                              package_cost_mounting: "",
                            });
                            const value = e.target.value;
                            // Allow only numeric characters and decimal point
                            if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                package_cost_mounting: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.package_cost_mounting
                            ? errorData.package_cost_mounting
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.package_cost_printing
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="package_cost_printing_currency">
                          Package Cost Printing *
                        </label>
                        <input
                          type="text"
                          id="package_cost_printing"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Printing Currency"
                          value={userInfo?.package_cost_printing}
                          onChange={(e) => {
                            setErrorData({
                              ...errorData,
                              package_cost_printing: "",
                            });
                            const value = e.target.value;
                            // Allow only numeric characters and decimal point
                            if (/^[0-9]*\.?[0-9]*$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                package_cost_printing: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.package_cost_printing
                            ? errorData.package_cost_printing
                            : ""}
                        </span>
                      </div>
                    </div>
                          </>
                      )
                    }

                    

                    {isAgency && (
                      <>
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.commission_display
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="agency_commission_display">
                              Agency Commission on Display (%) *
                            </label>
                            <input
                              type="text"
                              id="agency_commission_display"
                              className="form-control"
                              disabled={viewMode}
                              placeholder="Enter Display Commission Percentage"
                              value={userInfo?.agency_commission_display}
                              onChange={(e) => {
                                setErrorData({
                                  ...errorData,
                                  agency_commission_display: "",
                                });
                                const value = e.target.value;
                                // Allow only numeric characters and decimal point
                                if (/^\d{0,3}$/.test(value)) {
                                  setUserInfo({
                                    ...userInfo,
                                    agency_commission_display: value,
                                  });
                                }
                              }}
                            />
                            <span className="errorText">
                              {errorData?.agency_commission_display
                                ? errorData.agency_commission_display
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.agency_commission_mounting
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="agency_commission_mounting">
                              Agency Commission on Mounting (%) *
                            </label>
                            <input
                              type="text"
                              id="agency_commission_mounting"
                              className="form-control"
                              disabled={viewMode}
                              placeholder="Enter Mounting Commission Percentage"
                              value={userInfo?.agency_commission_mounting}
                              onChange={(e) => {
                                setErrorData({
                                  ...errorData,
                                  agency_commission_mounting: "",
                                });
                                const value = e.target.value;
                                // Allow only numeric characters and decimal point
                                if (/^\d{0,3}$/.test(value)) {
                                  setUserInfo({
                                    ...userInfo,
                                    agency_commission_mounting: value,
                                  });
                                }
                              }}
                            />
                            <span className="errorText">
                              {errorData?.agency_commission_mounting
                                ? errorData.agency_commission_mounting
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.agency_commission_printing
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="commission_printing">
                              Agency Commission on Printing (%) *
                            </label>
                            <input
                              type="text"
                              id="commission_printing"
                              className="form-control"
                              disabled={viewMode}
                              placeholder="Enter Printing Commission Percentage"
                              value={userInfo?.agency_commission_printing}
                              onChange={(e) => {
                                setErrorData({
                                  ...errorData,
                                  agency_commission_printing: "",
                                });
                                const value = e.target.value;
                                // Allow only numeric characters and decimal point
                                if (/^\d{0,3}$/.test(value)) {
                                  setUserInfo({
                                    ...userInfo,
                                    agency_commission_printing: value,
                                  });
                                }
                              }}
                            />
                            <span className="errorText">
                              {errorData?.agency_commission_printing
                                ? errorData.agency_commission_printing
                                : ""}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.total_agency_commision
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="commission_printing">
                              Total Agency Commission
                            </label>
                            <input
                              type="text"
                              id="commission_printing"
                              className="form-control"
                              disabled
                              placeholder="Enter Total Agency Commission"
                              value={userInfo?.total_agency_commision}
                              onChange={(e) => {
                                setErrorData({
                                  ...errorData,
                                  total_agency_commision: "",
                                });
                                const value = e.target.value;
                                // Allow only numeric characters and decimal point
                                if (/^\d{0,3}$/.test(value)) {
                                  setUserInfo({
                                    ...userInfo,
                                    total_agency_commision: value,
                                  });
                                }
                              }}
                            />
                            <span className="errorText">
                              {errorData?.agency_commission_printing
                                ? errorData.agency_commission_printing
                                : ""}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                    {
                      viewMode && (
                        <>
                            <div className="add_screen_head">
                  <span className="text_bold">Approval Details </span>
                </div>
                <div className="add_user_form">
                  <div className="row ">
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.submitted_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="submitted_date">Submitted Date </label>
                        {/* <input
                          type="date"
                          id="submitted_date"
                          className="form-control"
                          disabled={true}
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={
                            userInfo?.submitted_date
                              ? moment(userInfo?.submitted_date).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              submitted_date: e.target.value,
                            })
                          }
                        /> */}
                        <input
                          type="date"
                          id="submitted_date"
                          className="form-control"
                          disabled={true}
                          min={new Date().toISOString().split("T")[0]} // Ensure min date is today's date
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={
                            userInfo?.submitted_date
                              ? moment(userInfo?.submitted_date).format("YYYY-MM-DD")
                              : new Date().toISOString().split("T")[0] // Set today's date as the default value
                          }
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              submitted_date: e.target.value,
                            })
                          }
                        />

                        <span className="errorText">
                          {errorData?.submitted_date
                            ? errorData.submitted_date
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.approval_status
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="approval_status">
                          Approval Status{" "}
                        </label>
                        <input
                          type="text"
                          id="approval_status"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Approval Status"
                          value={userInfo?.approval_status}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only alphabetic characters (including spaces)
                            if (/^[A-Za-z0-9\s]*$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                approval_status: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.approval_status
                            ? errorData.approval_status
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.approved_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="approved_date">Approved Date </label>
                        <input
                          type="date"
                          id="approved_date"
                          disabled={viewMode}
                          className="form-control"
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={
                            userInfo?.approved_date
                              ? moment(userInfo?.approved_date).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              approved_date: e.target.value,
                            })
                          }
                        />
                        <span className="errorText">
                          {errorData?.approved_date
                            ? errorData.approved_date
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.approval_comments
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="approval_comments">
                          Approval Comments{" "}
                        </label>
                        <input
                          type="text"
                          id="approval_comments"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Approval Comments"
                          value={userInfo?.approval_comments}
                          onChange={(e) => {
                            // Regular expression to match only alphabetic characters and spaces
                            const value = e.target.value;

                            setUserInfo({
                              ...userInfo,
                              approval_comments: value,
                            });
                          }}
                        />
                        <span className="errorText">
                          {errorData?.approval_comments
                            ? errorData.approval_comments
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.rejected_date
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="rejected_date">Rejected Date </label>
                        <input
                          type="date"
                          id="rejected_date"
                          className="form-control"
                          disabled={viewMode}
                          min={new Date().toISOString().split("T")[0]}
                          onPaste={(e) => e.preventDefault()}
                          onKeyDown={(e) => e.preventDefault()}
                          value={
                            userInfo?.rejected_date
                              ? moment(userInfo?.rejected_date).format(
                                  "YYYY-MM-DD"
                                )
                              : ""
                          }
                          onChange={(e) =>
                            setUserInfo({
                              ...userInfo,
                              rejected_date: e.target.value,
                            })
                          }
                        />
                        <span className="errorText">
                          {errorData?.rejected_date
                            ? errorData.rejected_date
                            : ""}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.rejection_comments
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="rejection_comments">
                          Rejection Comments{" "}
                        </label>
                        <input
                          type="text"
                          id="rejection_comments"
                          className="form-control"
                          disabled={viewMode}
                          placeholder="Enter Rejection Comments"
                          value={userInfo?.rejection_comments}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Allow only alphabetic characters (including spaces)
                            if (/^[A-Za-z0-9\s]*$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                rejection_comments: value,
                              });
                            }
                          }}
                        />
                        <span className="errorText">
                          {errorData?.rejection_comments
                            ? errorData.rejection_comments
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                        </>
                      )
                    }
                {
                  id ?(
                    <>

<div className="add_screen_head">
                  <span className="text_bold">
                    Display, Mounting and Printing Cost{" "}
                  </span>
                </div>
                <div className="add_user_form">
                  <div className="row ">
                    {DMPCArray?.map((item) => (
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
                            disabled={
                              viewMode ||
                              item?.id === "total_selling_cost" ||
                              item?.id === "total_buying_cost"
                            }
                            placeholder={`Enter ${item?.label}`}
                            value={userInfo?.[item?.id]}
                            onChange={(e) =>
                              handleDMPCInfoChange(e, item?.fieldType)
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
                  <span className="text_bold">Total Cost</span>
                </div>
                <div className="add_user_form">
                  <div className="row ">
                    {TotalCostArray1?.map((item) => (
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
                            disabled={
                              viewMode ||
                              item?.id === "total_vendor_cost_with_tax" ||
                              item?.id === "total_client_cost_with_tax"
                            }
                            placeholder={`Enter ${item?.label}`}
                            value={userInfo?.[item?.id]}
                            onChange={(e) =>
                              handleTotalCostInfoChange(e, item?.fieldType)
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
                    {TotalCostArray2?.map((item) => (
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
                            disabled={
                              viewMode ||
                              item?.id === "total_vendor_cost_with_tax" ||
                              item?.id === "total_client_cost_with_tax"
                            }
                            placeholder={`Enter ${item?.label}`}
                            value={userInfo?.[item?.id]}
                            onChange={(e) =>
                              handleTotalCostInfoChange(e, item?.fieldType)
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
                  <span className="text_bold">Additional Information</span>
                </div>
                <div className="add_user_form">
                  <div className="row ">
                    {additionalInfoArray?.map((item) => (
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
                            disabled={viewMode}
                            placeholder={`Enter ${item?.label}`}
                            value={userInfo?.[item?.id]}
                            onChange={(e) =>
                              handleTotalCostInfoChange(e, item?.fieldType)
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
                            type="text"
                            id={item?.id}
                            className="form-control"
                            disabled={viewMode}
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

                  ) :null
                }

                {
                  id && (
                    <>
                        <AssetSites 
                          busiessTypeList={busiessTypeList}
                          userInfo={userInfo}
                          assetDeleteShowConfirm={assetDeleteShowConfirm}
                          viewMode={viewMode}
                          setAssetDeleteShowConfirm={setAssetDeleteShowConfirm}
                          setDeleteSiteAssetId={setDeleteSiteAssetId}
                          id={id}
                          deleteAssetSite={deleteAssetSite}
                          assetSiteLists={assetSiteLists}
                          errorToast={errorToast}
                          setErrorToast={setErrorToast}
                        />

                        

                        <AgencySites 
                          busiessTypeList={busiessTypeList}
                          userInfo={userInfo}
                          deleteshowConfirm={deleteshowConfirm}
                          setdeleteshowConfirm={setdeleteshowConfirm}
                          deleteAgencySite={deleteAgencySite}
                          agencySiteLists={agencySiteLists}
                          viewMode={viewMode}
                          show={show}
                          setShow={setShow}
                          setGetAgencyData={setGetAgencyData}
                          handleClose={handleClose}
                          getAgencyData={getAgencyData}
                          agencySiteData={agencySiteData}
                          setAgencySiteData={setAgencySiteData}
                          setDeleteSiteAgencyId={setDeleteSiteAgencyId}
                          id={id}
                        />

                        <SalesOrderManagement 
                            id={id}
                            link={`${filesUrl}/supportDoc/images${userInfo?.sales_order_pdf}`}
                        />

                        <PurchaseOrderManagement
                            id={id}
                            link={`${filesUrl}/supportDoc/images${userInfo?.sales_order_pdf}`}
                        />

                        <JobCardManagement
                          id={id}
                          type={userInfo?.cmpn_b_t_id}
                        />
                    </>
                  )
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
                                  <label htmlFor="newInputType">
                                    Input Type
                                  </label>
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
                            <Link href="/media/Estimations">
                              <button className="btn btn-cancel m-3 ">
                                Cancel
                              </button>
                            </Link>
                            {editMode ? (
                              <button
                                disabled={isAddLoading}
                                className="btn btn-primary"
                                onClick={UpdateHandler}
                              >
                                {isAddLoading ? "Loading..." : "Update"}
                              </button>
                            ) : (
                              <button
                                disabled={isAddLoading}
                                className="btn btn-primary"
                                onClick={submitHandler}
                              >
                                {isAddLoading ? "Loading..." : "Save & Submit"}
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
      
      <ModelAssetSite1 
          show={show1}
          handleClose={handleClose1}
          stateList={stateList}
          setStateId={setStateId}
          setCityIds={setCityIds}
          cityList={cityList}
          stateId={stateId}
          cityIds={cityIds}
          getSiteList={getSiteList}
      />

      <ModelAssetSite2
        show2={show2}
        handleClose2={handleClose2}
        siteLists={siteLists}
        isLoading={isLoading}
        selectedSites={selectedSites}
        handleSelectSite={handleSelectSite}
        addAssetInSite={addAssetInSite}
        getSingleData={getSingleData}
        getAssetSites={getAssetSites}
      />

      <ModelClientCostAsset
        show={show5}
        handleClose={handleClose5}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={id}
        getSingleData={getSingleData}
      />

      <ModelVendorCostAsset
        show={showVendorAsset}
        handleClose={handleVendorAssetClose}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={id}
        getContactList={getContactList}
        getSingleData={getSingleData}
      />

      <ModelAgencySite
        show={show3}
        handleClose3={handleClose3}
        estimateId={id}
        getSingleData={getSingleData}
      />

      <ModelAgencySiteUpload
        show={show4}
        handleClose={handleClose4}
        estimateId={id}
        getSingleData={getSingleData}
      />

      <ModelClientCostAgency
        show={show6}
        handleClose={handleClose6}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={id}
        getContactList={getContactList}
        getSingleData={getSingleData}
      />

      <ModelVendorCostAgency
        show={showVendorAgency}
        handleClose={handleVendorAgencyClose}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={id}
        getContactList={getContactList}
        getSingleData={getSingleData}
      />

      <ModelSalesOrder
        show={showSalesOrder}
        handleClose={handleCloseSalesOrder}
        estimateData={userInfo}
        estimateID={id}
        getSingleData={getSingleData}
      />
      
      <ModelPurchaseOrder
          show={showPurchaseOrder}
          handleClose={handleClosePurchaseOrder}
          businessType={userInfo?.cmpn_b_t_id}
          estimateID={id}
          getSingleData={getSingleData}
      />

      <ModelGenerateCard 
        show={showGenerateCard}
        handleClose={handleCloseGenerateCard}
        businessType={userInfo?.cmpn_b_t_id}
        estimateID={id}
        getSingleData={getSingleData}
      />

      <UpdateNDPModel
        id={id}
        assetSiteLists={assetSiteLists}
        show={showNDP}
        handleClose={handleCloseNDPModel}
      />

    </>
  );
};

export default AddEstimationScreen;
