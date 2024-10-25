import React, { useEffect, useState } from 'react'
import { fetchData } from '../../../Utils/getReq';
import { Table } from 'react-bootstrap';
import Link from 'next/link';
import moment from 'moment';

const SiteBookingHistory = ({id,errorToast,setErrorToast}) => {

  const [bookingHistory,setBookingHistory] =useState([])

  async function getBookingHistory(id) {
    await fetchData(
      `/db/media/estimation/getSiteBookingHistory?estimate_id=${id}`,
      setBookingHistory,
      errorToast,
      setErrorToast
    );
  }
  useEffect(()=>{
    if(id){
        getBookingHistory(id)
    }
  },[id])

  return (
    <>
            <div className="add_screen_head">
                    <span className="text_bold">Site Booking History</span>
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
                            <th>Booking History ID</th>
                            <th>Site ID</th>
                            <th>Campaign ID</th>
                            <th>Campaign Start Date</th>
                            <th>Campaign End Date</th>
                            <th>Campaign Total Days</th>
                            <th>Campaign Status</th>
                            <th>Client Cost</th>
                            <th>Vendor Cost</th>
                            <th>Margin</th>
                            <th>Margin %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookingHistory.map((booking,index) => (
                            <tr key={index}>
                              <td>{booking?.sb_code}</td>
                              <td>
                                <Link href={`/sites/${booking}`}>{booking?.db_site?.site_code}</Link>
                              </td>
                              <td>
                                <Link href={`/campaigns/${booking}`}>{booking?.db_media_campaign?.campaign_code}</Link>
                              </td>
                              <td>{moment(booking?.db_media_campaign?.campaign_start_date).format("DD/MM/YYYY")
                              }</td>
                              <td>{moment(booking?.db_media_campaign?.campaign_end_date).format("DD/MM/YYYY")
                              }</td>
                              <td>{booking?.db_media_campaign?.campaign_duration}</td>
                              <td>{booking?.db_media_campaign?.db_campaign_status?.cmpn_s_name}</td>
                              <td>{booking?.db_asset_client_cost_sheet?.final_client_po_cost?.toFixed(2)}</td>
                              <td>{(booking.db_asset_vendor_cost_sheet?.mounting_cost+booking.db_asset_vendor_cost_sheet?.printing_cost+booking.db_asset_vendor_cost_sheet?.final_display_cost).toFixed(2)}</td>
                              <td>{booking?.db_media_campaign?.overall_margin}</td>
                              <td>{booking?.db_media_campaign?.overall_margin_percentage}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    </div>
                    </div>
    </>
  )
}

export default SiteBookingHistory