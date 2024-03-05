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
    () => import('./OpportunityManagementTab'),
    { ssr: false }
)

const OpportuntyManagementScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const [show, setShow] = useState(false);
    const [dataList, setDataList] = useState([])
    const [userInfo, setUserInfo] = useState({ opportunity_stg_name: '' })
    const [editMode, setEditMode] = useState(false)
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState({ opportunity_stg_id: "", action: "" });
    const [confirmText, setconfirmText] = useState("");

    const handleClose = () => {
        setShow(false);
        setUserInfo({ opportunity_stg_name: '' })
    }

    const handleShow = () => setShow(true);

    const openEdtMdl = (value) => {
        setEditMode(true)
        setUserInfo({ ...userInfo, opportunity_stg_name: value[0], opportunity_stg_code: value[1], opportunity_stg_id: value[3] })
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
        setcurrObj({ opportunity_stg_id: value, action: type });
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
                    m_id: 159
                }
            }

            try {
                const response = await axios.get(Baseurl + `/db/oppr`, header);
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
            opportunity_stg_id: currObj.opportunity_stg_id,
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
                    m_id: 162
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/oppr`, reqInfo, header);
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
                    m_id: 163
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/oppr?opp_id=${currObj}`, header);
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
        if (userInfo.opportunity_stg_name == '') {
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
                        m_id: 160
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db/oppr`, userInfo, header);
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
        if (userInfo.opportunity_stg_name == '') {
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
                        m_id: 162
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/oppr`, userInfo, header);
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
                    <h3 className="content_head">OPPORTUNITY STAGE MASTER</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Opportunity Stage Master</li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">
                            <button className="btn btn-primary Add_btn" onClick={OpenAddModal}>
                                <PlusIcon />
                                ADD OPPORTUNITY STAGE
                            </button>
                        </div>
                        <DynamicTable
                            title='Opportunity Stage List'
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
                    <Modal.Title> {editMode ? 'EDIT' : ' ADD'} OPPORTUNITY STAGE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="email">Opportunity Stage Name</label>
                                    <input
                                        type='text'
                                        placeholder='Enter Opportunity Stage Name'
                                        name="email" id="email"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, opportunity_stg_name: e.target.value })}
                                        value={userInfo.opportunity_stg_name ? userInfo.opportunity_stg_name : ''} />
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

export default OpportuntyManagementScreen    