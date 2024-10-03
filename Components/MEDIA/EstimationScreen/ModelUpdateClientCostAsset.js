import React, { useState,useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';
import { hasCookie, getCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import moment from 'moment/moment';
import { toast } from 'react-toastify';
import {  updateClientCostAssetArray } from './Array';

const ModelUpdateClientCostAsset = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  stateId,
  cityIds,
  selectedSite,
  getAssetSites,
  estimationTotals
}) => {

  const [formData, setFormData] = useState({
    site_id: null,
    eab_id:null,
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
  const [errors,setErrors]=useState({});


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
          
            const response = await axios.get(Baseurl + `/db/media/costSheet/clientCostSheet/getAssetClientCostSheet?eab_id=${selectedSite?.eab_id}&site_id=${selectedSite?.site_id}`, header);

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
                  display_cost_per_month: response?.data?.data?.db_site?.selling_cost || 0,
                  selling_price_as_per_duration: response?.data?.data?.selling_price_as_per_duration || 0,
                  final_client_po_cost: response?.data?.data?.final_client_po_cost || 0,
                  mounting_cost_per_sq_ft: response?.data?.data?.mounting_cost_per_sq_ft || 0,
                  mounting_cost: response?.data?.data?.mounting_cost || 0,
                  printing_cost_per_sq_ft: response?.data?.data?.printing_cost_per_sq_ft || 0,
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
                state:selectedSite?.state || '',
                city:selectedSite?.city || '',
                location: selectedSite?.location || '',
                category: selectedSite?.category || '',
                media_format: selectedSite?.media_format|| '',
                media_vehicle: selectedSite?.media_vehicle || '',
                media_type: selectedSite?.media_type || '',
                quantity: selectedSite?.quantity || '',
                width:selectedSite?.width || '',
                height:selectedSite?.height || '',
                total_sq_ft: (selectedSite?.total_sq_ft).toFixed(2) || '',
                campaign_start_date: moment(selectedSite?.campaign_start_date).format("YYYY-MM-DD")  || '',
                campaign_end_date:moment(selectedSite?.campaign_end_date).format("YYYY-MM-DD")  || '',
                campaign_duration: moment(selectedSite?.campaign_end_date).diff(moment(selectedSite?.campaign_start_date), 'days') || '',
                display_cost_per_month: selectedSite?.display_cost_per_month || 0,
                selling_price_as_per_duration: selectedSite?.selling_price_as_per_duration|| 0,
                final_client_po_cost: selectedSite?.final_client_po_cost || 0,
                mounting_cost_per_sq_ft:selectedSite?.mounting_cost_per_sq_ft || 0,
                mounting_cost:Number(selectedSite?.mounting_cost).toFixed(2) || 0,
                printing_cost_per_sq_ft:selectedSite?.printing_cost_per_sq_ft || '0',
                printing_cost: Number(selectedSite?.printing_cost).toFixed(2) || 0,
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

    setErrors({
      
    });
  
}, [show]);

const validate = () => {
  const newErrors = {};
  // Add required fields validation
  const requiredFields = [
    'quantity',
    'width',
    'height',
    'campaign_start_date',
    'campaign_end_date',
    'final_client_po_cost',
    'mounting_cost_per_sq_ft',
    'printing_cost_per_sq_ft'
  ];

  requiredFields.forEach(field => {
    if (!formData[field]) {
      newErrors[field] = 'This field is required';
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};


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

 

  const saveClientCostSheetAssetForParticularSite = async () => {
    if(validate()){
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
      const newData={...formData,site_id:selectedSite?.site_id,eab_id:selectedSite?.eab_id,campaign_id:selectedSite.campaign_id}
      const datas={
        ...newData,totals:estimationTotals
      }
      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/createAssetClientCostSheet`,
            datas,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAssetSites()
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
    }}
  };

  const updateClientCostSheetAssetForParticularSite = async () => {
    if(validate()){
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
      const newData={...formData,site_id:selectedSite?.site_id,eab_id:selectedSite?.eab_id,campaign_id:selectedSite?.campaign_id}
      const datas={
        ...newData,totals:estimationTotals
      }
      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/updateAssetClientCostSheet`,
            datas,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAssetSites()
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
    }}
  };

  return (
    <>
      <Modal show={show} onHide={()=>{
        setFlag(false)
        handleClose()
      }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Cost Sheet(Asset)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              {updateClientCostAssetArray.map((field, index) => (
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
                        {errors[field.name] && (
                  <div style={{ color: 'red', fontSize: '0.875em' }}>
                    {errors[field.name]}
                  </div>
                )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={loading} variant="primary" onClick={()=>{
            flag==false ? saveClientCostSheetAssetForParticularSite() :updateClientCostSheetAssetForParticularSite()
          }}>
            { flag==false ?  loading ? "Saving...":"Save":loading? "Updating...":"Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateClientCostAsset;
