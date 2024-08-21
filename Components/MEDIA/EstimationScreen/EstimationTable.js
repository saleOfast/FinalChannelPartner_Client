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

const EstimationTable = ({ accountsList, openConfirmBox, title, loader }) => {
  const [errorToast, setErrorToast] = useState({});
  const [busiessTypeList, setBusinessTypeList] = useState([]);
  const [stateList, setStatelist] = useState([]);
  const [cityList, setCitylist] = useState([]);
  const [stateId, setStateId] = useState("");
  const [cityIds, setCityIds] = useState([]);
  const [siteLists, setSiteLists] = useState([]);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [selectedSites, setSelectedSites] = useState([]);

  const handleClose = () => {
    setShow(false);
    setStateId("");
    setCityIds([]);
  };

  const handleClose2 = () => {
    setShow2(false);
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
          return busiessTypeList.find(
            (item) => item.cmpn_b_t_id === value
          )?.cmpn_b_t_name || "";
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
              )?.cmpn_b_t_name === "Asset" && (
                <button
                  className="action_btn"
                  onClick={() => {
                    getState();
                    setShow(true);
                  }}
                  title="Offer Asset Site"
                >
                  <DisableIcon />
                </button>
              )}
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
      <Modal className="commonModal" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Offer Asset Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="state">State *</label>
                  <Select
                    id="state"
                    value={stateList
                      .map((item) => ({
                        value: item.state_id,
                        label: item.state_name,
                      }))
                      .find((option) => option.value === stateId)}
                    options={stateList.map((state) => ({
                      value: state.state_id,
                      label: state.state_name,
                    }))}
                    onChange={(e) => {
                      setStateId(e.value);
                      setCityIds([]);
                    }}
                    placeholder="Select State"
                  />
                </div>
              </div>
              <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                <div className="input_box">
                  <label htmlFor="cities">Cities *</label>
                  <Select
                    id="cities"
                    isMulti
                    value={cityList
                      .filter((city) => cityIds.includes(city.city_id))
                      .map((city) => ({
                        value: city.city_id,
                        label: city.city_name,
                      }))}
                    options={cityList.map((city) => ({
                      value: city.city_id,
                      label: city.city_name,
                    }))}
                    onChange={(selectedOptions) => {
                      setCityIds(selectedOptions.map((option) => option.value));
                    }}
                    placeholder="Select Cities"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={getSiteList}>
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal className="commonModal" show={show2} onHide={handleClose2} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Offer Asset Site</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {siteLists.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Select</th>
                  <th>Site ID</th>
                  <th>State</th>
                  <th>City</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Media Format</th>
                  <th>Media Vehicle</th>
                  <th>Media Type</th>
                  <th>Quantity</th>
                  <th>Height (Ft.)</th>
                  <th>Width (Ft.)</th>
                  <th>Total Sq. Ft.</th>
                </tr>
              </thead>
              <tbody>
                {siteLists.map((site) => (
                  <tr key={site.site_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedSites.includes(site.site_id)}
                        onChange={() => handleSelectSite(site.site_id)}
                      />
                    </td>
                    <td>{site.site_id}</td>
                    <td>{site?.db_state?.state_name}</td>
                    <td>{site?.db_city?.city_name}</td>
                    <td>{site.location}</td>
                    <td>{site?.db_site_category?.site_cat_name}</td>
                    <td>{site?.db_media_format?.m_f_name}</td>
                    <td>{site?.db_media_vehicle?.m_v_name}</td>
                    <td>{site?.db_media_type?.m_t_name}</td>
                    <td>{site.quantity}</td>
                    <td>{site.height}</td>
                    <td>{site.width}</td>
                    <td>{site.total_area}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No sites available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              const formattedSites = selectedSites.map((site_id) => ({
                site_id,
                status: true,
              }));
              
              console.log(formattedSites);
            }}
          >
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EstimationTable;

