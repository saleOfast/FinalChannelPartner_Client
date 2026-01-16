import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import Link from 'next/link';
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify';
import { Baseurl, filesUrl } from '../../../../Utils/Constants';
import { Modal } from 'react-bootstrap';
import { Delete } from '@mui/icons-material';
import { useReactToPrint } from "react-to-print";
import generatePDF, { Options } from 'react-to-pdf';
import { useDispatch, useSelector } from 'react-redux';
import { startButtonLoading, stopButtonLoading } from '../../../../store/buttonLoaderSlice';
import Loader from '../../../Loader/Loader';


const CampaignDetailsAdminScreen = () => {
  const router = useRouter()
  const { id } = router.query;
  const [showModal, setShowModal] = useState(false);
  const clientBtnColor = hasCookie("clientBtnColor")
    ? getCookie("clientBtnColor")
    : "#293790";
  const [projectData, setProjectData] = useState({
    project: "",
    project_id: null,
    location: "",
    property_size: "",
    unit_area: "",
    price: "",
    contact_no: "",
    file: null,
    file_preview: "",
    logo: null,
    logo_preview: null,
    template: null,
    template_name: null,
    htmlString: ""
  });
  const dispatch = useDispatch()
  const { isButtonLoading } = useSelector((state) => state.buttonLoader)
  const clientLogo = getCookie('clientLogo') ? JSON.parse(getCookie('clientLogo')) : null;
  const [loader, setLoader] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const userInfo = hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : null;
  const targetRef = useRef();
  const options = {
    filename: `${projectData?.project}-Template.pdf`,
    page: {
      margin: 20
    }
  };

  const getTargetElement = () => document.getElementById("content2");
  const downloadPdf = async () => {
    if (pdfLoading) return; // Prevent multiple clicks
    setPdfLoading(true);
    try {
      await generatePDF(getTargetElement, options);
      toast.success('PDF downloaded successfully!', { autoClose: 2000 });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Error generating PDF', { autoClose: 2500 });
    } finally {
      setPdfLoading(false);
    }
  };
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


  useEffect(() => {
    if (id) {
      getCampaignById()
    }
  }, [id])

  const getCampaignById = async () => {
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
          Baseurl + `/db/channel/project?project_id=${id}`,
          header
        );
        const campaign = response?.data?.data?.projectData
        if (response?.status === 200 || response?.status === 201) {
          let htmlContent = response?.data?.data?.htmlTemplate || "";
          
          // If htmlTemplate is empty but html_file exists, fetch the HTML file directly
          if (!htmlContent && campaign?.html_file) {
            try {
              const htmlFileUrl = `${filesUrl}/projectHtml/html/${campaign.html_file}`;
              const htmlResponse = await fetch(htmlFileUrl);
              if (htmlResponse.ok) {
                htmlContent = await htmlResponse.text();
              }
            } catch (htmlError) {
              console.log("Could not fetch HTML file:", htmlError);
            }
          }
          
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
            file: campaign?.cover_image,
            file_preview: `${filesUrl}/project/images${campaign?.cover_image}`,
            logo: campaign?.logo_image,
            logo_preview: `${filesUrl}/projectLogo/images${campaign?.logo_image}`,
            template: campaign?.html_file,
            template_name: campaign?.html_file,
            htmlString: htmlContent
          })
        }

      } catch (error) {
        console.log(error)
        if (error?.response?.data?.message) {
          setLoader(false)
          toast.error(error?.response?.data?.message, { autoClose: 2500 });
        } else {
          setLoader(false)
          toast.error("Something went wrong!", { autoClose: 2500 });
        }
      }
    }
  };

  const updateProject = async () => {
    if (projectData?.contact_no?.toString().length !== 10) {
      return toast.warning("contact no should be of 10 digit", { autoClose: 2500 })
    }
    if (projectData?.project == "" || projectData?.contact_no == "") {
      return toast.warning("Pls Fill Mandatory Fields", { autoClose: 2500 })
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

    const formData = new FormData();
    for (const [key, value] of Object.entries(projectData)) {
      formData.append(key, value);
    }

    try {
      dispatch(startButtonLoading())
      const response = await axios.put(`${Baseurl}/db/channel/project`, formData, header);
      if (response.status === 200 || response.status === 201) {
        toast.success(response?.data?.message, { autoClose: 2500 });
        dispatch(stopButtonLoading())
        setShowModal(false)
        getCampaignById();
      }
    } catch (error) {
      console.log(error)
      if (error?.response?.data?.status === 422) {
        dispatch(stopButtonLoading())
        toast.error(error?.response?.data?.message, { autoClose: 2500 })

      }
      if (error?.response?.data?.message) {
        dispatch(stopButtonLoading())
        toast.error(error?.response?.data?.message, { autoClose: 2500 });
      } else {
        dispatch(stopButtonLoading())
        toast.error("Something went wrong!", { autoClose: 2500 });
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
      toast.warning(`Invalid file type. Please upload ${allowedExtensions}.`, { autoClose: 2500 });
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
      {/* Global CSS for HTML content - Aggressive reset */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        .campaign-wrapper {
          font-family: 'Poppins', sans-serif;
        }
        .campaign-content * {
          max-width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        .campaign-content img {
          max-width: 100% !important;
          height: auto !important;
          display: block !important;
          margin: 5px auto !important;
          padding: 0 !important;
          border-radius: 8px !important;
        }
        .campaign-content h1 { font-size: 20px !important; margin: 8px 0 4px 0 !important; padding: 0 !important; color: #1a1a2e !important; line-height: 1.3 !important; }
        .campaign-content h2 { font-size: 18px !important; margin: 6px 0 3px 0 !important; padding: 0 !important; color: #1a1a2e !important; line-height: 1.3 !important; }
        .campaign-content h3, .campaign-content h4, .campaign-content h5, .campaign-content h6 { font-size: 16px !important; margin: 5px 0 2px 0 !important; padding: 0 !important; color: #333 !important; line-height: 1.3 !important; }
        .campaign-content p { margin: 3px 0 !important; padding: 0 !important; line-height: 1.5 !important; font-size: 14px !important; color: #444 !important; }
        .campaign-content p:empty { display: none !important; }
        .campaign-content ul, .campaign-content ol { margin: 4px 0 !important; padding: 0 0 0 20px !important; }
        .campaign-content li { margin: 2px 0 !important; padding: 0 !important; font-size: 14px !important; line-height: 1.5 !important; color: #444 !important; }
        .campaign-content table { width: 100% !important; border-collapse: collapse !important; margin: 5px 0 !important; border-radius: 8px !important; overflow: hidden !important; }
        .campaign-content td, .campaign-content th { padding: 6px 10px !important; border: 1px solid #e0e0e0 !important; font-size: 13px !important; margin: 0 !important; }
        .campaign-content div { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
        .campaign-content div:empty { display: none !important; }
        .campaign-content span { margin: 0 !important; padding: 0 !important; }
        .campaign-content br { line-height: 0.3 !important; display: block !important; content: '' !important; margin: 0 !important; }
        .campaign-content br + br { display: none !important; }
        .campaign-content [style*="margin"] { margin: 0 !important; }
        .campaign-content [style*="padding"] { padding: 0 !important; }
        .campaign-content [style*="width"] { width: auto !important; max-width: 100% !important; }
        .campaign-content [style*="height"]:not(img) { height: auto !important; }
        .campaign-content [style*="gap"] { gap: 3px !important; }
        .campaign-content [style*="line-height"] { line-height: 1.4 !important; }
        
        .btn-hover:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important; }
      `}</style>

      {
        loader ? <div style={{ padding: "2rem", width: "100%", display: "flex", justifyContent: "center" }}><Loader /></div>
          :
          (
            <div className="campaign-wrapper" style={{ 
              padding: "20px", 
              width: "100%", 
              minHeight: "100vh",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              overflowY: "auto"
            }}>
              
              {/* Main Card */}
              <div className="card-hover" style={{ 
                background: "#ffffff", 
                borderRadius: "20px", 
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)", 
                maxWidth: "900px", 
                margin: "0 auto",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}>
                
                {/* Header with Gradient */}
                <div style={{ 
                  background: `linear-gradient(135deg, ${clientBtnColor} 0%, ${clientBtnColor}dd 100%)`,
                  padding: "20px 24px", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  {/* Decorative circles */}
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.1)" }}></div>
                  <div style={{ position: "absolute", bottom: "-30px", left: "20%", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}></div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", zIndex: 1 }}>
                    <div style={{ 
                      width: "42px", height: "42px", 
                      background: "rgba(255,255,255,0.2)", 
                      borderRadius: "12px", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      backdropFilter: "blur(10px)"
                    }}>
                      <span style={{ fontSize: "20px" }}>📋</span>
                    </div>
                    <div>
                      <h2 style={{ color: "#fff", fontWeight: "700", fontSize: "18px", margin: 0, letterSpacing: "-0.5px" }}>Campaign Details</h2>
                      <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "12px", margin: "2px 0 0 0" }}>View and manage your campaign</p>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", zIndex: 1 }}>
                    {hasCookie("channel") && userInfo?.role_id == null && (
                      <button
                        className="btn-hover"
                        onClick={() => { setShowModal(true); getCampaignById(id); }}
                        style={{ 
                          background: "rgba(255,255,255,0.2)", 
                          border: "1px solid rgba(255,255,255,0.4)", 
                          borderRadius: "10px", 
                          padding: "10px 18px", 
                          cursor: "pointer", 
                          color: "#fff", 
                          fontSize: "13px", 
                          fontWeight: "600",
                          backdropFilter: "blur(10px)",
                          transition: "all 0.3s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      className="btn-hover"
                      onClick={downloadPdf}
                      disabled={pdfLoading}
                      style={{ 
                        background: pdfLoading ? "#ccc" : "#fff", 
                        border: "none", 
                        borderRadius: "10px", 
                        padding: "10px 18px", 
                        cursor: pdfLoading ? "not-allowed" : "pointer", 
                        color: pdfLoading ? "#666" : clientBtnColor, 
                        fontSize: "13px", 
                        fontWeight: "600",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        opacity: pdfLoading ? 0.7 : 1
                      }}
                    >
                      {pdfLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                          Generating...
                        </>
                      ) : (
                        <>📥 Download PDF</>
                      )}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div id="content2" style={{ padding: "16px" }}>
                  
                  {/* Logos Section */}
                  {(clientLogo?.logo || projectData?.logo) && (
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      padding: "12px 16px", 
                      background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", 
                      borderRadius: "10px", 
                      marginBottom: "12px",
                      border: "1px solid #e0e0e0"
                    }}>
                      {clientLogo?.logo ? (
                        <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt="Client Logo" style={{ maxHeight: "40px", objectFit: "contain" }} />
                      ) : <div></div>}
                      {projectData?.logo !== null && projectData?.logo_preview ? (
                        <img src={projectData?.logo_preview} alt="Project Logo" style={{ maxHeight: "40px", objectFit: "contain" }} />
                      ) : <div></div>}
                    </div>
                  )}

                  {/* HTML Content */}
                  {projectData?.htmlString && (
                    <div className="campaign-content" style={{ 
                      padding: "12px", 
                      background: "#fafafa", 
                      border: "1px solid #e8e8e8", 
                      borderRadius: "10px", 
                      marginBottom: "12px",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.03)"
                    }}>
                      <div dangerouslySetInnerHTML={{ __html: projectData?.htmlString }}></div>
                    </div>
                  )}

                  {/* Project Details Card */}
                  <div style={{ 
                    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)", 
                    borderRadius: "12px", 
                    border: "1px solid #e0e0e0", 
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
                  }}>
                    <div style={{ 
                      background: `linear-gradient(135deg, ${clientBtnColor}15 0%, ${clientBtnColor}08 100%)`,
                      padding: "10px 16px", 
                      fontWeight: "700", 
                      fontSize: "14px", 
                      color: clientBtnColor, 
                      borderBottom: "1px solid #e8e8e8",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px"
                    }}>
                      <span style={{ fontSize: "16px" }}>🏠</span>
                      Project Details
                    </div>
                    <div style={{ padding: "0" }}>
                      {/* Property Name */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        padding: "12px 16px", 
                        borderBottom: "1px solid #f0f0f0",
                        background: "#fff",
                        transition: "background 0.2s ease"
                      }}>
                        <div style={{ 
                          width: "36px", 
                          height: "36px", 
                          background: `${clientBtnColor}15`, 
                          borderRadius: "10px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          marginRight: "12px"
                        }}>
                          <span style={{ fontSize: "16px" }}>🏢</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#888", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px 0" }}>Property Name</p>
                          <p style={{ color: "#1a1a2e", fontSize: "14px", fontWeight: "700", margin: 0 }}>{projectData?.project || "N/A"}</p>
                        </div>
                      </div>
                      
                      {/* Contact Number */}
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        padding: "12px 16px",
                        background: "#fff"
                      }}>
                        <div style={{ 
                          width: "36px", 
                          height: "36px", 
                          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)", 
                          borderRadius: "10px", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          marginRight: "12px"
                        }}>
                          <span style={{ fontSize: "16px" }}>📞</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ color: "#888", fontSize: "10px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 2px 0" }}>Contact Number</p>
                          <p style={{ color: "#2e7d32", fontSize: "14px", fontWeight: "700", margin: 0 }}>+91-{projectData?.contact_no || "N/A"}</p>
                        </div>
                        <a 
                          href={`tel:+91${projectData?.contact_no}`}
                          className="btn-hover"
                          style={{ 
                            background: "linear-gradient(135deg, #43a047 0%, #2e7d32 100%)", 
                            color: "#fff", 
                            padding: "10px 16px", 
                            borderRadius: "10px", 
                            textDecoration: "none", 
                            fontWeight: "600", 
                            fontSize: "12px", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "6px",
                            boxShadow: "0 4px 15px rgba(46,125,50,0.3)",
                            transition: "all 0.3s ease"
                          }}
                        >
                          📱 Call Now
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer */}
                <div style={{ 
                  padding: "16px", 
                  background: "#f0f0f0", 
                  borderTop: "2px solid #ddd", 
                  display: "flex", 
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                  <Link 
                    href="/partner/CampaignAdmin" 
                    style={{ 
                      background: "#2563eb",
                      color: "#ffffff", 
                      padding: "14px 32px", 
                      borderRadius: "10px", 
                      textDecoration: "none", 
                      fontSize: "16px", 
                      fontWeight: "700",
                      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
                      display: "inline-block",
                      textAlign: "center",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    ← Back to Campaigns
                  </Link>
                </div>

              </div>
            </div>
          )
      }


      <Modal
        show={showModal}
        onHide={() => {
          if (isButtonLoading == false) {
            setShowModal(false);
          }
        }}
        size="lg"
        centered
      >
        <Modal.Body>
          <form className="  d-flex flex-column gap-4 p-4 " onSubmit={(e) => {
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
                {/* <div className="w-50 d-flex justify-content-lg-between align-items-center">
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
                </div> */}
              </div>

              {/* <div className="d-flex justify-content-between gap-5 align-items-center">
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
              </div> */}

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
                {/* <div className="w-50 d-flex justify-content-between align-items-center">
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
                </div> */}
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
                      <span className="absolute top-0 right-0" onClick={() => {
                        setProjectData({ ...projectData, file: null, file_preview: null })
                      }}>
                        <Delete style={{ color: 'red', cursor: 'pointer' }} />
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
                      <span className="absolute top-0 right-0" onClick={() => {
                        setProjectData({
                          ...projectData,
                          logo: null,
                          logo_preview: null
                        })
                      }}>
                        <Delete style={{ color: 'red', cursor: 'pointer' }} />
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
                    Template File
                  </label>
                  <input
                    type="file"
                    accept=".html,.htm"
                    onChange={(e) => {
                      handleFileChange(e, "template", "template_name")
                    }}
                    id="templateInput"
                    style={{ display: "none" }}
                  />
                  {projectData?.template_name ?
                    <div className="relative w-73">
                      <div  >{projectData?.template_name}</div>
                      <span className="absolute top-0 right-0" onClick={() => {
                        setProjectData({ ...projectData, template_name: null, template_file: null })
                      }}>
                        <Delete style={{ color: 'red', cursor: 'pointer' }} />
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
                onClick={() => {
                  setShowModal(false);
                  getCampaignById()
                }}
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
export default CampaignDetailsAdminScreen
