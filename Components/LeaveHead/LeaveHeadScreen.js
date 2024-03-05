import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../Svg/PlusIcon';
import Modal from "react-bootstrap/Modal";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import Button from "react-bootstrap/Button";
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
const DynamicTable = dynamic(
    () => import('./LeaveHeadMui'),
    { ssr: false }
)

const LeaveHeadScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();

    const [show, setShow] = useState(false);
    const [dataList, setDataList] = useState([])
    const [userInfo, setUserInfo] = useState({ head_leave_name: '', head_leave_short_name: '' })
    const [editMode, setEditMode] = useState('add')
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState({ head_leave_id: "", action: "" });
    const [confirmText, setconfirmText] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

    const years = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i);

    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
    }

    const handleClose = () => {
        setShow(false);
        setUserInfo({ head_leave_name: '', head_leave_short_name: '' })
        setSelectedYear('')
    }

    const handleShow = () => setShow(true);

    const openEdtMdl = (value) => {
        setEditMode('edit')
        setUserInfo({
            ...userInfo,
            head_leave_name: value[0],
            head_leave_code: value[1],
            head_leave_short_name: value[2],
            head_leave_id: value[4]
        })
        handleShow();
    }

    const openLeaveView = (value) => {
        setEditMode('leave list')
        console.log(value);
        handleShow();
    }

    function OpenAddModal() {
        setEditMode('add')
        handleShow();
    }

    function disableConfirm(value, type) {
        if (type == 1) {
            setconfirmText("Enable");
        } else {
            setconfirmText("Disable");
        }
        setcurrObj({ head_leave_id: value, action: type });
        setdisableShowConfirm(true);
    }

    function deleteConfirm(value) {
        setcurrObj({ head_leave_id: value, action: 'delete' });
        setdeleteshowConfirm(true)
    }

    const getDataList = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:205
                
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/leavehead`, header);
                setDataList(response.data.data);
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

    async function disableHandler() {

        const reqInfo = {
            head_leave_id: currObj.head_leave_id,
            status: currObj.action == 1 ? true : false,
        };

        setdisableShowConfirm(false)
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:209
                    
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/leavehead`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdisableShowConfirm(false)
                    setcurrObj({ head_leave_id: "", action: "" })
                    getDataList();
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

    async function deleteHandler() {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:209
                   
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/leavehead?h_id=${currObj.head_leave_id}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj({ head_leave_id: "", action: "" })
                    getDataList();
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

    const addIndustryHandler = async () => {
        if (userInfo.head_leave_name == '') {
            toast.error('Please enter the Leave Name')
        } else if (userInfo.head_leave_short_name == '') {
            toast.error('Please enter the total Leave')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:206
                        
                    
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db/leavehead`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        handleClose();
                        getDataList();
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

    const updateHandler = async () => {
        if (userInfo.head_leave_name == '') {
            toast.error('Please enter the Leave Name ')
        } else if (userInfo.head_leave_short_name == '') {
            toast.error('Please enter the total Leave')
        }
        else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:207
                      
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/leavehead`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        handleClose();
                        getDataList();
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

    const viewLeaveFunc = () => {
        if (!selectedYear && selectedYear == '') {
            toast.error('No year Selected')
        } else {
            handleClose();
            router.push(`/Viewleaves?yr=${selectedYear}`);
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
                    <h3 className="content_head">LEAVE HEAD MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Leave Head Master </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <div className='d-flex'>
                                <button className="btn btn-primary Add_btn me-3" onClick={openLeaveView}>
                                    <PlusIcon />
                                    FY LEAVE
                                </button>
                                <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                                    <PlusIcon />
                                    ADD LEAVE
                                </button>
                            </div>
                        </div>
                        <DynamicTable
                            title='Leave Head List'
                            openEdtMdl={openEdtMdl}
                            dataList={dataList}
                            disableConfirm={disableConfirm}
                            deleteConfirm={deleteConfirm}
                        />

                    </div>
                </div>
            </div>

            <Modal className="commonModal" show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {editMode === 'add' ? 'ADD LEAVE HEAD' : ''}
                        {editMode === 'edit' ? 'EDIT LEAVE HEAD' : ''}
                        {editMode === 'leave list' ? 'VIEW LEAVE LIST' : ''}
                    </Modal.Title>
                </Modal.Header>
                {editMode !== 'leave list' ? <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Head Leave Name </label>
                                    <input
                                        type="text"
                                        placeholder='Enter Leave Name'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, head_leave_name: e.target.value })}
                                        value={userInfo.head_leave_name ? userInfo.head_leave_name : ''}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Leave Short name </label>
                                    <input
                                        type="text"
                                        placeholder='Enter Short name'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, head_leave_short_name: e.target.value })}
                                        value={userInfo.head_leave_short_name ? userInfo.head_leave_short_name : ''}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body> : <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="selYear">Select Financial Year </label>
                                    <select id="year-select" className='form-control' value={selectedYear} onChange={handleYearChange}>
                                        <option value=""> -- Select a year -- </option>
                                        {years?.map(year => <option key={year} value={year}>{year} - {(parseInt(year) + 1).toString()}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>}

                <Modal.Footer>
                    {editMode === 'add' ?
                        <Button variant="primary" onClick={addIndustryHandler} >
                            SUBMIT
                        </Button> : ''}
                    {editMode === 'edit' ? <Button variant="primary" onClick={updateHandler} >
                        UPDATE
                    </Button> : ''}
                    {editMode === 'leave list' ? <Button variant="primary" onClick={viewLeaveFunc} >
                        View leave
                    </Button> : ''}

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default LeaveHeadScreen 