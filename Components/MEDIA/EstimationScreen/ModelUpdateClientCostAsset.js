import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';

const ModelUpdateClientCostAsset = ({
  show,
  handleClose,
  stateList,
  setStateId,
  setCityIds,
  cityList,
  stateId,
  cityIds,
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

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Client Cost Sheet(Asset)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="add_user_form">
            <div className="row">
              {[{label:'Site Code',name:'siteCode', type: 'number',disabled:true},
              {label:'State',name:'state', disabled: true},
              {label:'City',name:'city', disabled: true},
              { label: 'Location', name: 'location', disabled: true },
              { label: 'Category', name: 'category', disabled: true },
              { label: 'Media Format', name: 'mediaFormat', disabled: true },
              { label: 'Media Vehicle', name: 'mediaVehicle', disabled: true },
              { label: 'Media Type', name: 'mediaType', disabled: true },
                { label: 'Quantity', name: 'quantity', type: 'number' },
                { label: 'Width (Ft.)', name: 'width', type: 'number' },
                { label: 'Height (Ft.)', name: 'height', type: 'number' },
                { label: 'Total (Sq. Ft.)', name: 'total', type: 'text', disabled: true },
                { label: 'Campaign Start Date', name: 'campaignStartDate', type: 'date' },
                { label: 'Campaign End Date', name: 'campaignEndDate', type: 'date' },
                { label: 'Campaign Duration', name: 'campaignDuration', disabled:true },
                { label: 'Display Cost / Month', name: 'displayCostPerMonth', disabled:true },
                { label: 'Selling Price as per Duration', name: 'sellingPriceAsPerDuration', disabled:true },
                { label: 'Final Client PO Cost', name: 'finalClientPOCost', type: 'number' },
                { label: 'Mounting Cost / Sq. Ft.', name: 'mountingCostPerSqFt', type: 'number' },
                { label: 'Mounting Cost', name: 'mountingCost', disabled: true  },
                { label: 'Printing Cost / Sq. Ft.', name: 'printingCostPerSqFt', type: 'number' },
                { label: 'Printing Cost', name: 'printingCost', disabled: true },
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
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelUpdateClientCostAsset;
