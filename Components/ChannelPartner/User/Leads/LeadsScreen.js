import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../../../Svg/PlusIcon';
import axios from 'axios';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';

import { useSelector } from 'react-redux';
import { Modal, Button, Form, Row, Col, Dropdown } from 'react-bootstrap';
import dynamic from 'next/dynamic'
import Papa from "papaparse";
import { Baseurl } from '../../../../Utils/Constants';
import ConfirmBox from '../../../Basics/ConfirmBox';
import { useRouter } from 'next/router';
import Select from 'react-select';
import { fetchData } from '../../../../Utils/getReq';
import Daterange from '../../../DateRangeCustom/Daterange';
const DynamicTable = dynamic(
    () => import('./ManageUsersTable'),
    { ssr: false }
)

const LeadsScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);
    const router = useRouter()
    const [dataList, setDataList] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [confirmText, setconfirmText] = useState('')
    const [show, setShow] = useState(false);
    const [showAssignTo, setShowAssignTo] = useState("");
    const [oldAssignTo, setoldAssignTo] = useState("");
    const [showDateFilter, setShowDateFilter] = useState(false);
    const [excelData, setexcelData] = useState([]);
    const [errorToast, setErrorToast] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [DateEvent, seDateEvent] = useState({
        type: 'Custom',
        fDate: '',
        eDate: ''
    });
    const [currObj, setcurrObj] = useState({
        id: '',
        action: ''
    })

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
    const [leadList,setLeadList]=useState([])
    const [projectList,setProjectList]=useState([])
    const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"


    function disableConfirm(value, type) {
        if (type == 1) {
            setconfirmText('enable')
        } else {
            setconfirmText('Disable')
        }
        setcurrObj({
            id: value,
            action: type
        })
        setdisableShowConfirm(true)
    }

    const handleClose = () => {
        setShow(false);
        setexcelData([])
    };

    const handleShow = () => setShow(true);

    function deleteConfirm(value) {
        setcurrObj({
            id: value,
            action: 'delete'
        })
        setdeleteshowConfirm(true)
    }


    async function getUsersList() {
        await fetchData("/db/users", setUsersList, errorToast, setErrorToast);
      }


    const importHandler = (event, type) => {
        // Passing file data (event.target.files[0]) to parse using Papa.parse
        Papa.parse(event.target.files[0], {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setexcelData(results.data)

            },

        });

    };


    const getDataList = async (queryObjLeads) => {

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
                const leads = await axios.get(Baseurl + `/db/channel/lead`,{
                  ...header,
                  params:queryObjLeads
                });
                const projects = await axios.get(Baseurl + `/db/channel/project`, header);
                setLeadList(leads.data.data);
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
  

    async function csvSubmitHandler() {
        if (excelData.length <= 0) {
            toast.error('No Data Found Please Check and try Again')
        } else {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        pass: 'pass'
                    },
                };
                try {
                    const response = await axios.post(Baseurl + `/db/users/owner`, excelData, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        getDataList();
                        handleClose();
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Something went wrong!");
                    }
                }
            }
        }

    }

    const createLead =  async(queryObjLeads) => {
      if(lead.project_id===""){
        return toast.error("Pls Select Project")
      }
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
          const response = await axios.post(`${Baseurl}/db/channel/lead`,lead, header);
          if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message);
            setShowAssignTo(false)
            toast.success(response.message)
            setLead("")
            getDataList();
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


    useEffect(() => {
        getDataList();
        getUsersList();
    }, [])

    return (
      <>
        

        <div className="w-100 ps-4 pe-4 overflow-auto ">
          <div className="main_content">
            <div className="table_screen">
              <div className="top_btn_sec mb-2">
                <div className="d-flex">
                  <button
                    className="btn ms-auto  Add_btn "
                    style={{ background: `${clientBtnColor}` }}
                    onClick={()=>{setShowAssignTo(true)}}
                  >
                    <PlusIcon />
                    Create Lead
                  </button>
                </div>
              </div>
              <DynamicTable
                title="Leads"
                leadList={leadList}
                disableConfirm={disableConfirm}
                deleteConfirm={deleteConfirm}
                setShowAssignTo={setShowAssignTo}
                setoldAssignTo={setoldAssignTo}
                oldAssignTo={oldAssignTo}
                setShowDateFilter={setShowDateFilter}
                usersList={usersList}
                getDataList={getDataList}
              />
            </div>
          </div>
        </div>

        <Modal className="commonModal" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title> Import CSV </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="AttendenceFile">Select File</label>
                    <input
                      type="file"
                      name="AttendenceFile"
                      id="AttendenceFile"
                      accept=".csv"
                      onChange={importHandler}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="demoLink text-end py-2">
                  <a
                    className="text-decoration-underline text-primary"
                    href="/Docs/demoUser.csv"
                    download="user-Sample-File.csv"
                  >
                    Views Sample File{" "}
                  </a>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-cancel me-2" onClick={handleClose}>
              Cancel
            </button>
            <Button variant="primary" onClick={csvSubmitHandler}>
              SUBMIT
            </Button>
          </Modal.Footer>
        </Modal>

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
      <h3 className=" Perfect-Home text-center ">Create New Lead</h3>
      <div className="col-12 mt-md-5">
        <div className="Sign-In_Sign-Up Register w-100">
          <div className="perfect-home-form pt-1">
            <section className="Details_Form">
              <div className="">
                <form id="survey-form" method='post' onSubmit={(e)=>{
                  e.preventDefault()
                  createLead()
                  }} >
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
                          <select required name onChange={(e)=>{
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
                    <button 
                    className='btn btn-danger rounded-5' 
                    onClick={() => {setShowAssignTo("")
                    setLead("")
                    }}
                    
                    >Cancel</button>
                    <button 
                    className="btn rounded-5 text-white"
                    style={{background:clientBtnColor}}
                    >Submit</button>
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
          className="w-100"
          size="xl"
          show={showDateFilter}
          onHide={() => setShowDateFilter(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title> Assign to </Modal.Title>
          </Modal.Header>
          <Modal.Body className="mx-auto">
            <Daterange />
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-cancel me-2"
              onClick={() => setShowDateFilter(false)}
            >
              Cancel
            </button>
            <Button variant="primary">SUBMIT</Button>
          </Modal.Footer>
        </Modal>
      </>
    );
}

export default LeadsScreen