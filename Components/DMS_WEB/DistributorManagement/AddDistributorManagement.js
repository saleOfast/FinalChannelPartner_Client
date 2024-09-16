import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchData } from "../../../Utils/getReq";
import Select from "react-select";
import MainContent from "./MainContent";



const AddDistributorManagement = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [isLoading, setisLoading] = useState(false);

  const [distributorInfo, setDistributorInfo] = useState({
    role_id:10,
    distributor_name: "",
    contact_person: "",
    phone_number: "",
    email: "",
    physical_address: "",
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
    tier:""
  });
  const [updtUId, setUpdtUId] = useState("");

  const AddUploadPicture = async (id, path, file, name) => {
    if (!hasCookie("token")) return;

    const token = getCookie("token");
    const db_name = getCookie("db_name");

    const formdata = new FormData();
    formdata.append("path", path);
    formdata.append("user_id", id);
    formdata.append("file", file);
    formdata.append("_imageName", name || 0);

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
      },
      body: formdata,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        `${Baseurl}/db/users/uploads`,
        requestOptions
      );
      const result = await response.text();
      toast.info(result.message);
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = {
      distributor_name: "Distributor name is required",
      contact_person: "Contact person is required",
      phone_number: "Invalid phone number",
      email: "Email is required",
      physical_address: "Physical address is required",
      city_id: "City is required",
      state_id: "State is required",
      country_id: "Country is required",
      credit_limit: "Credit Limit is required",
      payment_method: "Payment method is required",
      // pan_file: "Business PAN card is required",
      // incorporation_certificate: "Certificate of Incorporation is required",
      // address_proof: "Address proof is required",
      // gst_registration: "GST Registration Certificate is required",
      // banking_details: "Banking details are required",
    };

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!distributorInfo[field]) {
        errors[field] = message;
      }
    }

    // Validate phone number length
    if (
      distributorInfo.phone_number &&
      distributorInfo.phone_number.length !== 10
    ) {
      errors.phone_number = "Invalid phone number";
    }

    // Validate email format
    if (distributorInfo.email && !/\S+@\S+\.\S+/.test(distributorInfo.email)) {
      errors.email = "Invalid email address";
    }

    // Set the errors in the state
    if (Object.keys(errors).length !== 0) {
      toast.warning("Please Fill Mandatory Fields");
      setErrorData(errors);
    }

    // Return true if no errors, false otherwise
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 236,
        },
      };

      let reqOptions = { ...distributorInfo };
      console.log(reqOptions);
      try {
        const response = await axios.post(
          Baseurl + `/db/leads/calls`,
          reqOptions,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/dms/AddDistributorManagement");
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
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  const updateHandler = async () => {
    if (!validateForm()) return;
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 238,
        },
      };

      let reqOptions = { ...distributorInfo };

      try {
        const response = await axios.put(
          Baseurl + `/db/leads/single?event_id=${router.query.id}`,
          reqOptions,
          header
        );

        if (response.status === 204 || response.status === 200) {
          
          // if (distributorInfo?.pan_file)
          //   AddUploadPicture(
          //     updtUId,
          //     "adh",
          //     uploadDocs.aadhar[0],
          //     oldFiles.aadhar
          //   );
          toast.success(response.data.message);
          setisLoading(false);
          router.push("/dms/AddDistributorManagement");
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
          m_id: 237,
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/leads/single?event_id=${id}`,
          header
        );
        setUpdtUId(response?.data?.data?.db_user_profile?.user_id);
        setDistributorInfo(response?.data?.data);
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
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    }
    if (router.query.vw) [setViewMode(true)];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, id]);

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">
          {viewMode ? "VIEW" : <>{editMode ? "EDIT" : "ADD"}</>} Distributor
        </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/dms">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/dms/DistributorManagement"> Distributor List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? "View" : <> {editMode ? "Edit" : "Add"}</>}{" "}
              Distributor
            </li>
          </ol>
        </nav>
      </div>
     
      <MainContent
        distributorInfo={distributorInfo}
        setDistributorInfo={setDistributorInfo}
        validateForm={validateForm}
        handleSubmit={handleSubmit}
        updateHandler={updateHandler}
        viewMode={viewMode}
        errorData={errorData}
        editMode={editMode}
        isLoading={isLoading}
        setViewMode={setViewMode}
      />
    </div>
  );
};

export default AddDistributorManagement;
