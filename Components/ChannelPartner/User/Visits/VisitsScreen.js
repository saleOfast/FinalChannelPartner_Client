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

const VisitsScreen = () => {
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


    const getVisitList = async (queryObjLeads) => {

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
                const response = await axios.get(Baseurl + `/db/channel/visit`, {...header,params:queryObjLeads});
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
                    getVisitList();
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
                    getVisitList();
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
                        getVisitList();
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
            getVisitList();
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
        getVisitList();
        getUsersList();
    }, [])

    return (
      <>
        <div className="w-100 ps-4 pe-4 overflow-auto">
          <div className="main_content">
            <div className="table_screen">
              <DynamicTable
                title="Visits"
                dataList={dataList}
                disableConfirm={disableConfirm}
                deleteConfirm={deleteConfirm}
                setShowAssignTo={setShowAssignTo}
                setoldAssignTo={setoldAssignTo}
                oldAssignTo={oldAssignTo}
                setShowDateFilter={setShowDateFilter}
                usersList={usersList}
                getVisitList={getVisitList}
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

export default VisitsScreen