import axios from 'axios'
import { getCookie, hasCookie } from 'cookies-next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Baseurl } from '../../../../Utils/Constants'
import { toast } from 'react-toastify'

const VisitDetailsScreen = () => { 
  const router=useRouter()
  const{id}=router.query;
  const[visitData,setVisitData]=useState([])

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

  useEffect(()=>{
    if(id){
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
                const {data} = await axios.get(Baseurl + `/db/channel/visit?visit_id=${id}`, header);
               setVisitData(data?.data)
                
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
      }
      getDataListById()
    }
  },[id])
  
  return (
    <div className='w-100 bg-white overflow-auto'>
       <section className="Channel-profile  Visit-Details pt-4 pb-2">
  <div className="container  mt-4 mb-4">
    <div className="row gx-4">
      <div className="profile-text mb-4">Visits/ Visit Detail</div>
      <div className="col-12  col-lg-12">
        <div className="lead-detail-sec overflow-hidden">
          <ul className="list-group General-list h-auto rounded-0 m-0">
            <li href="#" className="list-group-item list-group-item-action active active-list text-white d-flex justify-content-between" aria-current="true">
              <span className="lead-id">NK12648</span>
            </li>
          </ul>
          <ul className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0">
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Lead Name</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.lead_name}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Email</span>
                </div>
              </div>                            
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.email_id}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Contact No.</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">+91-{visitData?.leadData?.p_contact_no}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Project</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.projectData?.project}
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Location</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.address}</span>
                </div>
              </div>                            
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Pincode</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.pincode}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Possible Visit Date</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{formatDate(visitData?.p_visit_date)}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Possible Visit Time</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{formatTime(visitData?.p_visit_time)}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Visit Status</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">Requested</span>
                </div>
              </div>
            </div>

          </ul></div>
        <Link href={'/CHANNEL/Visits'} className="details-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
          <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0">Back to Visits</button>
        </Link>
      </div>  
    </div>
  </div>
</section>


    </div>

  )
}

export default VisitDetailsScreen