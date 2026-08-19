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

    const getAuthHeaders = (extra = {}) => ({
        headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(getCookie("token")),
            db: getCookie("db_name"),
            ...extra,
        }
    })

    const extractList = (response) => {
        const payload = response?.data?.data ?? response?.data;
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== "object") return [];
        const nested =
            payload.rows ||
            payload.leaveHeadData ||
            payload.leaveheadData ||
            payload.leaveCounts ||
            payload.leave_counts ||
            payload.list ||
            payload.data;
        return Array.isArray(nested) ? nested : [];
    }

    const getFinancialYear = () => {
        const now = new Date();
        const year = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
        return year;
    }

    const fetchLeaveList = async (url, extra = { pass: "pass" }) => {
        const response = await axios.get(Baseurl + url, getAuthHeaders(extra));
        return extractList(response);
    }

    const createDefaultLeaveHeads = async () => {
        const defaults = [
            { head_leave_name: "Casual Leave", head_leave_short_name: "CL" },
            { head_leave_name: "Sick Leave", head_leave_short_name: "SL" },
            { head_leave_name: "Earned Leave", head_leave_short_name: "EL" },
        ];
        const headersToTry = [{ m_id: 206, pass: "pass" }, { pass: "pass" }, { m_id: 206 }];
        for (const item of defaults) {
            for (const extra of headersToTry) {
                try {
                    await axios.post(Baseurl + `/db/leavehead`, item, getAuthHeaders(extra));
                    break;
                } catch (error) {
                    continue;
                }
            }
        }
        try {
            return await fetchLeaveList(`/db/leavehead`);
        } catch (error) {
            return [];
        }
    }

    const flattenLeaveRows = (list = []) => {
        const rows = [];
        (Array.isArray(list) ? list : []).forEach((data) => {
            const nestedCounts = Array.isArray(data?.leaveHead) && data.leaveHead[0]?.head_leave_cnt_id
                ? data.leaveHead
                : Array.isArray(data?.leave_counts)
                    ? data.leave_counts
                    : Array.isArray(data?.leaveCounts)
                        ? data.leaveCounts
                        : null;
            if (nestedCounts?.length) {
                nestedCounts.forEach((count) => {
                    rows.push({
                        ...data,
                        ...count,
                        head_leave_id: data?.head_leave_id || count?.head_leave_id,
                        head_leave_cnt_id: count?.head_leave_cnt_id || count?.cnt_id,
                        total_head_leave: count?.total_head_leave || data?.total_head_leave || 12,
                        head_leave_name: data?.head_leave_name || count?.head_leave_name,
                    });
                });
            } else {
                rows.push(data);
            }
        });
        return rows;
    }

    const createLeaveCounts = async (heads = []) => {
        const year = getFinancialYear();
        const headersToTry = [{ m_id: 205, pass: "pass" }, { pass: "pass" }, { m_id: 206 }];
        const created = [];
        for (const head of heads) {
            const headId = head?.head_leave_id || head?.leaveHead?.head_leave_id;
            if (!headId) continue;
            const payload = {
                head_leave_id: Number(headId),
                total_head_leave: Number(head?.total_head_leave || 12),
                financial_start: `${year}-04-01`,
                financial_end: `${year + 1}-03-31`,
            };
            for (const extra of headersToTry) {
                try {
                    const response = await axios.post(Baseurl + `/db/leavehead/count`, payload, getAuthHeaders(extra));
                    const createdRow = response?.data?.data;
                    created.push({
                        ...head,
                        ...(createdRow && !Array.isArray(createdRow) ? createdRow : {}),
                        head_leave_id: Number(headId),
                        head_leave_cnt_id: createdRow?.head_leave_cnt_id || createdRow?.[0]?.head_leave_cnt_id || head?.head_leave_cnt_id,
                        total_head_leave: payload.total_head_leave,
                    });
                    break;
                } catch (error) {
                    continue;
                }
            }
        }
        return created;
    }

    const normalizeLeaveOptions = (list = []) => {
        return flattenLeaveRows(list)
            .map((data) => {
                const nestedHead = Array.isArray(data?.leaveHead) ? null : data?.leaveHead;
                const countFromHead = Array.isArray(data?.leaveHead) ? data.leaveHead[0] : null;
                const headId = Number(data?.head_leave_id || nestedHead?.head_leave_id || countFromHead?.head_leave_id);
                const countId = Number(
                    data?.head_leave_cnt_id ||
                    data?.cnt_id ||
                    countFromHead?.head_leave_cnt_id ||
                    nestedHead?.head_leave_cnt_id
                );
                const label =
                    data?.head_leave_name ||
                    nestedHead?.head_leave_name ||
                    countFromHead?.head_leave_name ||
                    data?.leave_name ||
                    data?.name ||
                    (headId ? `Leave ${headId}` : "");
                if (!headId || !label) return null;
                return {
                    ...data,
                    head_leave_id: headId,
                    head_leave_cnt_id: Number.isFinite(countId) && countId > 0 ? countId : null,
                    total_head_leave: Number(data?.total_head_leave || countFromHead?.total_head_leave || 12),
                    leaveHead: {
                        head_leave_name: label,
                    },
                };
            })
            .filter(Boolean);
    }

    const getLeaveOptions = (list = leaveList) => {
        return normalizeLeaveOptions(list).map((data) => ({
            value: data.head_leave_id,
            label: data.leaveHead?.head_leave_name,
            total_head_leave: data.total_head_leave,
            head_leave_cnt_id: data.head_leave_cnt_id,
        }));
    }

    async function getLeaveCount(leaveId, totalLeave, countId) {

        if (hasCookie('token')) {
            try {
                const cntId = countId || leaveId;
                const response = await axios.get(
                    Baseurl + `/db/leaveapp/status?cnt_id=${cntId}&t_cnt=${totalLeave}`,
                    getAuthHeaders({ m_id: 97, pass: "pass" })
                );
                const remaining = response?.data?.data;
                setNoOfDays((prev) => ({
                    ...prev,
                    remainingCount: remaining === 0 || remaining ? remaining : totalLeave,
                }))
            } catch (error) {
                setNoOfDays((prev) => ({ ...prev, remainingCount: totalLeave || '' }))
            }
        }
    }

    async function getUserLeaves() {

        if (hasCookie('token')) {
            try {
                let list = [];
                try {
                    const response = await axios.get(Baseurl + `/db/leaveapp`, getAuthHeaders({ m_id: 188 }));
                    list = extractList(response);
                } catch (error) {
                    const response = await axios.get(Baseurl + `/db/leaveapp`, getAuthHeaders({ pass: "pass" }));
                    list = extractList(response);
                }
                setLeaveAppList(list);
            } catch (error) {
                setLeaveAppList([]);
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
        if (!hasCookie("token")) return;
        try {
            const year = getFinancialYear();
            let list = [];
            const urls = [
                `/db/leavehead/count?mode=user`,
                `/db/leavehead/count?year=${year}`,
                `/db/leavehead`,
            ];
            for (const url of urls) {
                try {
                    list = await fetchLeaveList(url);
                    if (list.length) break;
                } catch (error) {
                    continue;
                }
            }

            if (!list.length) {
                list = await createDefaultLeaveHeads();
            }

            const hasCount = flattenLeaveRows(list).some((item) => item?.head_leave_cnt_id);
            if (list.length && !hasCount) {
                const created = await createLeaveCounts(list);
                try {
                    list = await fetchLeaveList(`/db/leavehead/count?year=${year}`);
                    if (!list.length) {
                        list = await fetchLeaveList(`/db/leavehead/count?mode=user`);
                    }
                    if (!list.length && created.length) {
                        list = created;
                    }
                    if (!list.length) {
                        list = await fetchLeaveList(`/db/leavehead`);
                    }
                } catch (error) {
                    if (created.length) list = created;
                }
            }

            const normalized = normalizeLeaveOptions(list);
            setLeaveList(normalized);
            if (!normalized.length) {
                toast.warning("No leave types found. Please add Leave Head first.");
            }
        } catch (error) {
            setLeaveList([]);
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
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

    // const calculateDays = (value) => {
    //     const from_date = new Date(userInfo.from_date);
    //     const to_date = new Date(value);
    
    //     if (from_date && to_date) {
    //         const diffInMs = Math.abs(from_date - to_date);
    //         const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1;
    
    //         // Validate that the selected number of days is not greater than the remaining leaves
    //         if (diffInDays > noOfDays.remainingCount) {
    //             toast.error(`You cannot take more than ${noOfDays.remainingCount} days of leave.`);
    //         } else {
    //             setNoOfDays({ ...noOfDays, totalCount: diffInDays });
    //         }
    //     }
    // };
    

    const submitHandler = async () => {
        const remaining = Number(noOfDays.remainingCount)
        if (remaining && noOfDays.totalCount > remaining) {
            toast.error("You cannot apply for more days than your remaining leaves");
            return;
        }

        if (hasCookie("token")) {
            const selected = normalizeLeaveOptions(leaveList).find(
                (item) => String(item.head_leave_id) === String(userInfo.head_leave_id)
            );
            let headLeaveId = Number(userInfo.head_leave_id || selected?.head_leave_id);
            let countId = Number(userInfo.head_leave_cnt_id || selected?.head_leave_cnt_id);

            if (!headLeaveId) {
                toast.error("Please Choose Valid Leave Type");
                setErrorData({ ...errorData, head_leave_cnt_id: "Please Choose Valid Leave Type" });
                return;
            }

            if (!countId) {
                const created = await createLeaveCounts([selected || { head_leave_id: headLeaveId, total_head_leave: 12 }]);
                countId = Number(created?.[0]?.head_leave_cnt_id);
                if (!countId) {
                    try {
                        const year = getFinancialYear();
                        const refreshed = normalizeLeaveOptions(await fetchLeaveList(`/db/leavehead/count?year=${year}`));
                        const match = refreshed.find((item) => String(item.head_leave_id) === String(headLeaveId));
                        countId = Number(match?.head_leave_cnt_id);
                        if (match) setLeaveList(refreshed);
                    } catch (error) {
                        countId = null;
                    }
                }
            }

            if (!countId) {
                toast.error("Please Choose Valid Leave Type");
                setErrorData({ ...errorData, head_leave_cnt_id: "Please Choose Valid Leave Type" });
                return;
            }

            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 187,
                    pass: "pass",
                },
            };

            let reqOptions = {
                head_leave_id: headLeaveId,
                head_leave_cnt_id: countId,
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
                        setisLoading(false)
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
                    setisLoading(false)
                    if (error?.response?.data?.status === 422) {
                        const taskObject = {}
                        const array = error?.response?.data?.data;
                        for (let i = 0; i < array.length; i++) {
                            const key = Object.keys(array[i])[0];
                            const value = Object.values(array[i])[0];
                            taskObject[key] = value;
                        }

                        setErrorData(taskObject);
                        if (taskObject.head_leave_id && !taskObject.head_leave_cnt_id) {
                            taskObject.head_leave_cnt_id = taskObject.head_leave_id;
                            setErrorData(taskObject);
                        }
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.isReady, id]);

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">{editMode ? "EDIT" : "APPLY"} LEAVE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/crm">Home</Link>
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
                                        placeholder="Select Leave Type"
                                        options={getLeaveOptions()}
                                        value={getLeaveOptions().find((option) => String(option.value) === String(userInfo.head_leave_id)) || null}
                                        onChange={(e) => {
                                            setUserInfo({
                                                ...userInfo,
                                                head_leave_id: Number(e.value),
                                                total_head_leave: e.total_head_leave,
                                                head_leave_cnt_id: e.head_leave_cnt_id ? Number(e.head_leave_cnt_id) : null,
                                            })
                                            getLeaveCount(e.value, e.total_head_leave, e.head_leave_cnt_id)
                                            setErrorData({ ...errorData, head_leave_cnt_id: '', head_leave_id: '' })
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
                            leaveAppList={Array.isArray(leaveAppList) ? leaveAppList : []}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeave;