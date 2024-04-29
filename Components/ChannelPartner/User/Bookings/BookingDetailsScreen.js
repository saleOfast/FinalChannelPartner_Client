import Link from 'next/link'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

const BookingDetailsScreen = () => {
  return (
    <div className='w-100 bg-white overflow-auto'>
      <section className="Channel-profile Booking-Detail Visit-Details pt-2 pb-1">
        <div className="container mt-2 mb-5">
          <div className="row gx-4">
            <div className="profile-text mb-2 mb-md-4">Bookings/ Booking Detail</div>
            <div className="col-12  col-lg-12">
              <div className="lead-detail-sec overflow-hidden">
                <ul className="list-group General-list h-auto rounded-0 m-0">
                  <li href="#" className="list-group-item list-group-item-action active active-list text-white" aria-current="true">
                    <span className="lead-id">NK12648</span>
                    {/* <img src="./images/icons/profile-edit-white.svg" alt=""> */}
                  </li>
                </ul>
                <div className="row bg-white">
                  <div className="col-12 col-lg-6">
                    <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0 border-bottom border-lg-0">
                      <div className="row">
                        <div className="col-5 col-md-5">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Booking Name</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-6">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">Shekhar Mittal</span>
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
                            <span className="list-right">shekharmi2938@gmail.com</span>
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
                            <span className="list-right">+919283948579</span>
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
                            <span className="list-right">Harmony Hills Estates
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
                            <span className="list-right">New Delhi</span>
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
                            <span className="list-right">110012</span>
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
                            <span className="list-right">26/04/2024</span>
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
                            <span className="list-right">11:30 AM</span>
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
                            <span className="list-right">Lorem ipsum dolor sit amet consectetur.
                              Ultricies mattis </span>
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
                            <span className="list-right">Lorem ipsum dolor sit amet consectetur.
                              Ultricies mattis </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Possible Visit Date</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">26/04/2024</span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-5 col-md-5 col-lg-4">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-left">Possible Visit Time</span>
                          </div>
                        </div>
                        <div className="col-7 col-md-7 col-lg-8">
                          <div className="list-group-item list-group-item-action p-0 border-0">
                            <span className="list-right">11:30 AM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row gx-4 mt-3">
              <div className="col-12  col-lg-12">
                <div className="lead-detail-sec overflow-hidden">
                  <div className="row bg-white">
                    <div className="col-12  col-lg-6">
                      <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0 py-2">
                        <div className="row">
                          <div className="col-5 col-md-5 col-lg-5">
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
            </div>

          </div>

          <Link href={'/CHANNEL/Bookings'} className="details-btn d-flex justify-content-center gap-4 mt-2 mt-md-4">
            <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0">Back to Bookings</button>
          </Link>
        </div></section>

    </div>

  )
}

export default BookingDetailsScreen