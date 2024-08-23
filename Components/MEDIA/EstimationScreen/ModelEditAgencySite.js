// import React, { useState, useEffect } from 'react';
// import { Button, Modal } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported

// const ModelEditAgencySite = ({ show, handleClose, agencySiteData }) => {
//     console.log("site agency data is ", agencySiteData);

//     // State for all form fields
//     const [formData, setFormData] = useState({
//         state_id: '',
//         city_id: '',
//         location: '',
//         m_f_id: '',  //MediaFormat
//         m_t_id: '', //mediaType
//         m_v_id: '', //mediaVehicle
//         quantity: '',
//         height: '',
//         width: '',
//         totalSqFt: '',
//         client_display_cost: '',
//         client_mounting_cost: '',
//         client_printing_cost:''
//     });

//     useEffect(() => {
//         // Populate fields with initial data if agencySiteData is provided
//         if (agencySiteData) {
//             setFormData(prevState => ({
//                 ...prevState,
//                 ...agencySiteData,
//                 totalSqFt: (agencySiteData.height || 0) * (agencySiteData.width || 0)
//             }));
//         }
//     }, [agencySiteData]);

//     useEffect(() => {
//         // Calculate totalSqFt whenever height or width changes
//         if (formData.height && formData.width) {
//             setFormData(prevState => ({
//                 ...prevState,
//                 totalSqFt: formData.height * formData.width
//             }));
//         }
//     }, [formData.height, formData.width]);

//     const handleChange = (e) => {
//         const { id, value } = e.target;
//         setFormData(prevState => ({
//             ...prevState,
//             [id]: value
//         }));
//     };

//     const handleUpdate = async () => {
//         try {
//             const response = await fetch('/api/v1/db/media/estimationAgencyBusiness/updateSitesForAgencyEstimates', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 // Handle successful response
//                 console.log('Update successful', data);
//                 handleClose(); // Close the modal after successful update
//             } else {
//                 const errorData = await response.json();
//                 // Handle error response
//                 console.error('Update failed', errorData);
//             }
//         } catch (error) {
//             console.error('Error:', error);
//         }
//     };

//     return (
//         <>
//             <Modal className="commonModal" show={show} onHide={handleClose} size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title>Agency Site Edit</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className="d-flex flex-nowrap" style={{ overflowX: 'auto', padding: '10px' }}>
//                         <div className="d-flex flex-row">
//                             {[
//                                 { id: 'state', label: 'State', type: 'text', placeholder: 'Enter state' },
//                                 { id: 'city', label: 'City', type: 'text', placeholder: 'Enter city' },
//                                 { id: 'location', label: 'Location', type: 'text', placeholder: 'Enter location' },
//                                 { id: 'mediaFormat', label: 'Media Format', type: 'text', placeholder: 'Enter media format' },
//                                 { id: 'mediaType', label: 'Media Type', type: 'text', placeholder: 'Enter media type' },
//                                 { id: 'mediaVehicle', label: 'Media Vehicle', type: 'text', placeholder: 'Enter media vehicle' },
//                                 { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
//                                 { id: 'height', label: 'Height', type: 'number', placeholder: 'Enter height' },
//                                 { id: 'width', label: 'Width', type: 'number', placeholder: 'Enter width' },
//                                 { id: 'totalSqFt', label: 'Total Sq. Ft.', type: 'text', placeholder: 'Total Sq. Ft.', disabled: true },
//                                 { id: 'clientDisplayCost', label: 'Client Display Cost', type: 'number', placeholder: 'Enter client display cost' },
//                                 { id: 'clientMountingCost', label: 'Client Mounting Cost / Sq. Ft.', type: 'number', placeholder: 'Enter client mounting cost / sq. ft.' }
//                             ].map(({ id, label, type, placeholder, disabled }, index) => (
//                                 <div key={index} className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
//                                     <div className="form-group">
//                                         <label htmlFor={id}>{label}</label>
//                                         <input
//                                             type={type}
//                                             id={id}
//                                             className="form-control"
//                                             placeholder={placeholder}
//                                             style={{ width: '100%' }}
//                                             value={formData[id] || ''}
//                                             onChange={handleChange}
//                                             disabled={disabled}
//                                         />
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="primary" onClick={handleUpdate}>
//                         UPDATE
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </>
//     );
// }

// export default ModelEditAgencySite;

import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { Baseurl } from '../../../Utils/Constants'; // Ensure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { toast } from "react-toastify";

const ModelEditAgencySite = ({ show, handleClose, agencySiteData }) => {
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
        client_printing_cost: ''
    });

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

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleUpdate = async () => {
        setLoading(true); // Start loading

        try {
            const response = await axios.post(
                `${Baseurl}/db/media/estimationAgencyBusiness/updateSitesForAgencyEstimates`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Handle successful response
            console.log('Update successful', response.data);
            handleClose(); // Close the modal after successful update
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
                                <div key={index} className="col-xl-3 col-md-3 col-sm-3 col-3 p-1">
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
