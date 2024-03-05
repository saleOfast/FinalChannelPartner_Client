import React, { useEffect, useState } from "react";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from "react-redux";
import dynamic from 'next/dynamic'
import DownloadIcon from "../Svg/DownloadIcon";
const DynamicTable = dynamic(
    () => import('./ExpenseMuiTable'),
    { ssr: false }
)

const ExpenseScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [show, setShow] = useState(false);
    const [leaveLists, setLeaveLists] = useState([]);
    const [usersList, setUsersList] = useState([])
    const [leaveHead, setLeaveHead] = useState([])
    const [confirmMsg, setConfirmMsg] = useState('')
    const [userInfo, setUserInfo] = useState({
        expence_id: null,
        status: null,
        remark: null,
        submitted_by: null,
        report_to: null,
    })
    const [searchFields, setSearchFields] = useState({
        "u_id": null,
        "f_date": null,
        "t_date": null,
        "claim_type": null,
        "status": null
    })
    const [remarkMode, setRemarkMode] = useState({ text: '', mode: false, status: '' });

    const handleClose = () => {
        setShow(false);
        setRemarkMode({ text: '', mode: false, status: '' });
        setUserInfo({
            expence_id: null,
            status: null,
            remark: null,
            submitted_by: null,
            report_to: null,
        })
    };

    const handleShow = () => setShow(true);

    const getLeavelist = async () => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 198,
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/expence?mode=rpt`, header);
                setLeaveLists(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }

    function viewRemark(value) {
        setRemarkMode({ ...remarkMode, text: value[11], mode: true, status: value[9] })
        handleShow();
    }

    const getUsersList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass:"pass"
                    
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/users?mode=ul`, header);
                setUsersList(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    const getLeaveHead = async () => {

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
                const response = await axios.get(Baseurl + `/db/expence`, header);
                setLeaveHead(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    const clearFilter = () => {
        setSearchFields({
            "u_id": null,
            "f_date": null,
            "t_date": null,
            "claim_type": null,
            "status": null
        })
        getLeavelist();
    }

    async function filterSubmit() {
        const allEmpty = Object.values(searchFields).every(value => value === null || value === undefined || value === "");
        if (allEmpty) {
            toast.error('All Fields Are Empty')
        } else if (searchFields.f_date && !searchFields.t_date) {
            toast.error('Please enter To Date')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 198,
                    }
                }
                try {
                    const response = await
                        axios.get(Baseurl + `/db/expence?mode=rpt${searchFields.f_date ? `&f_date=${searchFields.f_date}` : ''}${searchFields.t_date ? `&t_date=${searchFields.t_date}` : ''}${searchFields.status ? `&status=${searchFields.status}` : ''}${searchFields.claim_type ? `&claim_type=${searchFields.claim_type}` : ''}${searchFields.u_id ? `&u_id=${searchFields.u_id}` : ''}`, header);
                    setLeaveLists(response.data.data);
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
                    }
                }
            }
        }

    }

    function openConfirmBox(value, type) {
        if (type == 0) {
            setConfirmMsg('Reject')
            setUserInfo({
                status: 'rejected',
                expence_id: value[10],
                submitted_by: value[0].user_id,
                report_to: value[1].user_id,
                remark: null,
            })
        } else {
            setConfirmMsg('Accept')
            setUserInfo({
                status: 'approved',
                expence_id: value[10],
                submitted_by: value[0].user_id,
                report_to: value[1].user_id,
                remark: null,
            })
        }
        handleShow()
    }

    const appReqHandler = async () => {
        if (!userInfo.remark || userInfo.remark == '') {
            toast.error('Please Enter The Remarks')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 197,
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/expence/status`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        handleClose();
                        getLeavelist();
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
                    }
                }
            }
        }


    }

    const handleDownload = () => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // Change the Accept type to Excel
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass",
                },
                responseType: 'blob' // set the response type as blob
            };

            axios.get(Baseurl + `/db/expence/download`, header)
                .then(response => {
                    const file = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }); // change the content type to Excel
                    const fileUrl = URL.createObjectURL(file);
                    // programmatically create and trigger the download link
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.setAttribute('download', 'Expenses.xlsx'); // specify the file name
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                }).catch(error => {
                    console.error(error);
                });
        }
    };


    useEffect(() => {
        getLeavelist();
        getUsersList();
        getLeaveHead();
    }, []);
    return (

        <>

            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">EXPENSES</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Expense Application List</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="row filterRow">
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6 ">
                                <div className="filterBox">
                                    <label className="label " htmlFor="users">Select User </label>
                                    <select
                                        name="users"
                                        id="users"
                                        className="form-control"
                                        onChange={(e) => setSearchFields({ ...searchFields, u_id: e.target.value })}
                                        value={searchFields?.u_id ? searchFields.u_id : ''} >
                                        <option value="">Select User</option>
                                        {usersList?.map(({ user_id, user }) => {
                                            return <option key={user_id} value={user_id}>{user}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6 pe-sm-0">
                                <div className="filterBox">
                                    <label className="label" htmlFor="fromDate">From </label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="fromDate"
                                        id="fromDate"
                                        onChange={(e) => setSearchFields({ ...searchFields, f_date: e.target.value })}
                                        value={searchFields?.f_date ? searchFields.f_date : ''}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6">
                                <div className="filterBox">
                                    <label className="label" htmlFor="toDate">To </label>
                                    <input type="date"
                                        className="form-control"
                                        name="toDate"
                                        id="toDate"
                                        onChange={(e) => setSearchFields({ ...searchFields, t_date: e.target.value })}
                                        value={searchFields?.t_date ? searchFields.t_date : ''}
                                    />
                                </div>
                            </div>
                            {/* <div className="col-xl-2 col-md-2 col-sm-6 col-6 pe-sm-0">
                                <div className="filterBox">
                                    <label className="label" htmlFor="claimType">Select Claim Type</label>
                                    <select
                                        name="claimType"
                                        id="claimType"
                                        className="form-control"
                                        onChange={(e) => setSearchFields({ ...searchFields, claim_type: e.target.value })}
                                        value={searchFields?.claim_type ? searchFields.claim_type : ''}>
                                        <option value="">Select Claim Type </option>
                                        <option value="TA">TA</option>
                                        <option value="DA">DA</option>
                                    </select>
                                </div>
                            </div> */}
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6">
                                <div className="filterBox">
                                    <label className="label " htmlFor="users">Select Status </label>
                                    <select
                                        name="users"
                                        id="users"
                                        className="form-control"
                                        onChange={(e) => setSearchFields({ ...searchFields, status: e.target.value })}
                                        value={searchFields?.status ? searchFields.status : ''} >
                                        <option value={null}>Select Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-6 col-6 ">
                                <div className="submitBtn">
                                    <button className="btn btn-primary" onClick={filterSubmit}>Search</button>
                                    <button className="btn btn-cancel ms-3" onClick={clearFilter}>Clear</button>
                                </div>
                            </div>
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12 me-2 p-3">
                                <button className="btn ms-auto btn-primary Add_btn" onClick={handleDownload}>
                                    <DownloadIcon />
                                    Export
                                </button>
                            </div>

                        </div>
                        <DynamicTable title='Application List '
                            leaveLists={leaveLists}
                            viewRemark={viewRemark}
                            openConfirmBox={openConfirmBox}
                        />
                    </div>
                </div>
            </div>
            <Modal className="commonModal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <div className="text-capitalize">
                            {remarkMode.mode ? `${remarkMode.status} Remarks` : `${confirmMsg} Remarks`}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                {remarkMode.mode ? <div className="remark-text text-capitalize">
                                    {remarkMode.text ? remarkMode.text : 'No Remarks Found'}
                                </div> : <div className="input_box">
                                    <label htmlFor="email">{confirmMsg} Remarks</label>
                                    <textarea
                                        placeholder="Enter Your Remarks here"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                remark: e.target.value,
                                            })
                                        }
                                        value={
                                            userInfo.remark ? userInfo.remark : ""
                                        }
                                    ></textarea>
                                </div>}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {remarkMode.mode ?
                        <Button variant="primary" onClick={handleClose}>
                            Close
                        </Button> :
                        <>
                            <Button variant="primary" onClick={appReqHandler}>
                                SUBMIT
                            </Button></>
                    }
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ExpenseScreen