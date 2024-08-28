import React, { useState,useEffect} from 'react';
import { Button, Modal } from 'react-bootstrap';
import { hasCookie, getCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import Select from 'react-select';
import moment from 'moment/moment';
import { toast } from 'react-toastify';

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
  getAssetSites
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

            if((response?.status==200 || response?.status==201 )&& Object.values(response?.data)[2].length > 0){
                setFlag(true)
                console.log("false")
            }
            else{
              console.log(true)
              setFormData({
                site_id: response?.data[0]?.site_id || '',
                state:response?.data[0]?.state || '',
                city:response?.data[0]?.city || '',
                location: response?.data[0]?.location || '',
                category: response?.data[0]?.category || '',
                media_format: response?.data[0]?.media_format|| '',
                media_vehicle: response?.data[0]?.media_vehicle || '',
                media_type: response?.data[0]?.media_type || '',
                quantity: response?.data[0]?.quantity || '',
                width:response?.data[0]?.width || '',
                height:response?.data[0]?.height || '',
                total_sq_ft: (response?.data[0]?.total_sq_ft).toFixed(2) || '',
                campaign_start_date: moment(response?.data[0]?.campaign_start_date).format("YYYY-MM-DD")  || '',
                campaign_end_date:moment(response?.data[0]?.campaign_end_date).format("YYYY-MM-DD")  || '',
                campaign_duration: response?.data[0]?.campaign_duration || '',
                display_cost_per_month: response?.data[0]?.display_cost_per_month || "0",
                selling_price_as_per_duration: response?.data[0]?.selling_price_as_per_duration || "0",
                final_client_po_cost: response?.data[0]?.final_client_po_cost || "0",
                mounting_cost_per_sq_ft: response?.data[0]?.mounting_cost_per_sq_ft || "0",
                mounting_cost: response?.data[0]?.mounting_cost || "0",
                printing_cost_per_sq_ft: response?.data[0]?.printing_cost_per_sq_ft || "0",
                printing_cost: response?.data[0]?.printing_cost || '0',
                remarks: response?.data[0]?.remarks || '',
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

    setFormData(newFormData);
  };

 

  const saveClientCostSheetAssetForParticularSite = async () => {
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

      try {
        const response = await axios.post(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/createAssetClientCostSheet`,
          formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAssetSites()
          setFlag(false)
          setLoading(false)
          handleClose()
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

  const updateClientCostSheetAssetForParticularSite = async () => {
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

      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/costSheet/clientCostSheet/updateAssetClientCostSheet`,
         formData,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          getAssetSites()
          setFlag(false)
          setLoading(false)
          handleClose()
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
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Cost Sheet(Asset)</Modal.Title>
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
