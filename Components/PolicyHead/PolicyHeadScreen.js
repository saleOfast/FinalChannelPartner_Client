import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../Svg/PlusIcon';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from '../Basics/ConfirmBox';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./PolicyHeadMui'),
    { ssr: false }
)

const PolicyHeadScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [show, setShow] = useState(false);
    const [dataList, setDataList] = useState([])
    const [userInfo, setUserInfo] = useState({ policy_name: '' })
    const [editMode, setEditMode] = useState(false)
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState({ policy_id: "", action: "" });
    const [confirmText, setconfirmText] = useState("");

    const handleClose = () => {
        setShow(false);
        setUserInfo({ policy_name: '' })
    }

    const handleShow = () => setShow(true);

    function OpenAddModal() {
        setEditMode(false)
        handleShow();
    }

    const openEdtMdl = (value) => {
        setEditMode(true)
        setUserInfo({ ...userInfo, policy_name: value[0], policy_code: value[1], policy_id: value[3] })
        handleShow();
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
                    m_id: 212
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/policy`, header);
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

    function disableConfirm(value, type) {
        if (type == 1) {
            setconfirmText("enable");
        } else {
            setconfirmText("Disable");
        }
        setcurrObj({ policy_id: value, action: type });
        setdisableShowConfirm(true);
    }

    function deleteConfirm(value) {
        setcurrObj(value)
        setdeleteshowConfirm(true)
    }

    async function disableHandler() {

        const reqInfo = {
            policy_id: currObj.policy_id,
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
                    m_id: 214,
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/policy`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdisableShowConfirm(false)
                    setcurrObj('')
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
                    m_id: 216
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/policy?ph_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj('')
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

    const addPolicyHandler = async () => {
        if (userInfo.policy_name == '') {
            toast.error('Please enter the Policy Name')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 213
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db//policy`, userInfo, header);
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
        if (userInfo.policy_name == '') {
            toast.error('Please enter the Policy Name')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 214
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/policy`, userInfo, header);
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
                    <h3 className="content_head">POLICY HEAD MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Policy Head Master</li>
                        </ol>
                    </nav>
                </div>

                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                                <PlusIcon />
                                ADD POLICY HEAD
                            </button>
                        </div>
                        <DynamicTable
                            openEdtMdl={openEdtMdl}
                            dataList={dataList}
                            title='Policy Head List'
                            disableConfirm={disableConfirm}
                            deleteConfirm={deleteConfirm}
                        />
                    </div>
                </div>
            </div>

            <Modal className="commonModal" show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title> {editMode ? 'EDIT' : ' ADD'} POLICY HEAD </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Policy Head Name</label>
                                    <input

                                        type="text"
                                        placeholder='Enter Policy Head Name'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, policy_name: e.target.value })}
                                        value={userInfo.policy_name ? userInfo.policy_name : ''}
                                    />

                                </div>
                            </div>
                            {editMode ? null : <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <div className="input_box me-2">
                                        <input
                                            type="checkbox"
                                            id='istrvlCheck'
                                            className='form-check-input me-2'
                                            onChange={(e) => {setUserInfo({ ...userInfo, is_travel: e.target.checked })}}
                                        />
                                        <label htmlFor="istrvlCheck">Travel Type</label>
                                    </div>
                                </div>
                            </div>}

                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {editMode ? <Button variant="primary" onClick={updateHandler} >
                        UPDATE
                    </Button> : (
                        <>
                            <Button variant="primary" onClick={addPolicyHandler} >
                                SUBMIT
                            </Button>
                        </>)}

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PolicyHeadScreen