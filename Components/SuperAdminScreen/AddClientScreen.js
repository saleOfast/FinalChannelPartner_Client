// code with media
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
        subscription_start_date: null,
        subscription_end_date: null,
        subscription_start_date_media: null,
        subscription_end_date_media: null,
        subscription_start_date_channel: null,
        subscription_end_date_channel: null,
        subscription_start_date_dms: null,
        subscription_end_date_dms: null,
        subscription_start_date_sales: null,
        subscription_end_date_sales: null,
        no_of_license: '',
        no_of_channel_license: 0,
        no_of_media_license:0,
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
        isCRM:null ,
        isMEDIA:null,
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
        host_name:"",
        salesforce_client_id:"",
        salesforce_client_pwd:"",
        grant_type:"",
        salesforce_url:""
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
                const tempDate = response?.data?.data
                setUserInfo({
                  user: tempDate.user,
                  email: tempDate.email,
                  contact_number: tempDate.contact_number,
                  user_id: tempDate.user_id,
                  user_code: tempDate.user_code,
                  subscription_start_date: (tempDate?.subscription_start_date==="0000-00-00" || tempDate?.subscription_start_date===null ) ? null :  moment(
                    tempDate.subscription_start_date
                  ).format("YYYY-MM-DD"),
                  subscription_end_date:(tempDate?.subscription_end_date==="0000-00-00" || tempDate?.subscription_end_date===null) ? null : moment(
                    tempDate.subscription_end_date
                  ).format("YYYY-MM-DD"),
                  

                  subscription_start_date_media: (tempDate?.subscription_start_date_media==="0000-00-00" || tempDate?.subscription_start_date_media===null ) ? null :  moment(
                    tempDate.subscription_start_date_media
                  ).format("YYYY-MM-DD"),
                  subscription_end_date_media:(tempDate?.subscription_end_date_media==="0000-00-00" || tempDate?.subscription_end_date_media===null) ? null : moment(
                    tempDate.subscription_end_date_media
                  ).format("YYYY-MM-DD"),


                  subscription_start_date_channel: (tempDate?.subscription_start_date_channel===null || tempDate?.subscription_start_date_channel==="0000-00-00") ? null : moment(
                    tempDate.subscription_start_date_channel
                  ).format("YYYY-MM-DD"),
                  subscription_end_date_channel:(tempDate?.subscription_end_date_channel===null || tempDate?.subscription_end_date_channel==="0000-00-00") ? null : moment(
                    tempDate.subscription_end_date_channel
                  ).format("YYYY-MM-DD"),
                  subscription_start_date_sales:(tempDate?.subscription_start_date_sales===null || tempDate?.subscription_start_date_sales==="0000-00-00") ? null : moment(
                    tempDate.subscription_start_date_sales
                  ).format("YYYY-MM-DD"),
                  subscription_end_date_sales:(tempDate?.subscription_end_date_sales===null || tempDate?.subscription_end_date_sales==="0000-00-00") ? null : moment(
                    tempDate.subscription_end_date_sales
                  ).format("YYYY-MM-DD"),
                  subscription_start_date_dms:(tempDate?.subscription_start_date_dms===null || tempDate?.subscription_start_date_dms==="0000-00-00") ? null : moment(
                    tempDate.subscription_start_date_dms
                  ).format("YYYY-MM-DD"),
                  subscription_end_date_dms:(tempDate?.subscription_end_date_dms===null || tempDate?.subscription_end_date_dms==="0000-00-00") ? null : moment(
                    tempDate.subscription_end_date_dms
                  ).format("YYYY-MM-DD"),
                  no_of_license: tempDate.no_of_license,
                  no_of_media_license: tempDate.no_of_media_license,
                  gst: tempDate.gst,
                  no_of_months: tempDate.no_of_months,
                  domain: tempDate.domain,
                  pan: tempDate.pan,
                  gst: tempDate.gst,
                  address: tempDate.address,
                  isCRM: true,  // Default values for flags
                  isMEDIA:false,
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
                  no_of_channel_license: tempDate?.no_of_channel_license,
                  no_of_dms_license: tempDate?.no_of_dms_license,
                  no_of_sales_license: tempDate?.no_of_sales_license,
                  button_color: tempDate?.button_color,
                  sidebar_color: tempDate?.sidebar_color,
                  top_nav_color: tempDate?.top_nav_color,
                  host_name:tempDate?.host_name,
                  salesforce_client_id:tempDate?.salesforce_client_id,
                  salesforce_client_pwd:tempDate?.salesforce_client_pwd,
                  grant_type:tempDate?.grant_type,
                  salesforce_url:tempDate?.salesforce_url,
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
                      case 5:
                        setUserInfo((prev)=>({...prev, isMEDIA: element.actions}))
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo?.email)) {
          setErrorData({ ...errorData, email: 'Please enter a valid email address' });
          return toast.error('Please enter a valid email address');
      }
      if(userInfo?.host_name==""|| userInfo?.host_name==null){
        setErrorData({ ...errorData, host_name: 'Please enter Salesforce Host URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_client_id==""|| userInfo?.salesforce_client_id==null){
        setErrorData({ ...errorData, salesforce_client_id: 'Please enter Salesforce Client ID' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_client_pwd==""|| userInfo?.salesforce_client_pwd==null){
        setErrorData({ ...errorData, salesforce_client_pwd: 'Please enter Salesforce Client Password' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.grant_type==""|| userInfo?.grant_type==null){
        setErrorData({ ...errorData, grant_type: 'Please enter Grant Type' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_url==""|| userInfo?.salesforce_url==null){
        setErrorData({ ...errorData, salesforce_url: 'Please enter Salesforce Request URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.client_url=="" || userInfo?.client_url==null){
        setErrorData({ ...errorData, client_url: 'Please enter Client URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(!userInfo?.isCRM && !userInfo?.isCHANNEL && !userInfo?.isDMS && !userInfo?.isSALES && !userInfo?.isMEDIA){
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.isCRM){
        if(userInfo?.subscription_start_date==null){
           setErrorData({ ...errorData, subscription_start_date: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date==null){
           setErrorData({ ...errorData, subscription_end_date: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_license==0|| userInfo?.no_of_license==null){
           setErrorData({ ...errorData, no_of_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date==null || userInfo?.subscription_end_date==null ||userInfo?.no_of_license==0|| userInfo?.no_of_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isMEDIA){
        if(userInfo?.subscription_start_date_media==null){
           setErrorData({ ...errorData, subscription_start_date_media: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_media==null){
           setErrorData({ ...errorData, subscription_end_date_media: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_media_license==0 || userInfo?.no_of_media_license==null){
           setErrorData({ ...errorData, no_of_media_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_media==null || userInfo?.subscription_end_date_media==null ||userInfo?.no_of_media_license==0 || userInfo?.no_of_media_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isCHANNEL){
        if(userInfo?.subscription_start_date_channel==null){
           setErrorData({ ...errorData, subscription_start_date_channel: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_channel==null){
           setErrorData({ ...errorData, subscription_end_date_channel: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_channel_license==0 || userInfo?.no_of_channel_license==null){
           setErrorData({ ...errorData, no_of_channel_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_channel==null || userInfo?.subscription_end_date_channel==null ||userInfo?.no_of_channel_license==0 ||userInfo?.no_of_channel_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isDMS){
        if(userInfo?.subscription_start_date_dms==null){
           setErrorData({ ...errorData, subscription_start_date_dms: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_dms==null){
           setErrorData({ ...errorData, subscription_end_date_dms: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_dms_license==0 || userInfo?.no_of_dms_license==null){
           setErrorData({ ...errorData, no_of_dms_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_dms==null || userInfo?.subscription_end_date_dms==null ||userInfo?.no_of_dms_license==0 || userInfo?.no_of_dms_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isSALES){
        if(userInfo?.subscription_start_date_sales==null){
           setErrorData({ ...errorData, subscription_start_date_sales: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_sales==null){
           setErrorData({ ...errorData, subscription_end_date_sales: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_sales_license==0 || userInfo?.no_of_sales_license==null){
           setErrorData({ ...errorData, no_of_sales_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_sales==null || userInfo?.subscription_end_date_sales==null ||userInfo?.no_of_sales_license==0 || userInfo?.no_of_sales_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      console.log(userInfo)
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
                    router.push('/admin');
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
    }  

    async function updateHandler() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userInfo?.email)) {
          setErrorData({ ...errorData, email: 'Please enter a valid email address' });
          return toast.error('Please enter a valid email address');
      }
      if(userInfo?.host_name=="" || userInfo?.host_name==null){
        setErrorData({ ...errorData, host_name: 'Please enter Salesforce Host URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_client_id==""|| userInfo?.salesforce_client_id==null){
        setErrorData({ ...errorData, salesforce_client_id: 'Please enter Salesforce Client ID' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_client_pwd==""|| userInfo?.salesforce_client_pwd==null){
        setErrorData({ ...errorData, salesforce_client_pwd: 'Please enter Salesforce Client Password' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.grant_type==""|| userInfo?.grant_type==null){
        setErrorData({ ...errorData, grant_type: 'Please enter Grant Type' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.salesforce_url==""|| userInfo?.salesforce_url==null){
        setErrorData({ ...errorData, salesforce_url: 'Please enter Salesforce Request URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.client_url==""|| userInfo?.client_url==null){
        setErrorData({ ...errorData, client_url: 'Please enter Client URL' })
        return toast.error('Please fill the Mandatory fields')
      }
      if(!userInfo?.isCRM && !userInfo?.isCHANNEL && !userInfo?.isDMS && !userInfo?.isSALES &&!userInfo?.isMEDIA){
        return toast.error('Please fill the Mandatory fields')
      }
      if(userInfo?.isCRM){
        if(userInfo?.subscription_start_date==null){
           setErrorData({ ...errorData, subscription_start_date: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date==null){
           setErrorData({ ...errorData, subscription_end_date: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_license==0 || userInfo?.no_of_license==null){
           setErrorData({ ...errorData, no_of_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date==null || userInfo?.subscription_end_date==null ||userInfo?.no_of_license==0|| userInfo?.no_of_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isMEDIA){
        if(userInfo?.subscription_start_date_media==null){
           setErrorData({ ...errorData, subscription_start_date_media: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_media==null){
           setErrorData({ ...errorData, subscription_end_date_media: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_media_license==0 || userInfo?.no_of_media_license==null){
           setErrorData({ ...errorData, no_of_media_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_media==null || userInfo?.subscription_end_date_media==null ||userInfo?.no_of_media_license
          ==0 || userInfo?.no_of_media_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isCHANNEL){
        if(userInfo?.subscription_start_date_channel==null){
           setErrorData({ ...errorData, subscription_start_date_channel: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_channel==null){
           setErrorData({ ...errorData, subscription_end_date_channel: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_channel_license==0 || userInfo?.no_of_channel_license==null){
           setErrorData({ ...errorData, no_of_channel_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_channel==null || userInfo?.subscription_end_date_channel==null ||userInfo?.no_of_channel_license==0 ||userInfo?.no_of_channel_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isDMS){
        if(userInfo?.subscription_start_date_dms==null){
           setErrorData({ ...errorData, subscription_start_date_dms: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_dms==null){
           setErrorData({ ...errorData, subscription_end_date_dms: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_dms_license==0 || userInfo?.no_of_dms_license==null){
           setErrorData({ ...errorData, no_of_dms_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_dms==null || userInfo?.subscription_end_date_dms==null || userInfo?.no_of_dms_license==0 || userInfo?.no_of_dms_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
      if(userInfo?.isSALES){
        if(userInfo?.subscription_start_date_sales==null){
           setErrorData({ ...errorData, subscription_start_date_sales: 'Please enter subscription start date' })
        }
        if(userInfo?.subscription_end_date_sales==null){
           setErrorData({ ...errorData, subscription_end_date_sales: 'Please enter subscription end date' })
        }
        if(userInfo?.no_of_sales_license==0 || userInfo?.no_of_sales_license==null){
           setErrorData({ ...errorData, no_of_sales_license: 'Please enter no of licenses ' })
        }
        if(userInfo?.subscription_start_date_sales==null || userInfo?.subscription_end_date_sales==null || userInfo?.no_of_sales_license==0 || userInfo?.no_of_sales_license==null){
          return toast.error('Please fill the Mandatory fields')
        }
      }
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
                    router.push('/admin');
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
      const file = e.target.files[0];
    
      if (file) {
        // Check file type
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          setUserInfo({ ...userInfo, logo: null, logoPreview: null });
          toast.error('Invalid file type. Please select a PNG, JPEG, or JPG image.', { autoClose: 1500 });
          e.target.value = ''; // Clear the input value to prevent invalid file from being selected
          return; // Exit the function early
        }
    
        // Use FileReader to read the file and check dimensions
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            // Log the dimensions for debugging
            console.log(`Loaded Image Width: ${img.width}, Height: ${img.height}`);
    
            // Check dimensions
            if ( img.width > 200 || img.height > 60) {
              console.log('Image dimensions are invalid, rejecting the file');
              setUserInfo({ ...userInfo, logo: null, logoPreview: null });
              toast.error('Invalid image dimensions. The image must be 200 pixels or less in height and 60 pixels or less in width.', { autoClose: 2000 });
              e.target.value = ''; // Clear the input value to prevent invalid file from being selected
              return; // Exit the function early
            }
    
            // If everything is fine, update user info
            console.log('Image dimensions are valid, accepting the file');
            setUserInfo({
              ...userInfo,
              logo: file,
              logoPreview: event.target.result, // Use FileReader result for preview
            });
          };
    
          img.onerror = () => {
            console.error('Error occurred while loading the image');
            setUserInfo({ ...userInfo, logo: null, logoPreview: null });
            toast.error('An error occurred while loading the image. Please try again.', { autoClose: 1500 });
            e.target.value = ''; // Clear the input value to prevent invalid file from being selected
          };
    
          img.src = event.target.result; // Set image source to read result
        };
    
        reader.readAsDataURL(file); // Read the file as a data URL
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
      <div className={`main_Box  w-100`}>
        <div className="bread_head">
          <h3 className="content_head">{editMode ? "EDIT" : "ADD"} Client</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                
                <Link href="/admin">All Clients </Link>
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
                      type="text"
                      placeholder="Enter Contact Number"
                      name="contact"
                      id="contact"
                      className={
                        errorData?.contact_number
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      maxLength="10"
                      onChange={(e) => {
                        const value = e.target.value;
                        // Remove non-digit characters
                        const numericValue = value.replace(/\D/g, '');
                        // Limit to 10 digits
                        const truncatedValue = numericValue.slice(0, 10);
                        
                        setUserInfo({
                          ...userInfo,
                          contact_number: truncatedValue,
                        });
                        setErrorData({ ...errorData, contact_number: "" });
                      }}
                      value={userInfo.contact_number || ""}
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
                      errorData?.client_url ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Client URL *</label>
                    <input
                      type="text"
                      placeholder="Enter Client URL"
                      name="client_url"
                      id="client_url"
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

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.host_name ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Salesforce Token URL *</label>
                    <input
                      type="text"
                      placeholder="Salesforce Host URL"
                      name="Name"
                      id="Name"
                      className={
                        errorData?.host_name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, host_name: e.target.value });
                        setErrorData({ ...errorData, host_name: "" });
                      }}
                      value={userInfo.host_name ? userInfo.host_name : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.host_name ? errorData.host_name : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.host_name ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Salesforce Request URL *</label>
                    <input
                      type="text"
                      placeholder="Salesforce Request URL"
                      name="salesforce_url"
                      id="salesforce_url"
                      className={
                        errorData?.host_name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, salesforce_url: e.target.value });
                        setErrorData({ ...errorData, salesforce_url: "" });
                      }}
                      value={userInfo.salesforce_url ? userInfo.salesforce_url : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.salesforce_url ? errorData.salesforce_url : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.host_name ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Salesforce Client ID *</label>
                    <input
                      type="text"
                      placeholder="Salesforce Client ID"
                      name="salesforce_client_id"
                      id="salesforce_client_id"
                      className={
                        errorData?.host_name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, salesforce_client_id: e.target.value });
                        setErrorData({ ...errorData, salesforce_client_id: "" });
                      }}
                      value={userInfo.salesforce_client_id ? userInfo.salesforce_client_id : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.salesforce_client_id ? errorData.salesforce_client_id : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.host_name ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Salesforce Client Password *</label>
                    <input
                      type="text"
                      placeholder="Salesforce Client Password"
                      name="salesforce_client_pwd"
                      id="salesforce_client_pwd"
                      className={
                        errorData?.host_name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, salesforce_client_pwd: e.target.value });
                        setErrorData({ ...errorData, salesforce_client_pwd: "" });
                      }}
                      value={userInfo.salesforce_client_pwd ? userInfo.salesforce_client_pwd : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.salesforce_client_pwd ? errorData.salesforce_client_pwd : ""}
                    </span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.host_name ? "input_box errorBox" : "input_box"
                    }
                  >
                    <label htmlFor="Name">Grant Type *</label>
                    <input
                      type="text"
                      placeholder="Grant Type"
                      name="grant_type"
                      id="grant_type"
                      className={
                        errorData?.host_name
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, grant_type: e.target.value });
                        setErrorData({ ...errorData, grant_type: "" });
                      }}
                      value={userInfo.grant_type ? userInfo.grant_type : ""}
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.grant_type ? errorData.grant_type : ""}
                    </span>
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
                          Product Details *
                        </label>
                      </div>
                  </div>

                    <div className="">

                    <div className="col-xl-12 col-md-12 col-sm-12 mb-3">
                      <div className='d-flex flex-column flex-md-row  justify-content-between'>
                        <div className="form-check col-xl-2 col-md-2 col-sm-12 col-12">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option1"
                                  id="option1"
                                  // checked={!editMode ? true : userInfo.isCRM }
                                  checked={userInfo.isCRM }
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      // isCRM: !editMode ? 1 : e.target.checked ? 1 : 0,
                                      isCRM: e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isCRM: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label "
                                  htmlFor="option1"
                                >
                                  CRM
                                </label>
                        </div>
                        {userInfo.isCRM ?
                        <>
                              <div className="input_box m-0 col-xl-3 col-md-3 col-sm-12 col-12">
                          <label>Number of Licenses*</label>
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
                            const value = e.target.value;
                            // Ensure that the value is a number and does not exceed 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                no_of_license: value,
                              });
                              setErrorData({ ...errorData, no_of_license: "" });
                            } else {
                              setErrorData({ ...errorData, no_of_license: "Only up to 10 digits are allowed" });
                            }
                          }}
                          value={userInfo.no_of_license ? userInfo.no_of_license : ""}
                        />

                        <span className="errorText">
                          {" "}
                          {errorData?.no_of_license ? errorData.no_of_license : ""}
                        </span>
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
                      min={moment().format("YYYY-MM-DD")}
                      className={
                        errorData?.subscription_start_date
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
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
                              <div className="input_box">
                                <label htmlFor="subscription_start_date">
                                  Subscription End Date *
                                </label>
                                <input
                                  type="date"
                                  name="subscription_start_date"
                                  id="subscription_start_date"
                                  min={moment().format("YYYY-MM-DD")}
                                  className={
                                    errorData?.subscription_end_date
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      subscription_end_date: e.target.value,
                                    });
                                    setErrorData({
                                      ...errorData,
                                      subscription_end_date: "",
                                    });
                                  }}
                                  value={
                                    userInfo.subscription_end_date
                                      ? userInfo.subscription_end_date
                                      : ""
                                  }
                                />
                              </div>
                            </div>   
                        </>
                        
                        : <></> }
                      </div>
                      
                    </div>


                    <div className="col-xl-12 col-md-12 col-sm-12 mb-3">
                    <div className='d-flex flex-column flex-md-row   justify-content-between'>
                        <div className="form-check col-xl-2 col-md-2 col-sm-12 col-12">
                                <input
                                  className="form-check-input text-nowrap"
                                  type="checkbox"
                                  value="option2"
                                  id="option2"
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
                                  htmlFor="option2"
                                >
                                  Channel Partner
                                </label>
                        </div>
                        {userInfo.isCHANNEL ?
                        <>
                            <div className="input_box m-0 col-xl-3 col-md-3 col-sm-12 col-12">
                          <label>Number of Licenses*</label>
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
                            const value = e.target.value;
                            // Ensure that the value is a number and does not exceed 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                no_of_channel_license: value,
                              });
                              setErrorData({ ...errorData, no_of_channel_license: "" });
                            } else {
                              setErrorData({ ...errorData, no_of_channel_license: "Only up to 10 digits are allowed" });
                            }
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
                                min={moment().format("YYYY-MM-DD")}
                                className={
                                  errorData?.subscription_start_date_channel
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                onChange={(e) => {
                                  setUserInfo({
                                    ...userInfo,
                                    subscription_start_date_channel: e.target.value,
                                  });
                                  setErrorData({
                                    ...errorData,
                                    subscription_start_date_channel: "",
                                  });
                                }}
                                value={
                                  userInfo.subscription_start_date_channel
                                    ? userInfo.subscription_start_date_channel
                                    : ""
                                }
                              />
                              <span className="errorText">
                                {" "}
                                {errorData?.subscription_start_date_channel
                                  ? errorData.subscription_start_date_channel
                                  : ""}
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
                                  min={moment().format("YYYY-MM-DD")}
                                  className={
                                    errorData?.subscription_end_date_channel
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      subscription_end_date_channel: e.target.value,
                                    });
                                    setErrorData({
                                      ...errorData,
                                      subscription_end_date_channel: "",
                                    });
                                  }}
                                  value={
                                    userInfo.subscription_end_date_channel
                                      ? userInfo.subscription_end_date_channel
                                      : ""
                                  }
                                />
                              </div>
                            </div> 
                        </>
                          
                        : <></> }
                      </div>
                      
                    </div>

                    <div className="col-xl-12 col-md-12 col-sm-12 mb-3">
                    <div className='d-flex flex-column flex-md-row   justify-content-between'>
                        <div className="form-check col-xl-2 col-md-2 col-sm-12 col-12">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option3"
                                  id="option3"
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
                                  htmlFor="option3"
                                >
                                  DMS
                                </label>
                        </div>
                        {userInfo.isDMS ?
                        <>
                        <div className="input_box m-0 col-xl-3 col-md-3 col-sm-12 col-12">
                          <label>Number of Licenses*</label>
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
                            const value = e.target.value;
                            // Ensure that the value is a number and does not exceed 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                no_of_dms_license: value,
                              });
                              setErrorData({ ...errorData, no_of_dms_license: "" });
                            } else {
                              setErrorData({ ...errorData, no_of_dms_license: "Only up to 10 digits are allowed" });
                            }
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
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                            <div
                              className={
                                errorData?.subscription_start_date_dms
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
                                min={moment().format("YYYY-MM-DD")}
                                className={
                                  errorData?.subscription_start_date_dms
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                onChange={(e) => {
                                  setUserInfo({
                                    ...userInfo,
                                    subscription_start_date_dms: e.target.value,
                                  });
                                  setErrorData({
                                    ...errorData,
                                    subscription_start_date_dms: "",
                                  });
                                }}
                                value={
                                  userInfo.subscription_start_date_dms
                                    ? userInfo.subscription_start_date_dms
                                    : ""
                                }
                              />
                              <span className="errorText">
                                {" "}
                                {errorData?.subscription_start_date_dms
                                  ? errorData.subscription_start_date_dms
                                  : ""}
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
                                  min={moment().format("YYYY-MM-DD")}
                                  className={
                                    errorData?.subscription_end_date_dms
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      subscription_end_date_dms: e.target.value,
                                    });
                                    setErrorData({
                                      ...errorData,
                                      subscription_end_date_dms: "",
                                    });
                                  }}
                                  value={
                                    userInfo.subscription_end_date_dms
                                      ? userInfo.subscription_end_date_dms
                                      : ""
                                  }
                                />
                              </div>
                        </div> 
                        </>

                        : <></> }
                      </div>
                      
                    </div>
                    
                    <div className="col-xl-12 col-md-12 col-sm-12 mb-3">
                    <div className='d-flex flex-column flex-md-row   justify-content-between'>
                        <div className="form-check col-xl-2 col-md-2 col-sm-12 col-12">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option4"
                                  id="option4"
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
                                  htmlFor="option4"
                                >
                                  Sales App
                                </label>
                        </div>
                        {userInfo.isSALES ?
                        <>
                          <div className="input_box m-0 col-xl-3 col-md-3 col-sm-12 col-12">
                          <label>Number of Licenses*</label>
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
                              const value = e.target.value;
                            // Ensure that the value is a number and does not exceed 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                no_of_sales_license: value,
                              });
                              setErrorData({ ...errorData, no_of_sales_license: "" });
                            } else {
                              setErrorData({ ...errorData, no_of_sales_license: "Only up to 10 digits are allowed" });
                            }
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
                          <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                            <div
                              className={
                                errorData?.subscription_start_date_sales
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
                                min={moment().format("YYYY-MM-DD")}
                                className={
                                  errorData?.subscription_start_date_sales
                                    ? "form-control is-invalid"
                                    : "form-control"
                                }
                                onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                onChange={(e) => {
                                  setUserInfo({
                                    ...userInfo,
                                    subscription_start_date_sales: e.target.value,
                                  });
                                  setErrorData({
                                    ...errorData,
                                    subscription_start_date_sales: "",
                                  });
                                }}
                                value={
                                  userInfo.subscription_start_date_sales
                                    ? userInfo.subscription_start_date_sales
                                    : ""
                                }
                              />
                              <span className="errorText">
                                {" "}
                                {errorData?.subscription_start_date_sales
                                  ? errorData.subscription_start_date_sales
                                  : ""}
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
                                  min={moment().format("YYYY-MM-DD")}
                                  className={
                                    errorData?.subscription_end_date_sales
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      subscription_end_date_sales: e.target.value,
                                    });
                                    setErrorData({
                                      ...errorData,
                                      subscription_end_date_sales: "",
                                    });
                                  }}
                                  value={
                                    userInfo.subscription_end_date_sales
                                      ? userInfo.subscription_end_date_sales
                                      : ""
                                  }
                                />
                              </div>
                        </div>
                        </>
                          
                        : <></> }
                      </div>
                      
                    </div>

  
                    <div className="col-xl-12 col-md-12 col-sm-12 mb-3">
                      <div className='d-flex flex-column flex-md-row  justify-content-between'>
                        <div className="form-check col-xl-2 col-md-2 col-sm-12 col-12">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  value="option5"
                                  id="option5"
                                  // checked={!editMode ? true : userInfo.isCRM }
                                  checked={userInfo?.isMEDIA }
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      // isCRM: !editMode ? 1 : e.target.checked ? 1 : 0,
                                      isMEDIA: e.target.checked ? 1 : 0,
                                    });
                                    setErrorData({ ...errorData, isMEDIA: "" });
                                  }}
                                />
                                <label
                                  className="form-check-label "
                                  htmlFor="option5"
                                >
                                  MEDIA
                                </label>
                        </div>
                        {userInfo.isMEDIA ?
                        <>
                              <div className="input_box m-0 col-xl-3 col-md-3 col-sm-12 col-12">
                          <label>Number of Licenses*</label>
                          <input
                          type="number"
                          placeholder="Enter Licence"
                          name="no_of_license"
                          id="no_of_license"
                          className={
                            errorData?.no_of_media_license
                              ? "form-control is-invalid"
                              : "form-control"
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            // Ensure that the value is a number and does not exceed 10 digits
                            if (/^\d{0,10}$/.test(value)) {
                              setUserInfo({
                                ...userInfo,
                                no_of_media_license: value,
                              });
                              setErrorData({ ...errorData, no_of_media_license: "" });
                            } else {
                              setErrorData({ ...errorData, no_of_media_license: "Only up to 10 digits are allowed" });
                            }
                          }}
                          value={
                            userInfo.no_of_media_license ? userInfo.no_of_media_license : ""
                          }
                        />
                        <span className="errorText">
                          {" "}
                          {errorData?.no_of_media_license ? errorData.no_of_media_license : ""}
                        </span>
                              </div>
                             <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div
                    className={
                      errorData?.subscription_start_date_media
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
                      min={moment().format("YYYY-MM-DD")}
                      className={
                        errorData?.subscription_start_date_media
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                      onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                      onChange={(e) => {
                        setUserInfo({
                          ...userInfo,
                          subscription_start_date_media: e.target.value,
                        });
                        setErrorData({
                          ...errorData,
                          subscription_start_date_media: "",
                        });
                      }}
                      value={
                        userInfo.subscription_start_date_media
                          ? userInfo.subscription_start_date_media
                          : ""
                      }
                    />
                    <span className="errorText">
                      {" "}
                      {errorData?.subscription_start_date_media
                        ? errorData.subscription_start_date_media
                        : ""}
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
                                  min={moment().format("YYYY-MM-DD")}
                                  className={
                                    errorData?.subscription_end_date_media
                                      ? "form-control is-invalid"
                                      : "form-control"
                                  }
                                  onKeyDown={(e) => e.preventDefault()}
                      onPaste={(e) => e.preventDefault()}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      subscription_end_date_media: e.target.value,
                                    });
                                    setErrorData({
                                      ...errorData,
                                      subscription_end_date_media: "",
                                    });
                                  }}
                                  value={
                                    userInfo.subscription_end_date_media
                                      ? userInfo.subscription_end_date_media
                                      : ""
                                  }
                                />
                              </div>
                            </div>   
                        </>
                        
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
                    <label className="form-label">Logo (Best Dimension: 200x60)</label>
                      <input
                        type="file"
                        accept=".png, .jpeg, .jpg"
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
                    
                    {
                      userInfo?.isCHANNEL ?(
                        <div className="mb-3">
                        <div className="other_details_info" style={{padding: '20px 0px', borderTop: '1px dashed #dfdfff'}}>
                            <div className="other_details">
                              <label className="text_bold head" htmlFor="opt_dtls">
                                Images for Channel Partner login page
                              </label>
                            </div>
                        </div>
    
                        <div className="row">
                        <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                        <div className="d-flex flex-column gap-1">
                          <label className="form-label"> Image 1  </label>
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
                          <label className="form-label"> Image 2 </label>
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
                          <label className="form-label"> Image 3 </label>
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
                          <label className="form-label">Image 4 </label>
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
                     </div>
                      ) :""
                    }
                 
                  

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
                      className="btn btn-danger text-white me-2"
                      onClick={()=>{
                        router.push("/admin")
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