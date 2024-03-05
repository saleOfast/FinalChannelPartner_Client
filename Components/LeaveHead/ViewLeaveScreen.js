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
    () => import('./ViewLeaveTable'),
    { ssr: false }
)

const ViewLeaveScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { yr } = router.query;

    const [show, setShow] = useState(false);
    const [dataList, setDataList] = useState([])
    const [userInfo, setUserInfo] = useState({ head_leave_name: '', total_head_leave: '' })
    const [editMode, setEditMode] = useState(false)
    const handleClose = () => {
        setShow(false);
        console.log(userInfo);
        setUserInfo({ head_leave_name: '', total_head_leave: '' })
    }

    const handleShow = () => setShow(true);

    const openEdtMdl = (value) => {
        if (!value[3].length == 0) {
            setUserInfo({
                head_leave_name: value[0],
                head_leave_code: value[1],
                head_leave_cnt_id: value[3]?.[0].head_leave_cnt_id,
                total_head_leave: value[3]?.[0].total_head_leave,
                head_leave_id: value[4]
            })
            setEditMode(true)
        } else {
            setUserInfo({
                head_leave_name: value[0],
                head_leave_code: value[1],
                total_head_leave: value[3],
                head_leave_id: value[4]
            })
            setEditMode(false)
        }

        handleShow();
    }

    const getDataList = async (year) => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 205
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/leavehead/count?year=${year}`, header);
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

    const addLeaveHandler = async () => {
        if (!userInfo.total_head_leave || userInfo.total_head_leave == '' || userInfo.total_head_leave == undefined) {
            toast.error('Please enter the total Leave')
        }
        else {
            let reqInfo = {
                ...userInfo,
                head_leave_id: userInfo.head_leave_id,
                financial_start: `${yr}-04-01`,
                financial_end: `${(parseInt(yr) + 1).toString()}-03-31`,
                total_head_leave: userInfo.total_head_leave,
            }
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: editMode ? 206: 205
                    }
                }
                if (editMode) {
                    try {
                        const response = await axios.put(Baseurl + `/db/leavehead/count`, reqInfo, header);
                        if (response.status === 204 || response.status === 200) {
                            toast.success(response.data.message)
                            handleClose();
                            getDataList(yr);
                        }
                    } catch (error) {
                        if (error?.response?.data?.message) {
                            toast.error(error.response.data.message);
                        }
                        else {
                            toast.error('Something went wrong!')
                        }
                    }
                } else {
                    try {
                        const response = await axios.post(Baseurl + `/db/leavehead/count`, reqInfo, header);
                        if (response.status === 204 || response.status === 200) {
                            toast.success(response.data.message)
                            handleClose();
                            getDataList(yr);
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
    }


    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.yr) {
            getDataList(yr);
        }
    }, [router.isReady, yr]);

    return (
        <>
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h3 className="content_head">LEAVE LIST</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home </Link></li>
                            <li className="breadcrumb-item"> <Link href='/ManageLeaveHeadScreen'>Leaves Head </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Leave List </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <DynamicTable
                            title={`Financial Year ${yr} -  ${(parseInt(yr) + 1).toString()}`}
                            openEdtMdl={openEdtMdl}
                            dataList={dataList}
                        />

                    </div>
                </div>
            </div>

            <Modal className="commonModal" show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>
                        ENTER LEAVES
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Head Leave Name </label>
                                    <input
                                        type="text"
                                        placeholder='Enter Leave Name'
                                        name="email" id="email"
                                        disabled
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, head_leave_name: e.target.value })}
                                        value={userInfo.head_leave_name ? userInfo.head_leave_name : ''}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Total  Leave </label>
                                    <input
                                        type="number"
                                        placeholder='Enter Total Head Leave'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, total_head_leave: e.target.value })}
                                        value={userInfo.total_head_leave ? userInfo.total_head_leave : ''}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={addLeaveHandler} >
                        SUBMIT
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ViewLeaveScreen 