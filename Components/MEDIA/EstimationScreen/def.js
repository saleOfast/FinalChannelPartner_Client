// 1
// import React, { useState ,useEffect} from 'react';
// import { fetchData } from "../../../Utils/getReq";
// import { hasCookie, getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import { Button, Modal } from 'react-bootstrap';
// import Select from 'react-select';

// const ModelUpdateVendorCostAsset = ({
//   show,
//   handleClose,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   stateId,
//   cityIds,
//   estimateId,
//   selectedSite
// }) => {
//   const [formData, setFormData] = useState({
//     siteCode: '',
//     location: '',
//     category: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     width: '',
//     height: '',
//     total: '',
//     campaignStartDate: '',
//     campaignEndDate: '',
//     campaignDuration: '',
//     displayCostPerMonth: '',
//     sellingPriceAsPerDuration: '',
//     finalClientPOCost: '',
//     mountingCostPerSqFt: '',
//     mountingCost: '',
//     printingCostPerSqFt: '',
//     printingCost: '',
//     remarks: '',
//   });
//   const [assetSiteLists, setAssetSiteLists] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Convert numeric values to numbers
//     const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
//                         name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
//                         name === 'printingCostPerSqFt'
//                         ? parseFloat(value) || ''
//                         : value;

//     // Update formData state
//     const newFormData = {
//       ...formData,
//       [name]: parsedValue,
//     };

//     // If width or height changes, update total
//     if (name === 'width' || name === 'height') {
//       const width = parseFloat(newFormData.width) || 0;
//       const height = parseFloat(newFormData.height) || 0;
//       newFormData.total = (width * height).toFixed(2); // Update total
//     }

//     setFormData(newFormData);
//   };

//   async function getAssetSites() {
//     await fetchData(
//       `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
//       setAssetSiteLists,
//       errorToast,
//       setErrorToast
//     );
//   }

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch('https://dummyapi.com/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log('Update successful:', data);
//       handleClose(); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };
//   useEffect(()=>{
//     getAssetSites()
//     console.log("asucc",selectedSite)
//   },[])

//   return (
//     <>
//       <Modal show={show} onHide={handleClose} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>vendor Cost Sheet(Asset)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               {[{label:'Site Code',name:'siteCode', type: 'number',disabled:true},
//               {label:'State',name:'state', disabled: true},
//               {label:'City',name:'city', disabled: true},
//               { label: 'Location', name: 'location', disabled: true },
//               { label: 'Category', name: 'category', disabled: true },
//               { label: 'Media Format', name: 'mediaFormat', disabled: true },
//               { label: 'Media Vehicle', name: 'mediaVehicle', disabled: true },
//               { label: 'Media Type', name: 'mediaType', disabled: true },
//                 { label: 'Quantity', name: 'quantity', type: 'text',disabled: true },
//                 { label: 'Width (Ft.)', name: 'width', type: 'text',disabled: true },
//                 { label: 'Height (Ft.)', name: 'height', type: 'text',disabled: true },
//                 { label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true },
//                 { label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date',disabled: true },
//                 { label: 'Campaign End Date', name: 'campaignEndDate', type: 'date',disabled: true },
//                 { label: 'Campaign Duration', name: 'campaignDuration', disabled:true },
//                 { label: 'Display Vendor Name', name: 'displayVendorName', disabled:true },

//                 { label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true },
//                 { label: 'Buying price as per duration ', name: 'BuyingPriceAsPerDuration ', disabled:true },
//                 { label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number' },
//                 { label: 'Mounting Vendor', name: 'mountingVendor', type: 'text' },

//                 { label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number' },
//                 { label: 'Mounting Cost', name: 'mountingCost', disabled: true  },
//                 { label: 'Printing Vendor', name: 'printingVendor' },
//                 { label: 'Printing Material', name: 'printingMaterial'  },
//                 { label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number' },
//                 { label: 'Printing Cost', name: 'printingCost', disabled: true },
//                 { label: 'Remarks', name: 'remarks' }
//               ].map((field, index) => (
//                 <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className="input_box">
//                     <label htmlFor={field.name}>{field.label}</label>
//                     <input
//                       type={field.type || 'text'}
//                       name={field.name}
//                       id={field.name}
//                       placeholder={`Enter ${field.label}`}
//                       className="form-control"
//                       onChange={handleChange}
//                       value={formData[field.name] || ''}
//                       disabled={field.disabled || false}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelUpdateVendorCostAsset;

//2
// import React, { useState, useEffect } from 'react';
// import { fetchData } from "../../../Utils/getReq";
// import { Button, Modal } from 'react-bootstrap';
// import { hasCookie, getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import Select from 'react-select';
// import { Baseurl } from "../../../Utils/Constants";
// import axios from "axios";

// const ModelUpdateVendorCostAsset = ({
//   show,
//   handleClose,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   stateId,
//   cityIds,
//   estimateId,
//   selectedSite
// }) => {
//   const [formData, setFormData] = useState({
//     siteCode: '',
//     location: '',
//     category: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     width: '',
//     height: '',
//     total: '',
//     campaignStartDate: '',
//     campaignEndDate: '',
//     campaignDuration: '',
//     displayCostPerMonth: '',
//     sellingPriceAsPerDuration: '',
//     finalClientPOCost: '',
//     mountingCostPerSqFt: '',
//     mountingCost: '',
//     printingCostPerSqFt: '',
//     printingCost: '',
//     remarks: '',
//   });

//   const [assetSiteLists, setAssetSiteLists] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);

//   // Options for Select fields
//   const [vendorOptions, setVendorOptions] = useState([]);
//   const [materialOptions, setMaterialOptions] = useState([]);
//   const[loader,setLoader]=useState(false);
//   const [dataList, setDataList] = useState([]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Convert numeric values to numbers
//     const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
//                         name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
//                         name === 'printingCostPerSqFt'
//                         ? parseFloat(value) || ''
//                         : value;

//     // Update formData state
//     const newFormData = {
//       ...formData,
//       [name]: parsedValue,
//     };

//     // If width or height changes, update total
//     if (name === 'width' || name === 'height') {
//       const width = parseFloat(newFormData.width) || 0;
//       const height = parseFloat(newFormData.height) || 0;
//       newFormData.total = (width * height).toFixed(2); // Update total
//     }

//     setFormData(newFormData);
//   };

//   const handleSelectChange = (name, selectedOption) => {
//     setFormData({
//       ...formData,
//       [name]: selectedOption ? selectedOption.value : ''
//     });
//   };

//   async function getAssetSites() {
//     await fetchData(
//       `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
//       setAssetSiteLists,
//       errorToast,
//       setErrorToast
//     );
//   }

//   const handleUpdate = async () => {
//     try {
//       const response = await fetch('https://dummyapi.com/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log('Update successful:', data);
//       handleClose(); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

//   const getDataList = async () => {
//     setLoader(true)
//     if (hasCookie("token")) {
//       let token = getCookie("token");
//       let db_name = getCookie("db_name");

//       let header = {
//         headers: {
//           Accept: "application/json",
//           Authorization: "Bearer ".concat(token),
//           db: db_name,
//           m_id: 14,

//         },
//       };

//       try {
//         const response = await axios.get(Baseurl + `/db/media/mountingCost/getMountingCost`, header);
//         console.log("response ",response)
//         if(response?.status==200|| response?.status==201){
//           setLoader(false)
//         //   setDataList(response?.data?.data);
//         //   console.log("mounag",dataList)

//         console.log("mountingcostdat is ",response.data.data)

//         const filteredData = response.data.data.filter(item =>
//             item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id &&
//             item.db_account.bill_state === selectedSite.db_site.db_state.state_id
//           );

//           // Extract acc_name from filtered data
//         //   const accNames = filteredData.map(item => item.acc_name);
//         const accNames = filteredData.map(item => ({
//             value: item.acc_name,
//             label: item.acc_name,
//           }));

//           console.log("Filtered Account Names: ", accNames);
//           setDataList(filteredData);
//           setVendorOptions(accNames); // Set vendor options to accNames

//         }
//       } catch (error) {
//         setLoader(false)
//         if (error?.response?.data?.message) {
//           toast.error(error.response.data.message);
//         } else {
//           toast.error("Something went wrong!");
//         }
//       }
//     }
//   };

//   useEffect(() => {
//      if (show && selectedSite) {
//       setFormData({
//         siteCode: selectedSite?.site_id || '',
//         state:selectedSite?.db_site?.db_state?.state_name || '',
//         city:selectedSite?.db_site?.db_city?.city_name || '',

//         location: selectedSite?.db_site?.location || '',
//         category: selectedSite?.db_site?.db_site_category?.site_cat_name || '',
//         mediaFormat: selectedSite?.db_site?.db_media_format?.m_f_name|| '',
//         mediaVehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || '',
//         mediaType: selectedSite?.db_site?.db_media_type?.m_t_name || '',
//         quantity: selectedSite?.db_site.quantity || '',
//         width:selectedSite?.db_site.width || '',
//         height:selectedSite?.db_site.height || '',
//         total: (selectedSite?.db_site.width *selectedSite?.db_site.height).toFixed(2) || '',
//         campaignStartDate: selectedSite.campaignStartDate || '',
//         campaignEndDate: selectedSite.campaignEndDate || '',
//         campaignDuration: selectedSite.campaignDuration || '',
//         displayCostPerMonth: selectedSite.displayCostPerMonth || '',
//         sellingPriceAsPerDuration: selectedSite.sellingPriceAsPerDuration || '',
//         finalClientPOCost: selectedSite.finalClientPOCost || '',
//         mountingCostPerSqFt: selectedSite.mountingCostPerSqFt || '',
//         mountingCost: selectedSite.mountingCost || '',
//         printingCostPerSqFt: selectedSite.printingCostPerSqFt || '',
//         printingCost: selectedSite.printingCost || '',
//         remarks: selectedSite?.db_site?.remarks || '',
//       });
//     }

//     getDataList();

//     console.log("agjg",selectedSite)
//   }, [show, selectedSite]);

//   useEffect(() => {
//     // Fetch vendor and material options (replace with actual fetching logic)
//     setVendorOptions([
//       { value: 'vendor1', label: 'Vendor 1' },
//       { value: 'vendor2', label: 'Vendor 2' },
//       // Add more vendor options as needed
//     ]);

//     setMaterialOptions([
//       { value: 'material1', label: 'Material 1' },
//       { value: 'material2', label: 'Material 2' },
//       // Add more material options as needed
//     ]);
//   }, []);

//   return (
//     <>
//       <Modal show={show} onHide={handleClose} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Vendor Cost Sheet (Asset)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               {[
//                 {label:'Site Code', name:'siteCode', type: 'number', disabled:true},
//                 {label:'State', name:'state', disabled: true,type:"text"},
//                 {label:'City', name:'city', disabled: true,type:"text"},
//                 {label: 'Location', name: 'location', disabled: true,type:"text"},
//                 {label: 'Category', name: 'category', disabled: true,type:"text"},
//                 {label: 'Media Format', name: 'mediaFormat', disabled: true,type:"text"},
//                 {label: 'Media Vehicle', name: 'mediaVehicle', disabled: true,type:"text"},
//                 {label: 'Media Type', name: 'mediaType', disabled: true,type:"text"},
//                 {label: 'Quantity', name: 'quantity', type: 'text', disabled: true},
//                 {label: 'Width (Ft.)', name: 'width', type: 'text', disabled: true},
//                 {label: 'Height (Ft.)', name: 'height', type: 'text', disabled: true},
//                 {label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true},
//                 {label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date', disabled: true},
//                 {label: 'Campaign End Date', name: 'campaignEndDate', type: 'date', disabled: true},
//                 {label: 'Campaign Duration', name: 'campaignDuration', disabled:true,type:"text"},
//                 {label: 'Display Vendor Name', name: 'displayVendorName', disabled:true,type:"text"},
//                 {label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true,type:"text"},
//                 {label: 'Buying Price as Per Duration ', name: 'BuyingPriceAsPerDuration ', disabled:true,type:"text"},
//                 {label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number'},
//                 {label: 'Mounting Vendor', name: 'mountingVendor', type: 'select'},
//                 {label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number'},
//                 {label: 'Mounting Cost', name: 'mountingCost', disabled: true,type:'number'},
//                 {label: 'Printing Vendor', name: 'printingVendor', type: 'select'},
//                 {label: 'Printing Material', name: 'printingMaterial', type: 'select'},
//                 {label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number'},
//                 {label: 'Printing Cost', name: 'printingCost', disabled: true,type:"number"},
//                 {label: 'Remarks', name: 'remarks'}
//               ].map((field, index) => (
//                 <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className="input_box">
//                     <label htmlFor={field.name}>{field.label}</label>
//                     {field.type === 'select' ? (
//                     //   <Select
//                     //     id={field.name}
//                     //     name={field.name}
//                     //     options={field.name === 'mountingVendor' ? vendorOptions :
//                     //               field.name === 'printingVendor' ? vendorOptions :
//                     //               field.name === 'printingMaterial' ? materialOptions : []}
//                     //     onChange={(selectedOption) => handleSelectChange(field.name, selectedOption)}
//                     //     value={(formData[field.name] && { value: formData[field.name], label: formData[field.name] }) || null}
//                     //     isDisabled={field.disabled || false}
//                     //   />
//                     <Select
//                         id={field.name}
//                         name={field.name}
//                         options={field.name === 'mountingVendor' ? vendorOptions : materialOptions}
//                         onChange={(selectedOption) => handleSelectChange(field.name, selectedOption)}
//                         value={(formData[field.name] && { value: formData[field.name], label: formData[field.name] }) || null}
//                         isDisabled={field.disabled || false}
//                       />
//                     ) : (
//                       <input
//                         type={field.type || 'text'}
//                         name={field.name}
//                         id={field.name}
//                         placeholder={`Enter ${field.label}`}
//                         className="form-control"
//                         onChange={handleChange}
//                         value={formData[field.name] || ''}
//                         disabled={field.disabled || false}
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelUpdateVendorCostAsset;

//3
// import React, { useState, useEffect } from 'react';
// import { fetchData } from "../../../Utils/getReq";
// import { Button, Modal } from 'react-bootstrap';
// import { hasCookie, getCookie } from "cookies-next";
// import { toast } from "react-toastify";
// import Select from 'react-select';
// import { Baseurl } from "../../../Utils/Constants";
// import axios from "axios";

// const ModelUpdateVendorCostAsset = ({
//   show,
//   handleClose,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   stateId,
//   cityIds,
//   estimateId,
//   selectedSite
// }) => {
//   const [formData, setFormData] = useState({
//     siteCode: '',
//     location: '',
//     category: '',
//     mediaFormat: '',
//     mediaVehicle: '',
//     mediaType: '',
//     quantity: '',
//     width: '',
//     height: '',
//     total: '',
//     campaignStartDate: '',
//     campaignEndDate: '',
//     campaignDuration: '',
//     displayCostPerMonth: '',
//     sellingPriceAsPerDuration: '',
//     finalClientPOCost: '',
//     mountingCostPerSqFt: '',
//     mountingCost: '',
//     printingCostPerSqFt: '',
//     printingCost: '',
//     remarks: '',
//     mountingVendor: '', // Added to track selected mounting vendor
//   });

//   const [assetSiteLists, setAssetSiteLists] = useState([]);
//   const [errorToast, setErrorToast] = useState(false);

//   // Options for Select fields
//   const [vendorOptions, setVendorOptions] = useState([]);
//   const [materialOptions, setMaterialOptions] = useState([]);
//   const [loader, setLoader] = useState(false);
//   const [dataList, setDataList] = useState([]);
//   const [accountList, setAccountsList] = useState([]);

//   // Handle change in input fields
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
//                         name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
//                         name === 'printingCostPerSqFt'
//                         ? parseFloat(value) || ''
//                         : value;

//     const newFormData = {
//       ...formData,
//       [name]: parsedValue,
//     };

//     if (name === 'width' || name === 'height') {
//       const width = parseFloat(newFormData.width) || 0;
//       const height = parseFloat(newFormData.height) || 0;
//       newFormData.total = (width * height).toFixed(2);
//     }

//     setFormData(newFormData);
//   };

//   // Handle change in select fields
//   const handleSelectChange = (name, selectedOption) => {
//     setFormData({
//       ...formData,
//       [name]: selectedOption ? selectedOption.value : ''
//     });
//   };

//   // Fetch asset sites
//   async function getAssetSites() {
//     await fetchData(
//       `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
//       setAssetSiteLists,
//       errorToast,
//       setErrorToast
//     );
//   }

//   // Update data on save
//   const handleUpdate = async () => {
//     try {
//       const response = await fetch('https://dummyapi.com/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }

//       const data = await response.json();
//       console.log('Update successful:', data);
//       handleClose(); // Close the modal after successful update
//     } catch (error) {
//       console.error('Error updating data:', error);
//     }
//   };

//   const getContactList = async () => {
//     setLoader(true)
//     if (hasCookie('token')) {
//         let token = (getCookie('token'));
//         let db_name = (getCookie('db_name'));

//         let header = {
//             headers: {
//                 Accept: "application/json",
//                 Authorization: "Bearer ".concat(token),
//                 db: db_name,
//                 m_id: 320,
//             }
//         }
//         try {
//             const response = await axios.get(Baseurl + `/db/media/printingCost/getPrintingCost`, header);
//             if(response?.status==200 || response?.status==201){
//                 setLoader(false)
//                 setAccountsList(response?.data?.data);
//                 console.log("pringong",response?.data?.data)
//             }
//         } catch (error) {
//             setLoader(false)
//             if (error?.response?.data?.message) {
//                 toast.error(error.response.data.message);
//             }
//             else {
//                 toast.error('Something went wrong prin!')
//             }
//         }
//     }
// }

//   // Fetch data list (mounting cost options)
//   const getDataList = async () => {
//     setLoader(true);
//     if (hasCookie("token")) {
//       let token = getCookie("token");
//       let db_name = getCookie("db_name");

//       let header = {
//         headers: {
//           Accept: "application/json",
//           Authorization: "Bearer ".concat(token),
//           db: db_name,
//           m_id: 14,
//         },
//       };

//       try {
//         const response = await axios.get(Baseurl + `/db/media/mountingCost/getMountingCost`, header);
//         if (response?.status === 200 || response?.status === 201) {
//           setLoader(false);
//           console.log("rshfl",response.data.data)
//           const filteredData = response.data.data.filter(item =>
//             item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id &&
//             item.db_account.bill_state === selectedSite.db_site.db_state.state_id
//           );

//           const accNames = filteredData.map(item => ({
//             value: item.acc_name,
//             label: item.acc_name,
//           }));

//           setDataList(filteredData);
//           setVendorOptions(accNames);
//         }
//       } catch (error) {
//         setLoader(false);
//         if (error?.response?.data?.message) {
//           toast.error(error.response.data.message);
//         } else {
//           toast.error("Something went wrong!");
//         }
//       }
//     }
//   };

//   // Update formData based on selectedSite and fetch data
//   useEffect(() => {
//     if (show && selectedSite) {
//       setFormData({
//         siteCode: selectedSite?.site_id || '',
//         state: selectedSite?.db_site?.db_state?.state_name || '',
//         city: selectedSite?.db_site?.db_city?.city_name || '',
//         location: selectedSite?.db_site?.location || '',
//         category: selectedSite?.db_site?.db_site_category?.site_cat_name || '',
//         mediaFormat: selectedSite?.db_site?.db_media_format?.m_f_name || '',
//         mediaVehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || '',
//         mediaType: selectedSite?.db_site?.db_media_type?.m_t_name || '',
//         quantity: selectedSite?.db_site.quantity || '',
//         width: selectedSite?.db_site.width || '',
//         height: selectedSite?.db_site.height || '',
//         total: (selectedSite?.db_site.width * selectedSite?.db_site.height).toFixed(2) || '',
//         campaignStartDate: selectedSite.campaignStartDate || '',
//         campaignEndDate: selectedSite.campaignEndDate || '',
//         campaignDuration: selectedSite.campaignDuration || '',
//         displayCostPerMonth: selectedSite.displayCostPerMonth || '',
//         sellingPriceAsPerDuration: selectedSite.sellingPriceAsPerDuration || '',
//         finalClientPOCost: selectedSite.finalClientPOCost || '',
//         mountingCostPerSqFt: selectedSite.mountingCostPerSqFt || '',
//         mountingCost: selectedSite.mountingCost || '',
//         printingCostPerSqFt: selectedSite.printingCostPerSqFt || '',
//         printingCost: selectedSite.printingCost || '',
//         remarks: selectedSite?.db_site?.remarks || '',
//         mountingVendor: '', // Reset mountingVendor
//       });
//     }

//     getDataList();
//     getContactList();
//   }, [show, selectedSite]);

//   // Effect to update mounting cost per sq ft based on selected mounting vendor
//   useEffect(() => {
//     if (formData.mountingVendor && dataList.length) {
//       const selectedVendor = dataList.find(item => item.acc_name === formData.mountingVendor);
//       if (selectedVendor) {
//         setFormData(prevData => ({
//           ...prevData,
//           mountingCostPerSqFt: selectedVendor.mo_c_cost || ''
//         }));
//       }
//     }
//   }, [formData.mountingVendor, dataList]);

//   // Fetch vendor and material options on mount
//   useEffect(() => {
//     setVendorOptions([
//       { value: 'vendor1', label: 'Vendor 1' },
//       { value: 'vendor2', label: 'Vendor 2' },
//     ]);

//     setMaterialOptions([
//       { value: 'material1', label: 'Material 1' },
//       { value: 'material2', label: 'Material 2' },
//     ]);
//   }, []);

//   return (
//     <>
//       <Modal show={show} onHide={handleClose} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Vendor Cost Sheet (Asset)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               {[
//                 { label: 'Site Code', name: 'siteCode', type: 'number', disabled: true },
//                 { label: 'State', name: 'state', disabled: true, type: "text" },
//                 { label: 'City', name: 'city', disabled: true, type: "text" },
//                 { label: 'Location', name: 'location', disabled: true, type: "text" },

//                 { label: 'Category', name: 'category', disabled: true, type: "text" },
//                 { label: 'Media Format', name: 'mediaFormat', disabled: true, type: "text" },
//                 { label: 'Media Vehicle', name: 'mediaVehicle', disabled: true, type: "text" },
//                 { label: 'Media Type', name: 'mediaType', disabled: true, type: "text" },
//                 { label: 'Quantity', name: 'quantity', type: 'text', disabled: true },
//                 { label: 'Width (Ft.)', name: 'width', type: 'text', disabled: true },
//                 { label: 'Height (Ft.)', name: 'height', type: 'text', disabled: true },
//                 { label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true },
//                 { label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date', disabled: true },
//                 { label: 'Campaign End Date', name: 'campaignEndDate', type: 'date', disabled: true },
//                 { label: 'Campaign Duration', name: 'campaignDuration', disabled: true, type: "text" },
//                 { label: 'Display Vendor Name', name: 'displayVendorName', disabled: true, type: "text" },
//                 { label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled: true, type: "text" },
//                 { label: 'Buying Price as Per Duration', name: 'BuyingPriceAsPerDuration', disabled: true, type: "text" },
//                 { label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number' },
//                 { label: 'Mounting Vendor', name: 'mountingVendor', type: 'select' },
//                 { label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number' },
//                 { label: 'Mounting Cost', name: 'mountingCost', disabled: true, type: 'number' },
//                 { label: 'Printing Vendor', name: 'printingVendor', type: 'select' },
//                 { label: 'Printing Material', name: 'printingMaterial', type: 'select' },
//                 { label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number' },
//                 { label: 'Printing Cost', name: 'printingCost', disabled: true, type: "number" },
//                 { label: 'Remarks', name: 'remarks' }
//               ].map((field, index) => (
//                 <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
//                   <div className="input_box">
//                     <label htmlFor={field.name}>{field.label}</label>
//                     {field.type === 'select' ? (
//                       <Select
//                         id={field.name}
//                         name={field.name}
//                         options={field.name === 'mountingVendor' ? vendorOptions : materialOptions}
//                         onChange={(selectedOption) => handleSelectChange(field.name, selectedOption)}
//                         value={(formData[field.name] && { value: formData[field.name], label: formData[field.name] }) || null}
//                         isDisabled={field.disabled || false}
//                       />
//                     ) : (
//                       <input
//                         type={field.type || 'text'}
//                         name={field.name}
//                         id={field.name}
//                         placeholder={`Enter ${field.label}`}
//                         className="form-control"
//                         onChange={handleChange}
//                         value={formData[field.name] || ''}
//                         disabled={field.disabled || false}
//                       />
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="primary" onClick={handleUpdate}>
//             Update
//           </Button>
//           <Button variant="secondary" onClick={handleClose}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };

// export default ModelUpdateVendorCostAsset;

//4
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import Select from "react-select";
import axios from "axios";
import { fetchData } from "../../../Utils/getReq";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import { Baseurl } from "../../../Utils/Constants";
import moment from "moment";

const ModelUpdateVendorCostAsset = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  stateId,
  cityIds,
  estimateId,
  selectedSite,
}) => {
  const [formData, setFormData] = useState({
    siteCode: "",
    location: "",
    category: "",
    mediaFormat: "",
    mediaVehicle: "",
    mediaType: "",
    quantity: "",
    width: "",
    height: "",
    total: "",
    campaignStartDate: "",
    campaignEndDate: "",
    campaignDuration: "",
    displayCostPerMonth: "",
    sellingPriceAsPerDuration: "",
    finalClientPOCost: "",
    mountingCostPerSqFt: "",
    mountingCost: "",
    printingCostPerSqFt: "",
    printingCost: "",
    remarks: "",
    mountingVendor: "",
    printingVendor: "",
    printingMaterial: "",
  });

  const [assetSiteLists, setAssetSiteLists] = useState([]);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [accountList, setAccountsList] = useState([]);
  const [printingCostList,setPrintingCostList]=useState([])
  const [printingMaterialData, setPrintingMaterialData] = useState([]);
  const [printingVendorData,setPrintingVendor]=useState([])
  const [selectedParentMaterial, setSelectedParentMaterial] = useState({});

  // Handle change in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "width" ||
      name === "height" ||
      name === "quantity" ||
      name === "finalClientPOCost" ||
      name === "mountingCostPerSqFt" ||
      name === "printingCostPerSqFt"
        ? parseFloat(value) || ""
        : value;

    const newFormData = {
      ...formData,
      [name]: parsedValue,
    };

    if (name === "width" || name === "height") {
      const width = parseFloat(newFormData.width) || 0;
      const height = parseFloat(newFormData.height) || 0;
      newFormData.total = (width * height).toFixed(2);
    }

    setFormData(newFormData);
  };

  useEffect(()=>{
    if(formData.mountingCostPerSqFt && formData.total ){
      const mountingCostPerSqFt = parseFloat(formData.mountingCostPerSqFt) || 0;
      const total = parseFloat(formData.total) || 0;
      const TotalMountingCost = (mountingCostPerSqFt * total).toFixed(2);



      setFormData({
        ...formData,mountingCost:TotalMountingCost
      }
      )
    }
 

  },[formData.mountingCostPerSqFt,formData.total])



  useEffect(()=>{
    if(formData.printingCostPerSqFt && formData.total ){
      const printingCostPerSqFt = parseFloat(formData.printingCostPerSqFt) || 0;
      const total = parseFloat(formData.total) || 0;
      const TotalPrintingCost = (printingCostPerSqFt * total).toFixed(2);



      setFormData({
        ...formData,printingCost:TotalPrintingCost
      }
      )
    }
 

  },[formData.printingCostPerSqFt,formData.total])

  // Handle change in select fields
  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : "",
    });
    // console.log(formData);
    if (name == "printingMaterial") {
      setSelectedParentMaterial(selectedOption ? selectedOption.value : null);
    }

    // console.log("printing material selected", selectedParentMaterial);
  };

  // Fetch asset sites
  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  // Update data on save
  const handleUpdate = async () => {
    try {
      const response = await fetch("https://dummyapi.com/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("Update successful:", data);
      handleClose(); // Close the modal after successful update
    } catch (error) {
      // console.error("Error updating data:", error);
    }
  };

  // Fetch mounting cost data
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
          m_id: 14,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/mountingCost/getMountingCost`,
          header
        );
        if (response?.status === 200 || response?.status === 201) {
          setLoader(false);
          const filteredData = response.data.data.filter(
            (item) =>
              item.db_media_type.m_t_id ===
                selectedSite.db_site.db_media_type.m_t_id &&
              item.db_account.bill_state ===
                selectedSite.db_site.db_state.state_id
          );

          const accNames = filteredData.map((item) => ({
            value: item.acc_name,
            label: item.acc_name,
          }));

          setDataList(filteredData);
          setVendorOptions(accNames);
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getPrintingCost = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 320,
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingCost/getPrintingCost`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          setLoader(false);
          setPrintingCostList(response?.data?.data);
          // console.log("answer 3 is",response?.data?.data)
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  // Update formData based on selectedSite and fetch data
  useEffect(() => {
    if (show && selectedSite) {
      setFormData({
        siteCode: selectedSite?.site_id || "",
        state: selectedSite?.db_site?.db_state?.state_name || "",
        city: selectedSite?.db_site?.db_city?.city_name || "",
        location: selectedSite?.db_site?.location || "",
        category: selectedSite?.db_site?.db_site_category?.site_cat_name || "",
        mediaFormat: selectedSite?.db_site?.db_media_format?.m_f_name || "",
        mediaVehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || "",
        mediaType: selectedSite?.db_site?.db_media_type?.m_t_name || "",
        quantity: selectedSite?.db_site.quantity || "",
        width: selectedSite?.db_site.width || "",
        height: selectedSite?.db_site.height || "",
        total:
          (selectedSite?.db_site.width * selectedSite?.db_site.height).toFixed(
            2
          ) || "",
        campaignStartDate: moment(selectedSite.db_estimate.db_media_campaign.campaign_start_date).format("YYYY-MM-DD") || "",
        campaignEndDate:  moment(selectedSite.db_estimate.db_media_campaign.campaign_end_date).format("YYYY-MM-DD") || "",
        campaignDuration: (selectedSite.db_estimate.db_media_campaign.campaign_duration+" months") || "0 months",
        displayCostPerMonth: selectedSite.displayCostPerMonth || "",
        sellingPriceAsPerDuration: selectedSite.sellingPriceAsPerDuration || "",
        finalClientPOCost: selectedSite.finalClientPOCost || "",
        mountingCostPerSqFt: selectedSite.mountingCostPerSqFt || "",
        mountingCost: selectedSite.mountingCost || "",
        printingCostPerSqFt: selectedSite.printingCostPerSqFt || "",
        printingCost: selectedSite.printingCost || "",
        remarks: selectedSite?.db_site?.remarks || "",
        mountingVendor: "",
        printingVendor: "",
        printingMaterial: "",
      });
    }
console.log("selecteSite is ",selectedSite)
    getDataList();
    getPrintingMaterial();
    getContactList();
    getPrintingCost();
  }, [show, selectedSite]);

  // Effect to update mounting cost per sq ft based on selected mounting vendor
  useEffect(() => {
    if (formData.mountingVendor && dataList.length) {
      const selectedVendor = dataList.find(
        (item) => item.acc_name === formData.mountingVendor
      );
      if (selectedVendor) {
        setFormData((prevData) => ({
          ...prevData,
          mountingCostPerSqFt: selectedVendor.mo_c_cost || "",
        }));
      }
    }
  }, [formData.mountingVendor, dataList]);


  const getContactList = async () => {
    setLoader(true)
    if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 320,
            }
        }
        try {
            const response = await axios.get(Baseurl + `/db/media/printingCost/getPrintingCost`, header);
            if(response?.status==200 || response?.status==201){
                setLoader(false)
                setAccountsList(response?.data?.data);
            }
        } catch (error) {
            setLoader(false)
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Something went wrong!')
            }
        }
    }
}


  useEffect(() => {
    if (formData.printingMaterial && printingMaterialData.length) {
      const selectedVendor = printingMaterialData.find(
        (item) => item?.pr_m_name === formData?.printingMaterial
      );
      if (selectedVendor) {
        // setFormData((prevData) => ({
        //   ...prevData,
        //   mountingCostPerSqFt: selectedVendor.mo_c_cost || "",
        // }));
       
        if(printingCostList){
          // console.log("answer 2 is",printingCostList,"and selected data is ",selectedSite);


const filteredDataPrinting =printingCostList.filter((item)=>
          item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id && item.db_account.bill_state === selectedSite.db_site.db_state.state_id && item.pr_m_id === selectedVendor.pr_m_id
          )

          // console.log("printing filtered data is ",filteredDataPrinting,"and selectedVendor is ",selectedVendor);



          
          const accNamesVendor = filteredDataPrinting.map((item) => ({
            value: item.acc_name,
            label: item.acc_name,
          }));

          setFormData((prevData) => ({
          ...prevData,
          printingVendor: "",
          printingCostPerSqFt:"",

        }));
          setPrintingVendor(accNamesVendor);


          // if (selectedVendor) {
          //   setFormData((prevData) => ({
          //     ...prevData,
          //     mountingCostPerSqFt: selectedVendor.mo_c_cost || "",
          //   }));
          // }

          // if (formData.printingVendor && printingCostList.length) {
          //   const selectedprintingVendor = printingCostList.find(
          //     (item) => item.acc_name === formData.printingVendor
          //   );
          //   if (selectedprintingVendor) {
          //     setFormData((prevData) => ({
          //       ...prevData,
          //       printingCostPerSqFt: selectedprintingVendor?.pr_c_cost || "",
          //     }));
          //   }
          // }
          


          // console.log("answer 4 is ",printingVendorData)
          // const filteredData = response.data.data.filter(
          //   (item) =>
          //     item.db_media_type.m_t_id ===
          //       selectedSite.db_site.db_media_type.m_t_id &&
          //     item.db_account.bill_state ===
          //       selectedSite.db_site.db_state.state_id   //seletedVendor.pr_m_id
          // );

          
        }
      }
      

      // console.log("answer is ",selectedVendor)
    }
  }, [formData.printingMaterial, printingMaterialData]);


  useEffect(() => {
    if (formData.printingVendor && printingCostList.length) {
      const selectedprintingVendor = printingCostList.find(
        (item) => item.acc_name === formData.printingVendor
      );
      if (selectedprintingVendor) {
        setFormData((prevData) => ({
          ...prevData,
          printingCostPerSqFt: selectedprintingVendor.pr_c_cost || "",
        }));
      }
    }
  }, [formData.printingVendor, printingCostList]);


  const getPrintingMaterial = async () => {
    setLoader(true);
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 342,
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/media/printingMaterial/getPrintingMaterial`,
          header
        );
        if (response?.status == 200 || response?.status == 201) {
          setLoader(false);
          const materialOptions = response.data.data.map((item) => ({
            value: item.pr_m_name,
            label: item.pr_m_name,
            pr_m_id: item.pr_m_id,
          }));
          setMaterialOptions(materialOptions);
          setPrintingMaterialData(response.data.data);

          // console.log("printing material data", printingMaterialData);

          //   setDataList(response.data.data);
          // console.log("printing material", response.data.data);
          // console.log("materaioapoption", materialOptions);
        }
      } catch (error) {
        setLoader(false);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Vendor Cost Sheet (Asset)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              {[
                {
                  label: "Site Code",
                  name: "siteCode",
                  type: "number",
                  disabled: true,
                },
                { label: "State", name: "state", disabled: true, type: "text" },
                { label: "City", name: "city", disabled: true, type: "text" },
                {
                  label: "Location",
                  name: "location",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Category",
                  name: "category",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Media Format",
                  name: "mediaFormat",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Media Vehicle",
                  name: "mediaVehicle",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Media Type",
                  name: "mediaType",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Quantity",
                  name: "quantity",
                  type: "text",
                  disabled: true,
                },
                {
                  label: "Width (Ft.)",
                  name: "width",
                  type: "text",
                  disabled: true,
                },
                {
                  label: "Height (Ft.)",
                  name: "height",
                  type: "text",
                  disabled: true,
                },
                {
                  label: "Total (Sq. Ft.)",
                  name: "total",
                  type: "text",
                  disabled: true,
                },
                {
                  label: "Campaign Start Date",
                  name: "campaignStartDate",
                  type: "date",
                  disabled: true,
                },
                {
                  label: "Campaign End Date",
                  name: "campaignEndDate",
                  type: "date",
                  disabled: true,
                },
                {
                  label: "Campaign Duration",
                  name: "campaignDuration",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Display Vendor Name",
                  name: "displayVendorName",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Display Cost / Month",
                  name: "displayCostPerMonth",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Buying Price as Per Duration",
                  name: "BuyingPriceAsPerDuration",
                  disabled: true,
                  type: "text",
                },
                {
                  label: "Final Display Cost",
                  name: "finalDisplayCost",
                  type: "number",
                },
                {
                  label: "Mounting Vendor",
                  name: "mountingVendor",
                  type: "select",
                },
                {
                  label: "Mounting Cost / Sq. Ft.",
                  name: "mountingCostPerSqFt",
                  type: "number",
                },
                {
                  label: "Mounting Cost",
                  name: "mountingCost",
                  disabled: true,
                  type: "number",
                },
                {
                  label: "Printing Vendor",
                  name: "printingVendor",
                  type: "select",
                },
                {
                  label: "Printing Material",
                  name: "printingMaterial",
                  type: "select",
                },
                {
                  label: "Printing Cost / Sq. Ft.",
                  name: "printingCostPerSqFt",
                  type: "number",
                },
                {
                  label: "Printing Cost",
                  name: "printingCost",
                  disabled: true,
                  type: "number",
                },
                { label: "Remarks", name: "remarks" },
              ].map((field, index) => (
                <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === "select" ? (
                      <>
                        <Select
                          id={field.name}
                          name={field.name}

                          options={
                            field.name === "mountingVendor"
                              ? vendorOptions
                              : field.name === "printingVendor"
                              ? printingVendorData
                              : field.name === "printingMaterial"
                              ? materialOptions
                              : []
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange(field.name, selectedOption)
                          }
                          value={
                            (formData[field.name] && {
                              value: formData[field.name],
                              label: formData[field.name],
                            }) ||
                            null
                          }
                          isDisabled={field.disabled || false}
                        />
                      </>
                    ) : (
                      <input
                        type={field.type || "text"}
                        name={field.name}
                        id={field.name}
                        placeholder={`Enter ${field.label}`}
                        className="form-control"
                        onChange={handleChange}
                        value={formData[field.name] || ""}
                        disabled={field.disabled || false}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateVendorCostAsset;
