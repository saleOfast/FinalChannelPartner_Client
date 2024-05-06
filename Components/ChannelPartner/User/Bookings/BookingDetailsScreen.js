import { getCookie, hasCookie } from 'cookies-next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Baseurl } from '../../../../Utils/Constants'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const BookingDetailsScreen = () => {

  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
  const[bookingData,setBookingData]=useState();
  const router=useRouter()
  const {booking_id}=router.query;

  
  
  const getDataList = async (id) => {
    if (hasCookie('token')) {
        let token = (getCookie('token'));
        let db_name = (getCookie('db_name'));

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 76,
            }
        }

        try {
            const response = await axios.get(Baseurl + `/db/channel/booking?booking_id=${id}`, header);
            console.log(response.data.data);
            setBookingData(response.data.data);
        } catch (error) {
          console.log(error)
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
}

useEffect(()=>{
  getDataList(booking_id)
},[booking_id])

function formatTime(timeString) {
  const timeParts = (timeString || '').split(':');
  const hours = parseInt(timeParts[0]);
  const minutes = parseInt(timeParts[1]);

  const date = new Date(2000, 0, 1, hours, minutes);

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}


  return (
    <div className='w-100 bg-white overflow-auto'>
      <section className="Channel-profile Booking-Detail Visit-Details pt-2 pb-1">
        <div className="container mt-2 mb-5">
          <div className="row gx-4">
            <div className="profile-text mb-2 mb-md-4">Bookings/ Booking Detail</div>
            <div className="col-12  col-lg-12">
              <div className="lead-detail-sec overflow-hidden">
                <ul className="list-group General-list h-auto rounded-0 m-0">
                  <li style={{background:`${clientBtnColor}`}} href="#" className="list-group-item list-group-item-action  text-white" aria-current="true">
                    <span className="lead-id text-white">{bookingData?.booking_code}</span>
                    {/* <img src="./images/icons/profile-edit-white.svg" alt=""> */}
                  </li>
                </ul>
                <div className="row bg-white">
                  <div className="col-12 col-lg-6">
                    <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0  border-lg-0">
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Booking Name</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.booking_name}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Email</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Contact No.</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">+91{bookingData?.contact_no}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Project</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.BookingprojectData?.project}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Location</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.Location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Pincode</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.pincode}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-6">
                    <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0">
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Visit Done Date</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{formatDate(bookingData?.visit_done_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Visit Done Time</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{formatTime(bookingData?.visit_done_time)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Visit Remarks</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.visit_remarks} </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Revisit Remarks</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{bookingData?.revisit_remarks} </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Revisit Done Date</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{formatDate(bookingData?.revisit_done_date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Revisit Done Time</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">{formatTime(bookingData?.revisit_done_time)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
              <div className="col-12  col-lg-12 mt-3">
                <div className="lead-detail-sec overflow-hidden">
                  <div className="row bg-white">
                    
                      <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0 py-2">
                        <div className="row">
                          <div className="col-5 col-md-5 col-lg-2">
                            <div className="list-group-item list-group-item-action p-0 border-0">
                              <span className="list-left">Booking Status</span>
                            </div>
                          </div>
                          <div className="col-7 col-md-7 col-lg-7">
                            <div className="list-group-item list-group-item-action p-0 border-0">
                              <span className="list-right">Agreement Done</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                  </div>
                </div>
              </div>
            

          </div>

          <Link href={'/CHANNEL/Bookings'} className="details-btn d-flex justify-content-center gap-4 mt-2 mt-md-4">
            <button style={{background:`${clientBtnColor}`}} className="back-to-lead d-flex align-items-center justify-content-center text-white border-0">Back to Bookings</button>
          </Link>
        </div></section>

    </div>

  )
}

export default BookingDetailsScreen