import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Baseurl } from '../../../Utils/Constants'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { toast } from "react-toastify";
import { hasCookie, getCookie } from "cookies-next";
import { fetchData } from "../../../Utils/getReq";
import moment from 'moment';




const ModelEditAgencySite = ({ show, handleClose, agencySiteData,setGetAgencyData,getAgencyData }) => {
    console.log("site agency data is ", agencySiteData);

    // State for all form fields
    const [formData, setFormData] = useState({
        state_id: '',
        city_id: '',
        location: '',
        m_f_id: '',  // MediaFormat
        m_t_id: '', // MediaType
        m_v_id: '', // MediaVehicle
        quantity: '',
        height: '',
        width: '',
        totalSqFt: '',
        client_display_cost: '',
        client_mounting_cost: '',
        client_printing_cost: '',
        start_date:'',
        end_date:'',
        duration:''
});
// const [agencySiteLists,setAgencySiteLists]=useState([]);
// const [errorToast, setErrorToast] = useState(false);



    // State for loading
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Populate fields with initial data if agencySiteData is provided
        if (agencySiteData) {
            setFormData(prevState => ({
                ...prevState,
                ...agencySiteData,
                totalSqFt: (agencySiteData.height || 0) * (agencySiteData.width || 0)
            }));
        }
    }, [agencySiteData]);

    useEffect(() => {
        // Calculate totalSqFt whenever height or width changes
        if (formData.height && formData.width) {
            setFormData(prevState => ({
                ...prevState,
                totalSqFt: formData.height * formData.width
            }));
        }
    }, [formData.height, formData.width]);

    useEffect(() => {
        if (formData.start_date && formData.end_date) {
            const startDate = new Date(formData.start_date);
            const endDate = new Date(formData.end_date);
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Duration in days
            setFormData(prevState => ({ ...prevState, duration }));
        }
    }, [formData.start_date, formData.end_date]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleUpdate = async () => {
        setLoading(true);

let header;
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");
      
         header = {
              headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 29,
              },
            };
        }   

        const { status, ...formDataWithoutStatus } = formData;

        console.log(formDataWithoutStatus)
        try {

            
            const response = await axios.put(
                `${Baseurl}/db/media/estimationAgencyBusiness/updateSitesForAgencyEstimates`,
                
                formDataWithoutStatus,
                header
            );

            // Handle successful response
            console.log('Update successful', response.data);
             // Close the modal after successful update
            if (response.status === 204 || response.status === 200) {
              
                setLoading(false);
                handleClose();
                setGetAgencyData(!getAgencyData)
                // getAgencySites();
              }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // async function getAgencySites() {
    //     await fetchData(
    //       `/db/media/estimationAgencyBusiness/getSitesForAgencyEstimates?estimate_id=${agencySiteData.site_id}`,
    //       setAgencySiteLists,
    //       errorToast,
    //       setErrorToast
    //     );
    //   }

    

    return (
        <>
            <Modal className="commonModal" show={show} onHide={handleClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agency Site Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-nowrap" style={{ overflowX: 'auto', padding: '10px' }}>
                        <div className="d-flex flex-row">
                            {[
                                { id: 'state_id', label: 'State', type: 'text', placeholder: 'Enter state' },
                                { id: 'city_id', label: 'City', type: 'text', placeholder: 'Enter city' },
                                { id: 'location', label: 'Location', type: 'text', placeholder: 'Enter location' },
                                { id: 'm_f_id', label: 'Media Format', type: 'text', placeholder: 'Enter media format' },
                                { id: 'm_t_id', label: 'Media Type', type: 'text', placeholder: 'Enter media type' },
                                { id: 'm_v_id', label: 'Media Vehicle', type: 'text', placeholder: 'Enter media vehicle' },
                                { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
                                { id: 'height', label: 'Height', type: 'number', placeholder: 'Enter height' },
                                { id: 'width', label: 'Width', type: 'number', placeholder: 'Enter width' },
                                { id: 'totalSqFt', label: 'Total Sq. Ft.', type: 'text', placeholder: 'Total Sq. Ft.', disabled: true },
                                { id: 'client_display_cost', label: 'Client Display Cost', type: 'number', placeholder: 'Enter client display cost' },
                                { id: 'client_mounting_cost', label: 'Client Mounting Cost / Sq. Ft.', type: 'number', placeholder: 'Enter client mounting cost / sq. ft.' },
                                { id: 'client_printing_cost', label: 'Client Printing Cost', type: 'number', placeholder: 'Enter client printing cost' }
                            ].map(({ id, label, type, placeholder, disabled }, index) => (
                                <div key={index} className="col-xl-4 col-md-4 col-sm-4 col-4 p-1">
                                    <div className="form-group">
                                        <label htmlFor={id}>{label}</label>
                                        <input
                                            type={type}
                                            id={id}
                                            className="form-control"
                                            placeholder={placeholder}
                                            style={{ width: '100%' }}
                                            value={formData[id] || ''}
                                            onChange={handleChange}
                                            disabled={disabled}
                                        />
                                    </div>
                                </div>
                            ))}
                             <div className="col-xl-4 col-md-4 col-sm-4 col-4 p-1">
                                <div className="form-group">
                                    <label htmlFor="start_date">Start Date*</label>
                                    <input 
                                        type="date" 
                                        id="start_date"
                                        min={moment(agencySiteData?.db_estimate?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD")}
                                        max={moment(agencySiteData?.db_estimate?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD")}
                                        className="form-control" 
                                        value={formData.start_date} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4 col-sm-4 col-4 p-1">
                                <div className="form-group">
                                    <label htmlFor="end_date">End Date*</label>
                                    <input 
                                        type="date" 
                                        min={moment(agencySiteData?.db_estimate?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD")}
                                        max={moment(agencySiteData?.db_estimate?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD")}
                                        id="end_date" 
                                        className="form-control" 
                                        value={formData.end_date} 
                                        onChange={handleChange} 
                                    />
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4 col-sm-4 col-4 p-1">
                                <div className="form-group">
                                    <label htmlFor="duration">Duration (days)</label>
                                    <input 
                                        type="text" 
                                        id="duration" 
                                        className="form-control" 
                                        value={formData.duration} 
                                        readOnly 
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={handleUpdate}
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'UPDATE'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModelEditAgencySite;
