import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModelGenerateCard = ({ show, handleClose, estimateID, businessType }) => {
  const [selectedVendors, setSelectedVendors] = useState({
    printing: false,
    mounting: false,
    display: false,
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedVendors((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleGenerateCard = () => {
    const selectedTypes = [];

    if (selectedVendors.printing) {
      selectedTypes.push({ account_type_id: "13" });
    }
    if (selectedVendors.mounting) {
      selectedTypes.push({ account_type_id: "14" });
    }
    if (selectedVendors.display) {
        
      selectedTypes.push({ account_type_id: businessType == 1 ? "12" : "10" });
    }

    if (selectedTypes.length === 0) {
      alert('Please select at least one vendor.');
      return;
    }

    // Call your function to send the payload
    const payload = {
      estimateID,
      vendors: selectedTypes,
    };
    
    console.log('Payload:', payload);
    
    // Here you would typically call your function to handle the payload
    // generateCard(payload);
    
    handleClose(); // Close the modal after generating the card
    setSelectedVendors({})
  };

  return (
    <Modal className="commonModal" show={show} onHide={()=>{
      handleClose()
      setSelectedVendors({})
    }}>
      <Modal.Header closeButton>
        <Modal.Title>Generate Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Check
            type="checkbox"
            label="Printing Vendors"
            name="printing"
            checked={selectedVendors.printing}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Mounting Vendors"
            name="mounting"
            checked={selectedVendors.mounting}
            onChange={handleCheckboxChange}
          />
          <Form.Check
            type="checkbox"
            label="Display Vendors"
            name="display"
            checked={selectedVendors.display}
            onChange={handleCheckboxChange}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleGenerateCard}>
          Generate Card
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelGenerateCard;