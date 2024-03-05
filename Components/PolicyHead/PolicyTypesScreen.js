import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import PlusIcon from '../Svg/PlusIcon';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { hasCookie, getCookie } from 'cookies-next';
import { useRouter } from "next/router";
import { toast } from 'react-toastify';
import ConfirmBox from '../Basics/ConfirmBox';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
import moment from 'moment';
const DynamicTable = dynamic(
    () => import('./PolicyTypeMui'),
    { ssr: false }
)

const PolicyTypesScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id  } = router.query;
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({
        claim_type: null,
        cost_per_km: null,
        max_allowance: null,
        fixed: null,
        policy_type_name:""

    });
    const [editMode, setEditMode] = useState(false)
    const [disableShowConfirm, setdisableShowConfirm] = useState(false)
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false)
    const [currObj, setcurrObj] = useState('');
    const [confirmText, setconfirmText] = useState("");
    const [dataList, setDataList] = useState([])

    const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD LTS");

    const handleClose = () => {
        setShow(false);
        setUserInfo({
            claim_type: null,
            cost_per_km: null,
            max_allowance: null,
            fixed: null,
        })
    }

    const handleShow = () => setShow(true);

    function OpenAddModal() {
        setEditMode(false)
        handleShow();
    }


    

    const openEdtMdl = (value) => {
        setEditMode(true)
        setUserInfo({
            ...userInfo,
            policy_id: router.query.id,
            policy_type_id: value[6],
            policy_type_name: value[0],
            claim_type: value[2], 
            cost_per_km: value[4],
            max_allowance: value[5],
            fixed: value[4]
            
        })
        handleShow();
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

    const getDataList = async (id) => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 217
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/policy/type?ph_id=${id}`, header);
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
            policy_id: currObj.policy_id,
            status: currObj.action == 1 ? true : false,
        };
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                     m_id: 219,
                }
            }

            try {
                const response = await axios.put(Baseurl + `/db/policy`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdisableShowConfirm(false)
                    setcurrObj('')
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

    async function deleteHandler(id) {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                     m_id: 221
                }
            }

            try {
                const response = await axios.delete(Baseurl + `/db/policy/type?pt_id=${currObj}`, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    setdeleteshowConfirm(false)
                    setcurrObj('')
                    getDataList(router.query.id);
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
        if (!userInfo.claim_type) {
            toast.error('Please select the claim type')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                const reqInfo = { ...userInfo, policy_id: router.query.id, from_date: DateNow,}

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                         m_id: 218
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db/policy/type`, reqInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        handleClose();
                        getDataList(router.query.id);
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
        if (userInfo.claim_type == '') {
            toast.error('Please select the claim type')
        } else if (userInfo.cost_per_km == "") {
            toast.error('Please enter the cost')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                         m_id: 219
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/policy/type`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        handleClose();
                        getDataList(router.query.id);
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
        if (!router.isReady) return;
        if (router.query.id) {
            getDataList(id)

        }
    }, [router.isReady, id])

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
                    <h3 className="content_head">POLICY LIST</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Home</Link></li>
                            <li className="breadcrumb-item"> <Link href='/ManagePolicyHeadScreen'>Policy Head</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Policy List</li>
                        </ol>
                    </nav>
                </div>

                <div className="main_content">
                    <div className="table_screen">
                        <div className="top_btn_sec">

                            <button
                                className="btn btn-primary Add_btn"
                                onClick={OpenAddModal}
                            > <PlusIcon />
                                ADD POLICY
                            </button>
                        </div>
                        <DynamicTable
                            openEdtMdl={openEdtMdl}
                            dataList={dataList}
                            title='Policy List'
                            disableConfirm={disableConfirm}
                            deleteConfirm={deleteConfirm}
                        />
                    </div>
                </div>
            </div>
            <Modal className="commonModal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title> {editMode ? "EDIT" : " ADD"} Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="add_user_form">
                        <div className="row">
                        <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="task_status">Policy Name  </label>
                                        <input
                                            type="Text"
                                            placeholder="Enter Policy Name "
                                            name="poliname"
                                            id="poliname"
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    policy_type_name: e.target.value,
                                                })
                                            }
                                            value={userInfo.policy_type_name ? userInfo.policy_type_name : ""}
                                        />
                                    </div>
                                </div> 
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="task_name">Claim Type *</label>
                                    <select
                                        name="selectInter"
                                        id="selectInter"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                claim_type: e.target.value,
                                            })
                                        }
                                        value={userInfo.claim_type ? userInfo.claim_type : ""}>
                                        <option value="">Select Claim Type </option>
                                        <option value="TA">TA</option>
                                        <option value="DA">DA</option>
                                    </select>
                                </div>
                            </div>

                            
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="task_status">Cost per Km</label>
                                        <input
                                            type="number"
                                            placeholder="Please Enter Cost"
                                            name="cost_per_km"
                                            id="cost_per_km"
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    cost_per_km: e.target.value,
                                                })
                                            }
                                            value={userInfo.cost_per_km ? userInfo.cost_per_km : ""}
                                            />
                                    </div>
                                </div>
                                {/* <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="task_priority">Max. Allowance</label>
                                        <input
                                            type="number"
                                            placeholder="Please Enter Allowance"
                                            name="max_allowance"
                                            id="max_allowance" className="form-control"
                                        />
                                    </div>
                                </div> */}
                            {/* </> : <>
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="task_status">Cost per Km</label>
                                        <input
                                            type="number"
                                            placeholder="Please Enter Cost"
                                            name="cost_per_km"
                                            id="cost_per_km"
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    cost_per_km: e.target.value,
                                                })
                                            }
                                            value={userInfo.cost_per_km ? userInfo.cost_per_km : ""}
                                        />
                                    </div>
                                </div> */}
                                {/* <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="task_priority">Max. Allowance</label>
                                        <input
                                            type="number"
                                            placeholder="Please Enter Allowance"
                                            name="max_allowance"
                                            id="max_allowance"
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserInfo({
                                                    ...userInfo,
                                                    max_allowance: e.target.value,
                                                })
                                            }
                                            value={userInfo.max_allowance ? userInfo.max_allowance : ""}
                                        />
                                    </div>
                                </div>
                            </>} */}

                            {/* <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="fixed">Fixed Allowance</label>
                                    {userInfo.cost_per_km || userInfo.max_allowance ? <input
                                        type="number"
                                        placeholder='Please Enter Fixed'
                                        name="fixed"
                                        disabled
                                        id="fixed"
                                        className="form-control" /> 
                                        :
                                        <input
                                            type="number"
                                            placeholder='Please Enter Fixed'
                                            name="fixed"
                                            id="fixed"
                                            className="form-control"
                                            onChange={(e) => setUserInfo({ ...userInfo, fixed: e.target.value })}
                                            value={userInfo.fixed ? userInfo.fixed : ""}
                                        />}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {editMode ? (
                        <Button variant="primary" onClick={updateHandler}>
                            UPDATE
                        </Button>
                    ) : (
                        <Button variant="primary" onClick={addPolicyHandler}>
                            SUBMIT
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PolicyTypesScreen