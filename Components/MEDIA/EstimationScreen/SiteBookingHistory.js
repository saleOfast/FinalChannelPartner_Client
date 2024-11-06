// import React, { useEffect, useState } from 'react'
// import { fetchData } from '../../../Utils/getReq';
// import { Table } from 'react-bootstrap';
// import Link from 'next/link';
// import moment from 'moment';

// const SiteBookingHistory = ({id,errorToast,setErrorToast}) => {

//   const [bookingHistory,setBookingHistory] =useState([])

//   async function getBookingHistory(id) {
//     await fetchData(
//       `/db/media/estimation/getSiteBookingHistory?estimate_id=${id}`,
//       setBookingHistory,
//       errorToast,
//       setErrorToast
//     );
//   }
//   useEffect(()=>{
//     if(id){
//         getBookingHistory(id)
//     }
//   },[id])

//   return (
//     <>
//             <div className="add_screen_head">
//                     <span className="text_bold">Site Booking History</span>
//                   </div>
//                   <div className="add_user_form">
//                     <div className="row">
//                     <div
//                       style={{
//                         maxHeight: '350px', // Set the maximum height for the table
//                         overflowY: 'auto',   // Enable vertical scrolling
//                         marginBottom: '20px', // Add some space below the table
//                       }}
//                     >
//                       <Table striped bordered hover responsive>
//                         <thead>
//                           <tr>
//                             <th>Booking History ID</th>
//                             <th>Site ID</th>
//                             <th>Campaign ID</th>
//                             <th>Campaign Start Date</th>
//                             <th>Campaign End Date</th>
//                             <th>Campaign Total Days</th>
//                             <th>Campaign Status</th>
//                             <th>Client Cost</th>
//                             <th>Vendor Cost</th>
//                             <th>Margin</th>
//                             <th>Margin %</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {bookingHistory.map((booking,index) => (
//                             <tr key={index}>
//                               <td>{booking?.sb_code}</td>
//                               <td>
//                               <Link href={`/media/AddSites/?id=${booking?.db_site?.site_id}&vw=md`}>{booking?.db_site?.site_code}</Link>
//                               </td>
//                               <td>
//                                 {booking?.db_media_campaign?.campaign_code}
//                               </td>
//                               <td>{moment(booking?.db_media_campaign?.campaign_start_date).format("DD/MM/YYYY")
//                               }</td>
//                               <td>{moment(booking?.db_media_campaign?.campaign_end_date).format("DD/MM/YYYY")
//                               }</td>
//                               <td>{booking?.db_media_campaign?.campaign_duration}</td>
//                               <td>{booking?.db_media_campaign?.db_campaign_status?.cmpn_s_name}</td>
//                               <td>{booking?.db_asset_client_cost_sheet?.final_client_po_cost?.toFixed(2)}</td>
//                               <td>{(booking.db_asset_vendor_cost_sheet?.mounting_cost+booking.db_asset_vendor_cost_sheet?.printing_cost+booking.db_asset_vendor_cost_sheet?.final_display_cost).toFixed(2)}</td>
//                               <td>{booking?.db_media_campaign?.overall_margin}</td>
//                               <td>{booking?.db_media_campaign?.overall_margin_percentage}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                     </div>
//                     </div>
//                     </div>
//     </>
//   )
// }

// export default SiteBookingHistory



import React, { useEffect, useState } from 'react';
import { fetchData } from '../../../Utils/getReq';
import { Table, Modal, Button } from 'react-bootstrap';
import Link from 'next/link';
import moment from 'moment';
import EditIcon from '../../Svg/EditIcon';
import { getCookie, hasCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl } from '../../../Utils/Constants';
import { toast } from 'react-toastify';

const SiteBookingHistory = ({ id, errorToast, setErrorToast }) => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [siteId, setSiteId] = useState("");
  const [campaignId, setCampaignId] = useState("");
  const [siteBookingId, setSiteBookingId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState(0);

  async function getBookingHistory(id) {
    await fetchData(
      `/db/media/estimation/getSiteBookingHistory?estimate_id=${id}`,
      setBookingHistory,
      errorToast,
      setErrorToast
    );
  }

  useEffect(() => {
    if (id) {
      getBookingHistory(id);
    }
  }, [id]);

  // Function to calculate duration
  const calculateDuration = (start, end) => {
    const startMoment = moment(start, 'YYYY-MM-DD');
    const endMoment = moment(end, 'YYYY-MM-DD');
    return endMoment.diff(startMoment, 'days');
  };


  const handleSave = async () => {
    if (!startDate) {
      toast.warning('Please Enter Start Date',{autoClose:1500});
      return;
    }
    if (!endDate) {
      toast.warning('Please Enter End Date',{autoClose:1500});
      return;
    }

    setIsLoading(true);
    
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          // m_id:444
          pass:"pass"
        },
      };

      try {
        const response = await axios.put(
          Baseurl +
            `/db/media/estimationAssetBusiness/updateEstimationAssetBusiness`,
          {
            estimate_id: id,
            start_date: startDate,
            end_date: endDate,
            duration,
            site_id: siteId,
            sb_id:siteBookingId,
            campaign_id:campaignId
          },
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response?.data?.message);
          setShowModal(false)
          getBookingHistory(id)
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error?.response?.data?.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
      finally {
        setIsLoading(false);
        setStartDate("")
        setEndDate("")
        setDuration(0)
      }
    }
  };

  return (
    <>
      <div className="add_screen_head">
        <span className="text_bold">Site Booking History</span>
      </div>
      <div className="add_user_form">
        <div className="row">
          <div
            style={{
              maxHeight: '350px',
              overflowY: 'auto',
              marginBottom: '20px',
            }}
          >
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Booking History ID</th>
                  <th>Site ID</th>
                  <th>Campaign ID</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Campaign Status</th>
                  <th>Client Cost</th>
                  <th>Vendor Cost</th>
                  <th>Margin</th>
                  <th>Margin %</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookingHistory.map((booking, index) => (
                  <tr key={index}>
                    <td>{booking?.sb_code}</td>
                    <td>
                      <Link
                        className="text-decoration-underline"
                        href={`/media/AddSites/?id=${booking?.db_site?.site_id}&vw=md`}
                      >
                        {booking?.db_site?.site_code}
                      </Link>
                    </td>
                    <td>{booking?.db_media_campaign?.campaign_code}</td>
                    <td>{moment(booking?.start_date).format("DD/MM/YYYY")}</td>
                    <td>{moment(booking?.end_date).format("DD/MM/YYYY")}</td>
                    <td>{booking?.duration}</td>
                    <td>{booking?.db_media_campaign?.db_campaign_status?.cmpn_s_name}</td>
                    <td>{booking?.db_asset_client_cost_sheet?.final_client_po_cost?.toFixed(2)}</td>
                    <td>
                      {(booking.db_asset_vendor_cost_sheet?.mounting_cost +
                        booking.db_asset_vendor_cost_sheet?.printing_cost +
                        booking.db_asset_vendor_cost_sheet?.final_display_cost).toFixed(2)}
                    </td>
                    <td>{booking?.db_media_campaign?.overall_margin}</td>
                    <td>{booking?.db_media_campaign?.overall_margin_percentage}</td>
                    <td className="table_btns">
                      <button
                        className="action_btn"
                        title="Change Duration"
                        onClick={() => {
                          setMinDate(moment(booking?.db_media_campaign?.campaign_start_date).format("YYYY-MM-DD"));
                          setMaxDate(moment(booking?.db_media_campaign?.campaign_end_date).format("YYYY-MM-DD"));
                          setSiteId(booking?.db_site?.site_id);
                          setCampaignId(booking?.db_media_campaign?.campaign_id);
                          setSiteBookingId(booking?.sb_id)
                          setStartDate("");
                          setEndDate("");
                          setDuration(0);
                          setShowModal(true);
                        }}
                      >
                        <EditIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking Duration</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              if (endDate) {
                setDuration(calculateDuration(e.target.value, endDate));
              }
            }}
          />
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            min={startDate}
            max={maxDate}
            disabled={!startDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              if (startDate) {
                setDuration(calculateDuration(startDate, e.target.value));
              }
            }}
          />
          <label>Duration (Days)</label>
          <input
            type="number"
            className="form-control"
            value={duration}
            readOnly
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>{
          handleSave()
        }}  disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SiteBookingHistory;
