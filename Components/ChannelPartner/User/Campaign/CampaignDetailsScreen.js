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
import { useDispatch, useSelector } from 'react-redux';
import { startButtonLoading, stopButtonLoading } from '../../../../store/buttonLoaderSlice';
import Loader from '../../../Loader/Loader';


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
    const dispatch=useDispatch()
    const {isButtonLoading}=useSelector((state)=>state.buttonLoader)
    const [loader,setLoader]=useState(false)

    const targetRef=useRef();
    const options = {
      filename: `${projectData?.project}-Template.pdf`,
      page: {
        margin: 20
      }
    };
   const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;


    const getTargetElement = () => document.getElementById("content2");
    const downloadPdf = () => generatePDF(getTargetElement, options);
    const downloadHtml = () => {
      const htmlContent = document.getElementById("content2").innerHTML;
      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectData?.project}-Template.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

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
            const response = await axios.get(
              Baseurl + `/db/channel/project?project_id=${id}`,
              header
            );
            const campaign=response?.data?.data?.projectData
            if(response?.status === 200 || response?.status === 201){
              setLoader(false)
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
                htmlString:response?.data?.data?.htmlTemplate
            })
            }
            
          } catch (error) {
            console.log(error)
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

    const updateProject=  async() => {
      if(projectData?.contact_no?.toString().length!==10){
        return toast.warning("contact no should be of 10 digit",{autoClose:2500})
       }
       if( projectData?.contact_no==""){
        return toast.warning("Pls Fill Mandatory Fields",{autoClose:2500})
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
          const response = await axios.post(`${Baseurl}/db/channel/project/usertemplate`,formData, header);
          if (response.status === 200 || response.status === 201) {
            toast.success(response?.data?.message,{autoClose:2500});
            dispatch(stopButtonLoading())
            setShowModal(false)
            getCampaignById();
          }
        } catch (error) {
          console.log(error)
          if (error?.response?.data?.status === 422) {
            dispatch(stopButtonLoading())
                toast.error(error?.response?.data?.message,{autoClose:2500})
                
          }
          if (error?.response?.data?.message) {
            dispatch(stopButtonLoading())
            toast.error(error?.response?.data?.message,{autoClose:2500});
          } else {
            dispatch(stopButtonLoading())
            toast.error("Something went wrong!",{autoClose:2500});
          }
        }
    };


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
      toast.warning(`Invalid file type. Please upload ${allowedExtensions}.`,{autoClose:2500});
      }
    
      // Reset the input value to ensure the change event is fired even if the same file is selected
      e.target.value = "";
    };

    // const handleFileChange = (e,field,fieldPreview) => {
    //     if (e.target.files[0]) {
    //       const reader = new FileReader();
    //       reader.onloadend = () => {
    //         if(fieldPreview==="template_name"){
    //           setProjectData({
    //             ...projectData,
    //             [field]: e.target.files[0],
    //             [fieldPreview]: e.target.files[0].name,
    //           });
    //         }
    //         else{
    //           setProjectData({
    //             ...projectData,
    //             [field]: e.target.files[0],
    //             [fieldPreview]: URL.createObjectURL(e.target.files[0]),
    //           });
    //         }
            
    //       };
    //       reader.readAsDataURL(e.target.files[0]);
    //     }
    //   };

   
  return (
    <>
    {
      loader ? <div style={{padding: "2rem", overflowX: "auto",width:"100%"}}><Loader/></div>
      :
      (
        <div style={{padding: "2rem", overflowX: "auto",width:"100%"}}>

        {/* Edit and Download Start */}
        {
           hasCookie("channel") && userInfo?.role_id==1 && (
            <div style={{display: "flex", justifyContent: "end", alignItems: "center",gap:"10px",paddingBottom:"15px"}}>
            <img src="/ChannelPartner/profile-edit.svg" alt="Profile Edit" style={{ fontWeight: "bold", cursor: "pointer"}} 
                onClick={() => {
                    setShowModal(true);
                    getCampaignById(id);
                }}
            />
            <img 
            src="/ChannelPartner/download-file-blue.svg" 
            alt="Download File" 
            style={{height: "1.2rem", cursor: "pointer"}} 
            onClick={()=>{
              downloadHtml()              
            }}
            />
        </div>
           )
        }
        
        {/* Edit and Download End */}
  
          
        {/* To be downloaded as html start */}
        <div style={{padding:"10px"}} id="content2">
        <div style={{padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem"}} >
  
  
        {/* company logo and client logo start*/}
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          {
            clientLogo?.logo  ? <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt="Client Logo" style={{maxHeight: "3rem"}} /> :<div></div>
          }
            {
              projectData?.logo!==null ? <img src={projectData?.logo_preview} alt="Project Logo" style={{maxHeight: "3rem"}} />
              :
              <div></div>
            }
        </div>
        {/* company logo and client logo end*/}
  
        {/* uploaded html by admin start*/}
        <div dangerouslySetInnerHTML={{__html: projectData?.htmlString  || ``}}></div>
        {/* uploaded html by admin end*/}
  
        {/* Project Detail Start  */}
        <div style={{gap: "1rem", display: "flex", flexDirection: "column"}} >
            <div style={{fontWeight: "bold", fontSize: "1.25rem"}}>Project Details</div>
  
            <div style={{border: "2px solid", borderRadius: "0.5rem", background: "#EBECEE", padding: "2rem"}}>
                <div style={{display: "flex", flexDirection: "column",gap:"20px"}}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Property Name</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>{projectData?.project}</div>
                        </div>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Property Size</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>{projectData?.property_size}</div>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Location</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>{projectData?.location}</div>
                        </div>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Unit Area</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>{projectData?.unit_area}</div>
                        </div>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Contact No.</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>+91-{projectData?.contact_no}</div>
                        </div>
                        <div style={{width: "50%",display:"flex"}}>
                            <label style={{color: "#9C9AA5", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>Price</label>
                            <div style={{color: "#293790", fontSize: "1rem", fontWeight: "bold",width:"50%",fontSize:"20px"}}>{projectData?.price}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Project Detail End  */}
  
        </div>
        </div>
        {/* To be downloaded as html end */}
  
  
        {/* Back to campaign button start */}
        <div style={{display:"flex", justifyContent:"center",alignItems:"center"}}>
            <Link href={`/partner/Campaign`} style={{background:clientBtnColor,color:"white",padding:"5px 10px",borderRadius:"20px"}}>Back to Campaigns</Link>
        </div>
        {/* Back to campaign button end */}
  
        </div>
      )
    }
      
      

     <Modal
        show={showModal}
        onHide={() => {
          if(isButtonLoading==false){
            setShowModal(false);
          }
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
                    Property Name*
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
                </div>
              </div>

              <div className="d-flex justify-content-between gap-5 align-items-center">
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
              </div>

              <div className="d-flex justify-content-between gap-5 align-items-center">
                <div className="w-50 d-flex justify-content-lg-between align-items-center">
                  <label className="w-27" style={{ color: "#9C9AA5" }}>
                    Contact No.*
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
                    Price*
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
                            <Delete style={{color: 'red',cursor:'pointer'}}/>
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
              type='button'
              disabled={isButtonLoading}
                className="btn btn-danger rounded-5"
                onClick={() => {
                  setShowModal(false);
                  getCampaignById()
                } }
              >
                Cancel
              </button>
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

            </div>
          </form>
        </Modal.Body>
      </Modal>

    </>

  )
}

export default CampaignDetailsScreen