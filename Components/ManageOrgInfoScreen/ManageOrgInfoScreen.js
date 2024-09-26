import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Select from 'react-select'; // Ensure you're using react-select
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { fetchData } from '../../Utils/getReq';
import { getCookie, hasCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { array } from './Array';

const ManageOrgInfoScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [userInfo, setUserInfo] = useState({
        organisation_info_id:null,
        company_name: '',
        mobile: '',
        email: '',
        website: '',
        country_id: '',
        state_id: '',
        city_id: '',
        address: '',
    });
    const router=useRouter();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [errors, setErrors] = useState({});
    const [errorToast, setErrorToast] = useState([]);
    const [loader,setLoader] =useState(false)

    const validateForm = () => {
        const newErrors = {};
    
        const companyNameRegex = /^[A-Za-z0-9 ]+$/;
        if (!userInfo.company_name) {
            newErrors.company_name = 'Company Name is required.';
        } else if (!companyNameRegex.test(userInfo.company_name) || /^[0-9]+$/.test(userInfo.company_name)) {
            newErrors.company_name = 'Company Name must contain letters and cannot be numbers alone.';
        }
    
        const mobileRegex = /^[0-9]{10}$/;
        if (!userInfo.mobile) {
            newErrors.mobile = 'Mobile is required.';
        } else if (!mobileRegex.test(userInfo.mobile)) {
            newErrors.mobile = 'Mobile number must be exactly 10 digits.';
        }
    
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userInfo.email) {
            newErrors.email = 'Email is required.';
        } else if (!emailRegex.test(userInfo.email)) {
            newErrors.email = 'Email is not valid.';
        }
    
        const websiteRegex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
        if (!userInfo.website) {
            newErrors.website = 'Website is required.';
        } else if (!websiteRegex.test(userInfo.website)) {
            newErrors.website = 'Website URL is not valid. Make sure it starts with http or https.';
        }
    
        if (!userInfo.country_id) newErrors.country_id = 'Country is required.';
        if (!userInfo.state_id) newErrors.state_id = 'State is required.';
        if (!userInfo.city_id) newErrors.city_id = 'City is required.';
        if (!userInfo.address) newErrors.address = 'Address is required.';
    
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
    };


    const getCountryList = async () => {
        await fetchData(
          `/db/area/country?country_id=1`,
          setCountries,
          errorToast,
          setErrorToast,
          true
        );
      };
    
      const getState = async (id) => {
        await fetchData(
          `/db/area/states?cnt_id=${id}`,
          setStates,
          errorToast,
          setErrorToast,
          true
        );
      };
    
      const getcity = async (id) => {
        await fetchData(
          `/db/area/city?st_id=${id}`,
          (data) => setCities(data.cityData),
          errorToast,
          setErrorToast,
          true
        );
      };

      useEffect(()=>{
            getCountryList()
      },[])

     useEffect(()=>{
        if(userInfo?.country_id){
            getState(userInfo.country_id)
        }
     },[userInfo?.country_id])

     useEffect(()=>{
        if(userInfo?.state_id){
            getcity(userInfo.state_id)
        }
     },[userInfo?.state_id])

     const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form before proceeding
        const isValid = validateForm();
        
        if (!isValid) {
            toast.error("Please fill Madetory Fields.");
            return;
        }
    
        if (hasCookie("token")) {
            setLoader(true)
            const token = getCookie("token");
            const db_name = getCookie("db_name");
    
            const header = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    db: db_name,
                    pass:"pass"
                },
            };
    
            try {
                const response = await axios.post(
                    `${Baseurl}/db/organisation/addOrganisation`,
                    userInfo,
                    header
                );
                if (response.status === 200 || response.status === 201) {
                    setLoader(false)
                    toast.success(response.data.message);
                    router.push("/OrganizationInformation");
                }
            } catch (error) {
                setLoader(false)
                if (error?.response?.data?.status === 422) {
                    toast.error(error?.response?.data?.message);
                }
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                    router.push("/");
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        // Validate form before proceeding
        const isValid = validateForm();
        
        if (!isValid) {
            toast.error("Please fill Madetory Fields.");
            return;
        }
    
        if (hasCookie("token")) {
            setLoader(true)
            const token = getCookie("token");
            const db_name = getCookie("db_name");
    
            const header = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    db: db_name,
                    pass:"pass"
                },
            };
    
            try {
                const response = await axios.put(
                    `${Baseurl}/db/organisation/updateOrganisation`,
                    userInfo,
                    header
                );
                if (response.status === 200 || response.status === 201) {
                    setLoader(false)
                    toast.success(response.data.message);
                    router.push("/OrganizationInformation");
                }
            } catch (error) {
                setLoader(false)
                if (error?.response?.data?.status === 422) {
                    toast.error(error?.response?.data?.message);
                }
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                    router.push("/");
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    };

    const getData = async () => {
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
              Baseurl + `/db/organisation/getOrganisation`,
              header
            );
            setUserInfo(data?.data[0]);
          } catch (error) {
            if (error?.response?.data?.message) {
              toast.error(error?.response?.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

    useEffect(()=>{
        getData()
    },[])

    return (
        <>
            <div className={`main_Box ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">Organization Information</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link href='/setting'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Organization Informationr</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content p-5  ">
                    <form onSubmit={userInfo?.organisation_info_id!=null ?handleUpdate :handleSubmit} style={{border:"1px solid #A7AFC9",borderRadius:"10px",padding:"10px",boxShadow:"1px 1px 4px #A7AFC9",borderTop:"0px",borderLeft:"0px"}} className='w-75 m-auto'>
                        <div className="add_user_form" >
                       {/* {
                        array?.map(({id,label,placeholder},index)=>(
                            <div className="row p-2" key={index}>
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="company_name" className=' fw-semibold mb-1'>{label} *</label>
                                        <input
                                            type="text"
                                            placeholder={placeholder}
                                            name={id}
                                            id={id}
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, [id]: e.target.value })}
                                            value={userInfo[id]}
                                        />
                                        {errors[id] && <span className="error">{errors[id]}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                       } */}

                    <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="company_name" className=' fw-semibold mb-1'>Company Name *</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Company Name'
                                            name="company_name"
                                            id="company_name"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, company_name: e.target.value })}
                                            value={userInfo?.company_name}
                                        />
                                        {errors.company_name && <span className="error">{errors.company_name}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="mobile" className=' fw-semibold mb-1'>Mobile *</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Mobile Number'
                                            name="mobile"
                                            id="mobile"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, mobile: e.target.value })}
                                            value={userInfo?.mobile}
                                        />
                                        {errors.mobile && <span className="error">{errors.mobile}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="email" className=' fw-semibold mb-1'>Email *</label>
                                        <input
                                            type="email"
                                            placeholder='Enter Email'
                                            name="email"
                                            id="email"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            value={userInfo?.email}
                                        />
                                        {errors.email && <span className="error">{errors.email}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="website" className=' fw-semibold mb-1'>Website *</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Website URL'
                                            name="website"
                                            id="website"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                                            value={userInfo?.website}
                                        />
                                        {errors.website && <span className="error">{errors.website}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="address" className=' fw-semibold mb-1'>Address *</label>
                                        <input
                                            type="text"
                                            placeholder='Enter Address'
                                            name="address"
                                            id="address"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                                            value={userInfo?.address}
                                        />
                                        {errors.address && <span className="error">{errors.address}</span>}
                                    </div>
                                </div>
                            </div> 
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="country" className=' fw-semibold mb-1'>Country *</label>
                                        <Select
                                            id="country"
                                            value={countries?.map((data)=>{
                                                if(userInfo?.country_id==data?.country_id){
                                                    return {
                                                        value: data?.country_id,
                                                        label: data?.country_name,
                                                      }
                                                }
                                            })}
                                            options={countries?.map((data) => {
                                                return {
                                                  value: data?.country_id,
                                                  label: data?.country_name,
                                                };
                                              })}
                                            onChange={(e)=>{
                                                setUserInfo({...userInfo,country_id:e.value})
                                            }}
                                        />
                                        {errors.country_id && <span className="error">{errors.country_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="state" className=' fw-semibold mb-1'>State *</label>
                                        <Select
                                            id="state"
                                            value={states?.map((data)=>{
                                                if(userInfo?.state_id==data?.state_id){
                                                    return {
                                                        value: data?.state_id,
                                                        label: data?.state_name,
                                                      }
                                                }
                                            })}
                                            options={states?.map((data) => {
                                                return {
                                                  value: data?.state_id,
                                                  label: data?.state_name,
                                                };
                                              })}
                                            onChange={(e)=>{
                                                setUserInfo({...userInfo,state_id:e.value})
                                            }}
                                        />
                                        {errors.state_id && <span className="error">{errors.state_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12">
                                    <div className="input_box">
                                        <label htmlFor="city" className=' fw-semibold mb-1'>City *</label>
                                        <Select
                                            id="city"
                                            value={cities?.map((data)=>{
                                                if(userInfo?.city_id==data?.city_id){
                                                    return {
                                                        value: data?.city_id,
                                                        label: data?.city_name,
                                                      }
                                                }
                                            })}
                                            options={cities?.map((data) => {
                                                return {
                                                  value: data?.city_id,
                                                  label: data?.city_name,
                                                };
                                              })}
                                            onChange={(e)=>{
                                                setUserInfo({...userInfo,city_id:e.value})
                                            }}
                                        />
                                        {errors.city_id && <span className="error">{errors.city_id}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="row p-2">
                                <div className="col-xl-12 ">
                                    <button type="submit" className="btn btn-primary float-end">
                                    {
                                    userInfo?.organisation_info_id != null 
                                        ? (loader 
                                            ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Update</>) 
                                            : "Update")
                                        : (loader 
                                            ? (<><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>&nbsp;Submit</>) 
                                            : "Submit")
                                    }

                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                    
                    
                </div>
            </div>
        </>
    );
};

export default ManageOrgInfoScreen;