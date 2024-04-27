import Link from 'next/link'
import React, { useState } from 'react'
import { Modal } from 'react-bootstrap'

const LeadDetailsScreen = () => {
  const [showAssignTo, setShowAssignTo] = useState("");
  return (
    <div className='w-100 bg-white overflow-auto'>
  <section className="Channel-profile Booking-Detail Visit-Details bg-white pt-4 pb-2">
  <div className="container mt-4 mb-4">
    <div className="row gx-4">
      <div className="profile-text mb-2 mb-md-4">Leads/ Lead Detail</div>
      <div className="col-12  col-lg-12">
        <div className="lead-detail-sec overflow-hidden">
          <ul className="list-group General-list h-auto rounded-0 m-0">
            <li   className="list-group-item list-group-item-action active active-list text-white d-flex justify-content-between" aria-current="true">
              <span className="lead-id">NK12648</span>
              <img src="/ChannelPartner/profile-edit-white.svg" onClick={()=>setShowAssignTo(true)} alt />
            </li>
          </ul>
          <div className="row bg-white">
            <div className="col-12 col-lg-6">
              <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0 border-bottom border-lg-0">
                <div className="row">
                  <div className="col-5 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Lead Name</span>
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
                      <span className="list-right">Emerald Grove Gardens
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0">
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
                <div className="row">
                  <div className="col-5 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Possible Visit Date</span>
                    </div>
                  </div>
                  <div className="col-7 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">26/04/2024</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Possible Visit Time</span>
                    </div>
                  </div>
                  <div className="col-7 col-md-6">
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
    </div>
    <Link href={'/CHANNEL/Leads'} className="details-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
      <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0">
        Back to Leads</button>
    </Link>
  </div>
  </section>
  <Modal
          className="commonModal"
          show={!showAssignTo ? false : true}
          onHide={() => setShowAssignTo("")}
          size='xl'
          centered
        >
          <Modal.Body >
          <section className="Sign-In pt-4 Create-New-Lead" style={{padding: '0 16px'}}>
  <div className="container">
    <div className="row">
      <h3 className=" Perfect-Home text-center ">Edit Lead Details</h3>
      <div className="col-12 mt-md-5">
        <div className="Sign-In_Sign-Up Register w-100">
          <div className="perfect-home-form pt-1">
            <section className="Details_Form">
              <div className="pt-3">
                <form id="survey-form" method="GET" action>
                  <div className="d-lg-flex justify-content-lg-around">
                    <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="name" className="pb-1">Lead Name</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input autofocus type="text" name="name" className="input-field" placeholder required />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="email" className="pb-1">Email</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input type="email" name="email" className="input-field" required placeholder />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="number" className="pb-1">Contact No.</label>
                        </div>
                        <div className="rightTab">
                          <input type="tel" name="number" className="input-field" required placeholder />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="project" className="pb-1">Project</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab d-flex gap-2">
                          <select name className="form-select dropdown" style={{paddingTop: 12, paddingBottom: 12}}>
                            <option value selected disabled>Select</option>
                            <option className="dropdown-item" href="#">Emerald Grove Gardens
                            </option>
                            <option className="dropdown-item" href="#">Harmony Hills Estates
                            </option>
                            <option className="dropdown-item" href="#">Horizon Vista Villas
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                      <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                        <div className="labels">
                          <label htmlFor="Location" className="pb-1">Location</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input autofocus type="text" name="name" className="input-field" placeholder required />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="code" className="pb-1">Pincode</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab">
                          <input type="text" name="pin" className="input-field" required placeholder />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="number" className="pb-1">Possible Visit Date</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab possible-visit">
                          <input type="text" name="date" className="input-field" required placeholder />
                        </div>
                      </div>
                      <div className="rowTab">
                        <div className="labels">
                          <label htmlFor="number" className="pb-1">Possible Visit Time</label>
                          <span className="star">*</span>
                        </div>
                        <div className="rightTab possible-visit">
                          <input type="text" name="time" className="input-field" required placeholder />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="new-leades-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
                    <button className="cancel-btn d-flex align-items-center justify-content-center bg-transparent" onClick={() => setShowAssignTo("")}>Cancel</button>
                    <button className="submit-btn d-flex align-items-center justify-content-center text-white border-0">Update</button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
          </section>

          </Modal.Body>
        </Modal>
    </div>

  )
}

export default LeadDetailsScreen