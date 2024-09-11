import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Select from 'react-select';
import { Table } from "react-bootstrap";


const AddSitesScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [iscollapse, setiscollapse] = useState(false);
  const [countrylist, setcountrylist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [leasedShow,setLeasedShow]=useState(false);
  const [userInfo,setUserInfo]=useState({
    site_code:"",
    acc_id:"",
    site_cat_id:"",
    country_id:"",
    state_id:"",
    city_id:"",
    location:"",
    m_f_id:"",
    m_v_id:"",
    m_t_id:"",
    s_s_id:"",
    traffic_from:"",
    traffic_to:"",
    position_of_site:"",
    lat_long:"",
    rating_id:"",
    a_s_id:"",
    available_from:"",
    available_to:"",
    remarks:"",
    lease_from:"",
    lease_to:"",
    lease_period:null,
    lease_cost:null,
    width:"",
    height:"",
    quantity:"",
    total_sq_ft:"",
    selling_cost:"",
    buying_cost:"",
    leased_cost:"",
    card_rate:"",
    selling_cost_sq_ft:"",
    buying_cost_sq_ft:"",
    leased_cost_sq_ft:"",
    card_rate_sq_ft:"",
    selling_cost_day:"",
    buying_cost_day:"",
    leased_cost_day:"",
    card_rate_day:"",
    p_close_shot:"",
    p_long_shot:"",
    p_night_shot:"",
    p_close_shot:"",
    p_close_shot_preview:"",
    p_long_shot_preview:"",
    p_night_shot_preview:""
  })
  const [errorData, setErrorData] = useState({})
  const [errorToast, setErrorToast] = useState(false);
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });
  const [accountList,setAccountList]=useState([]);
  const [siteCategories,setSiteCategories]=useState([])
  const [mediaFormats,setMediaFormats]=useState([])
  const [mediaVehicles,setMediaVehicles]=useState([])
  const [mediaTypes,setMediaTypes]=useState([])
  const [siteStatuses,setSiteStatuses]=useState([])
  const [ratings,setRatings]=useState([])
  const [availabilitySatuses,setAvailabilitySatuses]=useState([])
  const [bookingHistory,setBookingHistory] =useState([])

  async function getBookingHistory() {
    await fetchData(
      `/db/media/estimation/getSiteBookingHistory?site_id=${id}`,
      setBookingHistory,
      errorToast,
      setErrorToast
    );
  }
  

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");

 
  useEffect(()=>{
    if(userInfo.site_cat_id == 2){
      setLeasedShow(true)
    }else{
      setLeasedShow(false)
    }

  },[userInfo.site_cat_id])

  async function fetchData(url, setData) {
    const token = getCookie('token');
    const db_name = getCookie('db_name');

    const header = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        db: db_name,
        pass: 'pass',
      },
    };
    try {
      const response = await axios.get(Baseurl + url, header);
      if (response.status === 204 || response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong!');
    }
  }

  const AddFieldsFunc = (e) => {
    e.preventDefault();
    setiscollapse(true);
  }
    // const [userInfo, setUserInfo] = useState({
    //   lease_from: '',
    //   lease_to: '',
    //   lease_period: ''
    // });
  
    // Function to calculate the number of days between two dates
    const calculateLeasePeriod = (fromDate, toDate) => {
      if (fromDate && toDate) {
        // Parse dates using moment.js
        const start = moment(fromDate);
        const end = moment(toDate);
        // Calculate the difference in days
        return end.diff(start, 'days');
      }
      return '';
    };
  
    useEffect(() => {
      // Calculate lease period when either lease_from or lease_to changes
      const period = calculateLeasePeriod(userInfo.lease_from, userInfo.lease_to);
      setUserInfo(prevState => ({
        ...prevState,
        lease_period: period
      }));
    }, [userInfo.lease_from, userInfo.lease_to]);





  const createInputField = (e) => {
    e.preventDefault();
    const { field_lable, input_type, field_type, field_size, option } =
      newFields;

    const showError = (errorMessage) => {
      toast.error(errorMessage);
    };


    if (validateField()) {
      const inputReq = {
        ...newFields,
        field_name: field_lable.replaceAll(" ", "_"),
        navigate_type: userInfo.navigate_type,
        // field_order: inputsData.length + 1
      };
      let arr = userInfo;
      arr?.db_lead_fields?.push(newFields);
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
  
  const getCountryList = async () => {
    await fetchData(
      `/db/area/country?country_id=1`,
      setcountrylist,
      errorToast,
      setErrorData
    );
  };

  const getState = async (id) => {
    await fetchData(
      `/db/area/states?cnt_id=${id}`,
      setStatelist,
      errorToast,
      setErrorData
    );
  };

  const getcity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setCitylist(data.cityData),
      errorToast,
      setErrorData
    );
  };

  const getAccountList = async () => {
    await fetchData(
      `/db/account`,
      setAccountList,
      errorToast,
      setErrorData
    );
  };

  const getSiteCategories = async () => {
    await fetchData(
      `/db/media/siteManagement/getSiteCategory`,
      setSiteCategories,
      errorToast,
      setErrorData
    );
  };

  const getMediaFormats = async () => {
    await fetchData(
      `/db/media/mediaFormat/getMediaFormat`,
      setMediaFormats,
      errorToast,
      setErrorData
    );
  };

  const getMediaVehicles = async () => {
    await fetchData(
      `/db/media/mediaVehicle/getMediaVehicle`,
      setMediaVehicles,
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

  const getSiteStatuses = async () => {
    await fetchData(
      `/db/media/siteStatus/getSiteStatus`,
      setSiteStatuses,
      errorToast,
      setErrorData
    );
  };

  const getRating = async () => {
    await fetchData(
      `/db/media/rating/getRating`,
      setRatings,
      errorToast,
      setErrorData
    );
  };

  const getAvailabilitySatuses = async () => {
    await fetchData(
      `/db/media/availabiltyStatus/getAvailabiltyStatus`,
      setAvailabilitySatuses,
      errorToast,
      setErrorData
    );
  };

  const handleImageChange = (e,image,preview) => {
    
    const file = e.target.files[0];
    const allowedTypes=['image/jpg', 'image/jpeg', 'image/png'];

    if (file && allowedTypes.includes(file.type)) {
      
      const reader = new FileReader();
      reader.onloadend = () => {
        
        // setUserInfo({
        //   ...userInfo,
        //   [image]:e.target.files[0],
        //   [preview]:reader.result,
        // });
        setUserInfo((prev)=>({
          ...prev,
          [image]:file,
          [preview]:reader.result,
        }))
      };
      console.log(userInfo)
      reader.readAsDataURL(e.target.files[0]);
    }
    else{
      toast.warning(`Invalid file type. Please upload .jpg, .jpeg, .png`,{autoClose:1500});
      e.target.value = "";
    }
  };

  useEffect(() => {
    getAccountList()
    getCountryList();
    getSiteCategories()
    getMediaFormats()
    getMediaVehicles()
    getMediaTypes()
    getSiteStatuses()
    getRating()
    getAvailabilitySatuses()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const minDate = new Date().toISOString().slice(0, 10);

  const validateField = () => {
    if (!field_lable) {
      showError("Please enter the Field Name");
      return false;
    } 
   // else if (!input_type) {
    //   showError("Please select the Input Type");
    //   return false;
    // } else if (input_type === "input" && !field_type) {
    //   showError("Please select the Field Type");
    //   return false;
    // }
  
    // else if (input_type === "select" && !option) {
    //   showError("Please select input Options");
    //   return false;
    // }
    return true;
  };

  const submitHandler = async () => {
    const errors = {};

    // Validation for required fields
    if (!userInfo.acc_id) {
      errors.acc_id = "Vendor is required";
    }
  
    if (!userInfo.site_cat_id) {
      errors.site_cat_id = "Site Category is required";
    }
  
    if (!userInfo.country_id) {
      errors.country_id = "Country is required";
    }
  
    if (!userInfo.state_id) {
      errors.state_id = "State is required";
    }
  
    if (!userInfo.city_id) {
      errors.city_id = "City is required";
    }
  
    if (!userInfo.m_f_id) {
      errors.m_f_id = "Media Format is required";
    }
  
    if (!userInfo.m_v_id) {
      errors.m_v_id = "Media Vehicle is required";
    }
  
    if (!userInfo.m_t_id) {
      errors.m_t_id = "Media Type is required";
    }
  
    if (!userInfo.s_s_id) {
      errors.s_s_id = "Site Status is required";
    }
  
    if (!userInfo.rating_id) {
      errors.rating_id = "Rating is required";
    }
  
    if (!userInfo.a_s_id) {
      errors.a_s_id = "Availability Status is required";
    }
  
    // If there are validation errors, set them and stop submission
    if (Object.keys(errors).length > 0) {
      setErrorData(errors);
      return;
    }
    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 377,
          // pass:"pass"
        },
      };

      const formData=new FormData();
            for (const [key, value] of Object.entries(userInfo)) {
              formData.append(key, value);
            }


      try {
        const response = await axios.post(Baseurl + `/db/media/siteManagement/addSite`, formData, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setisLoading(false)
          router.push('/media/SiteManagement')
        }

      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {}
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
        setisLoading(false)
      }
    }
  };

  const updateHandler = async () => {
    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 379,
          // pass:"pass"
        },
      };
      const formData=new FormData();
            for (const [key, value] of Object.entries(userInfo)) {
              formData.append(key, value);
            }
     
      try {
        const response = await axios.put(
          Baseurl + `/db/media/siteManagement/updateSite`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push("/media/SiteManagement");

        }
      } catch (error) {
        if (error?.response?.data?.status === 422) {
          const taskObject = {}
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
        setisLoading(false)
      }
    }
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
          // m_id: 15
          pass:"pass"
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/media/siteManagement/getSite?site_id=${id}`,
          header
        );
        let data={...response.data.data}
        let newData={
          ...data,
          total_sq_ft:data?.total_area,
          selling_cost_sq_ft:Number(data?.selling_cost_per_unit).toFixed(1),
          selling_cost_day:Number(data?.selling_cost_per_day).toFixed(1),
          buying_cost_sq_ft:Number(data?.buying_cost_per_unit).toFixed(1),
          buying_cost_day:Number(data?.buying_cost_per_day).toFixed(1),
          leased_cost_sq_ft:Number(data?.leased_cost_per_unit).toFixed(1),
          leased_cost_day:Number(data?.leased_cost_per_day).toFixed(1),
          card_rate_sq_ft:Number(data?.card_cost_per_unit).toFixed(1),
          card_rate_day:Number(data?.card_cost_per_day).toFixed(1),
          p_close_shot_preview:data?.p_close_shot===""?"":`${filesUrl}/SitePhotos/images${data?.p_close_shot}`,
          p_long_shot_preview:data?.p_long_shot===""?"":`${filesUrl}/SitePhotos/images${data?.p_long_shot}`,
          p_night_shot_preview:data?.p_night_shot===""?"":`${filesUrl}/SitePhotos/images${data?.p_night_shot}`,
        }
        setUserInfo(newData);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  

  

  useEffect(()=>{
    getState(userInfo?.country_id);
  },[userInfo?.country_id])

  useEffect(()=>{
    getcity(userInfo?.state_id)
  },[userInfo?.state_id])
  
  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    }
    if (router.query.vw) [
      setViewMode(true)
    ]
  }, [router.isReady, id]);

  useEffect(()=>{
    if(id){
      getBookingHistory()
    }
  },[id])

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head"> {viewMode ? 'VIEW' : <>{editMode ? "EDIT" : "ADD"}</>} SITE</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/media">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/media/SiteManagement"> Site List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? 'View' : <>{editMode ? "Edit" : "Add"}</>} Site
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
      <div className="Add_user_screen">
            <div className="row">
              {/* <div
                className={
                  sidetaskToggle && viewMode
                    ? `col-xl-11 col-md-11 col-sm-12 col-12`
                    : viewMode
                    ? `col-xl-8 col-md-8 col-sm-12 col-12`
                    : `col-xl-12 col-md-12 col-sm-12 col-12`
                }
              > */}
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="add_screen_head">
                  <span className="text_bold">Fill Details</span> ( * Fields are
                  mandatory)
                  <div className="add_user_form">
                    <div className="row">
                      {userInfo?.site_code && (
                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.site_code
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="profilelevel">Site ID </label>
                            <input
                              type="text"
                              placeholder="Lead ID"
                              disabled={viewMode || editMode}
                              name=""
                              id=""
                              className={
                                errorData?.site_code
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              value={
                                userInfo.site_code ? userInfo.site_code : ""
                              }
                            />
                            <span className="errorText">
                              {" "}
                              {errorData?.site_code ? errorData.site_code : ""}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.acc_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_owner">Vendor</label>
                          <Select
                            id="media_owner"
                            isDisabled={viewMode}
                            options={
                              accountList?.filter((item)=>(item?.db_account_type?.platform_id==5))?.map((item)=>{
                                return{
                                  value:item.acc_id,
                                  label:item.acc_name
                                }
                              })
                            }
                            value={accountList?.map((item)=>{
                              if(item?.acc_id==userInfo?.acc_id){
                                return{
                                  value:item.acc_id,
                                  label:item.acc_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                acc_id: e.value,
                              });
                              setErrorData({ ...errorData, acc_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {" "}
                            {errorData?.acc_id
                              ? errorData.acc_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.site_cat_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="site_category">Site Category</label>
                          <Select
                            id="site_category"
                            isDisabled={viewMode}
                            options={siteCategories?.map((item)=>{
                              return {
                                value:item.site_cat_id,
                                label:item.site_cat_name
                              }
                            })}
                            value={siteCategories?.map((item)=>{
                              if(userInfo?.site_cat_id==item?.site_cat_id){
                                return {
                                  value:item.site_cat_id,
                                  label:item.site_cat_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                site_cat_id: e.value,
                              });
                              setErrorData({ ...errorData, site_cat_id: "" });
                            }}
                          />
                      <span className="errorText">
      {errorData?.site_cat_id || ""}
    </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.country_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="country">Country </label>
                          <Select
                            id="country"
                            defaultValue={""}
                            isDisabled={viewMode}
                            options={countrylist?.map((data, index) => {
                              return {
                                value: data?.country_id,
                                label: data?.country_name,
                              };
                            })}
                            value={countrylist?.map((data, index) => {
                              if (userInfo?.country_id === data.country_id) {
                                return {
                                  value: data?.country_id,
                                  label: data?.country_name,
                                };
                              }
                            })}
                            
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, country_id: e.value });
                              setErrorData({ ...errorData, country_id: "" });
                            }}
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
                            errorData?.state_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="state">State </label>
                          <Select
                            id="state"
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
                            
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, state_id: e.value });
                              setErrorData({ ...errorData, state_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {" "}
                            {errorData?.state_id ? errorData.state_id : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.city_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="city">City </label>
                          <Select
                            id="city"
                            isDisabled={viewMode}
                            defaultValue={""}
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
                            
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, city_id: e.value });
                              setErrorData({ ...errorData, city_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {" "}
                            {errorData?.city_id ? errorData.city_id : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="location">Location</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Location "
                            id="location"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                location: e.target.value,
                              })
                            }
                            value={userInfo?.location ? userInfo.location : ""}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.m_f_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_format">Media Format</label>
                          <Select
                            id="media_format"
                            isDisabled={viewMode}
                            options={mediaFormats?.map((item)=>{
                              return {
                                value:item.m_f_id,
                                label:item.m_f_name
                              }
                            })}
                            value={mediaFormats?.map((item)=>{
                              if(userInfo?.m_f_id==item?.m_f_id){
                                return {
                                  value:item.m_f_id,
                                  label:item.m_f_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                m_f_id: e.value,
                              });
                              setErrorData({ ...errorData, m_f_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.m_f_id
                              ? errorData.m_f_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.m_v_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_vehicle">Media Vehicle</label>
                          <Select
                            id="media_vehicle"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={mediaVehicles?.filter((item)=>(item?.m_f_id==userInfo?.m_f_id))?.map((item)=>{
                                 return {
                                  value:item.m_v_id,
                                  label:item.m_v_name
                                }
                            })}
                            value={mediaVehicles?.map((item)=>{
                              if(userInfo?.m_v_id==item?.m_v_id){
                                return {
                                  value:item.m_v_id,
                                  label:item.m_v_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                m_v_id: e.value,
                              });
                              setErrorData({ ...errorData, m_v_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.m_v_id
                              ? errorData.m_v_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.m_t_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_type">Media Type</label>
                          <Select
                            id="media_type"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={mediaTypes?.map((item)=>{
                              return {
                                value:item.m_t_id,
                                label:item.m_t_name
                              }
                            })}
                            value={mediaTypes?.map((item)=>{
                              if(userInfo?.m_t_id==item?.m_t_id){
                                return {
                                  value:item.m_t_id,
                                  label:item.m_t_name
                                }
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
                            {errorData?.m_t_id
                              ? errorData.m_t_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.s_s_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="site_status">Site Status</label>
                          <Select
                            id="site_status"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={siteStatuses?.map((item)=>{
                              return {
                                value:item.s_s_id,
                                label:item.s_s_name
                              }
                            })}
                            value={siteStatuses?.map((item)=>{
                              if(userInfo?.s_s_id==item?.s_s_id){
                                return {
                                  value:item.s_s_id,
                                  label:item.s_s_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                s_s_id: e.value,
                              });
                              setErrorData({ ...errorData, s_s_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.s_s_id
                              ? errorData.s_s_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="traffic_from">Traffic From</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Traffic From "
                            id="traffic_from"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                traffic_from: e.target.value,
                              })
                            }
                            value={userInfo?.traffic_from ? userInfo.traffic_from : ""}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="traffic_to">Traffic To</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Traffic To "
                            id="traffic_to"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                traffic_to: e.target.value,
                              })
                            }
                            value={userInfo?.traffic_to ? userInfo.traffic_to : ""}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="position_of_site">Position of Site</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Position of Site "
                            id="position_of_site"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                position_of_site: e.target.value,
                              })
                            }
                            value={userInfo?.position_of_site ? userInfo.position_of_site : ""}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="lat_long">Latitude - Longitude</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Latitude - Longitude"
                            id="lat_long"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                lat_long: e.target.value,
                              })
                            }
                            value={userInfo?.lat_long ? userInfo.lat_long : ""}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.rating_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="rating">Rating</label>
                          <Select
                            id="rating"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={ratings?.map((item)=>{
                              return {
                                value:item.rating_id,
                                label:item.rating_name
                              }
                            })}
                            value={ratings?.map((item)=>{
                              if(userInfo?.rating_id==item?.rating_id){
                                return {
                                  value:item.rating_id,
                                  label:item.rating_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                rating_id: e.value,
                              });
                              setErrorData({ ...errorData, rating_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.rating_id ? errorData.rating_id : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.a_s_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="availability_status">
                            Availability Status
                          </label>
                          <Select
                            id="availability_status"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={availabilitySatuses?.map((item)=>{
                              return {
                                value:item.a_s_id,
                                label:item.a_s_name
                              }
                            })}
                            value={availabilitySatuses?.map((item)=>{
                              if(userInfo?.a_s_id==item?.a_s_id){
                                return {
                                  value:item.a_s_id,
                                  label:item.a_s_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                a_s_id: e.value,
                              });
                              setErrorData({ ...errorData, a_s_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.a_s_id
                              ? errorData.a_s_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="available_from">Available From </label>
                          <input
                            type="date"
                            name="date"
                            id="available_from"
                            disabled={viewMode}
                            className="form-control"
                            min={moment().format("YYYY-MM-DD")}
                            onKeyDown={(e)=>e.preventDefault()}
                            onPaste={(e)=>e.preventDefault()}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                available_from: e.target.value,
                              })
                            }
                            value={moment(userInfo?.available_from).format(
                              "YYYY-MM-DD"
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="available_to">Available To </label>
                          <input
                            type="date"
                            name="date"
                            id="available_to"
                            disabled={viewMode}
                            min={moment().format("YYYY-MM-DD")}
                            onKeyDown={(e)=>e.preventDefault()}
                            onPaste={(e)=>e.preventDefault()}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                available_to: e.target.value,
                              })
                            }
                            value={moment(userInfo?.available_to).format(
                              "YYYY-MM-DD"
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="remarks">Remarks</label>
                          <input
                            type="text"
                            name="Location"
                            placeholder="Enter Remarks "
                            id="remarks"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                remarks: e.target.value,
                              })
                            }
                            value={userInfo?.remarks ? userInfo.remarks : ""}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                { leasedShow &&(
                  <>
                  <div className="add_screen_head">
                    <span className="text_bold">Lease Details</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="lease_from">Lease From </label>
                          <input
                            type="date"
                            name="date"
                            id="lease_from"
                            disabled={viewMode}
                            min={moment().format("YYYY-MM-DD")}
                            onKeyDown={(e)=>e.preventDefault()}
                            onPaste={(e)=>e.preventDefault()}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                lease_from: e.target.value,
                              })
                            }
                            value={moment(userInfo?.lease_from).format(
                              "YYYY-MM-DD"
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="lease_to">Lease To </label>
                          <input
                            type="date"
                            name="date"
                            id="lease_to"
                            disabled={viewMode}
                            min={moment().format("YYYY-MM-DD")}
                            onKeyDown={(e)=>e.preventDefault()}
                            onPaste={(e)=>e.preventDefault()}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                lease_to: e.target.value,
                              })
                            }
                            value={moment(userInfo?.lease_to).format(
                              "YYYY-MM-DD"
                            )}
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="lease_period">Lease Period</label>
                          <input
                            type="number"
                            name="lease_period"
                            placeholder="Enter Lease Period"
                            id="lease_period"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                lease_period: value,
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={ userInfo?.lease_period ? userInfo.lease_period : ""  }
                          />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="lease_cost">
                            Leased Cost / Month
                          </label>
                          <input
                            type="number"
                            name="lease_cost"
                            placeholder="Enter Lease Cost"
                            id="lease_cost"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                lease_cost: value,
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={ userInfo?.lease_cost ? userInfo.lease_cost : "" }
                          />

                        </div>
                      </div>
                    </div>
                  </div></>)
                  }

                  <div className="add_screen_head">
                    <span className="text_bold">Measurement Information</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="width">Width</label>
                          <input
                            type="number"
                            name="width"
                            placeholder="Enter Width"
                            id="width"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                width: value,
                                total_sq_ft: value * userInfo?.height,
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={userInfo?.width ? userInfo.width : ""}
                          />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="height">Height</label>
                          <input
                            type="number"
                            name="height"
                            placeholder="Enter Height"
                            id="height"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                height: value,
                                total_sq_ft: value * userInfo?.width,
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={userInfo?.height ? userInfo.height : ""}
                          />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="quantity">Quantity</label>
                          <input
                              type="number"
                              name="quantity"
                              placeholder="Enter Quantity"
                              id="quantity"
                              disabled={viewMode}
                              className="form-control"
                              onChange={(e) => {
                                const value = Math.max(0, e.target.value);
                                setUserInfo({
                                  ...userInfo,
                                  quantity: value,
                                });
                              }}
                              onInput={(e) => {
                                e.target.value = Math.max(0, e.target.value);
                              }}
                              value={userInfo?.quantity ? userInfo.quantity : ""}
                            />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="total_sq_ft">Total Sq. Ft.</label>
                          <input
                            type="number"
                            name="total_sq_ft"
                            placeholder="Enter Total Sq. Ft."
                            id="total_sq_ft"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                total_sq_ft: e.target.value,
                              })
                            }
                            value={
                              userInfo?.total_sq_ft ? userInfo.total_sq_ft.toFixed(1) : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="add_screen_head">
                    <span className="text_bold">Costing Information</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="selling_cost_month">
                            Selling Cost/Month
                          </label>
                          <input
                            type="number"
                            name="selling_cost_month"
                            placeholder="Enter Selling Cost/Month"
                            id="selling_cost_month"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                selling_cost: value,
                                selling_cost_sq_ft: (value / userInfo?.total_sq_ft).toFixed(2),
                                selling_cost_day: (value / 30).toFixed(2),
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={userInfo?.selling_cost ? userInfo.selling_cost : "" }
                          />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="buying_cost_month">
                            Buying Cost/Month
                          </label>
                          <input
                              type="number"
                              name="buying_cost_month"
                              placeholder="Enter Buying Cost/Month"
                              id="buying_cost_month"
                              disabled={viewMode}
                              className="form-control"
                              onChange={(e) => {
                                const value = Math.max(0, e.target.value);
                                setUserInfo({
                                  ...userInfo,
                                  buying_cost: value,
                                  buying_cost_sq_ft: (value / userInfo?.total_sq_ft).toFixed(2),
                                  buying_cost_day: (value / 30).toFixed(2),
                                });
                              }}
                              onInput={(e) => {
                                e.target.value = Math.max(0, e.target.value);
                              }}
                              value={ userInfo?.buying_cost ? userInfo.buying_cost : "" }
                            />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="leased_cost_month">
                            Leased Cost/Month
                          </label>
                          <input
                            type="number"
                            name="leased_cost_month"
                            placeholder="Enter Leased Cost/Month"
                            id="leased_cost_month"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) => {
                              const value = Math.max(0, e.target.value);
                              setUserInfo({
                                ...userInfo,
                                leased_cost: value,
                                leased_cost_sq_ft: (value / userInfo?.total_sq_ft).toFixed(2),
                                leased_cost_day: (value / 30).toFixed(2),
                              });
                            }}
                            onInput={(e) => {
                              e.target.value = Math.max(0, e.target.value);
                            }}
                            value={ userInfo?.leased_cost ? userInfo.leased_cost : "" }
                          />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="card_rate_month">
                            Card Rate/Month
                          </label>
                          <input
                              type="number"
                              name="card_rate_month"
                              placeholder="Enter Card Rate/Month"
                              id="card_rate_month"
                              disabled={viewMode}
                              className="form-control"
                              onChange={(e) => {
                                const value = Math.max(0, e.target.value);
                                setUserInfo({
                                  ...userInfo,
                                  card_rate: value,
                                  card_rate_sq_ft: (value / userInfo?.total_sq_ft).toFixed(2),
                                  card_rate_day: (value / 30).toFixed(2),
                                });
                              }}
                              onInput={(e) => {
                                e.target.value = Math.max(0, e.target.value);
                              }}
                              value={ userInfo?.card_rate ? userInfo.card_rate: "" }
                            />

                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="selling_cost_sq_ft">
                            Selling Cost/Sq. Ft.
                          </label>
                          <input
                            type="number"
                            name="selling_cost_sq_ft"
                            placeholder="Enter Selling Cost/Sq. Ft."
                            id="selling_cost_sq_ft"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                selling_cost_sq_ft: e.target.value,
                              })
                            }
                            value={
                              userInfo?.selling_cost_sq_ft
                                ? userInfo?.selling_cost_sq_ft
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="buying_cost_sq_ft">
                            Buying Cost/Sq. Ft.
                          </label>
                          <input
                            type="number"
                            name="buying_cost_sq_ft"
                            placeholder="Enter Buying Cost/Sq. Ft."
                            id="buying_cost_sq_ft"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                buying_cost_sq_ft: e.target.value,
                              })
                            }
                            value={
                              userInfo?.buying_cost_sq_ft
                                ? userInfo.buying_cost_sq_ft
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="leased_cost_sq_ft">
                            Leased Cost/Sq. Ft.
                          </label>
                          <input
                            type="number"
                            name="leased_cost_sq_ft"
                            placeholder="Enter Leased Cost/Sq. Ft."
                            id="leased_cost_sq_ft"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                leased_cost_sq_ft: e.target.value,
                              })
                            }
                            value={
                              userInfo?.leased_cost_sq_ft
                                ? userInfo.leased_cost_sq_ft
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="card_rate_sq_ft">
                            Card Rate/Sq. Ft.
                          </label>
                          <input
                            type="number"
                            name="card_rate_sq_ft"
                            placeholder="Enter Card Rate/Sq. Ft."
                            id="card_rate_sq_ft"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                card_rate_sq_ft: e.target.value,
                              })
                            }
                            value={
                              userInfo?.card_rate_sq_ft
                                ? userInfo.card_rate_sq_ft
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="selling_cost_day">
                            Selling Cost/Day
                          </label>
                          <input
                            type="number"
                            name="selling_cost_day"
                            placeholder="Enter Selling Cost/Day"
                            id="selling_cost_day"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                selling_cost_day: e.target.value,
                              })
                            }
                            value={
                              userInfo?.selling_cost_day
                                ? userInfo.selling_cost_day
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="buying_cost_day">
                            Buying Cost/Day
                          </label>
                          <input
                            type="number"
                            name="buying_cost_day"
                            placeholder="Enter Buying Cost/Day"
                            id="buying_cost_day"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                buying_cost_day: e.target.value,
                              })
                            }
                            value={
                              userInfo?.buying_cost_day
                                ? userInfo.buying_cost_day
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="leased_cost_day">
                            Leased Cost/Day
                          </label>
                          <input
                            type="number"
                            name="leased_cost_day"
                            placeholder="Enter Leased Cost/Day"
                            id="leased_cost_day"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                leased_cost_day: e.target.value,
                              })
                            }
                            value={
                              userInfo?.leased_cost_day
                                ? userInfo.leased_cost_day
                                : ""
                            }
                          />
                        </div>
                      </div>

                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="card_rate_day">Card Rate/Day</label>
                          <input
                            type="number"
                            name="card_rate_day"
                            placeholder="Enter Card Rate/Day"
                            id="card_rate_day"
                            disabled
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                card_rate_day: e.target.value,
                              })
                            }
                            value={
                              userInfo?.card_rate_day
                                ? userInfo.card_rate_day
                                : ""
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="add_screen_head">
                    <span className="text_bold">Photos</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="close_shot">Close Shot</label>
                          <input
                            type="file"
                            name="close_shot"
                            id="close_shot"
                            disabled={viewMode}
                            className="form-control"
                            accept=".jpeg, .jpg, .png"
                            onChange={(e) => handleImageChange(e,"p_close_shot","p_close_shot_preview")}
                          />
                          {userInfo?.p_close_shot_preview!=="" && (
                            <img
                              src={userInfo?.p_close_shot_preview}
                              alt={` Preview`}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="long_shot">Long Shot</label>
                          <input
                            type="file"
                            name="long_shot"
                            id="long_shot"
                            disabled={viewMode}
                            accept=".jpeg, .jpg, .png"
                            className="form-control"
                            onChange={(e) => handleImageChange(e,"p_long_shot","p_long_shot_preview")}
                          />
                          {userInfo?.p_long_shot_preview!=="" && (
                            <img
                              src={userInfo?.p_long_shot_preview}
                              alt={` Preview`}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                              }}
                            />
                          )}
                        </div>
                      </div>

                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="night_shot">Night Shot</label>
                          <input
                            type="file"
                            name="night_shot"
                            id="night_shot"
                            disabled={viewMode}
                            accept=".jpeg, .jpg, .png"
                            className="form-control"
                            onChange={(e) => handleImageChange(e,"p_night_shot","p_night_shot_preview")}
                          />
                          {userInfo?.p_night_shot_preview!=="" && (
                            <img
                              src={userInfo?.p_night_shot_preview}
                              alt={` Preview`}
                              style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="add_screen_head">
                    <span className="text_bold">Site Booking History</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                    <div
                      style={{
                        maxHeight: '350px', // Set the maximum height for the table
                        overflowY: 'auto',   // Enable vertical scrolling
                        marginBottom: '20px', // Add some space below the table
                      }}
                    >
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Booking History ID</th>

                            <th>Campaign ID</th>
                            <th>Campaign Start Date</th>
                            <th>Campaign End Date</th>
                            <th>Campaign Total Days</th>
                            <th>Campaign Status</th>
                            <th>Estimate ID</th>
                            <th>Client Cost</th>
                            <th>Vendor Cost</th>
                            <th>Margin</th>
                            <th>Margin %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingHistory.map((booking,index) => (
                            <tr key={index}>
                              <td>{booking?.sb_code}</td>
                              <td>
                                <Link href={`/campaigns/${booking}`}>{booking?.db_media_campaign?.campaign_id}</Link>
                              </td>
                              <td>{moment(booking?.db_media_campaign?.campaign_start_date).format("DD/MM/YYYY")
                              }</td>
                              <td>{moment(booking?.db_media_campaign?.campaign_end_date).format("DD/MM/YYYY")
                              }</td>
                              <td>{booking?.db_media_campaign?.campaign_duration}</td>
                              <td>{booking?.db_media_campaign?.db_campaign_status?.cmpn_s_name}</td>
                              <td>
                                <Link href={`/estimates/${booking}`}>{booking?.estimate_id}</Link>
                              </td>
                              <td>{booking?.db_asset_client_cost_sheet?.final_client_po_cost?.toFixed(2)}</td>
                              <td>{(booking.db_asset_vendor_cost_sheet?.mounting_cost+booking.db_asset_vendor_cost_sheet?.printing_cost+booking.db_asset_vendor_cost_sheet?.final_display_cost).toFixed(2)}</td>
                              <td>{booking?.db_media_campaign?.overall_margin}</td>
                              <td>{booking?.db_media_campaign?.overall_margin_percentage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    </div>
                    </div>
                  {/* code for add field */}
                  <div className="add_user_form">
                    
                    {/* <div className="row">
                      {userInfo.db_lead_fields?.map(
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
                                  placeholder={field_lable}
                                  disabled={viewMode}
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
                    </div> */}

                    {/* {iscollapse && (
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
                                  <label htmlFor="newInputType">
                                    Input Type
                                  </label>
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
                          
                          <button
                            onClick={createInputField}
                            className="btn btn-success"
                          >
                            Create Field
                          </button>
                        </div>
                      </div>
                    )} */}

                    <div className="text-end">
                      <div className="submit_btn">
                        {/* {viewMode ? null : (
                          <>
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
                            </div>{" "}
                          </>
                        )} */}
                        {viewMode ? null : (
                          <>
                            <Link href="/media/ManageLeads">
                              <button className="btn btn-cancel m-3 ">
                                Cancel
                              </button>
                            </Link>
                            {editMode ? (
                              <button
                                disabled={isLoading}
                                className="btn btn-primary"
                                onClick={updateHandler}
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
                  {/* code for add field */}

                </div>
              </div>
              
            </div>
          </div>
      </div>
    </div>
  );
};

export default AddSitesScreen;
