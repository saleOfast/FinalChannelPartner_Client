import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Select from 'react-select';

const reasonsOptions = [
  { value: '1', label: 'Natural Calamities' },
  { value: '2', label: 'Corporation Issue' },
  { value: '3', label: 'Others' },
];

const NDPDetailsModal = ({ selectedSites, show, handleClose, setSelectedSites }) => {
  const [ndpDetails, setNdpDetails] = useState({
    ndpReportedDate: new Date().toISOString().split('T')[0],
    ndpStartDate: '',
    ndpEndDate: '',
    reasonForNDP: null, // Change to null for react-select
    remarks: '',
  });

  
  
  const handleSubmit = () => {
    console.log('Submitting NDP Details:', { ...ndpDetails, selectedSites });
    // Add your submission logic here
    handleClose(); // Close modal after submission
    setSelectedSites([])
  };

  const handleReasonChange = (selectedOption) => {
    setNdpDetails({ ...ndpDetails, reasonForNDP: selectedOption });
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>NDP Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          {/* NDP Details Form */}
          <Form.Group controlId="ndpReportedDate">
            <Form.Label>NDP Reported Date</Form.Label>
            <Form.Control type="date" value={ndpDetails.ndpReportedDate} readOnly />
          </Form.Group>

          <Form.Group controlId="ndpStartDate">
            <Form.Label>NDP Start Date</Form.Label>
            <Form.Control type="date" onChange={(e) => setNdpDetails({ ...ndpDetails, ndpStartDate: e.target.value })} />
          </Form.Group>

          <Form.Group controlId="ndpEndDate">
            <Form.Label>NDP End Date</Form.Label>
            <Form.Control type="date" onChange={(e) => setNdpDetails({ ...ndpDetails, ndpEndDate: e.target.value })} />
          </Form.Group>

          {/* Reason for NDP using react-select */}
          <Form.Group controlId="reasonForNDP">
            <Form.Label>Reason for NDP</Form.Label>
            <Select
              value={ndpDetails.reasonForNDP}
              onChange={handleReasonChange}
              options={reasonsOptions}
              placeholder="Select a reason..."
              isClearable // Allow clearing selection
            />
          </Form.Group>

          {/* Remarks */}
          <Form.Group controlId="remarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control as="textarea" rows={3} onChange={(e) => setNdpDetails({ ...ndpDetails, remarks: e.target.value })} />
          </Form.Group>

        </Modal.Body>

        {/* Footer with Submit button */}
        <Modal.Footer>
          {/* Submit button */}
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>

          {/* Cancel button */}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

        </Modal.Footer>

      </Modal>
    </>
  );
};

export default NDPDetailsModal;