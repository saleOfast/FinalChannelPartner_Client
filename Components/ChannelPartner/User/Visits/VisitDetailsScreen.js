import axios from 'axios'
import { getCookie, hasCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Baseurl } from '../../../../Utils/Constants'
import { toast } from 'react-toastify'
import VisitHistoryModel from './VisitHistoryModel'
import FinishVisitModal from './FinishVisitModal'

const VisitDetailsScreen = () => { 
  const router = useRouter()
  const { id, type } = router.query;
  const isCpVisit = type === "cp";
  const [visitData, setVisitData] = useState([])
  const clientBtnColor = hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
  const [show, setShow] = useState(false)
  const [showFinishVisit, setShowFinishVisit] = useState(false)
  const [visitHistory, setVisitHiistory] = useState([])

  function formatTime(timeString) {
    const timeParts = (timeString || '').split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
  
    const date = new Date(2000, 0, 1, hours, minutes);
  
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }
  
  function formatDate(date) {
    if (!date) return "---------";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "---------";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  const getClientVisitById = async () => {
    if (!hasCookie('token')) return;
    const token = getCookie('token');
    const db_name = getCookie('db_name');
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer ".concat(token),
        db: db_name,
        m_id: 76,
      }
    };

    try {
      const { data } = await axios.get(Baseurl + `/db/channel/visit?visit_id=${id}`, header);
      setVisitData(data?.data);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { autoClose: 2500 });
      } else {
        toast.error("Something went wrong!", { autoClose: 2500 });
      }
    }
  };

  const getCpVisitById = async () => {
    if (!hasCookie('token')) return;
    const token = getCookie('token');
    const db_name = getCookie('db_name');
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        m_id: 76,
      }
    };

    try {
      const { data } = await axios.get(`${Baseurl}/db/channelPartnerLeads?db_name=${db_name}`, header);
      const lead = data?.data?.find((item) => String(item?.cpl_id) === String(id));
      if (!lead) {
        toast.error("CP visit record not found", { autoClose: 2500 });
        return;
      }
      setVisitData(lead);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { autoClose: 2500 });
      } else {
        toast.error("Something went wrong!", { autoClose: 2500 });
      }
    }
  };

  const getClientVisitHistory = async () => {
    if (!hasCookie('token')) return;
    const token = getCookie('token');
    const db_name = getCookie('db_name');
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer ".concat(token),
        db: db_name,
        pass: "pass"
      }
    };

    try {
      const { data } = await axios.get(Baseurl + `/db/channel/visit/getRevisitHistory?visit_id=${id}`, header);
      setVisitHiistory(data?.data || []);
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { autoClose: 2500 });
      } else {
        toast.error("Something went wrong!", { autoClose: 2500 });
      }
    }
  };

  const getCpVisitHistory = async () => {
    if (!hasCookie('token')) return;
    const db_name = getCookie('db_name');
    const token = getCookie('token');
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        pass: "pass",
      }
    };

    try {
      const { data } = await axios.get(
        `${Baseurl}/db/channelPartnerLeads/getLeadDetails?db_name=${db_name}&cpl_id=${id}`,
        header
      );
      const history = data?.data || [];
      setVisitHiistory(
        history.map((item) => ({
          revisit_date: item?.follow_up_date,
          revisit_time: "",
          remark: [item?.stage, item?.remarks].filter(Boolean).join(" - "),
        }))
      );
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { autoClose: 2500 });
      } else {
        toast.error("Something went wrong!", { autoClose: 2500 });
      }
    }
  };

  useEffect(() => {
    if (!id) return;
    if (isCpVisit) {
      getCpVisitById();
      getCpVisitHistory();
    } else {
      getClientVisitById();
      getClientVisitHistory();
    }
  }, [id, type]);

  const cpLeadName = `${visitData?.first_name || ""} ${visitData?.last_name || ""}`.trim();
  const visitStatus = isCpVisit ? (visitData?.stage || "VISIT") : (visitData?.status || "Upcoming");

  const handleBackToVisits = () => {
    if (isCpVisit) {
      setCookie("VisitTypeTab", "cp");
    } else {
      setCookie("VisitTypeTab", "client");
    }
    router.push("/partner/Visits");
  };

  return (
    <>
    <div className='w-100 overflow-auto pb-5'>
       <section className="Channel-profile  Visit-Details pt-4 pb-2">
  <div className="container  mt-4 mb-4">
    <div className="row gx-4">
      <div className="profile-text mb-4">Visits/ Visit Detail</div>
      <div className="col-12  col-lg-12">
        <div className="lead-detail-sec overflow-hidden">
          <ul className="list-group General-list h-auto rounded-0 m-0">
            <li style={{background:`${clientBtnColor}`}} href="#" className="list-group-item list-group-item-action  text-white d-flex justify-content-between" aria-current="true">
              <span className="lead-id text-white">
                {isCpVisit ? `CPL-${visitData?.cpl_id || id}` : visitData?.visit_code}
              </span>
            </li>
          </ul>
          <ul className="list-group General-list d-flex flex-column gap-4 bg-white leads-content h-auto m-0">
            {isCpVisit ? (
              <>
                <div className="row">
                  <div className="col-6 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">CP Lead Name</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">{cpLeadName || "---------"}</span>
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
                      <span className="list-right">{visitData?.email || "---------"}</span>
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
                      <span className="list-right">+91-{visitData?.contact || "---------"}</span>
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
                      <span className="list-right">{visitData?.project_name || visitData?.sales_project_name || "---------"}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Visit Date</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">{formatDate(visitData?.follow_up_date)}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Visit Type</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">{visitData?.visit_type || "---------"}</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-6 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Assigned To</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">{visitData?.user || "---------"}</span>
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
                      <span className="list-right">{visitData?.stage || "---------"}</span>
                    </div>
                  </div>
                </div>
                {visitData?.remarks && (
                  <div className="row">
                    <div className="col-6 col-md-5">
                      <div className="list-group-item list-group-item-action p-0 border-0">
                        <span className="list-left">Remarks</span>
                      </div>
                    </div>
                    <div className="col-6 col-md-6">
                      <div className="list-group-item list-group-item-action p-0 border-0">
                        <span className="list-right">{visitData?.remarks}</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-6 col-md-5">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-left">Registration Date</span>
                    </div>
                  </div>
                  <div className="col-6 col-md-6">
                    <div className="list-group-item list-group-item-action p-0 border-0">
                      <span className="list-right">{formatDate(visitData?.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                  <span className="list-right">{visitData?.leadData?.sales_project_name || "------"}
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
                  <span className="list-right">{visitData?.status}</span>
                </div>
              </div>
            </div>
            {
              visitData?.visit_remark && (
                <div className="row">
                <div className="col-6 col-md-5">
                  <div className="list-group-item list-group-item-action p-0 border-0">
                    <span className="list-left">Visit Remark</span>
                  </div>
                </div>
                <div className="col-6 col-md-6">
                  <div className="list-group-item list-group-item-action p-0 border-0">
                    <span className="list-right">{visitData?.visit_remark ? visitData?.visit_remark :"---------"}</span>
                  </div>
                </div>
              </div>
              )
            }
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Created At</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{formatDate(visitData?.createdAt?.split("T"))}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Created By</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{visitData?.leadData?.leadOwner?.user ?visitData?.leadData?.leadOwner?.user :"---------"}</span>
                </div>
              </div>
            </div>
            {
              visitData?.revisit_date && (
                <div className="row">
                <div className="col-6 col-md-5">
                  <div className="list-group-item list-group-item-action p-0 border-0">
                    <span className="list-left">Revisit Date</span>
                  </div>
                </div>
                <div className="col-6 col-md-6">
                  <div className="list-group-item list-group-item-action p-0 border-0">
                    <span className="list-right">{formatDate(visitData?.revisit_date)}</span>
                  </div>
                </div>
              </div>
              )
            }
            
            {
              visitData?.revisit_time && (
                <div className="row">
              <div className="col-6 col-md-5">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-left">Revisit Time</span>
                </div>
              </div>
              <div className="col-6 col-md-6">
                <div className="list-group-item list-group-item-action p-0 border-0">
                  <span className="list-right">{formatTime(visitData?.revisit_time)}</span>
                </div>
              </div>
            </div>
              )
            }
              </>
            )}
          </ul></div>
        <div className="details-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
          <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0"
            style={{background:`${clientBtnColor}`}}
            onClick={handleBackToVisits}
          >Back to Visits</button>
          <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0"
            style={{background:`${clientBtnColor}`}}
            onClick={()=>{
              setShow(true)
            }}
          >Visit History</button>
          {isCpVisit && (
            <button className="back-to-lead d-flex align-items-center justify-content-center text-white border-0"
              style={{background:`${clientBtnColor}`}}
              onClick={() => setShowFinishVisit(true)}
            >Finish Visit</button>
          )}
        </div>
        
        
      </div>  
    </div>                                                                                                                                                                                                                                                                                                             
  </div>
</section>
    </div>

    <VisitHistoryModel
        show={show}
        setShow={setShow}
        visitHistory={visitHistory}
    />

    {isCpVisit && (
      <FinishVisitModal
        show={showFinishVisit}
        setShow={setShowFinishVisit}
        visitStatus={visitStatus}
      />
    )}
    </>

  )
}

export default VisitDetailsScreen
