// import React, { useState } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import Select from 'react-select';

// const ModelUpdateClientCostAgency = ({
//   show,
//   handleClose,
//   stateList,
//   setStateId,
//   setCityIds,
//   cityList,
//   stateId,
//   cityIds,
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

//   return (
//     <>
//       <Modal show={show} onHide={handleClose} size="xl">
//         <Modal.Header closeButton>
//           <Modal.Title>Client Cost Sheet(Agency)</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="add_user_form">
//             <div className="row">
//               {[{label:'Site Code',name:'siteCode', type: 'number',disabled:true},
//               {label:'State',name:'state', disabled: true},
//               {label:'City',name:'city', disabled: true},
//               { label: 'Location', name: 'location', disabled: true },
//               { label: 'Media Format', name: 'mediaFormat', disabled: true },
//               { label: 'Media Vehicle', name: 'mediaVehicle', disabled: true },
//               { label: 'Media Type', name: 'mediaType', disabled: true },
//                 { label: 'Quantity', name: 'quantity', type: 'number' },
//                 { label: 'Width (Ft.)', name: 'width', type: 'number' },
//                 { label: 'Height (Ft.)', name: 'height', type: 'number' },
//                 { label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true },
//                 { label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date' },
//                 { label: 'Campaign End Date', name: 'campaignEndDate', type: 'date' },
//                 { label: 'Campaign Duration', name: 'campaignDuration', disabled:true },
//                 { label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true },
//                 { label: 'Selling Price as per Duration', name: 'sellingPriceAsPerDuration', disabled:true },
//                 { label: 'Final Client PO Cost', name: 'finalClientPOCost', type: 'number' },
//                 { label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number' },
//                 { label: 'Mounting Cost', name: 'mountingCost', disabled: true  },
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

// export default ModelUpdateClientCostAgency;

import React, { useState,useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';
import { hasCookie, getCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import moment from 'moment/moment';
import { toast } from 'react-toastify';

const ModelUpdateClientCostAgency = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  stateId,
  cityIds,
  selectedSite,
  getAgencySites
}) => {

  const [formData, setFormData] = useState({
    site_id: null,
    campaign_id:null,
    state:"",
    city:"",
    location: '',
    category: '',
    media_format: '',
    media_vehicle: '',
    media_type: '',
    quantity: '',
    width: '',
    height: '',
    total_sq_ft: '',
    campaign_start_date: '',
    campaign_end_date: '',
    campaign_duration: '',
    display_cost_per_month: '',
    selling_price_as_per_duration: '',
    final_client_po_cost: '',
    mounting_cost_per_sq_ft: '',
    mounting_cost: '',
    printing_cost_per_sq_ft: 0,
    printing_cost: '',
    remarks: '',
  });

  const [loading,setLoading]=useState(false)
  const [flag,setFlag]= useState(false)

  const getClientCostSheetInfoForParticularSite = async () => {
    
    if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                pass:"pass"
            }
        }
        try {
          
            const response = await axios.get(Baseurl + `/db/media/costSheet/clientCostSheet/getAgencyClientCostSheet?estimate_id=${selectedSite?.estimate_id}&site_id=${selectedSite?.site_id}`, header);

            if((response?.status==200 || response?.status==201 )&& response?.data?.data!==null){
                setFlag(true)
                
                setFormData({...formData,
                  ccs_id:response?.data?.data?.ccs_id || '',
                  site_id: response?.data?.data?.site_id || '',
                  state:response?.data?.data?.state || '',
                  city:response?.data?.data?.city || '',
                  location: response?.data?.data?.location || '',
                  category: response?.data?.data?.category || '',
                  media_format: response?.data?.data?.media_format|| '',
                  media_vehicle: response?.data?.data?.media_vehicle || '',
                  media_type: response?.data?.data?.media_type || '',
                  quantity: response?.data?.data?.quantity || '',
                  width:response?.data?.data?.width || '',
                  height:response?.data?.data?.height || '',
                  total_sq_ft: Number(response?.data?.data?.total_sq_ft).toFixed(2) || '',
                  campaign_start_date: moment(response?.data?.data?.campaign_start_date).format("YYYY-MM-DD")  || '',
                  campaign_end_date:moment(response?.data?.data?.campaign_end_date).format("YYYY-MM-DD")  || '',
                  campaign_duration: response?.data?.data?.campaign_duration || '',
                  display_cost_per_month: response?.data?.data?.display_cost_per_month || "0",
                  selling_price_as_per_duration: response?.data?.data?.selling_price_as_per_duration || "0",
                  final_client_po_cost: response?.data?.data?.final_client_po_cost || "0",
                  mounting_cost_per_sq_ft: response?.data?.data?.mounting_cost_per_sq_ft || "0",
                  mounting_cost: response?.data?.data?.mounting_cost || "0",
                  printing_cost_per_sq_ft: response?.data?.data?.printing_cost_per_sq_ft || "0",
                  printing_cost: response?.data?.data?.printing_cost || '0',
                  remarks: response?.data?.data?.remarks || '',
                });
                console.log("false")
            }
            else{
              console.log(true)
              setFormData({
                site_id: selectedSite?.site_id || '',
                estimate_id:selectedSite?.estimate_id||"",
                state:selectedSite?.state_id || '',
                city:selectedSite?.city_id || '',
                location: selectedSite?.location || '',
                category: selectedSite?.site_cat_name || '',
                media_format: selectedSite?.m_f_id|| '',
                media_vehicle: selectedSite?.m_v_id || '',
                media_type: selectedSite?.m_t_id || '',
                quantity: selectedSite?.quantity || '',
                width:selectedSite?.width || '',
                height:selectedSite?.height || '',
                total_sq_ft: (selectedSite?.width*selectedSite?.height).toFixed(2) || '',
                campaign_start_date: moment(selectedSite?.db_estimate?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD")  || '',
                campaign_end_date:moment(selectedSite?.db_estimate?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD")  || '',
                campaign_duration: selectedSite?.db_estimate?.db_media_campaign?.campaign_duration || '',
                display_cost_per_month: selectedSite?.display_cost_per_month || "0",
                selling_price_as_per_duration: selectedSite?.selling_price_as_per_duration || "0",
                final_client_po_cost: selectedSite?.final_client_po_cost || "0",
                mounting_cost_per_sq_ft:selectedSite?.mounting_cost_per_sq_ft || "0",
                mounting_cost:((selectedSite?.mounting_cost_per_sq_ft|| 0)*selectedSite?.width*selectedSite?.height).toFixed(2) || "0",
                printing_cost_per_sq_ft:selectedSite?.printing_cost_per_sq_ft || '0',
                printing_cost: ((selectedSite?.printing_cost_per_sq_ft||0)*selectedSite?.width*selectedSite?.height).toFixed(2) || "0",
                remarks: selectedSite?.remarks || '',
              });
            }
        } catch (error) {
            console.log(error)

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
    if (show && selectedSite) {
      getClientCostSheetInfoForParticularSite()
    } 
  }, [show, selectedSite]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Convert numeric values to numbers
    const parsedValue = name === 'width' || name === 'height' || name === 'quantity' ||
                        name === 'final_client_po_cost' || name === 'mounting_cost_per_sq_ft' ||
                        name === 'printing_cost_per_sq_ft'
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
      newFormData.total_sq_ft = (width * height).toFixed(2); // Update total
    }

    if(name==="mounting_cost_per_sq_ft"){
      const width = parseFloat(newFormData.width) || 0;
      const height = parseFloat(newFormData.height) || 0;
      const mounting_cost_per_sq_ft = parseFloat(newFormData.mounting_cost_per_sq_ft) || 0;
      newFormData.mounting_cost = (width * height * mounting_cost_per_sq_ft).toFixed(2); // Update total
    }

    if(name==="printing_cost_per_sq_ft"){
      const width = parseFloat(newFormData.width) || 0;
      const height = parseFloat(newFormData.height) || 0;
      const printing_cost_per_sq_ft = parseFloat(newFormData.printing_cost_per_sq_ft) || 0;
      newFormData.printing_cost = (width * height * printing_cost_per_sq_ft).toFixed(2); // Update total
    }

    setFormData(newFormData);
  };

 

  const saveClientCostSheetAgencyForParticularSite = async () => {
    if (hasCookie("token")) {
      setLoading(true)
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
      const newData={...formData,site_id:selectedSite?.site_id,campaign_id:selectedSite?.db_estimate?.campaign_id}
      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/createAgencyClientCostSheet`,
          newData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAgencySites()
          setLoading(false)
          handleClose()
          setFlag(false)
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setLoading(false)
      }
    }
  };

  const updateClientCostSheetAgencyForParticularSite = async () => {
    if (hasCookie("token")) {
      setLoading(true)
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
      const newData={...formData,site_id:selectedSite?.site_id,campaign_id:selectedSite?.db_estimate?.campaign_id}
      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/updateAgencyClientCostSheet`,
          newData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAgencySites()
          setLoading(false)
          handleClose()
          setFlag(false)
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
        setLoading(false)
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={()=>{
        setFlag(false)
        handleClose()
      }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Cost Sheet(Agency)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              {[{label:'Site Code',name:'site_id', type: 'number',disabled:true},
              {label:'State',name:'state', disabled: true},
              {label:'City',name:'city', disabled: true},
              { label: 'Location', name: 'location', disabled: true },
              { label: 'Category', name: 'category', disabled: true },
              { label: 'Media Format', name: 'media_format', disabled: true },
              { label: 'Media Vehicle', name: 'media_vehicle', disabled: true },
              { label: 'Media Type', name: 'media_type', disabled: true },
                { label: 'Quantity', name: 'quantity', type: 'number' },
                { label: 'Width (Ft.)', name: 'width', type: 'number' },
                { label: 'Height (Ft.)', name: 'height', type: 'number' },
                { label: 'Total (Sq. Ft.)', name: 'total_sq_ft', type: 'text', disabled: true },
                { label: 'Campaign Start Date', name: 'campaign_start_date', type: 'date' },
                { label: 'Campaign End Date', name: 'campaign_end_date', type: 'date' },
                { label: 'Campaign Duration', name: 'campaign_duration', disabled:true },
                { label: 'Display Cost / Month', name: 'display_cost_per_month', disabled:true },
                { label: 'Selling Price as per Duration', name: 'selling_price_as_per_duration', disabled:true },
                { label: 'Final Client PO Cost', name: 'final_client_po_cost', type: 'number' },
                { label: 'Mounting Cost / Sq. Ft.', name: 'mounting_cost_per_sq_ft', type: 'number' },
                { label: 'Mounting Cost', name: 'mounting_cost', disabled: true  },
                { label: 'Printing Cost / Sq. Ft.', name: 'printing_cost_per_sq_ft', type: 'number' },
                { label: 'Printing Cost', name: 'printing_cost', disabled: true },
                { label: 'Remarks', name: 'remarks' }
              ].map((field, index) => (
                <div key={index} className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor={field.name}>{field.label}</label>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" onClick={()=>{
            flag==false ? saveClientCostSheetAgencyForParticularSite() :updateClientCostSheetAgencyForParticularSite()
          }}>
            { flag==false ?  loading ? "Saving...":"Save":loading? "Updating...":"Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateClientCostAgency;

