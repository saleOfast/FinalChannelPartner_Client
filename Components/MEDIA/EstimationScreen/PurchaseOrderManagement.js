import moment from "moment";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table ,Alert} from "react-bootstrap";
import { fetchData } from "../../../Utils/getReq";
import EditIcon from "../../Svg/EditIcon";
import { getCookie, hasCookie } from "cookies-next";
import { Baseurl } from "../../../Utils/Constants";
import axios from "axios";
import { toast } from "react-toastify";

const PurchaseOrderManagement = ({ id, link }) => {
  const [formData, setFormData] = useState();
  const [purchaseOrder, setPurchaseOrder] = useState();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getPurchaseOrder = async (id) => {
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
        const response = await axios.get(
          Baseurl + `/db/media/purchaseOrder/getPurchaseOrder?estimate_id=${id}`,
          header
        );

        if (
          (response?.status == 200 || response?.status == 201) &&
          response?.data?.data?.length>0
        ) {
          const data = response?.data?.data;
          setPurchaseOrder(data);
        }
      } catch (error) {
        console.log(error);

        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    if(id){
      getPurchaseOrder(id);
    }
  }, [id]);

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

  const handleUpdate = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowError(true);
    } else {
      // Submit the form data
      setShowError(false);
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
          let data ={...formData}
          delete data.status;
          const response = await axios.put(
            Baseurl +
              `/db/media/purchaseOrder/updatePurchaseOrder?id=${formData?.p_o_id}`,
              data,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
            getPurchaseOrder()
            setShow(false)
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
    }
  };

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

  return (
    <>
      <div className="add_screen_head">
        <span className="text_bold">Purchase Order Management</span>
      </div>
      <div className="add_user_form">
        <div className="row">
          {
            purchaseOrder ? (
              <div
              style={{
                maxHeight: "350px", // Set the maximum height for the table
                overflowY: "auto", // Enable vertical scrolling
                marginBottom: "20px", // Add some space below the table
              }}
            >
              <Table bordered responsive>
                <thead>
                  <tr>
                    <th>PO Number</th>
                    <th>PO Date</th>
                    <th>Month</th>
                    <th>Campaign ID</th>
                    <th>Vendor</th>
                    <th>Type of Vendor</th>
                    <th>Type of Media</th>
                    <th>Total Cost</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>No. of Days</th>
                    <th>NDP Days</th>
                    <th>Invoice</th>
                    <th>Payment Status</th>
                    <th>Debit Note No.</th>
                    <th>Debit Note Date</th>
                    <th>Debit Percentage</th>
                    <th>Debit Note Amount</th>
                    <th>GST</th>
                    <th>Remarks</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      purchaseOrder?.map((item)=>(
                        <tr>
                        <td>{item?.p_o_code}</td>
                        <td>{item?.p_o_date && moment(item?.p_o_date).format("YYYY-MM-DD")}</td>
                        <td>{item?.month}</td>
                        <td>{item?.db_media_campaign?.campaign_code}</td>
                        <td>{item?.db_account?.acc_name}</td>
                        <td>{item?.db_account_type?.account_type_name}</td>
                        <td>{item?.m_t_name}</td>
                        <td>{item?.p_o_cost}</td>
                        <td>{item?.p_o_start_date && moment(item?.p_o_start_date).format("YYYY-MM-DD")}</td>
                        <td>{item?.p_o_end_date && moment(item?.p_o_end_date).format("YYYY-MM-DD")}</td>
                        <td>{item?.p_o_days}</td>
                        <td>{item?.p_o_ndp_days}</td>
                        <td>{item?.p_o_invoice}</td>
                        <td>{item?.p_o_payment_status}</td>
                        <td>{item?.p_o_debit_note_no}</td>
                        <td>{item?.p_o_debit_note_date}</td>
                        <td>{item?.p_o_debit_note_percentage}</td>
                        <td>{item?.p_o_debit_note_amount}</td>
                        <td>{item?.p_o_debit_note_gst}</td>
                        <td>{item?.p_o_debit_note_remarks}</td>
                        <td className="table_btns d-flex">
                          <button
                            className="action_btn"
                            onClick={() => {
                              setShow(true);
                              setFormData(item)
                            }}
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                        </td>
                      </tr>
                      ))
                    }
                  
                </tbody>
              </Table>
            </div>
            )
            :
            <p>No Purchase Order</p>
          }
          
        </div>
      </div>

      <Modal
        className=""
        show={show}
        onHide={() => {
          loading ? "":setShow(false);
        }}
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>Sales Order Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="p_o_code">
                  <Form.Label>PO Number</Form.Label>
                  <Form.Control type="text" value={formData?.p_o_code} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="account_type_id">
                  <Form.Label>Type of Vendor</Form.Label>
                  <Form.Control
                    type="text"
                    name="account_type_id"
                    value={formData?.db_account_type?.account_type_name}
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
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.account_type_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="acc_id">
                  <Form.Label>Vendor Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="acc_id"
                    value={formData?.db_account?.acc_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.acc_id}
                    disabled
                  />
                  <Form.Control.Feedback type="invalid">{errors.acc_id}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="campaign_id">
                  <Form.Label>Campaign ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="campaign_id"
                    value={formData?.db_media_campaign?.campaign_code}
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
                    value={formData?.m_t_name}
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
                    value={formData?.p_o_cost}
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
                    value={formData?.p_o_start_date }
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
                    value={formData?.p_o_end_date}
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
                    value={formData?.p_o_days}
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
                  value={formData?.p_o_date && moment(formData?.p_o_date).format("YYYY-MM-DD")} 
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
                    value={formData?.month}
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
                    value={formData?.p_o_ndp_days}
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
                    value={formData?.p_o_invoice}
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
                    value={formData?.p_o_payment_status}
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
                    value={formData?.p_o_debit_note_no}
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
                    value={formData?.p_o_debit_note_date}
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
                    value={formData?.p_o_debit_note_percentage}
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
                    value={formData?.p_o_debit_note_amount}
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
                    value={formData?.p_o_debit_note_gst}
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
                    value={formData?.p_o_debit_note_remarks}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            disabled={loading}
            onClick={() => {
              setShow(false);
            }}
          >
            Close
          </Button>
          <Button
          disabled={loading}
            variant="primary"
            onClick={() => {
              handleUpdate()
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                &nbsp;Update
              </>
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PurchaseOrderManagement;
