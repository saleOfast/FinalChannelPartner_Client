import axios from "axios";
import { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
import { getCookie, hasCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";

const ModelPurchaseOrder = ({ show, handleClose, estimateID,businessType }) => {
  const [formData, setFormData] = useState({
    p_o_code: '', // Auto-generated
    p_o_date: '',
    month: '',
    campaign_id: '',
    campaign_code: '',
    acc_id: '',
    acc_name:"",
    account_type_id: '',
    m_t_id: '',
    m_t_name: '',
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
  const [vendorsName, setVendorsName] = useState([]);

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
    // if (!formData.month) fieldErrors.month = "Month is required";
    if (!formData.campaign_id) fieldErrors.campaign_id = "Campaign ID is required";
    if (!formData.acc_id) fieldErrors.acc_id = "Vendor is required";
    if (!formData.account_type_id) fieldErrors.account_type_id = "Vendor Type is required";
    if (!formData.m_t_id) fieldErrors.m_t_id = "Type of Media is required";
    if (!formData.p_o_cost || isNaN(formData.p_o_cost)) fieldErrors.p_o_cost = "Valid Total Cost is required";
    // if (!formData.p_o_date) fieldErrors.p_o_date = "PO Date is required";
    if (!formData.p_o_start_date) fieldErrors.p_o_start_date = "Start Date is required";
    if (!formData.p_o_end_date) fieldErrors.p_o_end_date = "End Date is required";
    if (!formData.p_o_days || isNaN(formData.p_o_days)) fieldErrors.p_o_days = "Valid number of days is required";

    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      if (hasCookie("token")) {
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
              `/db/media/purchaseOrder/addPurchaseOrder`,
              formData,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
            setFormData({})
            handleClose()
          }
        } catch (error) {
          console.log(error);
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    } else {
      toast.error("Please fill the Fields.");
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
          
            const response = await axios.get(Baseurl + `/db/media/purchaseOrder/fetchPurchaseOrder?estimate_id=${estimateID}`, header);

            if((response?.status==200 || response?.status==201 )){
                setVendorsName(response?.data?.data)
            }
        } catch (error) {
            console.log(error)

            if (error?.response?.data?.message) {
                toast.error(error?.response?.data?.message);
            }
            else {
                toast.error('Something went wrong!')
            }
        }
    }
}


  useEffect(()=>{
      if(formData.account_type_id!==""){
        getParticularVendorInfo()
      }
  },[formData.account_type_id])

  useEffect(()=>{
      if(formData?.acc_id!==""){
        console.log(vendorsName)
        const data=vendorsName?.find(item=>item?.acc_id==formData?.acc_id)
        console.log(data)
        setFormData({...formData,
            acc_name:data?.acc_name,
            campaign_id:data?.campaign_id,
            campaign_code:data?.campaign_code,
            campaign_id:data?.campaign_id,
            m_t_id:data?.m_t_id,
            m_t_name:data?.m_t_name,
            p_o_cost:data?.p_o_cost,
            p_o_days:data?.p_o_days,
            p_o_start_date:data?.p_o_start_date ? moment(data?.p_o_start_date).format("YYYY-MM-DD"):"",
            p_o_end_date:data?.p_o_end_date ? moment(data?.p_o_end_date).format("YYYY-MM-DD"):"",
        })
      }
  },[formData?.acc_id])

  

  return (
    <>
      <Modal show={show} onHide={()=>{
        setErrors({})
        setFormData({})
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
                <Form.Group controlId="account_type_id">
                  <Form.Label>Type of Vendor</Form.Label>
                  <Form.Control
                    as="select"
                    name="account_type_id"
                    value={formData.account_type_id}
                    onChange={(e)=>{
                      setFormData({...formData,
                        account_type_id:e.target.value,
                        p_o_code: '', // Auto-generated
                        p_o_date: '',
                        month: '',
                        campaign_id: '',
                        campaign_code: '',
                        acc_id: '',
                        acc_name:"",
                        m_t_id: '',
                        m_t_name: '',
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
                      })
                    }}
                    // onChange={handleInputChange}
                    isInvalid={!!errors.account_type_id}
                  >
                    <option value="">Select Vendor Type</option>
                    <option value="13">Printing</option>
                    <option value="14">Mounting</option>
                    {/* <option value={businessType == 1 ? "12" :"10"}>Display</option> */}
                    {businessType == 1 ? <option value="12">Display</option> :<option value="10">Display</option>}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.account_type_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="acc_id">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    as="select"
                    name="acc_id"
                    value={formData.acc_id}
                    onChange={handleInputChange}
                    isInvalid={!!errors.acc_id}
                  >
                    <option value="">Select Vendor </option>
                  {  vendorsName?.filter(item=>item?.account_type_id==formData.account_type_id)?.map((item,index)=>(
                      <option key={index} value={item?.acc_id}>{item?.acc_name}</option>
                  ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.acc_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="campaign_id">
                  <Form.Label>Campaign ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="campaign_id"
                    value={formData.campaign_code}
                    onChange={handleInputChange}
                    isInvalid={!!errors.campaign_id}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.campaign_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="m_t_id">
                  <Form.Label>Type of Media</Form.Label>
                  <Form.Control
                    type="text"
                    name="m_t_id"
                    value={formData.m_t_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.m_t_id}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.m_t_id}</Form.Control.Feedback>
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
                  onChange={(e)=>{
                    setFormData({...formData,
                      p_o_date:moment(e.target.value).format("YYYY-MM-DD")
                    })
                  }}
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
                    onChange={(e)=>{
                      setFormData({...formData,
                        p_o_debit_note_date:moment(e.target.value).format("YYYY-MM-DD")
                      })
                    }}
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
            setFormData({})
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
