import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Select from 'react-select';
import ManageLeaveTab from "./ManageLeaveTab";
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./ManageLeaveTab'),
    { ssr: false }
)



const AddLeave = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();

    const [noOfDays, setNoOfDays] = useState({ totalCount: '', remainingCount: '' })
    const [userInfo, setUserInfo] = useState({
        head_leave_id: null,
        head_leave_cnt_id: null,
        from_date: "",
        to_date: "",
        reason: "",
    });



    const { id } = router.query;
    const [editMode, setEditMode] = useState(false);
    const [leaveList, setLeaveList] = useState([])
    const [leaveAppList, setLeaveAppList] = useState([])
    const [errorData, setErrorData] = useState({})
    const [isLoading, setisLoading] = useState(false)

    const minDate = new Date().toISOString().slice(0, 10);

    async function getLeaveCount(leaveId, totalLeave) {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 97
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/leaveapp/status?cnt_id=${leaveId}&t_cnt=${totalLeave}`, header);
                setNoOfDays({ ...noOfDays, remainingCount: response.data.data })
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

    async function getUserLeaves() {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: 'pass'
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/leaveapp`, header);
                setLeaveAppList(response.data.data);
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

    const getLeaveHead = async () => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass"
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/leavehead/count?mode=user`, header);
                setLeaveList(response.data.data);
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

    const calculateDays = (value) => {
        const from_date = new Date(userInfo.from_date);
        const to_date = new Date(value)
        if (from_date && to_date) {
            const diffInMs = Math.abs(from_date - to_date);
            const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
            setNoOfDays({ ...noOfDays, totalCount: diffInDays + 1 })
        }
    };

    const submitHandler = async () => {

        
            if (hasCookie("token")) {
                setisLoading(true)
                let token = getCookie("token");
                let db_name = getCookie("db_name");
                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 15,
                    },
                };

                let reqOptions = {
                    head_leave_id: userInfo.head_leave_id,
                    head_leave_cnt_id: userInfo.head_leave_cnt_id,
                    reason: userInfo.reason,
                    from_date: userInfo.from_date,
                    to_date: userInfo.to_date,
                    no_of_days: noOfDays.totalCount
                }

                try {
                    const response = await axios.post(
                        Baseurl + `/db/leaveapp`,
                        reqOptions,
                        header
                    );
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        setUserInfo({
                            head_leave_id: null,
                            head_leave_cnt_id: null,
                            from_date: "",
                            to_date: "",
                            reason: "",
                        })
                        setNoOfDays({ totalCount: '', remainingCount: '' })
                        getUserLeaves();
                    }
                } catch (error) {
                    if (error?.response?.data?.status === 422) {
                        const taskObject = {}
                        const array = error?.response?.data?.data;
                        for (let i = 0; i < array.length; i++) {
                            const key = Object.keys(array[i])[0];
                            const value = Object.values(array[i])[0];
                            taskObject[key] = value;
                        }

                        setErrorData(taskObject);
                    }
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Something went wrong!");
                    }
                    setisLoading(false)
                }
            }
        
        else {
            toast.error('Please fill the Mandatory fields')
        }
    };

    const updateHandler = async () => {
        if (userInfo.head_leave_id == "") {
            toast.error("Please Select Leave Type");
        }
        else if (userInfo.from_date == "") {
            toast.error("Please enter from date");
        } else if (userInfo.due_date == "") {
            toast.error("Please enter end date");
        } else if (userInfo.reason == "") {
            toast.error("Please enter the reason ");
        } else {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");
                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 15,
                    },
                };

                try {
                    const response = await axios.put(
                        Baseurl + `/db/tasks`,
                        userInfo,
                        header
                    );
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        router.push("/TaskScreen");
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
    };

    useEffect(() => {
        getLeaveHead();
        getUserLeaves();
    }, [])

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
        }
    }, [router.isReady, id]);

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">{editMode ? "EDIT" : "APPLY"} LEAVE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {editMode ? "Edit" : "Apply"} Leave
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="main_content">
                <div className="Add_user_screen">
                    <div className="add_screen_head">
                        <span className="text_bold">Fill Details</span> ( * Fields are
                        mandatory)
                    </div>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className={errorData?.head_leave_cnt_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Leave Type *</label>
                                    <Select
                                        defaultValue={''}
                                        options={leaveList?.map((data, i) => {
                                            return {
                                                value: data?.head_leave_id,
                                                label: data?.leaveHead?.head_leave_name,
                                                total_head_leave: data?.total_head_leave,
                                                head_leave_cnt_id: data?.head_leave_cnt_id,
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, head_leave_id: e.value, total_head_leave: e.total_head_leave, head_leave_cnt_id: e.head_leave_cnt_id }),
                                                getLeaveCount(e.value, e.total_head_leave),
                                                setErrorData({ ...errorData, head_leave_cnt_id: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.head_leave_cnt_id ? errorData.head_leave_cnt_id : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className={errorData?.from_date ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="due_date">From date * </label>
                                    <input
                                        type="date"
                                        name="From_date "
                                        id="From_date "
                                        min={minDate}
                                        className={errorData?.from_date ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) =>{ setUserInfo({ ...userInfo, from_date: e.target.value })
                                        setErrorData({ ...errorData, from_date: '' })
                                    }}
                                        value={userInfo.from_date ? moment(userInfo.from_date).format("YYYY-MM-DD") : ""}
                                    />
                                     <span className="errorText"> {errorData?.from_date ? errorData.from_date : ''}</span>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className={errorData?.to_date ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="to_date">To date *</label>
                                    <input
                                        type="date"
                                        name="to_date "
                                        id="to_date "
                                        className={errorData?.to_date ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            calculateDays(e.target.value),
                                                setUserInfo({ ...userInfo, to_date: e.target.value })
                                                setErrorData({ ...errorData, to_date: '' })
                                        }}
                                        value={userInfo.to_date ? moment(userInfo.to_date).format("YYYY-MM-DD") : ""}
                                    />
                                     <span className="errorText"> {errorData?.to_date ? errorData.to_date : ''}</span>
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="due_date">Number Of Days </label>
                                    <input
                                        type="text"
                                        name="From_date "
                                        placeholder="Number Of Days"
                                        id="From_date "
                                        disabled
                                        className="form-control"
                                        value={noOfDays.totalCount ? noOfDays.totalCount : ''}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="due_date">Remaining Leaves </label>
                                    <input
                                        type="text"
                                        name="From_date "
                                        placeholder="Remaining Leaves"
                                        id="From_date "
                                        disabled
                                        className="form-control"
                                        value={noOfDays.remainingCount ? noOfDays.remainingCount : ''}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                <div className={errorData?.reason ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_desc">Reason *</label>
                                    <textarea
                                        name="leave_reason"
                                        id="leave_reason"
                                        placeholder="Enter Reason...."
                                        rows="3"
                                        className={errorData?.reason ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({
                                                ...userInfo,
                                                reason: e.target.value,
                                            })
                                            setErrorData({ ...errorData, reason: '' })
                                        }}
                                        value={userInfo.reason ? userInfo.reason : ""}
                                    >
                                    </textarea>
                                    <span className="errorText"> {errorData?.reason ? errorData.reason : ''}</span>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="add_user_form">
                        <div className="text-end">
                            <div className="submit_btn">
                                {editMode ? (
                                    <button className="btn btn-primary" onClick={updateHandler}>
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        disabled={isLoading}
                                        className="btn btn-primary"
                                        onClick={submitHandler}
                                    >
                                       {isLoading ? 'Loading...' : 'Apply Leave' }
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <DynamicTable title='Application List '
                            leaveAppList={leaveAppList}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeave;