import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select';

const ModelForceClosure = ({ id, show, setShow, userInfo }) => {
  const [formData, setFormData] = useState({
    requestedDate: new Date().toISOString().split('T')[0], // Default to today's date
    discontinuation_fromDate: '',
    campaign_id: userInfo?.campaign_id,
    estimate_id: userInfo?.estimate_id,
    reduced_duration: 0,
    reason_forClosure: null,
    remarks: '',
    penalty_amount: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Updated options for reasons for force closure
  const reasonsOptions = [
    { value: 'product_issues', label: 'Product Issues' },
    { value: 'campaign_issues', label: 'Campaign Issues' },
    { value: 'others', label: 'Others' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevData) => ({
      ...prevData,
      reason_forClosure: selectedOption,
    }));
  };

  useEffect(() => {
    if (formData.discontinuation_fromDate) {
      const campaignEndDate = moment(userInfo?.db_media_campaign?.campaign_end_date);
      const discontinuationDate = moment(formData.discontinuation_fromDate);

      // Calculate the difference in days
      const reducedDuration = campaignEndDate.diff(discontinuationDate, 'days');
      setFormData((prevData) => ({
        ...prevData,
        reduced_duration: reducedDuration > 0 ? reducedDuration : 0,
      }));
    }
  }, [formData.discontinuation_fromDate, userInfo?.db_media_campaign?.campaign_end_date]);

  const handleSave = async () => {
    setIsLoading(true);
    
    // Prepare data to send for approval
    const dataToSend = {
      id,
      ...formData,
      campaign_id: userInfo?.campaign_id,
        estimate_id: userInfo?.estimate_id,
      reason_forClosure: formData.reason_forClosure?.value,
    };

    try {
      // Replace with your API call
      console.log('Sending data for approval:', dataToSend);
      // await api.sendForApproval(dataToSend);
      
      // Close modal after successful submission
      setShow(false);
    } catch (error) {
      console.error('Error sending data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={() => setShow(false)} size="md">
      <Modal.Header closeButton>
        <Modal.Title>Force Closure Request</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="formRequestedDate">
            <Form.Label>Requested Date</Form.Label>
            <Form.Control type="date" name="requestedDate" value={formData.requestedDate} readOnly />
          </Form.Group>

          <Form.Group controlId="formDiscontinuationFrom">
            <Form.Label>Discontinuation From Date</Form.Label>
            <Form.Control
              type="date"
              name="discontinuation_fromDate"
              value={formData.discontinuation_fromDate}
              min={moment(userInfo?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD")}
              max={moment(userInfo?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD")}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formCampaignId">
            <Form.Label>Campaign ID</Form.Label>
            <Form.Control
              type="text"
              name="campaign_id"
              value={userInfo?.db_media_campaign?.campaign_code}
              onChange={handleInputChange}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formEstimateId">
            <Form.Label>Estimate ID</Form.Label>
            <Form.Control
              type="text"
              name="estimate_id"
              value={userInfo.estimation_code}
              onChange={handleInputChange}
              readOnly
            />
          </Form.Group>

          <Form.Group controlId="formReducedDuration">
            <Form.Label>Reduced Duration</Form.Label>
            <Form.Control
              type="number"
              name="reduced_duration"
              value={formData.reduced_duration}
              readOnly // Auto-calculated based on remaining days logic
            />
          </Form.Group>

          <Form.Group controlId="formReasonForClosure">
            <Form.Label>Reason for Force Closure</Form.Label>
            <Select
              value={formData.reason_forClosure}
              onChange={handleSelectChange}
              options={reasonsOptions}
              placeholder="Select a reason..."
            />
          </Form.Group>

          <Form.Group controlId="formRemarks">
            <Form.Label>Remarks</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formPenaltyAmount">
            <Form.Label>Penalty Amount (Currency)</Form.Label>
            <Form.Control
              type="text"
              name="penalty_amount"
              value={formData.penalty_amount}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send for Approval'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModelForceClosure;