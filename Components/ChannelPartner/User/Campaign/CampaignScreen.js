import React, { useEffect, useState } from "react";
import axios from "axios";
import PlusIcon from "../../../Svg/PlusIcon";

import { Baseurl, filesUrl } from "../../../../Utils/Constants";
import { getCookie, hasCookie } from "cookies-next";
import { toast, useToast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { Delete } from "@mui/icons-material";

const DashBoardScreenCHANNEL = () => {
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
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
    file: null,
    file_name:""
  });
  const[editMode,setEditMode]=useState(false)
  const[projects,setProjects]=useState([]);
  

  const getDataList = async () => {
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
          Baseurl + `/db/channel/project`,
          header
        );
        setProjects(data?.data)
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
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
        setProjectData({
            ...projectData,
            project: data?.data?.project,
            project_id: data?.data?.project_id,
            location: data?.data?.location,
            property_size: data?.data?.property_size,
            unit_area: data?.data?.unit_area,
            price: data?.data?.price,
            contact_no: data?.data?.contact_no,
            file: data?.data?.cover_image,
            file_name: data?.data?.cover_image,
        })
        setImgFile([`${filesUrl}/project/images${data?.data?.cover_image}`])
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

  

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectData({
          ...projectData,
          file: e.target.files[0],
          file_name: e.target.files[0].name,
        });
      };
      reader.readAsDataURL(e.target.files[0]);
      const ImagesArray = Array.from(e.target.files).map((file) =>URL.createObjectURL(file)
    );
    console.log("ImagesArray",ImagesArray)
    setImgFile(ImagesArray);
    }
  };
  
  const createProject=  async() => {
    if(!projectData.project) return toast.warning("please enter project name")
   if(!projectData.file) return toast.warning("please upload cover image")
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
        const response = await axios.post(`${Baseurl}/db/channel/project`,formData, header);
        if (response.status === 200 || response.status === 201) {
          toast.success(response.data.message);
          setShowModal(false)
          getDataList();
        }
      } catch (error) {
        console.log(error)
        if (error?.response?.data?.status === 422) {
              toast.error(error?.response?.data?.message)
              
        }
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
  };

  const updateProject=  async() => {
   
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
      const response = await axios.put(`${Baseurl}/db/channel/project`,formData, header);
      if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message);
        setEditMode(false)
        setShowModal(false)
        setProjectData("")
        getDataList();
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.status === 422) {
            toast.error(error?.response?.data?.message)
            
      }
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
};

  

  return (
    <>
      <div className="ps-4 pe-4 pb-4 w-100 mt-4 overflow-auto">
        <div className="top_btn_sec mb-2">
          <div className="d-flex ">
            <button
              className="btn ms-auto  Add_btn me-3"
              style={{ background: `${clientBtnColor}` }}
              onClick={() => {
                setShowModal(true);
              }}
            >
              <PlusIcon />
              Create Campaign
            </button>
          </div>
        </div>
        <section className="Channel-profile Booking-Detail Visit-Details Campaigns pt-4 pb-2 bg-white">
          <div className="container mt-4 mb-4">
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
                          <img
                            src="/ChannelPartner/profile-edit-white.svg"
                            onClick={()=>{
                                setEditMode(true)
                               
                                getDataListById(project?.project_id)
                                setShowModal(true)
                            }}
                            alt
                            style={{ height: 17 }}
                          />
                          <img
                            src="/ChannelPartner/upload-file.svg"
                            alt
                            style={{ height: 16 }}
                          />
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

      <Modal
        show={showModal}
        onHide={() => {
            setEditMode(false)
          setProjectData("")
          setShowModal(false);
          setImgFile("")
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
                    Property Name
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
                    Property Size
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
                    Location
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
                    Unit Area
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
                    Contact No.
                  </label>
                  <input
                    type="text"
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
                    Price
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
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Logo
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    id="fileInput"
                    style={{ display: "none" }}
                  />
                  {imgFile.length > 0 ? 
                    <div className="relative">
                        <img src={imgFile[0]} />
                        <span className="absolute top-0 right-0" onClick={()=>setImgFile([])}>
                            <Delete style={{color: 'red'}}/>
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
                <div className="w-50 justify-content-lg-between align-items-center"></div>
              </div>
            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 ">
              <div
                className="btn btn-danger rounded-5"
                onClick={() => {setShowModal(false); setProjectData(""); setEditMode(false); setImgFile("")} }
              >
                Cancel
              </div>
              {
                editMode ?
                (
                    <button
                className="btn text-white rounded-5"
                style={{ background: clientBtnColor }}
              >
                Update
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

export default DashBoardScreenCHANNEL;
