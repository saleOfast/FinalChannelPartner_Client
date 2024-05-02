import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { Baseurl, filesUrl } from '../../Utils/Constants';
import axios from 'axios';
import { useRouter } from 'next/router'
import { getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { validEmail, validPhone } from '../../Utils/regex';
import moment from "moment";
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
// import ColorPicker from 'react-best-gradient-color-picker';
import { HexColorPicker } from "react-colorful";
import { setSidebarColor, setbuttonColor, setTopNavColor} from '../../store/themeSlice';

const AddClientScreen = () => {

    const dispatch = useDispatch()
    const sideView = useSelector((state) => state.sideView.value);
    const theme = useSelector((state) => state.themeMode);
    const router = useRouter()
    const { id } = router.query;
    const [countrylist, setcountrylist] = useState([]);
    const [statelist, setStatelist] = useState([]);
    const [citylist, setCitylist] = useState([]);
    const [errorData, setErrorData] = useState({})
    const [additionalFields, setAdditionalFields] = useState(false)
    const [sideColor, setSideColor] = useState(theme.side)
    const [buttonColor, setButtonColor] = useState(theme.buttons)
    const [navColor, setNavColor] = useState(theme.topnav)
    const [isLoading, setisLoading] = useState(false)
    const [userInfo, setUserInfo] = useState({
        user: '',
        email: '',
        contact_number: '',
        db_name: '',
        password: '',
        conPassword: '',
        subscription_start_date: '',
        subscription_end_date: '',
        no_of_license: '',
        no_of_channel_license: 0,
        no_of_dms_license: 0,
        no_of_sales_license: 0,
        button_color: theme.buttons,
        sidebar_color: theme.side,
        top_nav_color: theme.topnav,
        domain: '',
        no_of_months: '',
        pincode: '',
        pan: '',
        gst: '',
        address: "" ,
        isCRM:1 ,
        isDMS:null ,
        isSALES:null ,
        isCHANNEL:null ,
        logo:null,
        logoPreview:null,
        _imageName: null,
        client_url:"",
        client_image_1:null,
        client_image_1_preview:null,
        client_image_2:null,
        client_image_2_preview:null,
        client_image_3:null,
        client_image_3_preview:null,
        client_image_4:null,
        client_image_4_preview:null,
        
    })

    const minDate = new Date().toISOString().slice(0, 16);
    const [editMode, setEditMode] = useState(false)

    const monthSet = (e) => {
        const startDate = moment(userInfo.subscription_start_date, 'YYYY-MM-DD');
        const NumberOfMonth = parseInt(e.target.value)
        const endDate = startDate.add(NumberOfMonth, 'months').format("YYYY-MM-DD");
        setUserInfo({ ...userInfo, "no_of_months": NumberOfMonth, "subscription_end_date": endDate })
        setErrorData({ ...errorData, no_of_months: '', subscription_end_date: '' })
    }

    const getSingleData = async (id) => {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/admin?id=${id}`, header);
                const tempDate = response.data.data
                setUserInfo({
                  user: tempDate.user,
                  email: tempDate.email,
                  contact_number: tempDate.contact_number,
                  user_id: tempDate.user_id,
                  user_code: tempDate.user_code,
                  subscription_start_date: moment(
                    tempDate.subscription_start_date
                  ).format("YYYY-MM-DD"),
                  subscription_end_date: moment(
                    tempDate.subscription_end_date
                  ).format("YYYY-MM-DD"),
                  no_of_license: tempDate.no_of_license,
                  gst: tempDate.gst,
                  no_of_months: tempDate.no_of_months,
                  domain: tempDate.domain,
                  pan: tempDate.pan,
                  gst: tempDate.gst,
                  address: tempDate.address,
                  isCRM: true,  // Default values for flags
                  isDMS: false,
                  isSALES: false,
                  isCHANNEL: false,
                  _imageName:tempDate.logo,
                  logoPreview: `${filesUrl}`+`/logo/images${tempDate?.logo}`,
                  client_image_1_preview: `${filesUrl}`+`/clientdoc/images${tempDate?.client_image_1}`,
                  client_image_2_preview: `${filesUrl}`+`/clientdoc/images${tempDate?.client_image_2}`,
                  client_image_3_preview: `${filesUrl}`+`/clientdoc/images${tempDate?.client_image_3}`,
                  client_image_4_preview: `${filesUrl}`+`/clientdoc/images${tempDate?.client_image_4}`,
                  client_url:tempDate?.client_url,
                  no_of_channel_license: tempDate.no_of_channel_license,
                  no_of_dms_license: tempDate.no_of_dms_license,
                  no_of_sales_license: tempDate.no_of_sales_license,
                  button_color: tempDate.button_color,
                  sidebar_color: tempDate.sidebar_color,
                  top_nav_color: tempDate.top_nav_color,
                });

                setSideColor(tempDate.sidebar_color)
                setButtonColor(tempDate.button_color)
                setNavColor(tempDate.top_nav_color)


                tempDate.db_client_platforms?.forEach(element => {
                  switch (element.db_platform.platform_id) {
                    case 1:
                      setUserInfo((prev)=>({...prev, isCRM: element.actions}))
                      break;
                      case 2:
                        setUserInfo((prev)=>({...prev, isDMS: element.actions}))
                      break;
                      case 3:
                        setUserInfo((prev)=>({...prev, isSALES: element.actions}))
                      break;
                      case 4:
                        setUserInfo((prev)=>({...prev, isCHANNEL: element.actions}))
                      break;
                  
                    default:
                      break;
                  }
                });
                console.log(userInfo)
              

            } catch (error) {
              console.log(error, "error")
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrongssssss!')
                }
            }
        }
    }

    async function addClientHandler() {
        
        if (hasCookie('saLsTkn')) {
            setisLoading(true);
            if (userInfo.password) {
                if (!userInfo.conPassword) {
                    toast.error('Please fill the Mandatory fields')
                    return setErrorData({ ...errorData, conPassword: 'Confirm your Password' })
                } else if (userInfo.password !== userInfo.conPassword) {
                    toast.error('Please fill the Mandatory fields')
                    return setErrorData({ ...errorData, conPassword: 'Password Does not match' })
                }
            }
            let token = (getCookie('saLsTkn'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                }
            }
            const formData=new FormData();
            for (const [key, value] of Object.entries(userInfo)) {
              formData.append(key, value);
            }
            try {

                const res = await axios.post(Baseurl + `/db`, formData, header);
                if (res.status === 200 || res.status === 204) {
                    toast.success('Client Added Successfully')
                    router.push('/Admin');
                    setisLoading(false);
                }
            } catch (error) {
                setisLoading(false);
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
            }
        }
    };

    async function updateHandler() {

        if (hasCookie('saLsTkn')) {
            setisLoading(true);
            let token = (getCookie('saLsTkn'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,

                }
            }
            const formData=new FormData();
            for (const [key, value] of Object.entries(userInfo)) {
              formData.append(key, value);
            }
            try {
              console.log("update"+userInfo)
                const res = await axios.put(Baseurl + `/db/admin`, formData, header);
                if (res.status === 200 || res.status === 204) {
                    toast.success('Client Updated Successfully')
                    router.push('/Admin');
                    setisLoading(false);
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
                  console.log(error)
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
                setisLoading(false);
            }
        }

    };

    const getCountryList = async () => {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/admin/country?country_id=1`, header);
                setcountrylist(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    const getState = async (id) => {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/admin/state?cnt_id=${id}`, header);
                setStatelist(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }

    };

    const getcity = async (id) => {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                header
                const response = await axios.get(Baseurl + `/db/admin/city?st_id=${id}`, header);
                setCitylist(response.data.data.cityData);

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
          setUserInfo({
            ...userInfo,
            logo:e.target.files[0],
            logoPreview:reader.result
          });
        };
        
        reader.readAsDataURL(e.target.files[0]);
      }
    }; 
    
    const handleClientImageChange = (e,image,preview) => {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUserInfo({
            ...userInfo,
            [image]:e.target.files[0],
            [preview]:reader.result
          });
        };
        
        reader.readAsDataURL(e.target.files[0]);
      }
    };

    useEffect(() => {
        getCountryList()
        getState()

    }, [])


    useEffect(() => {
        if (!userInfo.state_id) {
            return;
        } else {
            getcity(userInfo.state_id);
        }
    }, [userInfo.state_id]);

    useEffect(() => {
        if (!userInfo.country_id) {
            return;
        } else {
            getState(userInfo.country_id);
        }
    }, [userInfo.country_id]);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true)
            getSingleData(id)
        }
    }, [router.isReady, id])

    useEffect(()=>{
      if(theme.side !== sideColor){
        dispatch(setSidebarColor(sideColor))
        setUserInfo({...userInfo, sidebar_color : sideColor})
      }

      if(theme.buttons !== buttonColor){
        dispatch(setbuttonColor(buttonColor))
        setUserInfo({...userInfo, button_color : buttonColor})
      }

      if(theme.topnav !== navColor){
        dispatch(setTopNavColor(navColor))
        setUserInfo({...userInfo, top_nav_color : navColor})
      }

    },[sideColor, buttonColor, navColor])



    

    return (
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">{editMode ? "EDIT" : "ADD"} Client</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                {" "}
                <Link href="/Admin">All Clients </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {editMode ? "Edit" : "Add"} Client
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="Add_user_screen">
            <div className="add_screen_head">
              <span className="text_bold">Fill Details</span> ( * Fields are
              mandatory){" "}
            </div>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.user ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Client Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Client Name"
                      name="Name"
                      id="Name"
                      className={
                        errorData?.user
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, user: e.target.value });
                        setErrorData({ ...errorData, user: "" });
                      }}
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
                      errorData?.email ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      name="email"
                      id="email"
                      className={
                        errorData?.email
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          email: e.target.value.toLowerCase().replace(" ", ""),
                        });
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
                  <div
                    className={
                      errorData?.contact_number
                        ? "input_box errorBox"
                        : "input_box"
                    }
                  >
                    <label htmlFor="contact">Contact Number *</label>
                    <input
                      type="number"
                      placeholder="Enter Contact Number"
                      name="contact"
                      id="contact"
                      className={
                        errorData?.contact_number
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({
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
                      errorData?.subscription_start_date
                        ? "input_box errorBox"
                        : "input_box"
                    }
                  >
                    <label htmlFor="subscription_start_date">
                      Subscription Start Date *
                    </label>
                    <input
                      type="date"
                      name="subscription_start_date"
                      id="subscription_start_date"
                      min={moment()
                        .subtract(7, "days")
                        .format("YYYY-MM-DD[T]HH:mm:ss")}
                      className={
                        errorData?.subscription_start_date
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          subscription_start_date: e.target.value,
                        });
                        setErrorData({
                          ...errorData,
                          subscription_start_date: "",
                        });
                      }}
                      value={
                        userInfo.subscription_start_date
                          ? userInfo.subscription_start_date
                          : ""
                      }
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.subscription_start_date
                        ? errorData.subscription_start_date
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.no_of_months
                        ? "input_box errorBox"
                        : "input_box"
                    }
                  >
                    <label htmlFor="no_of_months">No of Month *</label>
                    <input
                      type="number"
                      placeholder="Enter Month"
                      name="no_of_months"
                      id="no_of_months"
                      className={
                        errorData?.no_of_months
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={userInfo.no_of_months ? userInfo.no_of_months : ""}
                      onChange={(e) => monthSet(e)}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.no_of_months ? errorData.no_of_months : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="subscription_start_date">
                      Subscription End Date *
                    </label>
                    <input
                      type="date"
                      name="subscription_start_date"
                      id="subscription_start_date"
                      disabled
                      className={
                        errorData?.subscription_end_date
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      value={
                        userInfo.subscription_end_date
                          ? userInfo.subscription_end_date
                          : ""
                      }
                    />
                  </div>
                </div>

                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.client_url ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Client URL *</label>
                    <input
                      type="text"
                      placeholder="Enter Client URL"
                      name="Name"
                      id="Name"
                      className={
                        errorData?.client_url
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, client_url: e.target.value });
                        setErrorData({ ...errorData, client_url: "" });
                      }}
                      value={userInfo.client_url ? userInfo.client_url : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.client_url ? errorData.client_url : ""}
                    </span>
                  </div>
                </div>

                <div className="row">
                    <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <div className="d-flex flex-column gap-1">
                      <label className="form-label">Client Image 1 *</label>
                      <input
                        type="file"
                        onChange={(e) => handleClientImageChange(e,"client_image_1","client_image_1_preview")}
                        className="form-control input-field"
                        required
                      />
                      {userInfo?.client_image_1_preview && (
                        <img
                          src={userInfo?.client_image_1_preview}
                          alt={` Preview`}
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
                      <label className="form-label">Client Image 2 *</label>
                      <input
                        type="file"
                        onChange={(e) => handleClientImageChange(e,"client_image_2","client_image_2_preview")}
                        className="form-control input-field"
                        required
                      />
                      {userInfo?.client_image_2_preview && (
                        <img
                          src={userInfo?.client_image_2_preview}
                          alt={` Preview`}
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
                      <label className="form-label">Client Image 3 *</label>
                      <input
                        type="file"
                        onChange={(e) => handleClientImageChange(e,"client_image_3","client_image_3_preview")}
                        className="form-control input-field"
                        required
                      />
                      {userInfo?.client_image_3_preview && (
                        <img
                          src={userInfo?.client_image_3_preview}
                          alt={` Preview`}
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
                      <label className="form-label">Client Image 4 *</label>
                      <input
                        type="file"
                        onChange={(e) => handleClientImageChange(e,"client_image_4","client_image_4_preview")}
                        className="form-control input-field"
                        required
                      />
                      {userInfo?.client_image_4_preview && (
                        <img
                          src={userInfo?.client_image_4_preview}
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

                

                

                {editMode ? null : (
                  <>
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                      <div
                        className={
                          errorData?.bill_cont
                            ? "input_box errorBox"
                            : "input_box"
                        }
                      >
                        <label htmlFor="task_name">Country *</label>
                        <Select
                          id={userInfo.country_id}
                          defaultValue={""}
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
                        <label htmlFor="task_name">State *</label>
                        <Select
                          id={userInfo.state_id}
                          defaultValue={""}
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
                        <label htmlFor="task_name">City *</label>
                        <Select
                          id={userInfo.state_id}
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

                  </> 
                )}

                {/* for changing apps permission when we click on edit and logo */}
               
                   <div className="other_details_info" style={{ borderTop: '1px dashed #dfdfff'}}>
                      <div className="other_details">
                        <label className=" text_bold " htmlFor="opt_dtls">
                          Permission mode 
                        </label>
                      </div>
                  </div>

                    <div className="row">
                    <div className="col-xl-3 col-md-6 col-sm-12 mb-3">
                      <div className='d-flex gap-2 align-items-center justify-content-start'>
                        <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option1"
                                  id="option1"
                                  checked={!editMode ? true : userInfo.isCRM }
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      isCRM: !editMode ? 1 : e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isCRM: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="option1"
                                >
                                  CRM
                                </label>
                        </div>
                        {userInfo.isCRM ?
                        <div className="input_box m-0">
                          <input
                          type="number"
                          placeholder="Enter Licence"
                          name="no_of_license"
                          id="no_of_license"
                          className={
                            errorData?.no_of_license
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              no_of_license: e.target.value,
                            });
                            setErrorData({ ...errorData, no_of_license: "" });
                          }}
                          value={
                            userInfo.no_of_license ? userInfo.no_of_license : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.no_of_license ? errorData.no_of_license : ""}
                        </span>
                        </div>
                        : <></> }
                      </div>
                      
                    </div>

                    <div className="col-xl-3 col-md-6 col-sm-12 mb-3">
                      <div className='d-flex gap-2 align-items-center justify-content-start'>
                        <div className="form-check">
                                <input
                                  className="form-check-input text-nowrap"
                                  type="checkbox"
                                  value="option1"
                                  id="option1"
                                  checked={userInfo.isCHANNEL}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      isCHANNEL: e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isCHANNEL: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="option1"
                                >
                                  Channel Partner
                                </label>
                        </div>
                        {userInfo.isCHANNEL ?
                        <div className="input_box m-0">
                          <input
                          type="number"
                          placeholder="Enter Licence"
                          name="no_of_license"
                          id="no_of_license"
                          className={
                            errorData?.no_of_channel_license
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              no_of_channel_license: e.target.value,
                            });
                            setErrorData({ ...errorData, no_of_channel_license: "" });
                          }}
                          value={
                            userInfo.no_of_channel_license ? userInfo.no_of_channel_license : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.no_of_channel_license ? errorData.no_of_channel_license : ""}
                        </span>
                        </div>
                        : <></> }
                      </div>
                      
                    </div>

                    <div className="col-xl-3 col-md-6 col-sm-12 mb-3">
                      <div className='d-flex gap-2 align-items-center justify-content-start'>
                        <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option1"
                                  id="option1"
                                  checked={userInfo.isDMS}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      isDMS: e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isDMS: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="option1"
                                >
                                  DMS
                                </label>
                        </div>
                        {userInfo.isDMS ?
                        <div className="input_box m-0">
                          <input
                          type="number"
                          placeholder="Enter Licence"
                          name="no_of_license"
                          id="no_of_license"
                          className={
                            errorData?.no_of_dms_license
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            setUserInfo({
                              ...userInfo,
                              no_of_dms_license: e.target.value,
                            });
                            setErrorData({ ...errorData, no_of_dms_license: "" });
                          }}
                          value={
                            userInfo.no_of_dms_license ? userInfo.no_of_dms_license : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.no_of_dms_license ? errorData.no_of_dms_license : ""}
                        </span>
                        </div>
                        : <></> }
                      </div>
                      
                    </div>
                    <div className="col-xl-3 col-md-6 col-sm-12 mb-3">
                      <div className='d-flex gap-2 align-items-center justify-content-start'>
                        <div className="form-check">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option1"
                                  id="option1"
                                  checked={userInfo.isSALES}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      isSALES: e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isSALES: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  htmlFor="option1"
                                >
                                  Sales
                                </label>
                        </div>
                        {userInfo.isSALES ?
                          <div className="input_box m-0">
                            <input
                            type="number"
                            placeholder="Enter Licence"
                            name="no_of_license"
                            id="no_of_license"
                            className={
                              errorData?.no_of_sales_license
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                no_of_sales_license: e.target.value,
                              });
                              setErrorData({ ...errorData, no_of_sales_license: "" });
                            }}
                            value={
                              userInfo.no_of_sales_license ? userInfo.no_of_sales_license : ""
                            }
                          />
                          <span className="errorText">
                            {" "}
                            {errorData?.no_of_sales_license ? errorData.no_of_sales_license : ""}
                          </span>
                          </div>
                        : <></> }
                      </div>
                      
                    </div>


                  
                    
                    </div>


                   <div className="mb-3">
                    <div className="other_details_info" style={{padding: '20px 0px', borderTop: '1px dashed #dfdfff'}}>
                        <div className="other_details">
                          <label className="text_bold head" htmlFor="opt_dtls">
                            Theme
                          </label>
                        </div>
                    </div>

                    <div className="row">
                    <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <div className="d-flex flex-column gap-1">
                      <label className="form-label">Logo</label>
                      <input
                        type="file"
                        onChange={(e) => handleImageChange(e)}
                        className="form-control input-field"
                      />
                      {userInfo?.logoPreview && (
                        <img
                          src={userInfo?.logoPreview}
                          alt={` Preview`}
                          style={{
                            maxWidth: "100px",
                            maxHeight: "100px",
                          }}
                        />
                      )}
                    </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12 mb-3">
                      <div className="d-flex flex-column gap-1 colorcomp">
                        <label className="form-label">SideBar </label>
                        <input
                          type="text"
                          value={theme.side}
                          onChange={(e) => setSideColor(e.target.value)}
                        
                          className="form-control input-field"
                        />
                        <HexColorPicker  value={theme.side} onChange={setSideColor} height={100}    />

                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                      <div className="d-flex flex-column gap-1 colorcomp">
                        <label className="form-label">Button </label>
                        <input
                          type="text"
                          value={theme.buttons}
                          onChange={(e) => setButtonColor(e.target.value)}
                          className="form-control input-field"
                        />
                        <HexColorPicker  value={theme.buttons} onChange={setButtonColor} height={100} width={300}   />

                      </div>
                    </div>

                    <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12 mb-3">
                      <div className="d-flex flex-column gap-1 colorcomp">
                        <label className="form-label">TopNav </label>
                        <input
                          type="text"
                          value={theme.topnav}
                          onChange={(e) => setNavColor(e.target.value)}
                        
                          className="form-control input-field"
                        />
                        <HexColorPicker  value={theme.topnav} onChange={setNavColor} height={100}   />

                      </div>
                    </div>
                    </div>
                 </div>
                  

                {/* country state city  and app permission on add */}
               
                {editMode ? null : (
                  <>
                    
                    <div className="other_details_info" style={{ borderTop: '1px dashed #dfdfff'}}>
                      <div className="other_details">
                        <input
                          type="checkbox"
                          name="opt_dtls"
                          id="opt_dtls"
                          onChange={(e) =>
                            setAdditionalFields(e.target.checked)
                          }
                        />
                        <label className="text_bold head" htmlFor="opt_dtls">
                          Optional Detail
                        </label>
                      </div>
                    </div>

                    {additionalFields ? (
                      <div className="row">
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.pan
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="pan">Pancard No </label>
                            <input
                              type="text"
                              placeholder="Enter Pancard No"
                              name="pan"
                              id="pan"
                              className={
                                errorData?.pan
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setUserInfo({
                                  ...userInfo,
                                  pan: e.target.value,
                                });
                                setErrorData({ ...errorData, pan: "" });
                              }}
                              value={userInfo.pan ? userInfo.pan : ""}
                            />
                            <span className="errorText">
                              {" "}
                              {errorData?.pan ? errorData.pan : ""}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.gst
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="gst">GST No </label>
                            <input
                              type="text"
                              placeholder="Enter Gst No"
                              name="gst"
                              id="gst"
                              className={
                                errorData?.gst
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setUserInfo({
                                  ...userInfo,
                                  gst: e.target.value,
                                });
                                setErrorData({ ...errorData, gst: "" });
                              }}
                              value={userInfo.gst ? userInfo.gst : ""}
                            />
                            <span className="errorText">
                              {" "}
                              {errorData?.gst ? errorData.gst : ""}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.domain
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="domain">Domain </label>
                            <input
                              type="text"
                              placeholder="Enter Domain"
                              name="domain"
                              id="domain"
                              className={
                                errorData?.domain
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setUserInfo({
                                  ...userInfo,
                                  domain:
                                    userInfo.domain &&
                                    !userInfo.domain.includes("@")
                                      ? `@` + e.target.value
                                      : e.target.value,
                                });
                                setErrorData({ ...errorData, domain: "" });
                              }}
                              value={userInfo.domain}
                            />

                            <span className="errorText">
                              {" "}
                              {errorData?.domain ? errorData.domain : ""}
                            </span>
                          </div>
                        </div>
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.address
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="zip_add">Address </label>
                            <input
                              type="text"
                              placeholder="Enter Address"
                              name="Address"
                              id="Address"
                              className={
                                errorData?.address
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setUserInfo({
                                  ...userInfo,
                                  address: e.target.value,
                                });
                                setErrorData({ ...errorData, address: "" });
                              }}
                              value={userInfo.address ? userInfo.address : ""}
                            />
                            <span className="errorText">
                              {" "}
                              {errorData?.address ? errorData.address : ""}
                            </span>
                          </div>
                        </div>

                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                          <div
                            className={
                              errorData?.pincode
                                ? "input_box errorBox"
                                : "input_box"
                            }
                          >
                            <label htmlFor="zip_add">Zip / Postal Code </label>
                            <input
                              type="number"
                              placeholder="Zip / Postal Code"
                              name="zip_add"
                              id="zip_add"
                              className={
                                errorData?.pincode
                                  ? "form-control is-invalid"
                                  : "form-control"
                              }
                              onChange={(e) => {
                                setUserInfo({
                                  ...userInfo,
                                  pincode: e.target.value,
                                });
                                setErrorData({ ...errorData, pincode: "" });
                              }}
                              value={userInfo.pincode ? userInfo.pincode : ""}
                            />
                            <span className="errorText">
                              {" "}
                              {errorData?.pincode ? errorData.pincode : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                  
                  </>
                )}
              </div>

              <div className="text-end d-flex justify-content-end">
              <button
                      disabled={isLoading}
                      className="btn btn-primary me-2"
                      onClick={()=>{
                        router.push("/Admin")
                      }}
                    >
                      {isLoading ? "Loading ..." : "Cancel"}
                    </button>
                <div className="submit_btn">
                  {editMode ? (
                    <button
                      disabled={isLoading}
                      className="btn btn-primary"
                      onClick={updateHandler}
                    >
                      {isLoading ? "Loading ..." : "Update client"}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      disabled={isLoading}
                      onClick={addClientHandler}
                    >
                      {isLoading ? "Loading ..." : "Save & Submit"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default AddClientScreen