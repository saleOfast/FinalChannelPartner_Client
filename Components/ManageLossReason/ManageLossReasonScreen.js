import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../Svg/PlusIcon';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import ConfirmBox from "../Basics/ConfirmBox";
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./ManageLossReasonTab'),
    { ssr: false }
)

const ManageLossReasonScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [show, setShow] = useState(false);
    const [dataList, setDataList] = useState([])
    const [userInfo, setUserInfo] = useState({ loss_reason: '' })
    const [editMode, setEditMode] = useState(false)
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState({ loss_id: "", action: "" });
    const [confirmText, setconfirmText] = useState("");

    const handleClose = () => {
        setShow(false);
        setUserInfo({ loss_reason: '' })
    }

    const handleShow = () => setShow(true);

    const openEdtMdl = (value) => {
        setEditMode(true)
        setUserInfo({ ...userInfo, loss_reason: value[0], loss_code: value[1], loss_id: value[3] })
        handleShow();
    }

    function OpenAddModal() {
        setEditMode(false)
        handleShow();
    }

    function disableConfirm(value, type) {
        if (type == 1) {
          setconfirmText("enable");
        } else {
          setconfirmText("Disable");
        }
        setcurrObj({ loss_id: value, action: type });
        setdisableShowConfirm(true);
      }
    

    function deleteConfirm(value) {
        setcurrObj(value)
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
                    m_id:138
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/loss`, header);
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
            loss_id: currObj.loss_id,
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
                    m_id:141
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/loss`, reqInfo, header);
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
                    m_id:142
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/loss?ls_id=${currObj}`, header);
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

    const addIndustryHandler = async () => {
        if (userInfo.loss_reason == '') {
            toast.error('Please enter the Loss Reason')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:139
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db/loss`, userInfo, header);
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
        if (userInfo.loss_reason == '') {
            toast.error('Please enter the Loss Reason')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:141
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/loss`, userInfo, header);
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
                    <h3 className="content_head">LOSS REASON MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Loss Reason Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                                <PlusIcon />
                                ADD LOSS REASON
                            </button>
                        </div>
                        <DynamicTable
                            title='Loss Reason List'
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
                    <Modal.Title> {editMode ? 'EDIT' : ' ADD'} LOSS REASON</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Loss Reason</label>
                                    <textarea
                                        placeholder='Enter Loss Reason'
                                        rows='3'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, loss_reason: e.target.value })}
                                        value={userInfo.loss_reason ? userInfo.loss_reason : ''}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {editMode ? <Button variant="primary" onClick={updateHandler} >
                        UPDATE
                    </Button> :
                        <Button variant="primary" onClick={addIndustryHandler} >
                            SUBMIT
                        </Button>}

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ManageLossReasonScreen   