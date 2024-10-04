import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import Select from "react-select";
import { fetchData } from "../../../Utils/getReq";
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { startButtonLoading, stopButtonLoading } from "../../../store/buttonLoaderSlice";
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../Loader/Loader';


const paymentOptions = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
  ];

const bankingDetailsArray = [
    { label: "Business PAN Card", id: "pan_file",preview:"pan_file_preview" },
    { label: "Certificate of Incorporation", id: "incorporation_certificate",preview:"incorporation_certificate_preview" },
    { label: "Address Proof", id: "address_proof",preview:"address_proof_preview" },
    { label: "GST Registration Certificate", id: "gst_registration",preview:"gst_registration_preview" },
    { label: "Banking Details", id: "banking_details",preview:"banking_details_preview" },
  ];

  const fileDisplayStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  };
  
  const fileNameStyle = {
    flexGrow: 1,
    marginRight: '10px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  
  const removeButtonStyle = {
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: '#fff',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '16px',
    lineHeight: '1',
    transition: 'background-color 0.3s ease',
  };
  
  const removeButtonHoverStyle = {
    ...removeButtonStyle,
    backgroundColor: '#e60000',
  };


const OnboradingProcessScreen = () => {

const [distributorInfo, setDistributorInfo] = useState({
        user: "",
        user_l_name:"",
        contact_person: "",
        contact_number: "",
        email: "",
        address: "",
        city_id: "",
        state_id: "",
        country_id: "",
        credit_limit: "",
        payment_method: "",
        pan_file: "",
        pan_file_preview: "",
        incorporation_certificate: "",
        incorporation_certificate_preview: "",
        address_proof: "",
        address_proof_preview: "",
        gst_registration: "",
        gst_registration_preview: "",
        banking_details: "",
        banking_details_preview: "",
        isTokenVerified: false,
        isUploadVerified: false,
});
const router=useRouter();
const [countryList, setcountrylist] = useState([]);
const [stateList, setStatelist] = useState([]);
const [cityList, setCitylist] = useState([]);
const [errorToast, setErrorToast] = useState([]);
const [viewMode, setViewMode] = useState(true);
const [editMode, setEditMode] = useState(false);
const [errorData, setErrorData] = useState({});
const [isLoading, setisLoading] = useState(false);
const [clientData,setClientData] = useState()
const {isButtonLoading}=useSelector((state)=>state.buttonLoader)
  const dispatch=useDispatch()

    const handleFileUpload = (e, field, preview) => {
        const fileInput = e.target;
        const file = fileInput.files[0];
        const allowedFileTypes = [
          "application/pdf",
          "image/jpeg",
          "image/jpg",
          "image/png",
        ];
    
        if (file && allowedFileTypes.includes(file.type)) {
          setDistributorInfo({ ...distributorInfo, [field]: file,[preview]: file?.name });
        } else {
          toast.warning("Please upload a valid PDF, JPEG, JPG, or PNG file.");
          // Clear the file input value to prevent upload
          fileInput.value = "";
        }
      };
    
      const handleTextChange = (e, field) => {
        const value = e.target.value;
        const isAlphabetic = /^[a-zA-Z ]*$/;
        if (isAlphabetic.test(value)) {
          setDistributorInfo({ ...distributorInfo, [field]: value });
        }
      };
    
      const handlePhoneChange = (e) => {
        const value = e.target.value;
        const isNumeric = /^[0-9]*$/;
        if (isNumeric.test(value) && value.length <= 10) {
          setDistributorInfo({ ...distributorInfo, phone_number: value });
        }
      };

      const handleFileRemove = (id,preview) => {
        setDistributorInfo(prev => {
          const newFiles = { ...prev };
          delete newFiles[id];
          delete newFiles[preview];
          return newFiles;
        });
        // Optionally, you can also call a function to handle file removal on the backend if needed
      };

      const getCountryList = async () => {
        await fetchData(
          `/db/admin/country?country_id=1`,
          setcountrylist,
          errorToast,
          setErrorToast,
          true
        );
      };
    
      const getState = async (id) => {
        await fetchData(
          `/db/admin/states?cnt_id=${id}`,
          setStatelist,
          errorToast,
          setErrorToast,
          true
        );
      };
      // const getState = async (id) => {
      //   await fetchData(
      //     `/db/area/states?cnt_id=${id}`,
      //     setStatelist,
      //     errorToast,
      //     setErrorToast,
      //     true
      //   );
      // };
    
      const getcity = async (id) => {
        await fetchData(
          `/db/admin/city?st_id=${id}`,
          (data) => setCitylist(data.cityData),
          errorToast,
          setErrorToast,
          true
        );
      };
    
      useEffect(() => {
        getCountryList()
      }, []);
    
      useEffect(() => {
        if (distributorInfo?.country_id) {
          getState(distributorInfo?.country_id);
        }
      }, [distributorInfo?.country_id]);
    
      useEffect(() => {
        if (distributorInfo?.state_id) getcity(distributorInfo?.state_id);
      }, [distributorInfo?.state_id]);

      useEffect(() => {
        const getSignInData = async () => {
          try {
            let baseUrl = window.location.origin;
            if (baseUrl === "http://localhost:3000") {
              baseUrl = "http://192.168.1.38:3000";
            }
            const { data } = await axios.post(Baseurl + "/db/admin/url", {
              client_url: `${baseUrl}`,
            });
            setClientData(data?.data);
          } catch (error) {
            console.log(error);
          }
        };
        getSignInData();
      }, []);

      const validateForm = () => {
        const errors = {};
        const requiredFields = {
          pan_file: "Business PAN card is required",
          incorporation_certificate: "Certificate of Incorporation is required",
          address_proof: "Address proof is required",
          gst_registration: "GST Registration Certificate is required",
          banking_details: "Banking details are required",
        };
    
        for (const [field, message] of Object.entries(requiredFields)) {
          if (!distributorInfo[field]) {
            errors[field] = message;
          }
        }
    
        if (Object.keys(errors).length !== 0) {
          toast.error("Please Fill Mandatory Fields");
          setErrorData(errors);
        }
    
        if(Object.keys(errors).length === 0){
            setErrorData({})
            return Object.keys(errors).length === 0;
        }
      };


      const handleSubmit = async () => {
        if (!validateForm()) return;
        try {
          dispatch(startButtonLoading())
          
          
          let formData = new FormData();
    for (const key in distributorInfo) {
      if (distributorInfo.hasOwnProperty(key)) {
        formData.append(key, distributorInfo[key]);
      }
    }
    
          const { data } = await axios.put(
            Baseurl + `/db/users/dms/completeRegistration`,
            formData
          );
          if (data.status === 200) {
            dispatch(stopButtonLoading())
            toast.success(data.message);
            router.push("/dms/DistributorRegister_Next");
          }
        } catch (error) {
          dispatch(stopButtonLoading())
          console.log(error?.response?.data);
          const errorMessage =
            error?.response?.data?.message || "Something went wrong!";
          toast.error(errorMessage);
        }
      };

      useEffect(() => {
        const { token } = router.query;
        if (token) {
          verifyToken(token);
        }
      }, [router?.query?.token]);
    
      const verifyToken = async (token) => {
        setisLoading(true)
        try {
          const { data } = await axios.post(
            Baseurl + `/db/users/dms/verification`,
            { token }
          );
          if (data.status === 200) {
            setisLoading(false)
            if (data?.data?.doc_verification === 0) {
              toast.success(data.message);
              setDistributorInfo({
                ...distributorInfo,
                user: data?.data?.user || "",
                user_l_name: data?.data?.user_l_name || "",
                contact_number: data?.data?.contact_number || "",
                email: data?.data?.email || "",
                address:data?.data?.address || "",
                contact_person:data?.data?.db_user_profile?.contact_person,
                credit_limit:data?.data?.db_user_profile?.credit_limit,
                payment_method:data?.data?.db_user_profile?.payment_method,
                country_id:data?.data?.country_id || "",
                state_id:data?.data?.state_id || "",
                city_id:data?.data?.city_id || "",
                id: data?.data?.user_id,
                token: token,
                isTokenVerified: true,
              });
            }else if (data?.data?.doc_verification === 1) {
              toast.success("Pending for verification");
              setDistributorInfo({
                ...distributorInfo,
                user: data?.data?.user || "",
                user_l_name: data?.data?.user_l_name || "",
                contact_number: data?.data?.contact_number || "",
                email: data?.data?.email || "",
                address:data?.data?.address || "",
                contact_person:data?.data?.db_user_profile?.contact_person,
                credit_limit:data?.data?.db_user_profile?.credit_limit,
                payment_method:data?.data?.db_user_profile?.payment_method,
                country_id:data?.data?.country_id || "",
                state_id:data?.data?.state_id || "",
                city_id:data?.data?.city_id || "",
                id: data?.data?.user_id,
                token: token,
                isTokenVerified: true,
                isUploadVerified: true,
              });
              setInterval(()=>{
                router.push("/")
              },[500])
            }else if (data?.data?.doc_verification === 2) {
              toast.success("Documents Verified");
              setDistributorInfo({
                ...distributorInfo,
                user: data?.data?.user || "",
                user_l_name: data?.data?.user_l_name || "",
                contact_number: data?.data?.contact_number || "",
                email: data?.data?.email || "",
                address:data?.data?.address || "",
                contact_person:data?.data?.db_user_profile?.contact_person,
                credit_limit:data?.data?.db_user_profile?.credit_limit,
                payment_method:data?.data?.db_user_profile?.payment_method,
                country_id:data?.data?.country_id || "",
                state_id:data?.data?.state_id || "",
                city_id:data?.data?.city_id || "",
                id: data?.data?.user_id,
                token: token,
                isTokenVerified: true,
                isUploadVerified: true,
              });
              setInterval(()=>{
                router.push("/")
              },[500])
            } else{
              toast.success("Documents Rejected");
              setFormFields({
                ...distributorInfo,
                user: data?.data?.user || "",
                user_l_name: data?.data?.user_l_name || "",
                contact_number: data?.data?.contact_number || "",
                email: data?.data?.email || "",
                address:data?.data?.address || "",
                contact_person:data?.data?.db_user_profile?.contact_person,
                credit_limit:data?.data?.db_user_profile?.credit_limit,
                payment_method:data?.data?.db_user_profile?.payment_method,
                country_id:data?.data?.country_id || "",
                state_id:data?.data?.state_id || "",
                city_id:data?.data?.city_id || "",
                id: data?.data?.user_id,
                token: token,
                isTokenVerified: true,
                isUploadVerified: true,
              });
              setInterval(()=>{
                router.push("/")
              },[500])
            }
            
          }
        } catch (error) {
          setisLoading(false)
          console.log(error)
          const errorMessage =
            error?.response?.data?.message || "Something went wrong!";
          toast.error(errorMessage);
          router.push("/")
        }
      };

  return (
    <>
        {
          isLoading ? <Loader/> :(
            <div className={`main_Box bg-white p-4 `}>
            <div className="bread_head">
             
            <img
                      src={ clientData?.logo
                        &&( `${filesUrl}` +
                          `/logo/images${clientData?.logo}`)}
                      alt
                      className=" "
                    />
            </div>
           
            <div className="main_content " >
          <div className="Add_user_screen">
            <div className="add_screen_head p-2">
            
            </div>
            <div className="row add_user_form">
            <div className="add_screen_head mt-3 ">
                <span className="text_bold">Distributor Details</span>
              </div>
              
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="firstName">First Name*</label>
                  <input
                    type="text"
                    id="firstName"
                    className="form-control"
                    disabled={viewMode}
                    value={distributorInfo?.user}
                    placeholder="Enter Distributor's Fisrt Name"
                    onChange={(e) => handleTextChange(e, "user")}
                  />
                  {errorData?.user && (
                    <span className="error-text">
                      {errorData?.user}
                    </span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="lastName">Last Name*</label>
                  <input
                    type="text"
                    id="lastName"
                    className="form-control"
                    disabled={viewMode}
                    value={distributorInfo?.user_l_name}
                    placeholder="Enter Distributor's Last Name"
                    onChange={(e) => handleTextChange(e, "user_l_name")}
                  />
                  {errorData?.user_l_name && (
                    <span className="error-text">
                      {errorData?.user_l_name}
                    </span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="contactPerson">Contact Person*</label>
                  <input
                    type="text"
                    id="contactPerson"
                    className="form-control"
                    disabled={viewMode}
                    placeholder="Enter Contact Person"
                    value={distributorInfo?.contact_person || ""}
                    onChange={(e) => handleTextChange(e, "contact_person")}
                  />
                  {errorData?.contact_person && (
                    <span className="error-text">
                      {errorData?.contact_person}
                    </span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="phoneNumber">Phone Number*</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    disabled={viewMode}
                    value={distributorInfo?.contact_number}
                    onChange={handlePhoneChange}
                  />
                  {errorData?.contact_number && (
                    <span className="error-text">{errorData?.contact_number}</span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="emailAddress">Email Address*</label>
                  <input
                    type="email"
                    id="emailAddress"
                    className="form-control"
                    placeholder="Enter Email Address"
                    disabled={viewMode}
                    value={distributorInfo?.email || ""}
                    onChange={(e) =>
                      setDistributorInfo({
                        ...distributorInfo,
                        email: e.target.value,
                      })
                    }
                  />
                  {errorData?.email && (
                    <span className="error-text">{errorData?.email}</span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="physicalAddress">Physical Address*</label>
                  <input
                    type="text"
                    id="physicalAddress"
                    className="form-control"
                    placeholder="Enter Physical Address"
                    disabled={viewMode}
                    value={distributorInfo?.address || ""}
                    onChange={(e) =>
                      setDistributorInfo({
                        ...distributorInfo,
                        address: e.target.value,
                      })
                    }
                  />
                  {errorData?.address && (
                    <span className="error-text">
                      {errorData?.address}
                    </span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="creditLimit">Credit Limit*</label>
                  <input
                    type="number"
                    id="creditLimit"
                    className="form-control"
                    disabled={viewMode}
                    placeholder='Enter Credit Limit'
                    value={distributorInfo?.credit_limit || ""}
                    onChange={(e) =>
                      setDistributorInfo({
                        ...distributorInfo,
                        credit_limit: e.target.value,
                      })
                    }
                  />
                  {errorData?.credit_limit && (
                    <span className="error-text">{errorData?.credit_limit}</span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="country">Country*</label>
                  <Select
                    id={distributorInfo?.country_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                     placeholder="Select Country"
                    options={countryList?.map((data, index) => {
                      return {
                        value: data?.country_id,
                        label: data?.country_name,
                      };
                    })}
                    value={countryList?.map((data, index) => {
                      if (distributorInfo?.country_id === data?.country_id) {
                        return {
                          value: data?.country_id,
                          label: data?.country_name,
                        };
                      }
                    })}
                    onChange={(e) =>
                      setDistributorInfo({
                        ...distributorInfo,
                        country_id: e.value,
                      })
                    }
                  />
                  {errorData?.country_id && (
                    <span className="error-text">{errorData?.country_id}</span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="state">State/Province*</label>
                  <Select
                    id={distributorInfo?.state_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                    placeholder="Select State"
                    options={stateList?.map((data, index) => {
                      return {
                        value: data?.state_id,
                        label: data?.state_name,
                      };
                    })}
                    value={stateList?.map((data, index) => {
                      if (distributorInfo?.state_id === data?.state_id) {
                        return {
                          value: data?.state_id,
                          label: data?.state_name,
                        };
                      }
                    })}
                    onChange={(e) =>
                      setDistributorInfo({
                        ...distributorInfo,
                        state_id: e.value,
                      })
                    }
                  />
                  {errorData?.state_id && (
                    <span className="error-text">{errorData?.state_id}</span>
                  )}
                </div>
              </div>
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="city">City*</label>
                  <Select
                    id={distributorInfo?.city_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                    placeholder="Select City"
                    options={cityList?.map((data, index) => {
                      return {
                        value: data?.city_id,
                        label: data?.city_name,
                      };
                    })}
                    value={cityList?.map((data, index) => {
                      if (distributorInfo?.city_id === data?.city_id) {
                        return {
                          value: data?.city_id,
                          label: data?.city_name,
                        };
                      }
                    })}
                    onChange={(e) =>
                      setDistributorInfo({ ...distributorInfo, city_id: e.value })
                    }
                  />
                  {errorData?.city_id && (
                    <span className="error-text">{errorData?.city_id}</span>
                  )}
                </div>
              </div>
      
      
              <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                  <label htmlFor="paymentMethod">Preferred Payment Method*</label>
                  <Select
                  id="paymentMethod"
                  classNamePrefix="react-select"
                  isDisabled={viewMode}
                  options={paymentOptions}
                  value={paymentOptions.find(option => option.value === distributorInfo?.payment_method) || null}
                  onChange={(selectedOption) => {
                      setDistributorInfo({
                      ...distributorInfo,
                      payment_method: selectedOption.value,
                      });
                  }}
                  placeholder="Select Payment Method"
                  />
                  {errorData?.payment_method && (
                  <span className="error-text">
                      {errorData?.payment_method}
                  </span>
                  )}
              </div>
              </div>
      
              <div className="add_screen_head mt-3">
                <span className="text_bold">KYC Documents</span>
              </div>
              {bankingDetailsArray.map((item, index) => (
                <div className="col-xl-4 col-md-4 col-sm-12 col-12" key={index}>
                  <div className="input_box">
                      {
                          distributorInfo[item?.preview] ?
                          <>
                          <label htmlFor={item?.id}>{item?.label}</label>
                              <div style={fileDisplayStyle}>
                                  
                              <span style={fileNameStyle}>
                                  {distributorInfo[item?.preview] || 'No file selected'}
                              </span>
                              <button
                                  type="button"
                                  style={removeButtonStyle}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = removeButtonHoverStyle.backgroundColor}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = removeButtonStyle.backgroundColor}
                                  onClick={() => handleFileRemove(item?.id, item?.preview)}
                              >
                                  ×
                              </button>
                              </div>
                          </> 
                          :
                          <>
                              <label htmlFor={item?.id}>{item?.label}</label>
                    <input
                      type="file"
                      id={item?.id}
                      className="form-control"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={distributorInfo?.isUploadVerified}
                      onChange={(e) => handleFileUpload(e, `${item?.id}`, `${item?.preview}`)}
                    />
                          </>
                      }
                    {errorData[item?.id] && (
                      <span className="error-text">{errorData[item?.id]}</span>
                    )}
                  </div>
                </div>
              ))}
      
              <div className="btn-box text-end mt-4">
              <button
                        disabled={isLoading}
                        className="btn btn-primary"
                        onClick={(e)=>{
                          e.preventDefault()
                          handleSubmit()
                        }}
                      >
                       {isButtonLoading ? (
                                        <>
                                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                          &nbsp;Upload
                                        </>
                                      ) : (
                                        'Upload'
                                      )}
                      </button>
              </div>
            </div>
          </div>
        </div>
          </div>

          )
        }
    </>
    
    
    
    
  )
}

export default OnboradingProcessScreen