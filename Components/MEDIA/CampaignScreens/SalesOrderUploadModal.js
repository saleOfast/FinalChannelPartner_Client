import React from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SalesOrderUploadModal = ({show,setShow,userInfo,setUserInfo,salesOrderUploadHandler,handlePoUpload,prevCmpStatusId}) => {
  return (
    <>  
        <Modal className="commonModal" show={show} onHide={() => {
                      setUserInfo({ ...userInfo, cmpn_s_id: prevCmpStatusId });
                      setShow(false);
                    }}>
                      <Modal.Header closeButton>
                        <Modal.Title>Sales Order Upload</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        {/* PDF Upload */}
                        <Form.Group controlId="fileUpload">
                          <Form.Label>Sales Order PDF *</Form.Label>
                          <Form.Control
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handlePoUpload(e)}
                          />
                        </Form.Group>

                        {/* Sales Order PO Number */}
                        <Form.Group controlId="poNumber">
                          <Form.Label>PO Number *</Form.Label>
                          <Form.Control
                            type="text"
                            value={userInfo.s_o_po_number || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_number: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Date */}
                        <Form.Group controlId="poDate">
                          <Form.Label>PO Date *</Form.Label>
                          <Form.Control
                            type="date"
                            value={userInfo.s_o_po_date || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_date: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Value */}
                        <Form.Group controlId="poValue">
                          <Form.Label>PO Value *</Form.Label>
                          <Form.Control
                            type="number"
                            value={userInfo.s_o_po_value || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_value: e.target.value })}
                          />
                        </Form.Group>

                        {/* Sales Order PO Remarks */}
                        <Form.Group controlId="poRemarks">
                          <Form.Label>PO Remarks *</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={userInfo.s_o_po_remarks || ''}
                            onChange={(e) => setUserInfo({ ...userInfo, s_o_po_remarks: e.target.value })}
                          />
                        </Form.Group>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button variant="primary" onClick={() => {
                          // Perform validation
                          const { sales_order_pdf, s_o_po_number, s_o_po_date, s_o_po_value, s_o_po_remarks } = userInfo;

                          if (!sales_order_pdf || !s_o_po_number || !s_o_po_date || !s_o_po_value || !s_o_po_remarks) {
                            return toast.error("Please fill all mandatory fields", { autoClose: 2500 });
                          }

                          // If all validations pass, handle the submission
                          salesOrderUploadHandler();
                        }}>
                          SUBMIT
                        </Button>
                      </Modal.Footer>
                    </Modal>
    </>
  )
}

export default SalesOrderUploadModal