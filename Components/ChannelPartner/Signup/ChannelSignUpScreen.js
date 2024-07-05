import Link from "next/link";
import React, { useEffect, useState } from "react";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import { setCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import { startButtonLoading, stopButtonLoading } from "../../../store/buttonLoaderSlice";


const ChannelSignUpScreen = () => {
  const [formFields, setFormFields] = useState({
    id: "",
    token: "",
    aadhar: "",
    pan: "",
    rera: "",
    cheque: "",
    name: "",
    user_l_name: "",
    email: "",
    mobile: "",
    isTokenVerified: false,
    isUploadVerified: false,
    organisation: "",
    country_id: 101,
    state_id: "",
    city_id: "",
    address: "",
    gst: "",
  });
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const [errorToast, setErrorToast] = useState(false);
  const[clientData,setClientData]=useState();
  const {isButtonLoading}=useSelector((state)=>state.buttonLoader)
  const dispatch=useDispatch()

  const router = useRouter();

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      verifyToken(token);
    }
  }, [router.query.token]);

  const verifyToken = async (token) => {
    try {
      const { data } = await axios.post(
        Baseurl + `/db/users/cp/registrationToken/verification`,
        { token }
      );
      if (data.status === 200) {
        if (data.data.doc_verification === 0) {
          toast.success(data.message);
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            user_l_name: data.data.user_l_name || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            id: data.data.user_id,
            token: token,
            isTokenVerified: true,
          });
        }else if (data.data.doc_verification === 1) {
          toast.success("Pending for verification");
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            user_l_name: data.data.user_l_name || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
            organisation: data.data.organisation || "",
            state_id: data.data.state_id || "",
            city_id: data.data.city_id || "",
            address: data.data.address || "",
            gst: data.data.gst || "",
          });
        }else if (data.data.doc_verification === 2) {
          toast.success("Documents Verified");
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            user_l_name: data.data.user_l_name || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
            organisation: data.data.organisation || "",
            state_id: data.data.state_id || "",
            city_id: data.data.city_id || "",
            address: data.data.address || "",
            gst: data.data.gst || "",
          });
          setInterval(()=>{
            router.push("/partner")
          },[1000])
        } else{
          toast.success("Documents Rejected");
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            user_l_name: data.data.user_l_name || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
            organisation: data.data.organisation || "",
            state_id: data.data.state_id || "",
            city_id: data.data.city_id || "",
            address: data.data.address || "",
            gst: data.data.gst || "",
          });
          setInterval(()=>{
            router.push("/partner")
          },[1000])
        }
        
      }
    } catch (error) {
      
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(startButtonLoading())
      if (!formFields.aadhar || !formFields.pan || !formFields.rera) {
        toast.error("Aadhar, PAN, and RERA are required.");
        dispatch(stopButtonLoading())
        return;
      }
      const formData = new FormData();
      formData.append("id", formFields.id);
      formData.append("token", formFields.token);
      formData.append("aadhar", formFields.aadhar);
      formData.append("pan", formFields.pan);
      formData.append("rera", formFields.rera);

      if (formFields.cheque) {
        formData.append("cheque", formFields.cheque);
      }

      formData.append("name", formFields.name);
      formData.append("user_l_name", formFields.user_l_name);
      formData.append("email", formFields.email);
      formData.append("mobile", formFields.mobile);
      formData.append("address", formFields.address);
      formData.append("city_id", formFields.city_id);
      formData.append("state_id", formFields.state_id);
      formData.append("organisation", formFields.organisation);
      formData.append("gst", formFields.gst);
      

      const { data } = await axios.put(
        Baseurl + `/db/users/cp/completeRegistration`,
        formData
      );
      if (data.status === 200) {
        dispatch(stopButtonLoading())
        toast.success(data.message);
        setFormFields({ ...formFields, isSubmitted: true });
        router.push("/ChannelPartnerRegister_Next");
      }
    } catch (error) {
      dispatch(stopButtonLoading())
      console.log(error?.response?.data);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const getState = async () => {
    const id = 101;
    await fetchData(
      `/db/admin/state?cnt_id=${id}`,
      setStatelist,
      errorToast,
      setErrorToast,
      true
    );
  };

  const getcity = async (id) => {
    await fetchData(
      `/db/admin/city?st_id=${id}`,
      (data) => setCitylist(data.cityData),
      errorToast,
      setErrorToast,
      true
    );
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Check the selected file in the console
    if (file) {
      setFormFields({ ...formFields, [field]: file });
    }
  };

  const inputFields = [
    { label: "Aadhar Card*", field: "aadhar" },
    { label: "PAN Card*", field: "pan" },
    { label: "RERA License*", field: "rera" },
    { label: "Cancelled Cheque*", field: "cheque" },
  ];

  useEffect(() => {
    getState();
  }, []);

  useEffect(() => {
    if (formFields.state_id) {
      getcity(formFields.state_id);
    }
  }, [formFields.state_id]);

  useEffect(()=>{
    const getSignInData=async()=>{
      try {
        const baseUrl = window.location.origin;
        const {data}=await axios.post(Baseurl+"/db/admin/url",{
          client_url:`${baseUrl}`,
        })
        setClientData(data?.data)
      } catch (error) {
        console.log(error)
      }
    }
    getSignInData()
  },[])

  return (
    <>
      <section className="Sign-Up pt-4" style={{padding:'0 16px'}}>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-7">
              <div className="row gx-3">
                <div className="Sign-In-logo pb-4">
                  <img style={{height: '90px'}} src={
                        clientData?.logo
                          ? `${filesUrl}` +
                            `/logo/images${clientData?.logo}`
                          : "/ChannelPartner/logo.png"
                      } alt="normal"/>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      height: 320,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img1.png)",
                      backgroundImage: clientData?.client_image_1 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_1}`:`url(/ChannelPartner/signup-img1.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderTopLeftRadius: 10,
                    }}
                  ></div>
                  <div
                    style={{
                      height: 336,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img3.png)",
                      backgroundImage: clientData?.client_image_2 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_2}`:`url(/ChannelPartner/signup-img3.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomLeftRadius: 10,
                    }}
                  ></div>
                  <div></div>
                </div>
                <div className="col-6">
                  <div
                    style={{
                      height: 176,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img2.png)",
                      backgroundImage: clientData?.client_image_3 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_3}`:`url(/ChannelPartner/signup-img2.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderTopRightRadius: 10,
                    }}
                  ></div>
                  <div
                    style={{
                      height: 368,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img4.png)",
                      backgroundImage: clientData?.client_image_4 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_4}`:`url(/ChannelPartner/signup-img4.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomRightRadius: 10,
                    }}
                  ></div>
                </div>
                <div className="col-12 d-flex gap-3">
                  <div
                    style={{
                      height: 192,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img2.png)",
                      backgroundImage: clientData?.client_image_1 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_1}`:`url(/ChannelPartner/signup-img2.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomLeftRadius: 10,
                    }}
                  ></div>
                  <div
                    style={{
                      height: 304,
                      width: "100%",
                      // backgroundImage: "url(/ChannelPartner/signup-img5.png)",
                      backgroundImage: clientData?.client_image_2 ?`url(${filesUrl}/clientdoc/images${clientData?.client_image_2}`:`url(/ChannelPartner/signup-img5.png)`,
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      marginBottom: 15,
                      borderBottomRightRadius: 10,
                      marginTop: "-110px",
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 d-flex justify-content-center">
              <div className="Sign-Up_Sign-In">
                <h3 className="Perfect-Home ps-2">Find Your Perfect Home. </h3>
                <div className="underline" />
                <div className="d-flex pt-5 ps-2">
                                   <div
                    className="nav-link d-flex flex-column gap-2 align-items-center pb-3 Sign-Up-btn text-white"
                    id="Sign-Up"
                    data-bs-toggle="tab"
                    data-bs-target="#Sign-Up-tab"
                    style={{ backgroundColor: `${clientData?.button_color || '#293790'}`}}
                  >
                    Sign Up
                  </div>
                </div>
                <div className="perfect-home-form pt-1">
                  <section className="Details_Form">
                    <div className="container pt-3">
                      <form
                        id="survey-form"
                        method="GET"
                        action
                        className="d-flex flex-column gap-3"
                        onSubmit={handleSubmit}
                      >
                        <div className="d-flex gap-2">
                          <div className="rowTab">
                            <div className="labels">
                              <label id="name-label" htmlFor="name">
                                Name
                              </label>
                              <span>*</span>
                            </div>
                            <div className="rightTab">
                              <input
                                autofocus
                                type="text"
                                name="name"
                                id="name"
                                className="input-field"
                                placeholder="Enter First Name"
                                value={formFields.name}
                                required
                                disabled={formFields.isTokenVerified}
                              />
                            </div>
                          </div>
                          <div className="rowTab">
                            <div className="labels">
                              <label id="name-label" htmlFor="name">Last Name</label>
                              <span />
                            </div>
                            <div className="rightTab">
                              <input
                                autofocus
                                type="text"
                                name="name"
                                id="last"
                                className="input-field"
                                placeholder="Enter Last Name"
                                value={formFields.user_l_name}
                                disabled={formFields.isTokenVerified}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="labels">
                            <label id="Organization" htmlFor="name">
                              Organization
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              autofocus
                              type="text"
                              name="name"
                              id="Organization"
                              className="input-field"
                              placeholder="Enter Organisation Name"
                              value={formFields.organisation}
                              required
                              disabled={formFields.isUploadVerified}
                              onChange={(e)=>{
                                setFormFields({...formFields,organisation:e.target.value})
                              }}  
                            />
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="labels">
                            <label id="number" htmlFor="number">
                              Mobile Number
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              type="tel"
                              name="number"
                              id="num"
                              className="input-field"
                              required
                              placeholder="Enter Mobile Number"
                              value={formFields.mobile}
                              onChange={(e)=>{
                                setFormFields({...formFields,mobile:e.target.value})
                              }} 
                            />
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="labels">
                            <label id="email-label" htmlFor="email">
                              Email
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              type="email"
                              name="email"
                              id="email"
                              className="input-field"
                              required
                              placeholder="Enter Email"
                              value={formFields.email}
                              disabled={formFields.isTokenVerified}
                            />
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="rightTab d-flex gap-2 ">
                            <div className="w-50" >
                              <label id="email-label" htmlFor="email">
                                State*
                              </label>
                              <Select
                                id={formFields.state_id}
                                defaultValue={"select state"}
                                disabled={formFields.isUploadVerified}
                                options={statelist?.map((data, index) => {
                                  return {
                                    value: data?.state_id,
                                    label: data?.state_name,
                                  };
                                })}
                                value={statelist?.map((data, index) => {
                                  if (formFields.state_id === data.state_id) {
                                    return {
                                      value: data?.state_id,
                                      label: data?.state_name,
                                    };
                                  }
                                })}
                                onChange={(e) =>
                                  setFormFields({
                                    ...formFields,
                                    state_id: e.value,
                                  })
                                }
                              />
                            </div>
                            <div className="w-50">
                              <label id="email-label" htmlFor="email">
                                City*
                              </label>
                              <Select
                                id={formFields.city_id}
                                defaultValue={"select city"}
                                disabled={formFields.isUploadVerified}
                                options={citylist?.map((data, index) => {
                                  return {
                                    value: data?.city_id,
                                    label: data?.city_name,
                                  };
                                })}
                                value={citylist?.map((data, index) => {
                                  if (formFields.city_id === data.city_id) {
                                    return {
                                      value: data?.city_id,
                                      label: data?.city_name,
                                    };
                                  }
                                })}
                                onChange={(e) =>
                                  setFormFields({
                                    ...formFields,
                                    city_id: e.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="labels">
                            <label id="address-label" htmlFor="address">
                              Address
                            </label>
                            <span>*</span>
                          </div>
                          <div className="rightTab">
                            <input
                              type="text"
                              name="address"
                              id="address"
                              className="input-field"
                              placeholder="Enter your address"
                              value={formFields.address}
                              onChange={(e)=>{
                                setFormFields({...formFields,address:e.target.value})
                              }} 
                              required
                              disabled={formFields.isUploadVerified}
                            />
                          </div>
                        </div>
                        <div className="rowTab">
                          <div className="labels">
                            <label id="GST" htmlFor="name">
                              GST Number *
                            </label>
                            <span />
                          </div>
                          <div className="rightTab">
                            <input
                              autofocus
                              type="text"
                              name="name"
                              id="GST"
                              className="input-field"
                              placeholder="Enter GST Number"
                              value={formFields.gst}
                              onChange={(e)=>{
                                setFormFields({...formFields,gst:e.target.value})
                              }}
                              required
                              disabled={formFields.isUploadVerified}
                            />
                          </div>
                        </div>
                        <div className="d-flex justify-content-between flex-wrap  upload-files">
                          {inputFields.map((input) => (
                            <div className="rowTab" key={input.field}>
                              <div className="labels">
                                <label id="name-label" htmlFor={input.field}>
                                  {input.label}
                                </label>
                              </div>
                              <div className="rightTab">
                                <label
                                  htmlFor={input.field}
                                  className="form-control d-flex justify-content-between align-items-center"
                                  style={{ width: 160, height: 48 }}
                                >
                                  Upload
                                  <img
                                    src="/ChannelPartner/upload-file.svg"
                                    alt="normal"
                                    style={{ height: 24 }}
                                  />
                                </label>
                                <input
                                  autofocus
                                  type="file"
                                  name={input.field}
                                  id={input.field}
                                  className="input-field"
                                  style={{ display: "none" }}
                                  required
                                  onChange={(e) =>
                                    handleFileChange(e, input.field)
                                  }
                                  disabled={formFields.isUploadVerified}
                                />

                                {formFields.isUploadVerified === false &&
                                  formFields[input.field] && (
                                    <img
                                      src={URL.createObjectURL(
                                        formFields[input.field]
                                      )}
                                      alt={`${input.label} Preview`}
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                        marginTop: "5px",
                                      }}
                                    />
                                  )}

                                {formFields.isUploadVerified &&
                                input.field === "aadhar" &&
                                formFields[input.field] ? (
                                  <img
                                    src={`${filesUrl}/adh/images${
                                      formFields[input.field]
                                    }`}
                                    alt={`${input.label} Preview`}
                                    style={{
                                      maxWidth: "100px",
                                      maxHeight: "100px",
                                    }}
                                  />
                                ) : (
                                  formFields.isUploadVerified &&
                                  input.field !== "aadhar" &&
                                  formFields[input.field] && (
                                    <img
                                      src={
                                        `${filesUrl}` +
                                        `/${input.field}/images${
                                          formFields[input.field]
                                        }`
                                      }
                                      alt={`${input.label} Preview`}
                                      style={{
                                        maxWidth: "100px",
                                        maxHeight: "100px",
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button
                          id="craete-account"
                          type="submit"
                          className="border-0 mb-4"
                          disabled={formFields.isUploadVerified}
                        >
                          {isButtonLoading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Create Account
                                  </>
                                ) : (
                                  'Create Account'
                                )}
                        </button>
                      </form>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChannelSignUpScreen;
