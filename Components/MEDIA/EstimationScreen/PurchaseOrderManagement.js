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
  const [salesOrder, setSalesOrder] = useState();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const getSalesOrder = async () => {
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
          Baseurl + `/db/media/salesOrder/getSalesOrder?estimate_id=${id}`,
          header
        );

        if (
          (response?.status == 200 || response?.status == 201) &&
          response?.data?.data!==null
        ) {
          const data = response?.data?.data;
          setSalesOrder({
            ...salesOrder,
            campaign_code: data?.db_media_campaign?.campaign_code,
            acc_name: data?.db_account?.acc_name,
            estimate_code: data?.db_estimate?.estimation_code,
            s_o_date: moment(data?.s_o_date).format("YYYY-MM-DD"),
            s_o_po_date: moment(data?.s_o_po_date).format("YYYY-MM-DD"),
            campaign_name: data?.campaign_name,
            s_o_po_number: data?.s_o_po_number,
            s_o_po_value: data?.s_o_po_value,
            s_o_po_remarks: data?.s_o_po_remarks,
            estimate_id: data?.estimate_id,
            campaign_id: data?.campaign_id,
            acc_id: data?.acc_id,
            s_o_id: data?.s_o_id,
            s_o_code: data?.s_o_code,
            s_o_number: data?.s_o_number,
            s_o_code: data?.s_o_code,
          });
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
    getSalesOrder();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!salesOrder?.s_o_date)
      newErrors.s_o_date = "Sales Order Date is required";
    if (!salesOrder?.campaign_id)
      newErrors.campaign_id = "Campaign ID is required";
    if (!salesOrder?.acc_id)
      newErrors.acc_id = "Client/Agency Name is required";
    if (!salesOrder?.estimate_id)
      newErrors.estimate_id = "Estimate ID is required";
    if (!salesOrder?.s_o_po_number)
      newErrors.s_o_po_number = "Sales PO Number is required";
    if (!salesOrder?.s_o_po_date)
      newErrors.s_o_po_date = "Sales PO Date is required";
    if (!salesOrder?.s_o_po_value)
      newErrors.s_o_po_value = "Sales PO Value is required";
    if (!salesOrder?.s_o_po_remarks)
      newErrors.s_o_po_remarks = "Remarks are required";

    return newErrors;
  };

  const handleUpdate = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setShowError(true);
    } else {
      // Submit the form data
      setShowError(false);
      if (hasCookie("token")) {
        setLoading(true);
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
              `/db/media/salesOrder/updateSalesOrder?id=${salesOrder?.s_o_id}`,
            salesOrder,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success(response?.data?.message);
            setLoading(false);
            setShow(false)
          }
        } catch (error) {
          console.log(error);
          if (error?.response?.data?.message) {
            toast.error(error?.response?.data?.message);
          } else {
            toast.error("Something went wrong!");
          }
          setLoading(false);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalesOrder({ ...salesOrder, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: false }); // Clear the error for that field if it's corrected
    }
  };

  return (
    <>
      <div className="add_screen_head">
        <span className="text_bold">Purchase Order Management</span>
      </div>
      <div className="add_user_form">
        <div className="row">
          {
            salesOrder ? (
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
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{/* PO Number (Auto-generated) */}</td>
                    <td>{/* PO Date (Date input) */}</td>
                    <td>{/* Month (Text) */}</td>
                    <td>{/* Campaign ID (Lookup) */}</td>
                    <td>{/* Vendor (Lookup) */}</td>
                    <td>{/* Type of Vendor (Picklist) */}</td>
                    <td>{/* Type of Media (Text) */}</td>
                    <td>{/* Total Cost (Currency) */}</td>
                    <td>{/* Start Date (Date input) */}</td>
                    <td>{/* End Date (Date input) */}</td>
                    <td>{/* No. of Days (Number input) */}</td>
                    <td>{/* NDP Days (Number input) */}</td>
                    <td>{/* Invoice (Text input) */}</td>
                    <td>{/* Payment Status (Picklist) */}</td>
                    <td>{/* Debit Note No. (Text input) */}</td>
                    <td>{/* Debit Note Date (Date input) */}</td>
                    <td>{/* Debit Percentage (%) */}</td>
                    <td>{/* Debit Note Amount (Currency input) */}</td>
                    <td>{/* GST (Text input) */}</td>
                    <td>{/* Remarks (Text input) */}</td>
                    <td className="table_btns d-flex">
                      <button
                        className="action_btn"
                        onClick={() => {
                          setShow(true);
                        }}
                        title="Edit"
                      >
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
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
          {showError && (
            <Alert variant="danger">Please fill out all required fields.</Alert>
          )}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group controlId="salesOrderDate">
                  <Form.Label>Sales Order Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="s_o_date"
                    value={salesOrder?.s_o_date}
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
                    value={salesOrder?.campaign_code}
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
                    value={salesOrder?.campaign_name}
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
                    value={salesOrder?.acc_name}
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
                    value={salesOrder?.estimate_code}
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
                    value={salesOrder?.s_o_po_number}
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
                    value={salesOrder?.s_o_po_date}
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
                    value={salesOrder?.s_o_po_value}
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
                    value={salesOrder?.s_o_po_remarks}
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
