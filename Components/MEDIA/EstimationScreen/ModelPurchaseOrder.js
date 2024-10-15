import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";

const ModelPurchaseOrder = ({ show, handleClose, estimateID,businessType }) => {
  const [formData, setFormData] = useState({
    p_o_code: '', // Auto-generated
    p_o_date: '',
    month: '',
    campaign_id: '',
    vendor_id: '',
    vendor_type: '',
    media_type: '',
    p_o_cost: '',
    p_o_start_date: '',
    p_o_end_date: '',
    p_o_days: '',
    p_o_ndp_days: '',
    p_o_invoice: '',
    p_o_payment_status: '',
    // Debit Note Details
    p_o_debit_note_no: '',
    p_o_debit_note_date: '',
    p_o_debit_note_percentage: '',
    p_o_debit_note_amount: '',
    p_o_debit_note_gst: '',
    p_o_debit_note_remarks: '',
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if ((name === "p_o_ndp_days" || name === "p_o_debit_note_percentage" || name === "p_o_debit_note_amount" || name === "p_o_debit_note_gst") && value < 0) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateFields = () => {
    let fieldErrors = {};
    if (!formData.month) fieldErrors.month = "Month is required";
    if (!formData.campaign_id) fieldErrors.campaign_id = "Campaign ID is required";
    if (!formData.vendor_id) fieldErrors.vendor_id = "Vendor is required";
    if (!formData.vendor_type) fieldErrors.vendor_type = "Vendor Type is required";
    if (!formData.media_type) fieldErrors.media_type = "Type of Media is required";
    if (!formData.p_o_cost || isNaN(formData.p_o_cost)) fieldErrors.p_o_cost = "Valid Total Cost is required";
    if (!formData.p_o_date) fieldErrors.p_o_date = "PO Date is required";
    if (!formData.p_o_start_date) fieldErrors.p_o_start_date = "Start Date is required";
    if (!formData.p_o_end_date) fieldErrors.p_o_end_date = "End Date is required";
    if (!formData.p_o_days || isNaN(formData.p_o_days)) fieldErrors.p_o_days = "Valid number of days is required";

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        // Submit form data via API
        // Example: await axios.post(`${Baseurl}/po/create`, formData);
        toast.success("Form submitted successfully!");
        handleClose();
      } catch (error) {
        toast.error("Error submitting form!");
      }
    } else {
      toast.error("Please fix the validation errors.");
    }
  };

  const getParticularVendorInfo = async () => {
    
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
          
            const response = await axios.get(Baseurl + `/db/media/salesOrder/getSalesOrder?estimate_id=${estimateID}`, header);

            if((response?.status==200 || response?.status==201 )&& response?.data?.data!==null){
                setFlag(true)
                const data=response?.data?.data;
                setFormData(data)
                setFormData({...formData,
                    campaign_code:data?.db_media_campaign?.campaign_code,
                    acc_name:data?.db_account?.acc_name,
                    estimate_code:data?.db_estimate?.estimation_code,
                    s_o_date:moment(data?.s_o_date).format("YYYY-MM-DD"),
                    s_o_po_date:moment(data?.s_o_po_date).format("YYYY-MM-DD"),
                    campaign_name:data?.campaign_name,
                    s_o_po_number:data?.s_o_po_number,
                    s_o_po_value:data?.s_o_po_value,
                    s_o_po_remarks:data?.s_o_po_remarks,
                    estimate_id:data?.estimate_id,
                    campaign_id:data?.campaign_id,
                    acc_id:data?.acc_id,
                    s_o_id:data?.s_o_id,
                    s_o_code:data?.s_o_code,
                    s_o_number:data?.s_o_number,
                    s_o_code:data?.s_o_code,
                })
            }
            else{      
                setFlag(false)      
                setFormData({...formData,
                    s_o_date: new Date().toISOString().slice(0, 10),
                    campaign_name:estimateData?.db_media_campaign?.campaign_name,
                    campaign_code:estimateData?.db_media_campaign?.campaign_code,
                    campaign_id:estimateData?.db_media_campaign?.campaign_id,
                    estimate_code:estimateData?.estimation_code,
                    estimate_id:estimateData?.estimate_id,
                    acc_name:estimateData?.db_media_campaign?.db_account?.acc_name,
                    acc_id:estimateData?.db_media_campaign?.db_account?.acc_id
                })
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


  // useEffect(()=>{
  //     if(formData.vendor_type==10 || formData.vendor_type==12 || formData.vendor_type==13 || formData.vendor_type==14){
        
  //     }
  // },[formData.vendor_type==10 || formData.vendor_type==12 || formData.vendor_type==13 || formData.vendor_type==14])

  

  

  return (
    <>
      <Modal show={show} onHide={()=>{
        setErrors({})
        handleClose()
      }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Purchase Order Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              {/* <Col md={6}>
                <Form.Group controlId="p_o_code">
                  <Form.Label>PO Number (Auto-Generated)</Form.Label>
                  <Form.Control type="text" value="Auto-generated" disabled />
                </Form.Group>
              </Col> */}
              <Col md={6}>
                <Form.Group controlId="vendor_type">
                  <Form.Label>Type of Vendor</Form.Label>
                  <Form.Control
                    as="select"
                    name="vendor_type"
                    value={formData.vendor_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.vendor_type}
                  >
                    <option value="">Select Vendor Type</option>
                    <option value="13">Printing</option>
                    <option value="14">Mounting</option>
                    <option value={businessType == 1 ? "12" :"10"}>Display</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.vendor_type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="vendor_id">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.vendor_id}
                  >
                    <option value="">Select Vendor </option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.vendor_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="campaign_id">
                  <Form.Label>Campaign ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="campaign_id"
                    value={formData.campaign_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.campaign_id}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.campaign_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="media_type">
                  <Form.Label>Type of Media</Form.Label>
                  <Form.Control
                    type="text"
                    name="media_type"
                    value={formData.media_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.media_type}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.media_type}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_cost">
                  <Form.Label>Total Cost</Form.Label>
                  <Form.Control
                    type="text"
                    name="p_o_cost"
                    value={formData.p_o_cost}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_cost}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_cost}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_start_date">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="p_o_start_date"
                    value={formData.p_o_start_date}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_start_date}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_start_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_end_date">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="p_o_end_date"
                    value={formData.p_o_end_date}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_end_date}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_end_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_days">
                  <Form.Label>No of Days</Form.Label>
                  <Form.Control
                    type="number"
                    name="p_o_days"
                    value={formData.p_o_days}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_days}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_days}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_date">
                  <Form.Label>PO Date</Form.Label>
                  <Form.Control 
                  type="date" 
                  value={formData.p_o_date} 
                  onChange={handleInputChange}
                  isInvalid={!!errors.p_o_date}
                  name="p_o_date"  
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="month">
                  <Form.Label>Month</Form.Label>
                  <Form.Control
                    type="text"
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    isInvalid={!!errors.month}
                  />
                  <Form.Control.Feedback type="invalid">{errors.month}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_ndp_days">
                  <Form.Label>NDP Days</Form.Label>
                  <Form.Control
                    type="number"
                    name="p_o_ndp_days"
                    value={formData.p_o_ndp_days}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_invoice">
                  <Form.Label>Invoice Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="p_o_invoice"
                    value={formData.p_o_invoice}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_payment_status">
                  <Form.Label>Payment Status</Form.Label>
                  <Form.Control
                    as="select"
                    name="p_o_payment_status"
                    value={formData.p_o_payment_status}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_payment_status}
                  >
                    <option value="">Select Payment Status</option>
                    <option value="1">Pending</option>
                    <option value="2">In-Progress</option>
                    <option value="3">Done</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.p_o_payment_status}</Form.Control.Feedback>
                </Form.Group>
              </Col>

              {/* Debit Note Section */}
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_no">
                  <Form.Label>Debit Note Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="p_o_debit_note_no"
                    value={formData.p_o_debit_note_no}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_debit_note_no}
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_debit_note_no}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_date">
                  <Form.Label>Debit Note Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="p_o_debit_note_date"
                    value={formData.p_o_debit_note_date}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_debit_note_date}
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_debit_note_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_percentage">
                  <Form.Label>Debit Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="p_o_debit_note_percentage"
                    value={formData.p_o_debit_note_percentage}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_debit_note_percentage}
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_debit_note_percentage}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_amount">
                  <Form.Label>Debit Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="p_o_debit_note_amount"
                    value={formData.p_o_debit_note_amount}
                    onChange={handleInputChange}
                    isInvalid={!!errors.p_o_debit_note_amount}
                  />
                  <Form.Control.Feedback type="invalid">{errors.p_o_debit_note_amount}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_gst">
                  <Form.Label>Debit GST Amount</Form.Label>
                  <Form.Control
                    type="number"
                    name="p_o_debit_note_gst"
                    value={formData.p_o_debit_note_gst}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="p_o_debit_note_remarks">
                  <Form.Label>Debit Note Remarks</Form.Label>
                  <Form.Control
                    type="text"
                    name="p_o_debit_note_remarks"
                    value={formData.p_o_debit_note_remarks}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{
            setErrors({})
            handleClose()
          }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Generate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelPurchaseOrder;
