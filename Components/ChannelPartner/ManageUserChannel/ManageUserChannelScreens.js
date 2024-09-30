import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../../Svg/PlusIcon';
import axios from 'axios';
import { Baseurl } from '../../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../../Basics/ConfirmBox";
import { useSelector } from 'react-redux';
import Modal from "react-bootstrap/Modal";
import { Button } from 'react-bootstrap';
import dynamic from 'next/dynamic'
import Papa from "papaparse";
const DynamicTable = dynamic(
    () => import('./ManageUsersTable'),
    { ssr: false }
)

const ManageUserChannelScreens = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [dataList, setDataList] = useState([])
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [confirmText, setconfirmText] = useState('')
    const [show, setShow] = useState(false);
    const [excelData, setexcelData] = useState([]);
    const [loader, setLoader] = useState([]);
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
        setLoader(true)
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
                const response = await axios.get(Baseurl + `/db/users/cp/getPendingVerificationUser`, header);
                if (response?.status == 200 || response?.status == 201) {
                    setLoader(false)
                    setDataList(response.data.data);
                }

            } catch (error) {
                setLoader(false)
                if (error?.response?.data?.message) {
                    toast.error(error?.response?.data?.message,{autoClose:2500});
                } else {
                    toast.error("Something went wrong!",{autoClose:2500});
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
                    toast.success(response?.data?.message,{autoClose:2500})
                    setdisableShowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error?.response?.data?.message,{autoClose:2500});
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
                    toast.success(response?.data?.message,{autoClose:2500})
                    setdeleteshowConfirm(false)
                    setcurrObj({
                        id: '',
                        action: ''
                    })
                    getDataList();
                }
            } catch (error) {
                toast.error(error?.response?.data?.message,{autoClose:2500})
            }
        }

    }

    async function csvSubmitHandler() {
        if (excelData.length <= 0) {
            toast.error('No Data Found Please Check and try Again',{autoClose:2500})
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
                        toast.success(response?.data?.message,{autoClose:2500});
                        getDataList();
                        handleClose();
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error?.response?.data?.message,{autoClose:2500});
                    } else {
                        toast.error("Something went wrong!",{autoClose:2500});
                    }
                }
            }
        }

    }


    useEffect(() => {
        getDataList();
    }, [])

    return (
        <>
            <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={disableHandler}
                title={`Are You Sure you want to ${confirmText} ?`} />

            <ConfirmBox
                showConfirm={deleteshowConfirm}
                setshowConfirm={setdeleteshowConfirm}
                actionType={deleteHandler}
                title={"Are You Sure you want to Delete ?"} />

            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">CHANNEL PARTNER </h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/setting'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">User Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec ">
                            <div className="d-flex">
                                <Link href='/ChannelAddUsers'>
                                    {/* <button className="btn ms-auto btn-primary Add_btn me-3">
                                    <PlusIcon />
                                    ADD USER
                                </button> */}
                                </Link>
                                {/* <button className="btn btn-primary Add_btn" onClick={handleShow}>
                                <PlusIcon />
                                Import CSV
                            </button> */}
                            </div>
                        </div>
                        <DynamicTable
                            loader={loader}
                            title='Channel Partner List'
                            dataList={dataList}
                            disableConfirm={disableConfirm}
                            deleteConfirm={deleteConfirm}
                        />
                    </div>
                </div>
            </div>

            <Modal className="commonModal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>  Import CSV </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="AttendenceFile">Select File</label>
                                    <input type="file"
                                        name="AttendenceFile"
                                        id="AttendenceFile"
                                        accept=".csv"
                                        onChange={importHandler}
                                        className="form-control" />
                                </div>
                            </div>
                            <div className="demoLink text-end py-2">
                                <a className="text-decoration-underline text-primary" href="/Docs/demoUser.csv" download='user-Sample-File.csv'>Views Sample File </a>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-cancel me-2" onClick={handleClose}>Cancel</button>
                    <Button variant="primary" onClick={csvSubmitHandler}>
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ManageUserChannelScreens