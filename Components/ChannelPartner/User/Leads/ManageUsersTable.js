import React, { useEffect, useState } from 'react'
import MUIDataTable from "mui-datatables";
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button, Modal } from 'react-bootstrap';
import Select from 'react-select';
import axios from 'axios';
import { Baseurl } from '../../../../Utils/Constants';
import { getCookie, hasCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import DateRange from '../../../DateRangeCustom/Daterange';






const ManageUsersTable = ({ deleteConfirm, disableConfirm, leadList, openEdtMdl, title, setShowAssignTo, oldAssignTo,setoldAssignTo, setShowDateFilter,usersList,getDataList }) => {
    const router = useRouter()
    const [data, setData] = useState([])
    const [userData, setUserData] =  useState([])
    const [actionMode, setActionMode] =  useState('')
    const [showModal, setShowModal] =  useState(false)
    const [showModal2, setShowModal2] =  useState(false)
    const [userInfo, setUserInfo ] =  useState({
    user_code: '',
    reject_reason: ''
  })
  
  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11)
  });
  const[visitId,setVisitId]=useState("");
  const[p_visit_date,setVisitDate]=useState("");
  const[p_visit_time,setVisitTime]=useState("");
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"


const getVisitInfo=async(visitId)=>{
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
            
            const {data} = await axios.get(Baseurl + `/db/channel/lead?lead_id=${visitId}`, header);
            setVisitDate(data?.data?.p_visit_date)
            setVisitTime(data?.data?.p_visit_time)
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
}
  
  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  function formatTime(timeString) {
    const timeParts = (timeString || '').split(':');
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
  
    const date = new Date(2000, 0, 1, hours, minutes);
  
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${year}-${month}-${day}: ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  const permitVisit = (status, createdAt) => {
    const currentDate = new Date(); 
    const statusDate = new Date(createdAt); 

    switch (status) {
        case "Requested":
            statusDate.setDate(statusDate.getDate() + 1); 
            
            if (statusDate < currentDate) {
                return false;
            } else {
                return true;
            }
            break;

        case "Scheduled":
            return true;
            break;

        case "Completed":
            statusDate.setDate(statusDate.getDate() + 90); 
            if (statusDate < currentDate) {
                return false;
            } else {
                return true;
            }
            break;

        default:
            return false;
            break;
    }
}


    const columns = [
        {
            name: 'lead_id',
            label: "Lead ID",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div  className='status_box fw-bold' style={{color:"#293790"}} >
                            {value}
                        </div>
                    )
                }
                  
            }
        },
        {
            name: 'lead_name',
            label: "Lead Name",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <Link href={`/CHANNEL/LeadDetails?id=${tableMeta?.rowData[0]}`}  className='status_box fw-bold text-decoration-underline' style={{color:"#293790"}}>
                            {value}
                        </Link>
                    )
                }
            },

        },
        {
            name: 'email_id',
            label: "Email",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                  customBodyRender: (value, tableMeta, updateValue) => {
                    
                    return (
                        <div className='status_box fw-bold' style={{color:"#293790"}}>
                            {value}
                        </div>
                    )
                }
                
            }
        },
        {
            name: 'p_contact_no',
            label: "Contact No.",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            +91-{value}
                        </div>
                    )
                }
            }
        },
        {
            name: 'projectData',
            label: "Project",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className='status_box' style={{color:"#667799"}}>
                            {value?.project}
                        </div>
                    )
                }
            }
        },
        {
            name: 'visitList',
            label: "Action",
            options: {
                filter: true,
                customHeadRender: (columnMeta, updateDirection) => (
                    <th style={{background:`${clientBtnColor}`, color: 'white',paddingLeft:"15px"}}   >
                      {columnMeta.label}
                    </th>
                  ),
                customBodyRender: (value, tableMeta, updateValue) => {
                    return (
                        <div className="table_btns">
                            <button
                                onClick={()=>{getVisitInfo(tableMeta?.rowData[0]); setVisitId(tableMeta?.rowData[0]); setShowModal(true);}}
                                style={{background:permitVisit(value[0]?.status,value[0]?.createdAt) ? "#9C9AA5":`${clientBtnColor}`, color:"white",padding:"6px", borderRadius:"20px",border:"white"}}
                                className='pe-3 ps-3'
                                title='Request Visit'
                                disabled={permitVisit(value[0]?.status, value[0]?.createdAt)}
                                >
                                    Request Visit
                            </button>
                          
                        </div>
                    )
                }
            }
        },
    ];

    
    
    const CustomToolbar = () => {
        return (
            <div className=' d-flex justify-content-start gap-3 align-items-center '>
                <p className='fw-bold ' style={{fontSize:"18px"}} >{title}</p>
                <DateRange value={value} setValue={setValue}  getData={getDataList} />
            </div>
        );
    }

    const handleRowClick = (rowData, rowMeta) => {
        const data = rowMeta?.reduce((accu, value) => {
            accu.push(dataList[value.dataIndex].user_code);
            return accu; // Return the accumulator
        }, []);
        setUserData([...data]);
    };

    const options = {
        selectableRows: 'multiple',
        responsive: "standard",
        onRowSelectionChange : handleRowClick,
    };

    const goto = (url) => {
        router.push(url)
    }

    const updateUserHandler = async (e) => {
        e.preventDefault()
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
            const response = await axios.post(`${Baseurl}/db/channel/visit`, {
                lead_id:visitId,
                p_visit_date,
                p_visit_time,
                current_date:getCurrentDateTime()
              }, header);
            if (response.status === 200 || response.status === 201) {
              toast.success(response.data.message);
              setShowModal(false)
              toast.success(response.message)
             
            }
          } catch (error) {
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
    
      
 

    return (
      <>
        <div className="miuiTable channelTable">
          <MUIDataTable
            title={<CustomToolbar />}
            data={leadList}
            columns={columns}
            options={options}
          />
          <div>
            {/* {userData.length ?
          <div className="table_btns d-flex align-items-center justify-content-center gap-3 mt-4">
              

              <button onClick={()=>{setActionMode('Cancel'); setShowModal(false);setUserData([])}} className=" btn btn-danger rounded-5">
                Cancel
              </button>
              <button onClick={()=>{setActionMode('Assignto'); setShowModal(true)}} style={{backgroundColor: '#293790'}} className="btn  rounded-5 text-white" >
                Assign to
              </button>
            
          </div>
          : <></>
        } */}
          </div>
        </div>

        <Modal
          show={showModal}
          onHide={() => {
            setShowModal(false);
            setVisitDate("")
            setVisitTime("")
          }}
          size="lg"
          centered
        >
          <Modal.Body>
            <section
              className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill Add-New-Visit-Date-and-Time Visit-Date-and-Time d-flex justify-content-center align-items-center"
              style={{ padding: "0 16px" }}
            >
              <div className="container p-0">
                <div className="row d-flex flex-column gap-3">
                  <h3 className=" Perfect-Home text-center text-black">
                    Visit Date and Time
                  </h3>
                  <div className>
                    <div className="Sign-In_Sign-Up Register w-100">
                      <div className="perfect-home-form pt-1">
                        <section className="Details_Form">
                          <div className>
                            <form
                              id="survey-form"
                              method="post"
                              action
                              className="d-flex flex-column gap-4"
                                onSubmit={(e)=>{
                                    updateUserHandler(e)
                                }}
                            >
                              <div className="d-flex align-items-center justify-content-lg-between gap-3">
                                <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details text-center text-lg-start">
                                  <div className="rowTab">
                                    <div className="labels">
                                      <span
                                        htmlFor="name"
                                        className="pb-1 label"
                                        style={{ color: "#9C9AA5" }}
                                      >
                                        Possible Visit Date
                                      </span>
                                      <span className="star">*</span>
                                    </div>
                                    <div className="rightTab w-auto">
                                      <span
                                        style={{ color: "#293790" }}
                                        className="date fw-bold"
                                      >
                                       {formatDate(p_visit_date)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details text-center text-lg-start">
                                  <div className="rowTab">
                                    <div className="labels">
                                      <span
                                        htmlFor="name"
                                        className="pb-1 label"
                                        style={{ color: "#9C9AA5" }}
                                      >
                                        Possible Visit Time
                                      </span>
                                      <span className="star">*</span>
                                    </div>
                                    <div className="rightTab w-auto">
                                      <span
                                        style={{ color: "#293790" }}
                                        className="date fw-bold"
                                      >
                                        {formatTime(p_visit_time)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="new-leades-btn d-flex justify-content-center gap-4 mt-2">
                                <div
                                  className="cancel-btn d-flex align-items-center justify-content-center cursor-pointer bg-transparent"
                                  style={{borderColor:clientBtnColor,color:clientBtnColor ? clientBtnColor:"white"}}
                                  onClick={() => {
                                    setShowModal2(true);
                                  }}
                                >
                                  Change
                                </div>
                                <button className="submit-btn d-flex align-items-center justify-content-center text-white border-0" style={{background:clientBtnColor}}>
                                  Confirm
                                </button>
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

        <Modal
          show={showModal2}
          onHide={() => setShowModal2(false)}
          size="lg"
          centered
        >
          <Modal.Body>
            <section
              className="Sign-In pt-4 Create-New-Lead Create-Brokerage-Bill Add-New-Visit-Date-and-Time"
              style={{ padding: "0 16px" }}
            >
              <div className="container">
                <div className="row">
                  <h3 className=" Perfect-Home text-center text-black">
                    Add New Visit Date and Time
                  </h3>
                  <div className="col-12 mt-md-5">
                    <div className="Sign-In_Sign-Up Register w-100">
                      <div className="perfect-home-form pt-1">
                        <section className="Details_Form">
                          <div className="pt-3">
                            <form id="survey-form" method="GET" action>
                              <div className="d-lg-flex justify-content-lg-between">
                                <div className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                  <div className="rowTab">
                                    <div className="labels">
                                      <label htmlFor="name" className="pb-1">
                                        Possible Visit Date
                                      </label>
                                      <span className="star">*</span>
                                    </div>
                                    <div className="rightTab">
                                      <input
                                        autofocus
                                        type="Date"
                                        value={p_visit_date}
                                        onChange={(e)=>{
                                            setVisitDate(e.target.value)
                                        }}
                                        name="name"
                                        className="input-field"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
                                  <div className="rowTab mt-3 mt-md-4 mt-lg-0">
                                    <div className="labels">
                                      <label
                                        htmlFor="Location"
                                        className="pb-1"
                                      >
                                        Possible Visit Time
                                      </label>
                                      <span className="star">*</span>
                                    </div>
                                    <div className="rightTab">
                                      <input
                                        autofocus
                                        type="time"
                                        value={p_visit_time}
                                        onChange={(e)=>{
                                            setVisitTime(e.target.value)
                                        }}
                                        name="name"
                                        className="input-field"
                                        required
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="new-leades-btn d-flex justify-content-center gap-4 mt-5">
                                <div
                                  className=" cursor-pointer cancel-btn d-flex align-items-center justify-content-center bg-transparent"
                                  style={{borderColor:clientBtnColor,color:clientBtnColor ? clientBtnColor:"white"}}
                                  onClick={() =>{ 
                                    setShowModal2(false);
                                     setShowModal(false)
                                    }}
                                >
                                  Cancel
                                </div>
                                <div 
                                className="submit-btn d-flex align-items-center justify-content-center cursor-pointer text-white border-0"
                                style={{background:clientBtnColor}}
                                onClick={()=>{
                                    setShowModal2(false)
                                }}
                                >
                                  Update
                                </div>
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
      </>
    );
}

export default ManageUsersTable 