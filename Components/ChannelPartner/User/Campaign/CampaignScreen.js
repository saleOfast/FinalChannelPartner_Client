import React, { useEffect, useState } from "react";
import axios from "axios";
import PlusIcon from "../../../Svg/PlusIcon";

import { Baseurl, filesUrl } from "../../../../Utils/Constants";
import { getCookie, hasCookie } from "cookies-next";
import { toast, useToast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Delete } from "@mui/icons-material";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { startButtonLoading, stopButtonLoading } from "../../../../store/buttonLoaderSlice";
import Loader from "../../../Loader/Loader";

const CampaignScreen = () => {
  const [showModal, setShowModal] = useState(false);
  const [imgFile, setImgFile] = useState("");
  const clientBtnColor = hasCookie("clientBtnColor")
    ? getCookie("clientBtnColor")
    : "#293790";
  const [projectData, setProjectData] = useState({
    project: "",
    project_id:null,
    location: "",
    property_size: "",
    unit_area: "",
    price: "",
    contact_no: "",
    rera_number: "",
    file: null,
    file_preview:"",
    logo:null,
    logo_preview:null,
    template:null,
    template_name:null
  });
  const[editMode,setEditMode]=useState(false)
  const[projects,setProjects]=useState([]);
  const dispatch=useDispatch()
  const {isButtonLoading}=useSelector((state)=>state.buttonLoader)
  const [loader,setLoader]=useState();
  const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;

  

  const getDataList = async () => {
    setLoader(true)
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 76,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/channel/project`,
          header
        );
        if(response.status === 200 || response.status === 201){
          setLoader(false)
        setProjects(response?.data?.data)
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          setLoader(false)
          toast.error(error?.response?.data?.message,{autoClose:2500});
        } else {
          setLoader(false)
          toast.error("Something went wrong!",{autoClose:2500});
        }
      }
    }
  };

  const getDataListById = async (projectId) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 76,
        },
      };

      try {
        const { data } = await axios.get(
          Baseurl + `/db/channel/project?project_id=${projectId}`,
          header
        );
        const campaign=data?.data?.projectData;
        setProjectData({
            ...projectData,
            project: campaign?.project,
            project_id: campaign?.project_id,
            location: campaign?.location,
            property_size: campaign?.property_size,
            unit_area: campaign?.unit_area,
            price: campaign?.price,
            contact_no: campaign?.contact_no,
            rera_number: campaign?.rera_number || "",
            file:campaign?.cover_image,
            file_preview: `${filesUrl}/project/images${campaign?.cover_image}`,
            logo:campaign?.logo_image,
            logo_preview: `${filesUrl}/projectLogo/images${campaign?.logo_image}`,
            template:campaign?.html_file,
            template_name:campaign?.html_file,
        })
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message,{autoClose:2500});
        } else {
          toast.error("Something went wrong!",{autoClose:2500});
        }
      }
    }
  };

  useEffect(() => {
    getDataList();
  }, []);

  const handleFileChange = (e, field, fieldPreview) => {
    const file = e.target.files[0];
    if (!file) {
      e.target.value = "";
      return;
    }

    const allowedTypes = field === "template" ? ['text/html', 'text/htm'] : ['image/jpg', 'image/jpeg', 'image/png'];
  
    if (!allowedTypes.includes(file.type)) {
      const allowedExtensions = field === "template" ? ".html, .htm" : ".jpg, .jpeg, .png";
      toast.warning(`Invalid file type. Please upload ${allowedExtensions}.`,{autoClose:2500});
      e.target.value = "";
      return;
    }

    // For HTML template files, skip FileReader to avoid memory issues with large files
    if (field === "template") {
      // Check file size and block if larger than 10MB (server limit is around 10MB based on 413 errors)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        toast.error(`File size is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed size is 10MB. Please upload a smaller file.`, {autoClose: 4000});
        e.target.value = "";
        return;
      }
      
      // Store file directly without reading into memory
      setProjectData({
        ...projectData,
        [field]: file,
        [fieldPreview]: file.name,
      });
    } else {
      // For images, use FileReader for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectData({
          ...projectData,
          [field]: file,
          [fieldPreview]: URL.createObjectURL(file),
        });
      };
      reader.readAsDataURL(file);
    }
  
    // Reset the input value to ensure the change event is fired even if the same file is selected
    e.target.value = "";
  };

  // const handleFileChange = (e,field,fieldPreview) => {
  //   if (e.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       if(fieldPreview==="template_name"){
  //         setProjectData({
  //           ...projectData,
  //           [field]: e.target.files[0],
  //           [fieldPreview]: e.target.files[0].name,
  //         });
  //       }
  //       else{
  //         setProjectData({
  //           ...projectData,
  //           [field]: e.target.files[0],
  //           [fieldPreview]: URL.createObjectURL(e.target.files[0]),
  //         });
  //       }
        
  //     };
  //     reader.readAsDataURL(e.target.files[0]);
  //   }
  // };
  
  const validateProjectForm = () => {
    if (!projectData?.rera_number?.toString().trim()) {
      toast.warning("Please enter RERA Number", { autoClose: 2500 });
      return false;
    }
    const contactNo = projectData?.contact_no?.toString().trim();
    if (contactNo && contactNo.length !== 10) {
      toast.warning("contact no should be of 10 digit", { autoClose: 2500 });
      return false;
    }
    return true;
  };

  const createProject=  async() => {
    if (!validateProjectForm()) return;
  //   if(!projectData.project) return toast.warning("please enter project name")
  //  if(!projectData.file) return toast.warning("please upload cover image")
      if (!hasCookie("token")) return;
      const token = getCookie("token");
      const db_name = getCookie("db_name");
      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          m_id: 79,
        },
      };

      const formData=new FormData();
    for (const [key, value] of Object.entries(projectData)) {
      // Only append non-null values
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value);
      }
    }

      try {
        const response = await axios.post(`${Baseurl}/db/channel/project`,formData, {
          ...header,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          transformRequest: [(data) => data], // Don't transform FormData
          // Don't set Content-Type - let browser set it with boundary for FormData
        });
        if (response.status === 200 || response.status === 201) {
          toast.success(response?.data?.message,{autoClose:2500});
          setShowModal(false)
          getDataList();
        }
      } catch (error) {
        console.log("Upload error:", error)
        
        // Handle 413 Request Entity Too Large error
        if (error?.response?.status === 413) {
          toast.error("File size is too large. Maximum allowed size is 15MB. Please upload a smaller file.", { autoClose: 4000 });
          return;
        }
        
        if (error?.response?.data?.status === 422) {
          toast.error(error?.response?.data?.message,{autoClose:2500})
        } else if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message, {autoClose:2500});
        } else if (error?.message) {
          toast.error(error.message, {autoClose:2500});
        } else {
          toast.error("Something went wrong! Please check your connection and try again.",{autoClose:2500});
        }
      }
  };

  const updateProject=  async() => {
    if (!validateProjectForm()) return;
    if (!hasCookie("token")) return;
    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        m_id: 79,
      },
    };

    const formData=new FormData();
  for (const [key, value] of Object.entries(projectData)) {
    // Only append non-null values
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  }

    try {
      dispatch(startButtonLoading())
      const response = await axios.post(`${Baseurl}/db/channel/project/usertemplate`,formData, {
        ...header,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        transformRequest: [(data) => data], // Don't transform FormData
        // Don't set Content-Type - let browser set it with boundary for FormData
      });
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message,{autoClose:2500});
        dispatch(stopButtonLoading())
        setEditMode(false)
        setShowModal(false)
        setProjectData("")
        getDataList();
      }
    } catch (error) {
      console.log("Update error:", error)
      dispatch(stopButtonLoading())
      
      // Handle 413 Request Entity Too Large error
      if (error?.response?.status === 413) {
        toast.error("File size is too large. Maximum allowed size is 10MB. The server rejected this file. Please upload a smaller file or contact your administrator to increase the server upload limit.", { autoClose: 5000 });
        return;
      }
      
      if (error?.response?.data?.status === 422) {
        toast.error(error?.response?.data?.message,{autoClose:2500})
      } else if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, {autoClose:2500});
      } else if (error?.message) {
        toast.error(error.message, {autoClose:2500});
      } else {
        toast.error("Something went wrong! Please check your connection and try again.",{autoClose:2500});
      }
    }
};

  

  return (
    <>
    {
      loader ? <div className="ps-4 pe-4 pb-4 w-100 mt-4 overflow-auto"><Loader/></div>
      :
      (
        <div className="ps-4 pe-4 pb-4 w-100 mt-4 overflow-auto">
        
        <section className="Channel-profile Booking-Detail Visit-Details Campaigns  pb-2 bg-white">
          <div className="container mt-3 mb-4">
            <div className="row gx-4 gy-4">
              <div className="profile-text">Campaigns</div>
            {
                projects?.map((project, i)=> (
                    <div key={i} className="col-12 col-md-6">
                <div
                  className="w-100 position-relative Campaign-img"
                  style={{
                    backgroundImage:
                      `url(${filesUrl}`+`/project/images${project?.cover_image})`,
                  }}
                >
                  <div className="overlay" />
                  <div className="cart-overlay-items">
                    <div className="row">
                      <div className="col-8">
                        <div className="Campaign-name">
                          <h3 className="text-white">{project?.project}</h3>
                        </div>
                      </div>
                      <div className="col-4 d-flex justify-content-end">
                        <div className="d-flex gap-2">
                        {
                          hasCookie("channel") && userInfo?.role_id==1 && (
                            <img
                            src="/ChannelPartner/profile-edit-white.svg"
                            onClick={()=>{
                                setEditMode(true)
                                getDataListById(project?.project_id)
                                setShowModal(true)
                            }}
                            alt
                            
                            style={{ height: 17,cursor:"pointer" }}
                          />
                          )
                        }
                          
                          <Link
                            href={`/partner/CampaignDetails?id=${project?.project_id}`}
                          >
                          <img
                            src="/ChannelPartner/download-file-white.svg"
                            alt
                            className=" cursor-pointer"
                            style={{ height: 17 }}
                          />
                          </Link>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                ))
            }
            </div>
          </div>
        </section>
      </div>
      )
    }
      

      <Modal
        show={showModal}
        onHide={() => {
          if(isButtonLoading==true)
            {
              setEditMode(false)
              setProjectData("")
              setShowModal(false);
            }
        }}
        size="lg"
        centered
      >
        <Modal.Body>
          <form className="  d-flex flex-column gap-4 p-4 " onSubmit={(e)=>{
            e.preventDefault()
            editMode ?  updateProject():createProject()
           
          }}>
            <div
              className=" text-center fs-4 "
              style={{ color: clientBtnColor }}
            >
              Project Details
            </div>

            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Name*
                  </label>
                  <input
                    type="text"
                    disabled={true}
                    value={projectData?.project}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        project: e.target.value,
                      });
                    }}
                    placeholder="Burrow Real Estate"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    RERA Number*
                  </label>
                  <input
                    type="text"
                    value={projectData?.rera_number}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        rera_number: e.target.value,
                      });
                    }}
                    placeholder="Enter RERA Number"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
                {/* <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Size*
                  </label>
                  <input
                    type="text"
                    disabled
                    value={projectData?.property_size}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        property_size: e.target.value,
                      });
                    }}
                    placeholder="3,4,5 BHK"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div> */}
              </div>

              {/* <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Location*
                  </label>
                  <input
                    type="text"
                    disabled
                    value={projectData?.location}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        location: e.target.value,
                      });
                    }}
                    placeholder="Ex:- Vasant Kunj"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Unit Area*
                  </label>
                  <input
                    type="text"
                    disabled
                    value={projectData?.unit_area}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        unit_area: e.target.value,
                      });
                    }}
                    placeholder="4000 sq ft"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
              </div> */}

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Contact No
                  </label>
                  <input
                    type="number"
                    value={projectData?.contact_no}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        contact_no: e.target.value,
                      });
                    }}
                    placeholder="+91-8787675466"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
                <div className="w-50" />
              </div>


              <div className="d-flex justify-content-between gap-5 align-items-center">
                
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Logo
                  </label>
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    onChange={(e)=>{
                      handleFileChange(e,"logo","logo_preview")
                    }}
                    id="logoInput"
                    style={{ display: "none" }}
                  />
                  {projectData?.logo_preview ? 
                    <div className="relative">
                        <img src={projectData?.logo_preview} />
                        <span className="absolute top-0 right-0" onClick={()=>{
                          setProjectData({
                            ...projectData,
                            logo: null,
                            logo_preview:null
                          })
                        }}>
                            <Delete  style={{color: 'red',cursor:"pointer"}}/>
                        </span>
                        
                    </div>
                    : 
                  <label
                      htmlFor="logoInput"
                      className="w-73 border p-2 ps-1 rounded-md text-black"
                      style={{ outline: "none", cursor: "pointer" }}
                    >
                      Click here to choose file
                    </label>
                    }
                </div>
              </div>

             

            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 ">
              <button
              type="button"
              disabled={isButtonLoading}
                className="btn btn-danger rounded-5"
                onClick={() => {setShowModal(false); setProjectData(""); setEditMode(false); } }
              >
                Cancel
              </button>
              {
                editMode ?
                (
                    <button
                    disabled={isButtonLoading}
                className="btn text-white rounded-5"
                style={{ background: clientBtnColor }}
              >
                {isButtonLoading ? (
                    <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    &nbsp;Update
                  </>
                ) : (
                  'Update'
                )}                 
              </button>
                ) 
                :
                (
                    <button
                className="btn text-white rounded-5"
                style={{ background: clientBtnColor }}
              >
                Create
              </button>
                )
              }

            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CampaignScreen;
