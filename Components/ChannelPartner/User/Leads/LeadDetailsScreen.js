import axios from 'axios';
import { getCookie, hasCookie } from 'cookies-next';
import Link from 'next/link'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Baseurl } from '../../../../Utils/Constants';
import { toast } from 'react-toastify';

const LeadDetailsScreen = () => {
  const [showAssignTo, setShowAssignTo] = useState("");
  const router=useRouter();
  const {id}=router.query;

  const [lead,setLead]=useState({
    lead_id:"",
    lead_name: "", 
    email_id: "",
    p_contact_no: "", 
    address: "", 
    pincode: "", 
    p_visit_date: "",
    p_visit_time: "", 
    project_id:"",
    project_name:"",
  })
 
  const [projectList,setProjectList]=useState([])
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"

  useEffect(()=>{
    if(id){
      getDataListById();
    }
  },[id])

  const getDataListById = async () => {
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
            
            const leads = await axios.get(Baseurl + `/db/channel/lead?lead_id=${id}`, header);
            const projects = await axios.get(Baseurl + `/db/channel/project`, header);
            setLead({
              ...lead,
              lead_id:leads.data.data.lead_id,
    lead_name: leads.data.data.lead_name, 
    email_id: leads.data.data.email_id,
    p_contact_no: leads.data.data.p_contact_no, 
    address: leads.data.data.address, 
    pincode: leads.data.data.pincode, 
    p_visit_date: leads.data.data.p_visit_date,
    p_visit_time: leads.data.data.p_visit_time, 
    project_id:leads.data.data.projectData.project_id,
    project_name:leads.data.data.projectData.project,
            });
            setProjectList(projects.data.data);
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
  }
  
  const createLead =  async(e) => {
  e.preventDefault();
     if (!hasCookie("token")) return;
     const token = getCookie("token");
     const db_name = getCookie("db_name");
     const header = {
       headers: {
         Accept: "application/json",
         Authorization: `Bearer ${token}`,
         db: db_name,
         m_id: 79,
       },
     };
 
    
     try {
       const response = await axios.put(`${Baseurl}/db/channel/lead`,lead, header);
       if (response.status === 200 || response.status === 201) {
         toast.success(response.data.message);
         setShowAssignTo(false)
         toast.success(response.message)
         getDataListById();
       }
     } catch (error) {
      console.log(error)
       if (error?.response?.data?.status === 422) {
             toast.error(error?.response?.data?.message)
             
       }
       if (error?.response?.data?.message) {
         toast.error(error.response.data.message);
       } else {
         toast.error("Something went wrong!");
       }
     }
 };

 function formatTime(timeString) {
  const timeParts = timeString.split(':');
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
  <section className="Channel-profile Booking-Detail Visit-Details bg-white pt-4 pb-2">
  <div className="container mt-4 mb-4">
    <div className="row gx-4">
      <div className="profile-text mb-2 mb-md-4">Leads/ Lead Detail</div>
      <div className="col-12  col-lg-12"  >
        <div className="lead-detail-sec overflow-hidden" >
          <ul className="list-group General-list h-auto rounded-0 m-0">
            <li  style={{background:`${clientBtnColor}`}}  className="list-group-item list-group-item-action active active-list text-white d-flex justify-content-between" aria-current="true">
              <span className="lead-id">{lead?.lead_id}</span>
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
                      <span className="list-right">{lead?.lead_name}</span>
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
                      <span className="list-right">{lead?.email_id}</span>
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
                      <span className="list-right">{lead?.p_contact_no}</span>
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
                      <span className="list-right">{lead?.project_name}
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
                      <span className="list-right">{lead?.address}</span>
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
                      <span className="list-right">{lead?.pincode}</span>
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
                      <span className="list-right">{formatDate(lead.p_visit_date)}</span>
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
                    <span className="list-right">
        {lead?.p_visit_time ? formatTime(lead?.p_visit_time) : ''}
      </span>
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
      <button style={{background:`${clientBtnColor}`}} className="back-to-lead d-flex align-items-center justify-content-center text-white border-0">
        Back to Leads</button>
    </Link>
  </div>
  </section>
  <Modal
          className="w-100"
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
              <div className="">
                <form id="survey-form" method='post' onSubmit={(e)=>{createLead(e)}} >
                  <div className='row'>
                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Lead Name<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus value={lead?.lead_name} onChange={(e)=>{
                              setLead({...lead,lead_name:e.target.value})
                            }} 
                            type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Location<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus value={lead?.address} onChange={(e)=>{
                              setLead({...lead,address:e.target.value})
                            }} type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Email<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus value={lead?.email_id} onChange={(e)=>{
                              setLead({...lead,email_id:e.target.value})
                            }} type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Pincode<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus  value={lead?.pincode} onChange={(e)=>{
                              setLead({...lead,pincode:e.target.value})
                            }}  type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Contact No<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus  value={lead?.p_contact_no} onChange={(e)=>{
                              setLead({...lead,p_contact_no:e.target.value})
                            }} type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Visit Date<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus  value={lead?.p_visit_date} onChange={(e)=>{
                              setLead({...lead,p_visit_date:e.target.value})
                            }} type="Date" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Project<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                          <select name value={lead?.project_id} onChange={(e)=>{
                            setLead({...lead,project_id:e.target.value})
                          }} className="form-select dropdown" style={{paddingTop: 12, paddingBottom: 12}}>
                            <option value selected disabled>Select</option>
                            {
                              projectList?.map((project)=>(
                                <option key={project?.project_id} value={project?.project_id} className="dropdown-item" href="#">
                                  {project?.project}
                            </option>
                              ))
                            }
                          </select>
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Visit Time<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus  value={lead?.p_visit_time} onChange={(e)=>{
                              setLead({...lead,p_visit_time:e.target.value})
                            }} type="time" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="new-leades-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
                    <div  className="cancel-btn d-flex align-items-center cursor-pointer justify-content-center bg-transparent" 
                    onClick={() => {setShowAssignTo("")
                    }}>Cancel</div>
                    <button className="submit-btn d-flex align-items-center justify-content-center text-white border-0">Submit</button>
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