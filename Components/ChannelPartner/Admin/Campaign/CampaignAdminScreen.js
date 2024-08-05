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

const CampaignAdminScreen = () => {
  const [showModal, setShowModal] = useState(false);
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
    file: null,
    file_preview:"",
    logo:null,
    logo_preview:null,
    template:null,
    template_name:null
  });
  const[editMode,setEditMode]=useState(false)
  const[projects,setProjects]=useState([]);
  const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;
  const dispatch=useDispatch()
  const {isButtonLoading}=useSelector((state)=>state.buttonLoader)
  const[loader,setLoader]=useState(false)


  const getDataList = async () => {
    setLoader(true);
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
        if(response?.status === 200 || response?.status === 201){
          setLoader(false)
          setProjects(response?.data?.data)
        }
      } catch (error) {
        if (error?.response?.data?.message) {
          setLoader(false)
          toast.error(error.response.data.message);
        } else {
          setLoader(false)
          toast.error("Something went wrong!");
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
            file:campaign?.cover_image,
            file_preview: `${filesUrl}/project/images${campaign?.cover_image}`,
            logo:campaign?.logo_image,
                logo_preview: `${filesUrl}/projectLogo/images${campaign?.logo_image}`,
                template:campaign?.html_file,
                template_name:campaign?.html_file,
        })
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
    getDataList();
  }, []);

  const handleFileChange = (e, field, fieldPreview) => {
    const file = e.target.files[0];
    const allowedTypes = field === "template" ? ['text/html', 'text/htm'] : ['image/jpg', 'image/jpeg', 'image/png'];
  
    if (file && allowedTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (fieldPreview === "template_name") {
          setProjectData({
            ...projectData,
            [field]: file,
            [fieldPreview]: file.name,
          });
        } else {
          setProjectData({
            ...projectData,
            [field]: file,
            [fieldPreview]: URL.createObjectURL(file),
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      // toast.warning(`Invalid file type. Please upload ${allowedTypes.join(', ')}.`);
      const allowedExtensions = field === "template" ? ".html, .htm" : ".jpg, .jpeg, .png";
      toast.warning(`Invalid file type. Please upload ${allowedExtensions}.`,{autoClose:1500});
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
  
  const createProject=  async() => {
    if(projectData?.contact_no?.toString().length!==10){
      return toast.warning("contact no should be of 10 digit")
     }
     if(projectData?.project=="" || projectData?.property_size=="" || projectData?.location=="" || projectData?.unit_area=="" || projectData?.contact_no=="" || projectData?.price==""){
      return toast.warning("Pls Fill Mandatory Fields")
     }
     
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
      formData.append(key, value);
    }

      try {
        dispatch(startButtonLoading())
        const response = await axios.post(`${Baseurl}/db/channel/project`,formData, header);
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          dispatch(stopButtonLoading())
          setShowModal(false)
          getDataList();
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
          dispatch(stopButtonLoading())
              toast.error(error?.response?.data?.message)
        }
        if (error?.response?.data?.message) {
          dispatch(stopButtonLoading())
          toast.error(error.response.data.message);
        } else {
          dispatch(stopButtonLoading())
          toast.error("Something went wrong!");
        }
      }
  };

  const updateProject=  async() => {
    
    if(projectData?.contact_no?.toString().length!==10){
      return toast.warning("contact no should be of 10 digit")
     }
     if(projectData?.project=="" || projectData?.property_size=="" || projectData?.location=="" || projectData?.unit_area=="" || projectData?.contact_no=="" || projectData?.price=="" ){
      return toast.warning("Pls Fill Mandatory Fields")
     }
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
    formData.append(key, value);
  }

    try {
      dispatch(startButtonLoading())
      const response = await axios.put(`${Baseurl}/db/channel/project`,formData, header);
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        dispatch(stopButtonLoading())
        setEditMode(false)
        setShowModal(false)
        setProjectData("")
        getDataList();
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.status === 422) {
            toast.error(error?.response?.data?.message)
            dispatch(stopButtonLoading())
      }
      if (error?.response?.data?.message) {
        dispatch(stopButtonLoading())
        toast.error(error.response.data.message);
      } else {
        dispatch(stopButtonLoading())
        toast.error("Something went wrong!");
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
        <div className="top_btn_sec mb-4" >
          <div className="d-flex ">
            {
              hasCookie("channel") && userInfo?.role_id==null && (
                <button
                className="btn ms-auto  Add_btn "
                style={{ background: `${clientBtnColor}`}}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <PlusIcon />
                Create Campaign
              </button>
              )
            }
           
          </div>
        </div>
        <section className="Channel-profile Booking-Detail Visit-Details Campaigns pt-4 pb-2 bg-white">
          <div className="container mb-4">
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
                            hasCookie("channel") && userInfo?.role_id==null && (
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
                            href={`/partner/CampaignDetailsAdmin?id=${project?.project_id}`}
                          >
                          <img
                            src="/ChannelPartner/download-file-white.svg"
                            alt
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
          if(isButtonLoading==false){
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
                    Property Size*
                  </label>
                  <input
                    type="text"
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
                </div>
              </div>

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Location*
                  </label>
                  <input
                    type="text"
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
              </div>

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Contact No.*
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
                <div className="w-50 d-flex justify-content-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Price*
                  </label>
                  <input
                    type="text"
                    value={projectData?.price}
                    onChange={(e) => {
                      setProjectData({
                        ...projectData,
                        price: e.target.value,
                      });
                    }}
                    placeholder="₹ 3.57 Cr onwards"
                    style={{ outline: "none" }}
                    className="w-73 border p-2 rounded-md text-black"
                  />
                </div>
              </div>


              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50  d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Cover
                  </label>
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    onChange={(e) => handleFileChange(e, "file", "file_preview")}
                    id="fileInput"
                    style={{ display: "none" }}
                  />
                  {projectData?.file_preview ?
                    <div className="relative">
                        <img src={projectData?.file_preview} />
                        <span className="absolute top-0 right-0" onClick={()=>{
                          setProjectData({...projectData, file: null,file_preview:null})
                        }}>
                            <Delete style={{color: 'red',cursor:"pointer"}}/>
                        </span>
                    </div>
                    : 
                  <label
                      htmlFor="fileInput"
                      className="w-73 border p-2 ps-1 rounded-md text-black"
                      style={{ outline: "none", cursor: "pointer" }}
                    >
                      Click here to choose file
                    </label>
                    }
                </div>
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Logo
                  </label>
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    onChange={(e) => handleFileChange(e, "logo", "logo_preview")}
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
                            <Delete style={{color: 'red',cursor:"pointer"}}/>
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

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50  d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Template File(HTML)
                  </label>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={(e)=>{
                      handleFileChange(e,"template","template_name")
                    }}
                    id="templateInput"
                    style={{ display: "none" }}
                  />
                  {projectData?.template_name ? 
                    <div className="relative w-73">
                        <div  >{projectData?.template_name}</div>
                        <span className="absolute top-0 right-0" onClick={()=>{
                          setProjectData({...projectData, template_name: null, template_file: null})
                        }}>
                            <Delete style={{color: 'red',cursor:"pointer"}}/>
                        </span>
                    </div>
                    : 
                  <label
                      htmlFor="templateInput"
                      className="w-73 border p-2 ps-1 rounded-md text-black"
                      style={{ outline: "none", cursor: "pointer" }}
                    >
                      Click here to choose file
                    </label>
                    }
                </div>
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                 
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
                    type="submit"
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
                    type="submit"
                    disabled={isButtonLoading}
                className="btn text-white rounded-5"
                style={{ background: clientBtnColor }}
              >
                {isButtonLoading ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Create
                                  </>
                                ) : (
                                  'Create'
                                )}
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

export default CampaignAdminScreen;
