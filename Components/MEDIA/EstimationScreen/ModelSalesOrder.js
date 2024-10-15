import axios from "axios";
import { getCookie, hasCookie } from "cookies-next";
import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col, Alert } from "react-bootstrap";
import { Baseurl } from "../../../Utils/Constants";
import { toast } from "react-toastify";
import moment from "moment";

const ModelSalesOrder = ({ show, handleClose,estimateData,estimateID }) => {
    const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    s_o_id: null,
    s_o_code: "",
    s_o_number: "",
    s_o_date: new Date().toISOString().slice(0, 10),
    s_o_po_number: "",
    s_o_po_date: "",
    s_o_po_value: null,
    campaign_name: "",
    campaign_id: null,
    campaign_code: "",
    acc_id: null,
    acc_name: "",
    estimate_id: null,
    estimate_code: "",
    s_o_po_remarks: "",
  });
  const [loading,setLoading] =useState(false)
  const [flag,setFlag]= useState(false)

  const getSalesOrder = async () => {
    
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
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false }); // Clear the error for that field if it's corrected
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.s_o_date) newErrors.s_o_date = "Sales Order Date is required";
    if (!formData.campaign_id) newErrors.campaign_id = "Campaign ID is required";
    if (!formData.acc_id) newErrors.acc_id = "Client/Agency Name is required";
    if (!formData.estimate_id) newErrors.estimate_id = "Estimate ID is required";
    if (!formData.s_o_po_number)
      newErrors.s_o_po_number = "Sales PO Number is required";
    if (!formData.s_o_po_date) newErrors.s_o_po_date = "Sales PO Date is required";
    if (!formData.s_o_po_value)
      newErrors.s_o_po_value = "Sales PO Value is required";
    if (!formData.s_o_po_remarks)
      newErrors.s_o_po_remarks = "Remarks are required";

    return newErrors;
  };

  const handleSubmit = async() => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowError(true);
    } else {
      // Submit the form data
      setShowError(false);
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
              `/db/media/salesOrder/addSalesOrder`,
              formData,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
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
    }
  };

  const handleUpdate = async() => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowError(true);
    } else {
      // Submit the form data
      setShowError(false);
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
              `/db/media/salesOrder/updateSalesOrder?id=${formData?.s_o_id}`,
              formData,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
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
    }
  };

  useEffect(()=>{
    if(show){
        getSalesOrder()
    }
},[show])

  return (
    <>
      <Modal className="" show={show} onHide={()=>{
        setErrors({})
        setShowError(false)
        setFormData({})
        handleClose()
      }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Sales Order Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showError && (
            <Alert variant="danger">
              Please fill out all required fields.
            </Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="salesOrderDate">
                  <Form.Label>Sales Order Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="s_o_date"
                    value={formData.s_o_date}
                    onChange={handleChange}
                    isInvalid={!!errors.s_o_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.s_o_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="campaignId">
                  <Form.Label>Campaign ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="campaign_id"
                    value={formData.campaign_code}
                    onChange={handleChange}
                    placeholder="Select Campaign"
                    disabled
                    isInvalid={!!errors.campaign_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.campaign_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="campaignName">
                  <Form.Label>Campaign Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.campaign_name}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="clientAgencyName">
                  <Form.Label>Client / Agency Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="acc_id"
                    value={formData.acc_name}
                    onChange={handleChange}
                    placeholder="Select Client/Agency"
                    disabled
                    isInvalid={!!errors.acc_name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.acc_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="estimateId">
                  <Form.Label>Estimate ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="estimate_id"
                    value={formData.estimate_code}
                    onChange={handleChange}
                    disabled
                    isInvalid={!!errors.estimate_code}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.estimate_code}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="salesPoNumber">
                  <Form.Label>Sales PO Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="s_o_po_number"
                    value={formData.s_o_po_number}
                    onChange={handleChange}
                    placeholder="Enter PO Number"
                    isInvalid={!!errors.s_o_po_number}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.s_o_po_number}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="salesPoDate">
                  <Form.Label>Sales PO Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="s_o_po_date"
                    value={formData.s_o_po_date}
                    onChange={handleChange}
                    isInvalid={!!errors.s_o_po_date}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.s_o_po_date}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="salesPoValue">
                  <Form.Label>Sales PO Value</Form.Label>
                  <Form.Control
                    type="number"
                    name="s_o_po_value"
                    value={formData.s_o_po_value}
                    onChange={handleChange}
                    placeholder="Enter PO Value"
                    isInvalid={!!errors.s_o_po_value}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.s_o_po_value}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group controlId="remarks">
                  <Form.Label>Remarks</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="s_o_po_remarks"
                    value={formData.s_o_po_remarks}
                    onChange={handleChange}
                    placeholder="Enter any remarks"
                    isInvalid={!!errors.s_o_po_remarks}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.s_o_po_remarks}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" disabled={loading} onClick={()=>{
        setErrors({})
        setShowError(false)
        setFormData({})
        handleClose()
      }}>
            Close
          </Button>
          <Button disabled={loading} variant="primary" onClick={()=>{
            flag==false ? handleSubmit() :handleUpdate()
          }}>
          { flag==false ?  loading ? "Saving...":"Save":loading? "Updating...":"Update"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModelSalesOrder;
