// import React, { useEffect, useState } from "react";
// import MUIDataTable from "mui-datatables";
// // import moment from "moment";
// import ViewIcon from "../../Svg/ViewIcon";
// import DisableIcon from "../../Svg/DisableIcon";
// import EditIcon from "../../Svg/EditIcon";
// import Link from "next/link";
// import moment from "moment";
// import DeleteIcon from "../../Svg/DeleteIcon";
// import Loader from "../../Loader/Loader";
// import { fetchData } from "../../../Utils/getReq";
// import { Button, Modal, Table } from "react-bootstrap";
// import Select from "react-select";
// import { toast } from "react-toastify";

// const EstimationTable = ({ accountsList, openConfirmBox, title, loader }) => {
//   const [errorToast, setErrorToast] = useState({});
//   const [busiessTypeList, setBusinessTypeList] = useState([]);
//   const [stateList, setStatelist] = useState([]);
//   const [cityList, setCitylist] = useState([]);
//   const [stateId, setStateId] = useState("");
//   const [cityIds, setCityIds] = useState([]);
//   const [siteLists, setSiteLists] = useState([]);
//   const [show, setShow] = useState(false);
//   const [show2, setShow2] = useState(false);
//   const [selectedSites,setSelectedSites]=useState([])

//   const handleClose = () => {
//     setShow(false);
//     setStateId("")
//     setCityIds([])
//   };

//   const handleClose2 = () => {
//     setShow2(false);
//   };

//   const getState = async (id) => {
//     await fetchData(
//       `/db/area/states?cnt_id=101`,
//       setStatelist,
//       errorToast,
//       setErrorToast
//     );
//   };

//   const getcity = async (id) => {
//     await fetchData(
//       `/db/area/city?st_id=${id}`,
//       (data) => setCitylist(data.cityData),
//       errorToast,
//       setErrorToast
//     );
//   };

//   async function getBusinessTypeList() {
//     await fetchData(
//       `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
//       setBusinessTypeList,
//       errorToast,
//       setErrorToast
//     );
//   }

//   const getSiteList = async () => {
//     if(!stateId){
//         return toast.warning("Please Select State")
//     }
//     if(!cityIds.length>=1){
//         return toast.warning("Please Select City")
//     }
//     console.log(cityIds)
//     const params = {
//       city_id: cityIds,
//     };

//     const queryString = new URLSearchParams(params).toString();
//     await fetchData(
//       `/db/media/siteManagement/getSite?${queryString}`,
//       setSiteLists,
//       errorToast,
//       setErrorToast
//     );
//     handleClose()
//     setShow2(true)
//   };

//   useEffect(() => {
//     getBusinessTypeList();

//   }, []);

//   useEffect(() => {
//     getcity(stateId);
//   }, [stateId]);

//   const modelColumns=[]

//   const columns = [
//     {
//       name: "campaign_name",
//       label: "Campaign Name",
//       options: {
//         filter: true,
//       },
//     },

//     {
//       name: "estimate_type",
//       label: "Estimated Type",
//       options: {
//         filter: true,
//       },
//     },
//     {
//       name: "business_type",
//       label: "Business Type",
//       options: {
//         filter: true,
//         customBodyRender: (value, tableMeta, updateValue) => {
//           return (
//             <>
//               {
//                 busiessTypeList?.find((item) => item?.cmpn_b_t_id == value)
//                   ?.cmpn_b_t_name
//               }
//             </>
//           );
//         },
//       },
//     },
//     {
//       name: "estimate_id",
//       label: "Action",
//       options: {
//         filter: false,
//         download: false,
//         customBodyRender: (value, tableMeta, updateValue) => {
//           return (
//             <div className="table_btns">
//               <Link href={`/media/AddEstimations?id=${value}&vw=mds`}>
//                 <button className="action_btn" title="View">
//                   <ViewIcon />
//                 </button>
//               </Link>
//               <Link href={`/media/AddEstimations?id=${value}`}>
//                 <button className="action_btn" title="Edit">
//                   <EditIcon />
//                 </button>
//               </Link>
//               <button
//                 className="action_btn"
//                 onClick={() => openConfirmBox(value)}
//                 title="Remove"
//               >
//                 <DeleteIcon />
//               </button>
//               {busiessTypeList?.find(
//                 (item) => item?.cmpn_b_t_id == tableMeta?.rowData[2]
//               )?.cmpn_b_t_name == "Asset" && (
//                 <button
//                   className="action_btn"
//                   onClick={() =>{
//                     getState()
//                     setShow(true)}
//                 }
//                   title="Offer Asset Site"
//                 >
//                   <DisableIcon />
//                 </button>
//               )}
//             </div>
//           );
//         },
//       },
//     },
//   ];

//   const handleSelectSite = (site_id) => {
//     setSelectedSites((prevSelected) =>
//       prevSelected.includes(site_id)
//         ? prevSelected.filter((id) => id !== site_id)
//         : [...prevSelected, site_id]
//     );
//   };

//   const options = {
//     selectableRows: "none",
//     responsive: "standard",
//     downloadOptions: { filename: "ContactList.csv" },
//   };

//   const mappedDataList = accountsList?.map((list) => ({
//     campaign_name: list?.db_media_campaign?.campaign_name,
//     estimate_type: list?.estimate_type,
//     estimate_id: list?.estimate_id,
//     business_type: list?.db_media_campaign?.cmpn_b_t_id,
//   }));

//   return (
//     <>
//       {loader ? (
//         <Loader />
//       ) : (
//         <div className="miuiTable">
//           <MUIDataTable
//             title={title}
//             // data={accountsList}
//             data={mappedDataList}
//             columns={columns}
//             options={options}
//           />
//         </div>
//       )}
//       <Modal className="commonModal" show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title> Offer Asset Site</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               <div className="col-xl-12 col-md-12 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="state">State *</label>
//                   <Select
//                     id="state"
//                     value={stateList.map((item) => ({
//                         value: item?.state_id,
//                         label: item?.state_name
//                     })).find(option => option.value === stateId)}
//                     options={stateList.map(state => ({ value: state?.state_id, label: state?.state_name }))}
//                     onChange={(e) => {
//                         setStateId(e.value);
//                         setCityIds([]);
//                     }}
//                     placeholder="Select State"
//                   />
//                 </div>
//               </div>
//               <div className="col-xl-12 col-md-12 col-sm-12 col-12">
//                 <div className="input_box">
//                   <label htmlFor="cities">Cities *</label>
//                   <Select
//                     id="cities"
//                     isMulti
//                     value={cityList
//                       .filter((city) => cityIds.includes(city.city_id))
//                       .map((city) => ({
//                         value: city.city_id,
//                         label: city.city_name,
//                       }))}
//                     options={cityList.map((city) => ({
//                       value: city.city_id,
//                       label: city.city_name,
//                     }))}
//                     onChange={(selectedOptions) => {
//                       setCityIds(selectedOptions.map((option) => option.value));
//                     }}
//                     placeholder="Select Cities"
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={() => {
//             getSiteList()

//           }}>
//             SUBMIT
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal className="commonModal" show={show2} onHide={handleClose2} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title> Offer Asset Site</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//   {siteLists.length > 0 ? (
//     <Table striped bordered hover responsive>
//       <thead>
//         <tr>
//           <th>Select</th>
//           <th>Site ID</th>
//           <th>State</th>
//           <th>City</th>
//           <th>Location</th>
//           <th>Category</th>
//           <th>Media Format</th>
//           <th>Media Vehicle</th>
//           <th>Media Type</th>
//           <th>Quantity </th>
//           <th>Height (Ft.)  </th>
//           <th>Width (Ft.)  </th>
//           <th>Total Sq. Ft.  </th>
//           {/* Add more columns as needed */}
//         </tr>
//       </thead>
//       <tbody>
//         {siteLists.map((site) => (
//           <tr key={site.site_id}>
//             <td>
//               <input
//                 type="checkbox"
//                 checked={selectedSites.includes(site.site_id)}
//                 onChange={() => handleSelectSite(site.site_id)}
//               />
//             </td>
//             <td>{site.site_id}</td>
//             <td>{site?.db_state?.state_name}</td>
//             <td>{site?.db_state?.state_name}</td>
//             <td>{site.location}</td>
//             <td>{site?.db_site_category?.site_cat_name}</td>
//             <td>{site?.db_media_format?.m_f_name}</td>
//             <td>{site?.db_media_vehicle?.m_v_name}</td>
//             <td>{site?.db_media_type?.m_t_name}</td>
//             <td>{site.quantity}</td>
//             <td>{site.height}</td>
//             <td>{site.width}</td>
//             <td>{site.total_area}</td>

//             {/* Add more data fields as needed */}
//           </tr>
//         ))}
//       </tbody>
//     </Table>
//   ) : (
//     <p>No sites available</p>
//   )}
// </Modal.Body>

//         <Modal.Footer>
//           <Button variant="primary" onClick={() => {
//             console.log(selectedSites)

//           }}>
//             SUBMIT
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default EstimationTable;

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import ViewIcon from "../../Svg/ViewIcon";
import DisableIcon from "../../Svg/DisableIcon";
import EditIcon from "../../Svg/EditIcon";
import Link from "next/link";
import DeleteIcon from "../../Svg/DeleteIcon";
import Loader from "../../Loader/Loader";
import { fetchData } from "../../../Utils/getReq";
import { Button, Modal, Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { Baseurl } from "../../../Utils/Constants";
import { getCookie, hasCookie } from "cookies-next";
import axios from "axios";
import ModelAssetSite1 from "./ModelAssetSite1";
import ModelAgencySite from "./ModelAgencySite";
import ModelAssetSite2 from "./ModelAssetSite2";
// import ModelAssetSite3 from "./ModelAssetSite3";
// import ModelAssetSite5 from "./ModelAssetSite5";
import ModelAgencySiteUpload from "./ModelAgencySiteUpload";
import PlusIcon from "../../Svg/PlusIcon";
import ModelClientCostAgency from "./ModelClientCostAgency";
import ModelClientCostAsset from "./ModelClientCostAsset";
import ModelVendorCostAsset from "./ModelVendorCostAsset";
import ModelVendorCostAgency from "./ModelVendorCostAgency";

import StarIcon from "../../Svg/StarIcon";
import AcceptIcon from "../../Svg/AcceptIcon";
import RejectIcon from "../../Svg/RejectIcon";

const EstimationTable = ({ accountsList, openConfirmBox, title, loader, getContactList }) => {
  const [errorToast, setErrorToast] = useState({});
  const [busiessTypeList, setBusinessTypeList] = useState([]);
  const [stateList, setStatelist] = useState([]);
  const [cityList, setCitylist] = useState([]);
  const [stateId, setStateId] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [siteLists, setSiteLists] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [show6, setShow6] = useState(false);
  const [showVendorAsset, setShowVendorAsset] = useState(false);
  const [showVendorAgency, setShowVendorAgency] = useState(false);

  const [selectedSites, setSelectedSites] = useState([]);
  const [estimationId, setEstimationId] = useState(null);
  const userInfo=hasCookie("userInfo")?JSON.parse(getCookie("userInfo")):null;
  const [isLoading, setisLoading] = useState(false);
  const handleClose = () => {
    setShow(false);
    setStateId("");
    setCityIds([]);
  };

  const handleClose2 = () => {
    setShow2(false);
  };
  const handleClose6 = () => {
    setShow6(false);
  };

  const handleClose3 = () => {
    setShow3(false);
  };

  const handleClose4 = () => {
    setShow4(false);
  };
  const handleClose5 = () => {
    setShow5(false);
  };

  const handleVendorAssetClose = () => {
    setShowVendorAsset(false);
  };

  const handleVendorAgencyClose = () => {
    setShowVendorAgency(false);
  };
  const getState = async () => {
    await fetchData(
      `/db/area/states?cnt_id=101`,
      setStatelist,
      errorToast,
      setErrorToast
    );
  };

  const getCity = async (id) => {
    await fetchData(
      `/db/area/city?st_id=${id}`,
      (data) => setCitylist(data.cityData),
      errorToast,
      setErrorToast
    );
  };

  async function getBusinessTypeList() {
    await fetchData(
      `/db/media/campaign/campaignBusinessType/getCampaignBusinessType`,
      setBusinessTypeList,
      errorToast,
      setErrorToast
    );
  }

  const getSiteList = async () => {
    if (!stateId) {
      return toast.warning("Please Select State");
    }
    if (cityIds.length < 1) {
      return toast.warning("Please Select City");
    }

    const params = { city_id: cityIds };
    const queryString = new URLSearchParams(params).toString();

    await fetchData(
      `/db/media/siteManagement/getSite?${queryString}`,
      setSiteLists,
      errorToast,
      setErrorToast
    );

    handleClose();
    setShow2(true);
  };

  const addAssetInSite = async (formattedSites) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimationAssetBusiness/addEstimationAssetBusiness`,
          {
            estimate_id: estimationId,
            sites: formattedSites,
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setisLoading(false);
          handleClose2();
          setSelectedSites();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };

  const sentForApproval = async (estimate_id) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimation/sendMailForApproval/`,
          {
            estimate_id: estimate_id,
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getContactList()
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };


  const accept_rejectApproval = async (estimate_id,status) => {
    if (hasCookie("token")) {
      setisLoading(true);
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/estimation/approveEstimate`,
          {
            estimate_id: estimate_id,
            approval:status
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getContactList()
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setisLoading(false);
      }
    }
  };


  useEffect(() => {
    getBusinessTypeList();
  }, []);

  useEffect(() => {
    getCity(stateId);
  }, [stateId]);

  const columns = [
    {
      name: "campaign_name",
      label: "Campaign Name",
      options: { filter: true },
    },  
    {
      name: "estimate_type",
      label: "Estimated Type",
      options: { filter: true },
    },
    {
      name: "business_type",
      label: "Business Type",
      options: {
        filter: true,
        customBodyRender: (value) => {
          return (
            busiessTypeList.find((item) => item.cmpn_b_t_id === value)
              ?.cmpn_b_t_name || ""
          );
        },
      },
    },
    {
      name: "estimate_id",
      label: "Action",
      options: {
        filter: false,
        download: false,
        customBodyRender: (value, tableMeta) => {
          return (
            <div className="table_btns">
              <Link href={`/media/AddEstimations?id=${value}&vw=mds`}>
                <button className="action_btn" title="View">
                  <ViewIcon />
                </button>
              </Link>
              <Link href={`/media/AddEstimations?id=${value}`}>
                <button className="action_btn" title="Edit">
                  <EditIcon />
                </button>
              </Link>
              <button
                className="action_btn"
                onClick={() => openConfirmBox(value)}
                title="Remove"
              >
                <DeleteIcon />
              </button>
              {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Asset" && userInfo?.role_id==5 && (
                <button
                  className=""
                  style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                  onClick={() => {
                    setEstimationId(tableMeta?.rowData[3]);
                    getState();
                    setShow(true);
                  }}
                  title="Offer Asset Site"
                >
                  Offer Site
                </button>
              )}

              {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Asset" && userInfo?.role_id==5 && (
                <>
                  <button
                    className=""
                    style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                    onClick={() => {
                      setEstimationId(tableMeta?.rowData[3]);
                      getState();
                      setShow5(true);
                    }}
                    title="Client Cost Sheet Update"
                  >
                    Client Cost Sheet 
                  </button>
                </>
              )}

              {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Asset" && userInfo?.role_id==6 && (
                <>
                  <button
                    className=""
                    style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                    onClick={() => {
                      setEstimationId(tableMeta?.rowData[3]);
                      getState();
                      setShowVendorAsset(true);
                    }}
                    title="Vendor Cost Sheet Update"
                  >
                    Vendor Cost Sheet
                  </button>
                </>
              )}

              {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Agency" && userInfo?.role_id==5 && (
                <button
                  className=""
                  style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                  onClick={() => {
                    setEstimationId(tableMeta?.rowData[3]);

                    setShow3(true);
                  }}
                  title="Offer Agency Site"
                >
                  Offer Site
                </button>
              )}
              {/* {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Agency" && userInfo?.role_id==5 (
                <button
                  className=""
                  style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                  onClick={() => {
                    setEstimationId(tableMeta?.rowData[3]);

                    setShow4(true);
                  }}
                  title="Upload Site"
                >
                  Upload Site
                </button>
              )} */}

              {busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Agency" && userInfo?.role_id==5 && (
                <>
                  <button
                    className=""
                    style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                    onClick={() => {
                      setEstimationId(tableMeta?.rowData[3]);
                      getState();
                      setShow6(true);
                    }}
                    title="Client Cost Sheet Update"
                  >
                    Client Cost Sheet
                  </button>
                </>
              )}

{busiessTypeList.find(
                (item) => item.cmpn_b_t_id === tableMeta.rowData[2]
              )?.cmpn_b_t_name === "Agency" && userInfo?.role_id==6 && (
                <>
                  <button
                    className=""
                    style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                    onClick={() => {
                      setEstimationId(tableMeta?.rowData[3]);
                      getState();
                      setShowVendorAgency(true);
                    }}
                    title="Vendor Cost Sheet Update"
                  >
                    Vendor Cost Sheet
                  </button>
                </>
              )}
              
              
              {
                userInfo?.role_id==5 && (
              <button 
              className="" 
              style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
              title="Sent For Approval"
              onClick={()=>{
                sentForApproval(value)
              }}
               
              >
                Sent For Approval
              </button>
                )
              }
              {
                (userInfo?.role_id==4 || userInfo?.role_id==7) && (
                  <>
                  
              <button 
              className="action_btn" 
              title="Accept"
              onClick={()=>{
                accept_rejectApproval(value,"true")
              }}
               
              >
                <AcceptIcon/>
              </button>

              <button 
              className="action_btn" 
              title="Reject"
              onClick={()=>{
                accept_rejectApproval(value,"false")
              }}
               
              >
                <RejectIcon />
              </button>
                  </>
                )
              }
              {
                userInfo?.role_id==5 && (
              <Link href={`/media/PorformaInvoice?est_id=${value}`}>
              <button
                className=""
                style={{height:"fit-content",width:"fit-content",border:"2px solid #d2ddff",backgroundColor:"#e9eefe",marginRight:"7px"}}
                title="Download Performa Invoice"
              >
                Invoice
              </button>
              </Link>
                )
              }


              {/* <button className="action_btn" title="Upload Site" onClick={()=>{setShow4(true)}}>
                  <EditIcon />
                </button> */}
            </div>
          );
        },
      },
    },
  ];

  const handleSelectSite = (site_id) => {
    setSelectedSites((prevSelected) =>
      prevSelected.includes(site_id)
        ? prevSelected.filter((id) => id !== site_id)
        : [...prevSelected, site_id]
    );
  };

  const options = {
    selectableRows: "none",
    responsive: "standard",
    downloadOptions: { filename: "ContactList.csv" },
  };

  const mappedDataList = accountsList?.map((list) => ({
    campaign_name: list?.db_media_campaign?.campaign_name,
    estimate_type: list?.estimate_type,
    estimate_id: list?.estimate_id,
    business_type: list?.db_media_campaign?.cmpn_b_t_id,
  }));

  return (
    <>
      {loader ? (
        <Loader />
      ) : (
        <div className="miuiTable">
          <MUIDataTable
            title={title}
            data={mappedDataList}
            columns={columns}
            options={options}
          />
        </div>
      )}

      <ModelAssetSite1
        show={show}
        handleClose={handleClose}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
      />

      <ModelClientCostAsset
        show={show5}
        handleClose={handleClose5}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimationId}
      />

      <ModelVendorCostAsset
        show={showVendorAsset}
        handleClose={handleVendorAssetClose}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimationId}
      />

      <ModelVendorCostAgency
        show={showVendorAgency}
        handleClose={handleVendorAgencyClose}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimationId}
      />

      <ModelClientCostAgency
        show={show6}
        handleClose={handleClose6}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimationId}
      />

      <ModelAgencySiteUpload
        show={show4}
        handleClose={handleClose4}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        estimateId={estimationId}
        cityIds={cityIds}
      />

      <ModelAgencySite
        show={show3}
        handleClose3={handleClose3}
        stateList={stateList}
        setStateId={setStateId}
        setCityIds={setCityIds}
        cityList={cityList}
        getSiteList={getSiteList}
        stateId={stateId}
        cityIds={cityIds}
        estimateId={estimationId}
      />

      <ModelAssetSite2
        show2={show2}
        handleClose2={handleClose2}
        siteLists={siteLists}
        isLoading={isLoading}
        selectedSites={selectedSites}
        handleSelectSite={handleSelectSite}
        addAssetInSite={addAssetInSite}
      />
    </>
  );
};

export default EstimationTable;
