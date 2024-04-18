import React, { useState, useEffect } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Baseurl, filesUrl } from "../../../Utils/Constants";
import axios from "axios";

const ChannelPartnerRegisterScreen = () => {
  const [formFields, setFormFields] = useState({
    id: null,
    token: null,
    aadhar: null,
    pan: null,
    rera: null,
    cheque: null,
    name: "",
    email: "",
    mobile: "",
    isTokenVerified: false,
    isUploadVerified: false,
    isSubmitted: false,
  });

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
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
          });
        }else if (data.data.doc_verification === 2) {
          toast.success("Documents Verified");
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
          });
          setInterval(()=>{
            router.push("/")
          },[1000])
        } else{
          toast.success("Documents Rejected");
          setFormFields({
            ...formFields,
            name: data.data.user || "",
            mobile: data.data.contact_number || "",
            email: data.data.email || "",
            pan: data.data.db_user_profile.pan_file || null,
            aadhar: data.data.db_user_profile.aadhar_file || null,
            rera: data.data.db_user_profile.rera_file || null,
            cheque: data.data.db_user_profile.c_cheque_file || null,
            isTokenVerified: true,
            isUploadVerified: true,
          });
          setInterval(()=>{
            router.push("/")
          },[1000])
        }
        
      }
    } catch (error) {
      
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const handleFileChange = (event, field) => {
    const file = event.target.files[0];
    console.log("Selected file:", file); // Check the selected file in the console
    if (file) {
      setFormFields({ ...formFields, [field]: file });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!formFields.aadhar || !formFields.pan || !formFields.rera) {
        toast.error("Aadhar, PAN, and RERA are required.");
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
      formData.append("email", formFields.email);
      formData.append("mobile", formFields.mobile);

      const { data } = await axios.put(
        Baseurl + `/db/users/cp/completeRegistration`,
        formData
      );
      if (data.status === 200) {
        toast.success(data.message);
        router.push("/ChannelPartnerRegister_Next");
      }
    } catch (error) {
      console.log(error.response.data);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    }
  };

  const inputFields = [
    { label: "Aadhar Card *", field: "aadhar" },
    { label: "PAN Card *", field: "pan" },
    { label: "RERA License *", field: "rera" },
    { label: "Bank Cancelled Cheque", field: "cheque" },
  ];

  

  return (
    <div className="d-block w-100">
      <section className="channel_partner_register">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 d-flex justify-content-between align-items-center">
              <div className="my_profile d-flex align-items-center gap-3">
                <KeyboardBackspaceIcon />
                <span style={{ fontSize: "16PX", fontWeight: 600 }}>
                  SignUp
                </span>
              </div>
              <div className="logo">
                <a href="#">
                  <img src="/DMS_IMAGES/kloudmart.png" alt />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="channel_partner_register">
        <div className="container-fluid">
          <div className="row">
            <div className="col col-xl-12 col-md-12 col-sm-12 ">
              <form
                className="px-2 body"
                onSubmit={handleSubmit}
                style={{ position: "relative" }}
              >
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">
                      Name <span className="error-message">*</span>
                    </label>
                    <input
                      className="form-control input-field"
                      type="text"
                      placeholder="Enter Name"
                      id="Name"
                      formcontrolname="Email"
                      name="Name"
                      value={formFields.name}
                      disabled={formFields.isTokenVerified}
                    />
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">
                      Email <span className="error-message">*</span>
                    </label>
                    <input
                      className="form-control input-field"
                      type="text"
                      placeholder="Enter Email"
                      id="Email"
                      formcontrolname="Email"
                      name="Email"
                      value={formFields.email}
                      disabled={formFields.isTokenVerified}
                    />
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3">
                    <label className="form-label">
                      Mobile No. <span className="error-message">*</span>
                    </label>
                    <input
                      className="form-control input-field"
                      formcontrolname="Name"
                      type="text"
                      placeholder="Enter Mobile No."
                      name="Mobile"
                      value={formFields.mobile}
                      disabled={formFields.isTokenVerified}
                    />
                  </div>
                  <div className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3"></div>
                  {inputFields.map((input, index) => (
                    <div
                      key={index}
                      className="col-xl-3 col-md-3 col-lg-3 col-sm-12  mb-3"
                    >
                      <div className="d-flex flex-column gap-1">
                        <label className="form-label">{input.label}</label>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, input.field)}
                          className="form-control input-field"
                          disabled={formFields.isUploadVerified}
                        />
                        {formFields.isUploadVerified === false &&
                          formFields[input.field] && (
                            <img
                              src={URL.createObjectURL(formFields[input.field])}
                              alt={`${input.label} Preview`}
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
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
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                          />
                        ) : (
                          formFields.isUploadVerified &&
                          input.field !== "aadhar" &&
                          formFields[input.field] && (
                            <img
                              src={`${filesUrl}`+`/${input.field}/images${formFields[input.field]}`}
                              alt={`${input.label} Preview`}
                              style={{ maxWidth: "100px", maxHeight: "100px" }}
                            />
                          )
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="mt-3  md-text-center">
                    <button
                      type="submit"
                      className="btn btn-outline-dark btn-sm shadow rounded fw-normal px-4"
                      disabled={formFields.isUploadVerified}
                    >
                      <SaveIcon
                        style={{ fontSize: "20px", paddingBottom: "4px" }}
                      />
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChannelPartnerRegisterScreen;
