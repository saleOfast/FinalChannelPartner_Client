import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../../Utils/Constants';
import { Modal } from 'react-bootstrap';
import { Delete } from '@mui/icons-material';
import generatePDF, { Options } from 'react-to-pdf';


const CampaignDetailsScreen = () => {
    const router=useRouter()
    const {id}=router.query;
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
        template_name:null,
        htmlString:""
    });

    const clientLogo= getCookie('clientLogo')? JSON.parse(getCookie('clientLogo')) : null;

    const targetRef=useRef();
    const options = {
      filename: `${projectData?.project}-Template.pdf`,
      page: {
        margin: 20
      }
    };

    const getTargetElement = () => document.getElementById("content2");
    const downloadPdf = () => generatePDF(getTargetElement, options);

    useEffect(()=>{
        if(id){
            getCampaignById()
        }
    },[id])

    const getCampaignById = async () => {
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
              Baseurl + `/db/channel/project?project_id=${id}`,
              header
            );
            const campaign=data?.data?.projectData
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
                htmlString:data?.data?.htmlTemplate
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
          const response = await axios.post(`${Baseurl}/db/channel/project/usertemplate`,formData, header);
          if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message);
            setShowModal(false)
            getCampaignById();
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

    const handleFileChange = (e,field,fieldPreview) => {
        if (e.target.files[0]) {
          const reader = new FileReader();
          reader.onloadend = () => {
            if(fieldPreview==="template_name"){
              setProjectData({
                ...projectData,
                [field]: e.target.files[0],
                [fieldPreview]: e.target.files[0].name,
              });
            }
            else{
              setProjectData({
                ...projectData,
                [field]: e.target.files[0],
                [fieldPreview]: URL.createObjectURL(e.target.files[0]),
              });
            }
            
          };
          reader.readAsDataURL(e.target.files[0]);
        }
      };

   
  return (
    <>
             <section ref={targetRef}  className="Channel-profile Booking-Detail Visit-Details Campaigns overflow-auto w-100  Campaign-upload pt-4 pb-2 bg-white">
            <div  className="container mt-4 mb-4" id='content2'>
              <div className="row gx-4 gy-4">
                <div className="d-flex justify-content-end gap-2">
                  <img src="/ChannelPartner/profile-edit.svg" alt style={{height: 17,fontWeight:"bold"}} 
                      onClick={()=>{
                          setShowModal(true)
                          getCampaignById(id)
                      }}
                  />
                  <img src="/ChannelPartner/download-file-blue.svg" alt style={{height: 17}} 
                  onClick={() => downloadPdf()}
                  />
                </div>
                <div className="d-flex justify-content-between Campaign-upload-logo">
                <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt=""  />
                  <img src={projectData?.logo_preview} alt />
                </div>
              
              <div dangerouslySetInnerHTML={{__html: projectData?.htmlString  || ``}}>

              </div>
              </div>
              <div className="row gx-4 mt-5">
                <div className="profile-text mb-2 mb-md-4">Project Details</div>
                <div className="col-12  col-lg-12">
                  <div className="lead-detail-sec overflow-hidden">
                    <div className="row" style={{backgroundColor: '#F9F9F9'}}>
                      <div className="col-12 col-lg-6">
                        <div className="list-group General-list d-flex flex-column gap-3  leads-content h-auto m-0 border-bottom border-lg-0">
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Property Name</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right">{projectData?.project} </span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Location</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right">{projectData?.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Contact No.</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right">+91{projectData?.contact_no}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-lg-6">
                        <div className="list-group General-list d-flex flex-column gap-3  leads-content h-auto m-0">
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Property Size</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right">{projectData?.property_size}</span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Unit Area</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right">{projectData?.unit_area}</span>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-5 col-md-5">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-left">Price</span>
                              </div>
                            </div>
                            <div className="col-7 col-md-6">
                              <div className="list-group-item list-group-item-action p-0 border-0">
                                <span className="list-right"> {projectData?.price}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="details-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
                <Link href={`/CHANNEL/CampaignAdmin`} className="back-to-lead d-flex align-items-center justify-content-center text-white border-0" style={{background:clientBtnColor}}>Back to Campaigns</Link>
              </div>
            </div>
</section>

     <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        size="lg"
        centered
      >
        <Modal.Body>
          <form className="  d-flex flex-column gap-4 p-4 " onSubmit={(e)=>{
            e.preventDefault()
            updateProject()
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
                    disabled
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
                </div>
              </div>

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Location
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
                    Unit Area
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
                    disabled
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
                {/* <div className="w-50  d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Cover
                  </label>
                  <input
                    type="file"
                    onChange={(e)=>{
                      handleFileChange(e,"file","file_preview")
                    }}
                    id="fileInput"
                    style={{ display: "none" }}
                  />
                  {projectData?.file_preview ?
                    <div className="relative">
                        <img src={projectData?.file_preview} />
                        <span className="absolute top-0 right-0" onClick={()=>{
                          setProjectData({...projectData, file: null,file_preview:null})
                        }}>
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
                </div> */}
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Property Logo
                  </label>
                  <input
                    type="file"
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
                            <Delete style={{color: 'red'}}/>
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
{/* 
              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50  d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Template File
                  </label>
                  <input
                    type="file"
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
                            <Delete style={{color: 'red'}}/>
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
              </div> */}

            </div>

            <div className="d-flex justify-content-center align-items-center gap-3 ">
              <div
                className="btn btn-danger rounded-5"
                onClick={() => {setShowModal(false); } }
              >
                Cancel
              </div>
              <button
                className="btn text-white rounded-5"
                style={{ background: clientBtnColor }}
              >
                Update
              </button>

            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>

  )
}

export default CampaignDetailsScreen