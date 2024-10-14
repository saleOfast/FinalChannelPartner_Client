import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Modal, Row, Table } from 'react-bootstrap'
import { fetchData } from '../../../Utils/getReq'
import EditIcon from '../../Svg/EditIcon'
import { getCookie, hasCookie } from 'cookies-next'
import { Baseurl } from '../../../Utils/Constants'
import axios from 'axios'
import { toast } from 'react-toastify'

const SalesOrderManagement = ({id,link}) => {

    const [salesOrder,setSalesOrder] =useState([])
    const [show,setShow] =useState(false)

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
          
            const response = await axios.get(Baseurl + `/db/media/salesOrder/getSalesOrder`, header);

            if((response?.status==200 || response?.status==201 )&& response?.data?.data.length>0){
                const data=response?.data?.data[0];
                setSalesOrder({...salesOrder,
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
            // else{      
            //     setFlag(false)      
            //     setFormData({...formData,
            //         s_o_date: new Date().toISOString().slice(0, 10),
            //         campaign_name:estimateData?.db_media_campaign?.campaign_name,
            //         campaign_code:estimateData?.db_media_campaign?.campaign_code,
            //         campaign_id:estimateData?.db_media_campaign?.campaign_id,
            //         estimate_code:estimateData?.estimation_code,
            //         estimate_id:estimateData?.estimate_id,
            //         acc_name:estimateData?.db_media_campaign?.db_account?.acc_name,
            //         acc_id:estimateData?.db_media_campaign?.db_account?.acc_id
            //     })
            // }
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

  useEffect(()=>{
    getSalesOrder()
  },[])


 

  
  return (
    <>
        <div className="add_screen_head">
                    <span className="text_bold">Sales Order Management</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                    <div
                      style={{
                        maxHeight: '350px', // Set the maximum height for the table
                        overflowY: 'auto',   // Enable vertical scrolling
                        marginBottom: '20px', // Add some space below the table
                      }}
                    >
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            {/* <th>Sales Order Number</th> */}
                            <th>Sales Order Date</th>
                            <th>Campaign ID</th>
                            <th>Campaign Name</th>
                            <th>Client / Agency Name</th>
                            <th>Estimate ID</th>
                            <th>Sales PO Number</th>
                            <th>Sales PO Date</th>
                            <th>Sales PO Value</th>
                            <th>Remarks</th>                            
                            <th>PDF</th>                            
                          </tr>
                        </thead>
                        
                        <tbody>
                        <tr >
                              {/* <td>{data?.s_o_number}</td> */}
                              <td>{moment(salesOrder?.s_o_date).format("YYYY-MM-DD")}</td>
                              <td>{salesOrder?.campaign_code}</td>
                              <td>{salesOrder?.campaign_name}</td>
                              <td>{salesOrder?.acc_name}</td>
                              <td>{salesOrder?.estimate_code}</td>
                              <td>{salesOrder?.s_o_po_number}</td>
                              <td>{moment(salesOrder?.s_o_po_date).format("YYYY-MM-DD")}</td>
                              <td>{salesOrder?.s_o_po_value}</td>
                              <td>{salesOrder?.s_o_po_remarks}</td>
                              <td><a target='_blank' href={link}>PDF</a></td>
                            </tr>
                        </tbody>
                      </Table>
                    </div>
                    </div>
                    </div>

    <Modal className="" show={show} onHide={()=>{
        setShow(false)
      }} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Sales Order Management</Modal.Title>
        </Modal.Header>
        <Modal.Body>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{setShow(false)}}>
            Close
          </Button>
          <Button variant="primary" >
            SUBMIT
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default SalesOrderManagement