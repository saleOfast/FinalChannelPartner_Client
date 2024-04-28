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

    const goto = (url) => {
        router.push(url)
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


    const getDataList = async () => {

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
                const response = await axios.get(Baseurl + `/db/users/rolewise?role_id=1`, header);
                    console.log(response.data.data)
                setDataList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    async function disableHandler() {

        const reqInfo = { user_code: currObj.id, user_status: currObj.action == 1 ? true : false }

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 79
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/users`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdisableShowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    }

    async function deleteHandler() {
        setdeleteshowConfirm(false)

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 80
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/users?id=${currObj.id}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error.response.data.message)
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
    const updateUserhandler = async () => {
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
          const response = await axios.put(`${Baseurl}/db/users`, {
            db_name: db_name,
            user_code: showAssignTo,
            report_to: oldAssignTo,
          }, header);
          if (response.status === 200 || response.status === 201) {
            toast.success(response.data.message);
            setoldAssignTo('')
            setShowAssignTo('')
            toast.success(response.message)
            getDataList();
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


    useEffect(() => {
        getDataList();
        getUsersList();
    }, [])

    return (
      <>
        <ConfirmBox
          showConfirm={disableShowConfirm}
          setshowConfirm={setdisableShowConfirm}
          actionType={disableHandler}
          title={`Are You Sure you want to ${confirmText} ?`}
        />

        <ConfirmBox
          showConfirm={deleteshowConfirm}
          setshowConfirm={setdeleteshowConfirm}
          actionType={deleteHandler}
          title={"Are You Sure you want to Delete ?"}
        />

        <div className="w-100 ps-4 pe-4 overflow-auto">
          <div className="main_content">
            <div className="table_screen">
              <div className="top_btn_sec mb-2">
                <div className="d-flex">
                  <button
                    className="btn ms-auto  Add_btn me-3"
                    style={{ background: "#293790" }}
                    onClick={()=>{setShowAssignTo(true)}}
                  >
                    <PlusIcon />
                    Create Lead
                  </button>
                </div>
              </div>
              <DynamicTable
                title="Leads"
                dataList={dataList}
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
                <form id="survey-form" >
                  <div className='row'>
                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Lead Name<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Location<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Email<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Pincode<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Contact No<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="text" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Visit Date<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="Date" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Project<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
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

                    <div className='col col-xl-6 col-md-6 col-sm-12 my-2'>
                      <div className='row '>
                        <div className="col-3">
                            <label htmlFor="name" className="pb-1">Visit Time<span className="star text-danger">*</span></label>
                          </div>
                          <div className="col-9">
                            <input autofocus type="time" name="name" className="input-field" placeholder required />
                          </div>
                      </div>
                    </div>
                    
                  </div>
                  <div className="new-leades-btn d-flex justify-content-center gap-4 mt-4 mt-md-5">
                    <button className="cancel-btn d-flex align-items-center justify-content-center bg-transparent" onClick={() => setShowAssignTo("")}>Cancel</button>
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
        
        {/* <Modal  show={!showAssignTo ? false : true}
          onHide={() => setShowAssignTo("")} centered size='xl'>
      <Modal.Header closeButton>
        <Modal.Title>Create New Lead</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="survey-form" method="GET" action="">
          <Row className="d-lg-flex d-md-block d-sm-inline-block justify-content-lg-around">
            <Col className="d-flex flex-column gap-3 gap-md-4 gap-lg-5 Leads-form-details">
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="name" className="pb-1">
                    Lead Name
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab">
                  <Form.Control autoFocus type="text" name="name" placeholder="" required />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="email" className="pb-1">
                    Email
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab">
                  <Form.Control type="email" name="email" placeholder="" required />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="number" className="pb-1">Contact No.</Form.Label>
                </Col>
                <Col className="rightTab">
                  <Form.Control type="tel" name="number" required placeholder="" />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="project" className="pb-1">
                    Project
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle className="form-select dropdown" style={{ paddingTop: 12, paddingBottom: 12 }}>
                      Select
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="#">Emerald Grove Gardens</Dropdown.Item>
                      <Dropdown.Item href="#">Harmony Hills Estates</Dropdown.Item>
                      <Dropdown.Item href="#">Horizon Vista Villas</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
            <Col className="d-flex flex-column  gap-3 gap-md-4 gap-lg-5 Leads-form-details">
              <Row className="rowTab mt-3 mt-md-4 mt-lg-0">
                <Col className="labels">
                  <Form.Label htmlFor="Location" className="pb-1">
                    Location
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab">
                  <Form.Control autoFocus type="text" name="name" placeholder="" required />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="code" className="pb-1">
                    Pincode
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab">
                  <Form.Control type="text" name="pin" required placeholder="" />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="number" className="pb-1">
                    Possible Visit Date
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab possible-visit">
                  <Form.Control type="text" name="date" required placeholder="" />
                </Col>
              </Row>
              <Row className="rowTab">
                <Col className="labels">
                  <Form.Label htmlFor="number" className="pb-1">
                    Possible Visit Time
                    <span className="star">*</span>
                  </Form.Label>
                </Col>
                <Col className="rightTab possible-visit">
                  <Form.Control type="text" name="time" required placeholder="" />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary">
          Submit
        </Button>
      </Modal.Footer>
    </Modal> */}
        

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