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







import React, { useState, useEffect } from 'react';
import { fetchData } from "../../../Utils/getReq";
import { Button, Modal } from 'react-bootstrap';
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Select from 'react-select';
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";



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
  selectedSite
}) => {
  const [formData, setFormData] = useState({
    siteCode: '',
    location: '',
    category: '',
    mediaFormat: '',
    mediaVehicle: '',
    mediaType: '',
    quantity: '',
    width: '',
    height: '',
    total: '',
    campaignStartDate: '',
    campaignEndDate: '',
    campaignDuration: '',
    displayCostPerMonth: '',
    sellingPriceAsPerDuration: '',
    finalClientPOCost: '',
    mountingCostPerSqFt: '',
    mountingCost: '',
    printingCostPerSqFt: '',
    printingCost: '',
    remarks: '',
  });

  const [assetSiteLists, setAssetSiteLists] = useState([]);
  const [errorToast, setErrorToast] = useState(false);

  // Options for Select fields
  const [vendorOptions, setVendorOptions] = useState([]);
  const [materialOptions, setMaterialOptions] = useState([]);
  const[loader,setLoader]=useState(false);
  const [dataList, setDataList] = useState([]);




  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric values to numbers
    const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
                        name === 'finalClientPOCost' || name === 'mountingCostPerSqFt' ||
                        name === 'printingCostPerSqFt'
                        ? parseFloat(value) || ''
                        : value;

    // Update formData state
    const newFormData = {
      ...formData,
      [name]: parsedValue,
    };

    // If width or height changes, update total
    if (name === 'width' || name === 'height') {
      const width = parseFloat(newFormData.width) || 0;
      const height = parseFloat(newFormData.height) || 0;
      newFormData.total = (width * height).toFixed(2); // Update total
    }

    setFormData(newFormData);
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({
      ...formData,
      [name]: selectedOption ? selectedOption.value : ''
    });
  };

  async function getAssetSites() {
    await fetchData(
      `/db/media/estimationAssetBusiness/getEstimationAssetBusiness?estimate_id=${estimateId}`,
      setAssetSiteLists,
      errorToast,
      setErrorToast
    );
  }

  const handleUpdate = async () => {
    try {
      const response = await fetch('https://dummyapi.com/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Update successful:', data);
      handleClose(); // Close the modal after successful update
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

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
          m_id: 14,

        },
      };
       
      try {
        const response = await axios.get(Baseurl + `/db/media/mountingCost/getMountingCost`, header);
        console.log("response ",response)
        if(response?.status==200|| response?.status==201){
          setLoader(false)
        //   setDataList(response?.data?.data);
        //   console.log("mounag",dataList)

        console.log("mountingcostdat is ",response.data.data)


        const filteredData = response.data.data.filter(item =>
            item.db_media_type.m_t_id === selectedSite.db_site.db_media_type.m_t_id &&
            item.db_account.bill_state === selectedSite.db_site.db_state.state_id
          );
  
          // Extract acc_name from filtered data
          const accNames = filteredData.map(item => item.acc_name);
  
          console.log("Filtered Account Names: ", accNames);
          setDataList(filteredData);

        }
      } catch (error) {
        setLoader(false)
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {   
     if (show && selectedSite) {
      setFormData({
        siteCode: selectedSite?.site_id || '',
        state:selectedSite?.db_site?.db_state?.state_name || '',
        city:selectedSite?.db_site?.db_city?.city_name || '',

        location: selectedSite?.db_site?.location || '',
        category: selectedSite?.db_site?.db_site_category?.site_cat_name || '',
        mediaFormat: selectedSite?.db_site?.db_media_format?.m_f_name|| '',
        mediaVehicle: selectedSite?.db_site?.db_media_vehicle?.m_v_name || '',
        mediaType: selectedSite?.db_site?.db_media_type?.m_t_name || '',
        quantity: selectedSite?.db_site.quantity || '',
        width:selectedSite?.db_site.width || '',
        height:selectedSite?.db_site.height || '',
        total: (selectedSite?.db_site.width *selectedSite?.db_site.height).toFixed(2) || '',
        campaignStartDate: selectedSite.campaignStartDate || '',
        campaignEndDate: selectedSite.campaignEndDate || '',
        campaignDuration: selectedSite.campaignDuration || '',
        displayCostPerMonth: selectedSite.displayCostPerMonth || '',
        sellingPriceAsPerDuration: selectedSite.sellingPriceAsPerDuration || '',
        finalClientPOCost: selectedSite.finalClientPOCost || '',
        mountingCostPerSqFt: selectedSite.mountingCostPerSqFt || '',
        mountingCost: selectedSite.mountingCost || '',
        printingCostPerSqFt: selectedSite.printingCostPerSqFt || '',
        printingCost: selectedSite.printingCost || '',
        remarks: selectedSite?.db_site?.remarks || '',
      });
    }
    
    getDataList();

    console.log("agjg",selectedSite)
  }, [show, selectedSite]);

  useEffect(() => {
    // Fetch vendor and material options (replace with actual fetching logic)
    setVendorOptions([
      { value: 'vendor1', label: 'Vendor 1' },
      { value: 'vendor2', label: 'Vendor 2' },
      // Add more vendor options as needed
    ]);

    setMaterialOptions([
      { value: 'material1', label: 'Material 1' },
      { value: 'material2', label: 'Material 2' },
      // Add more material options as needed
    ]);
  }, []);

  

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
                {label:'Site Code', name:'siteCode', type: 'number', disabled:true},
                {label:'State', name:'state', disabled: true,type:"text"},
                {label:'City', name:'city', disabled: true,type:"text"},
                {label: 'Location', name: 'location', disabled: true,type:"text"},
                {label: 'Category', name: 'category', disabled: true,type:"text"},
                {label: 'Media Format', name: 'mediaFormat', disabled: true,type:"text"},
                {label: 'Media Vehicle', name: 'mediaVehicle', disabled: true,type:"text"},
                {label: 'Media Type', name: 'mediaType', disabled: true,type:"text"},
                {label: 'Quantity', name: 'quantity', type: 'text', disabled: true},
                {label: 'Width (Ft.)', name: 'width', type: 'text', disabled: true},
                {label: 'Height (Ft.)', name: 'height', type: 'text', disabled: true},
                {label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true},
                {label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date', disabled: true},
                {label: 'Campaign End Date', name: 'campaignEndDate', type: 'date', disabled: true},
                {label: 'Campaign Duration', name: 'campaignDuration', disabled:true,type:"text"},
                {label: 'Display Vendor Name', name: 'displayVendorName', disabled:true,type:"text"},
                {label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true,type:"text"},
                {label: 'Buying Price as Per Duration ', name: 'BuyingPriceAsPerDuration ', disabled:true,type:"text"},
                {label: 'Final Display Cost', name: 'finalDisplayCost', type: 'number'},
                {label: 'Mounting Vendor', name: 'mountingVendor', type: 'select'},
                {label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number'},
                {label: 'Mounting Cost', name: 'mountingCost', disabled: true,type:'number'},
                {label: 'Printing Vendor', name: 'printingVendor', type: 'select'},
                {label: 'Printing Material', name: 'printingMaterial', type: 'select'},
                {label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number'},
                {label: 'Printing Cost', name: 'printingCost', disabled: true,type:"number"},
                {label: 'Remarks', name: 'remarks'}
              ].map((field, index) => (
                <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor={field.name}>{field.label}</label>
                    {field.type === 'select' ? (
                      <Select
                        id={field.name}
                        name={field.name}
                        options={field.name === 'mountingVendor' ? vendorOptions : 
                                  field.name === 'printingVendor' ? vendorOptions : 
                                  field.name === 'printingMaterial' ? materialOptions : []}
                        onChange={(selectedOption) => handleSelectChange(field.name, selectedOption)}
                        value={(formData[field.name] && { value: formData[field.name], label: formData[field.name] }) || null}
                        isDisabled={field.disabled || false}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        name={field.name}
                        id={field.name}
                        placeholder={`Enter ${field.label}`}
                        className="form-control"
                        onChange={handleChange}
                        value={formData[field.name] || ''}
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
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateVendorCostAsset;





