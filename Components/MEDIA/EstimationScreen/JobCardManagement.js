import { getCookie, hasCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { Baseurl } from '../../../Utils/Constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

const JobCardManagement = ({id,type}) => {

  const [displayRequest,setDisplayRequest]=useState([])
  const [mountingRequest,setMountingRequest]=useState([])
  const [printingRequest,setPrintingRequest]=useState([])

  const getJobCards = async (id,type) => {
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
        const ACCOUNT_TYPES = {
          PRINTING: 13,
          MOUNTING: 14,
          DISPLAY_TYPE1: 12,
          DISPLAY_TYPE2: 10
      };
        try {
            const response = await axios.get(Baseurl + `/db/media/jobCard/getJobCard?estimate_id=${id}`, header);
            if (response?.status == 200 || response?.status == 201) {
              const data = response?.data?.data || [];
              
              setPrintingRequest(data.filter(item => item.account_type_id == ACCOUNT_TYPES.PRINTING));
              setMountingRequest(data.filter(item => item.account_type_id == ACCOUNT_TYPES.MOUNTING));
              
              const displayType = type == 1 ? ACCOUNT_TYPES.DISPLAY_TYPE1 : ACCOUNT_TYPES.DISPLAY_TYPE2;
              setDisplayRequest(data.filter(item => item.account_type_id == displayType));
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

useEffect(() => {
  if (id && type !== undefined) { // Check that both id and type are valid
    getJobCards(id, type);
  }
}, [id, type]);


  return (
    <div className=''>
      <div className="add_screen_head">
        <span className="text_bold">Job Card Management</span>
      </div>

      {/* Display Table */}
      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Display Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Request Date</th>
            <th>Display Vendor Code</th>
            <th>Display Vendor Name</th>
            <th>Campaign Id</th>
            <th>Estimate Id</th>
            <th>Campaign Start Date</th>
            <th>Campaign End Date</th>
            <th>Campaign Duration</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {displayRequest?.map((request, index) => (
            <tr key={index}>
            <td>{request.jc_code}</td>
            <td>{moment(request.jc_request_date).format("YYYY-MM-DD")}</td>
            <td>{request.jc_vendor_code}</td>
            <td>{request.jc_vendor_name}</td>
            <td>{request.campaign_code||request.campaign_id}</td>
            <td>{request.estimation_code||request.estimate_id}</td>
            <td>{moment(request.campaign_start_date).format("YYYY-MM-DD")}</td>
            <td>{moment(request.campaign_end_date).format("YYYY-MM-DD")}</td>
            <td>{request.campaign_duration}</td>
            <td>{request.site_code ||request.site_id}</td>
            <td>{request.site_state}</td>
            <td>{request.site_city}</td>
            <td>{request.site_location}</td>
            <td>{request.site_width}</td>
            <td>{request.site_height}</td>
            <td>{request.site_quantity}</td>
            <td>{request.site_total_payout}</td>
          </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>
      
      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Mounting Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
          <th>Request ID</th>
          <th>Request Date</th>
            <th>Mounting Vendor Code</th>
            <th>Mounting Vendor Name</th>
            <th>Campaign Id</th>
            <th>Estimate Id</th>
            <th>Campaign Start Date</th>
            <th>Campaign End Date</th>
            <th>Campaign Duration</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {mountingRequest.map((request, index) => (
            <tr key={index}>
            <td>{request.jc_code}</td>
            <td>{moment(request.jc_request_date).format("YYYY-MM-DD")}</td>
            <td>{request.jc_vendor_code}</td>
            <td>{request.jc_vendor_name}</td>
            <td>{request.campaign_code||request.campaign_id}</td>
            <td>{request.estimation_code||request.estimate_id}</td>
            <td>{moment(request.campaign_start_date).format("YYYY-MM-DD")}</td>
            <td>{moment(request.campaign_end_date).format("YYYY-MM-DD")}</td>
            <td>{request.campaign_duration}</td>
            <td>{request.site_code ||request.site_id}</td>
            <td>{request.site_state}</td>
            <td>{request.site_city}</td>
            <td>{request.site_location}</td>
            <td>{request.site_width}</td>
            <td>{request.site_height}</td>
            <td>{request.site_quantity}</td>
            <td>{request.site_total_payout}</td>
          </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>

      <div className="add_user_form">
            <div className="row">
                 <span className="text_bold mb-2">Printing Requests</span>
                 <Table striped bordered hover responsive>
        <thead>
          <tr>
          <th>Request ID</th>
            <th>Request Date</th>
            <th>Printing Vendor Code</th>
            <th>Printing Vendor Name</th>
            <th>Printing Material</th>
            <th>Campaign Id</th>
            <th>Estimate Id</th>
            <th>Campaign Start Date</th>
            <th>Campaign End Date</th>
            <th>Campaign Duration</th>
            <th>Site ID</th>
            <th>Site State</th>
            <th>Site City</th>
            <th>Site Location</th>
            <th>Width (Ft.)</th>
            <th>Height (Ft.)</th>
            <th>Quantity</th>
            <th>Total Payout</th>
          </tr>
        </thead>
        <tbody>
          {printingRequest.map((request, index) => (
            <tr key={index}>
              <td>{request.jc_code}</td>
              <td>{moment(request.jc_request_date).format("YYYY-MM-DD")}</td>
              <td>{request.jc_vendor_code}</td>
              <td>{request.jc_vendor_name}</td>
              <td>{request.printing_material}</td>
              <td>{request.campaign_code||request.campaign_id}</td>
              <td>{request.estimation_code||request.estimate_id}</td>
              <td>{moment(request.campaign_start_date).format("YYYY-MM-DD")}</td>
              <td>{moment(request.campaign_end_date).format("YYYY-MM-DD")}</td>
              <td>{request.campaign_duration}</td>
              <td>{request.site_code ||request.site_id}</td>
              <td>{request.site_state}</td>
              <td>{request.site_city}</td>
              <td>{request.site_location}</td>
              <td>{request.site_width}</td>
              <td>{request.site_height}</td>
              <td>{request.site_quantity}</td>
              <td>{request.site_total_payout}</td>
            </tr>
          ))}
        </tbody>
      </Table>
            </div>
      </div>

     

    </div>
  );
};

export default JobCardManagement;