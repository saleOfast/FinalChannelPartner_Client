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
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./AddExpenseMui'),
    { ssr: false }
)



const AddLeave = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();

    const [noOfDays, setNoOfDays] = useState({ totalCount: '', remainingCount: '' });

    const [userInfo, setUserInfo] = useState({
        policy_id: null,
        policy_type_id: null,
        claim_type: null,
        from_date: null,
        to_date: null,
        from_location: null,
        to_location: null,
        total_expence: null,
        kms: "",
        detail:"",
        report_to: null,
    });

    const { id } = router.query;

    const [policyHeadList, setPolicyHeadList] = useState([])
    const [policyAppList, setPolicyAppList] = useState([])
    const [policyTypeList, setpolicyTypeList] = useState([])
    const [policyObj, setPolicyObj] = useState({})
    const [policyViewMode, setPolicyViewMode] = useState('')
    const [errorData, setErrorData] = useState({})
    const [isLoading, setisLoading] = useState(false)
    const [activeData, setActiveData] = useState(false)
    const [isTravel, setIsTravel] = useState(false)
    const [uploadDocs, setuploadDocs] = useState([])
    const [usersList, setUsersList] = useState([])
    const [loginUser, setLoginUser] = useState({})

    const minDate = new Date().toISOString().slice(0, 10);

    const extractList = (response) => {
        const payload = response?.data?.data ?? response?.data;
        if (Array.isArray(payload)) return payload;
        if (!payload || typeof payload !== "object") return [];
        const nested =
            payload.rows ||
            payload.policyData ||
            payload.policyHeadData ||
            payload.policyTypes ||
            payload.policy_types ||
            payload.types ||
            payload.policyTypeData ||
            payload.expenceData ||
            payload.list ||
            payload.data;
        return Array.isArray(nested) ? nested : [];
    }

    const getAuthHeaders = (extra = {}) => ({
        headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(getCookie("token")),
            db: getCookie("db_name"),
            ...extra,
        }
    })

    const userOptions = (Array.isArray(usersList) ? usersList : []).map((data) => ({
        value: data?.user_id,
        label: data?.user || data?.user_name || `User ${data?.user_id}`,
    }))

    const policyOptions = (Array.isArray(policyHeadList) ? policyHeadList : [])
        .filter((data) => data?.status !== false && data?.status !== 0)
        .map((data) => ({
            value: data?.policy_id,
            label: data?.policy_name || data?.policy_code || `Policy ${data?.policy_id}`,
            is_travel: data?.is_travel,
        }))

    const policyTypeOptions = (Array.isArray(policyTypeList) ? policyTypeList : []).map((item) => {
        const typeId = item?.policy_type_id || item?.id || item?.pt_id || null;
        return {
            value: typeId,
            label: item?.policy_type_name || item?.name || item?.claim_type || `Type ${typeId}`,
            claim_type: item?.claim_type,
        };
    })

    const selectStyles = {
        control: (base, state) => ({
            ...base,
            minHeight: 38,
            height: 38,
            borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
            boxShadow: "none",
        }),
        valueContainer: (base) => ({ ...base, height: 36, padding: "0 8px" }),
        indicatorsContainer: (base) => ({ ...base, height: 36 }),
        input: (base) => ({ ...base, margin: 0, padding: 0 }),
        menu: (base) => ({ ...base, zIndex: 20 }),
    }

    const getLoginDetails = () => {
        try {
            return hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) : {};
        } catch (error) {
            return {};
        }
    }

    const getUsersList = async () => {
        if (!hasCookie("token")) return;
        try {
            let response;
            try {
                response = await axios.get(Baseurl + `/db/users?mode=ul`, getAuthHeaders({ pass: "pass" }));
            } catch (error) {
                response = await axios.get(Baseurl + `/db/users`, getAuthHeaders({ pass: "pass" }));
            }
            const list = extractList(response);
            setUsersList(list);
        } catch (error) {
            setUsersList([]);
        }
    }

    const getCurrentUser = async () => {
        const cookieUser = getLoginDetails();
        setLoginUser(cookieUser);
        const userId = cookieUser?.user_id;
        if (!userId || !hasCookie("token")) {
            if (cookieUser?.user_id) {
                setUserInfo((prev) => ({
                    ...prev,
                    report_to: cookieUser?.report_to || cookieUser?.user_id,
                }));
            }
            return;
        }
        try {
            const response = await axios.get(Baseurl + `/db/users?id=${userId}`, getAuthHeaders({ pass: "pass" }));
            const current = response?.data?.data || cookieUser;
            setLoginUser({ ...cookieUser, ...current });
            setUserInfo((prev) => ({
                ...prev,
                report_to: current?.report_to || cookieUser?.report_to || current?.user_id || cookieUser?.user_id,
            }));
        } catch (error) {
            setUserInfo((prev) => ({
                ...prev,
                report_to: cookieUser?.report_to || cookieUser?.user_id,
            }));
        }
    }

    const ensureUserReportTo = async (reportToId) => {
        const current = loginUser || getLoginDetails();
        if (!current?.user_id || !reportToId) return reportToId;
        if (current?.report_to) return reportToId;
        const payload = {
            user_id: current.user_id,
            user_code: current.user_code,
            report_to: reportToId,
        };
        try {
            await axios.put(
                Baseurl + `/db/users`,
                payload,
                getAuthHeaders({ pass: "pass" })
            );
            setLoginUser({ ...current, report_to: reportToId });
        } catch (error) {
            console.log(error);
        }
        return reportToId;
    }

    async function getPolicyHead() {
        if (hasCookie('token')) {
            try {
                let response;
                try {
                    response = await axios.get(Baseurl + `/db/expence`, getAuthHeaders({ m_id: 202 }));
                } catch (error) {
                    response = await axios.get(Baseurl + `/db/expence`, getAuthHeaders({ pass: "pass" }));
                }
                setPolicyAppList(extractList(response));
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



    function getpolExpFunc(e) {
        const currId = e?.value;
        const currObj = (Array.isArray(policyHeadList) ? policyHeadList : [])
            .find((item) => String(item?.policy_id) === String(currId));
        const isTravelPolicy = !!(currObj?.is_travel);
        setUserInfo({
            ...userInfo,
            policy_id: currId,
            policy_type_id: null,
            claim_type: null,
        });
        setpolicyTypeList([]);
        setIsTravel(isTravelPolicy);
        setActiveData(isTravelPolicy);
        if (currId) {
            getOnePolicy(currId);
        }
    }

    const getPolicyTypeId = (item) => item?.policy_type_id || item?.id || item?.pt_id || null;

    const fetchPolicyTypes = async (policyId) => {
        const urls = [
            `/db/policy/type?ph_id=${policyId}`,
            `/db/policy/type?policy_id=${policyId}`,
        ];
        for (const url of urls) {
            try {
                const response = await axios.get(Baseurl + url, getAuthHeaders({ pass: "pass" }));
                const list = extractList(response);
                if (list.length) return list;
            } catch (error) {
                continue;
            }
        }
        try {
            const response = await axios.get(
                Baseurl + `/db/policy/type?ph_id=${policyId}`,
                getAuthHeaders({ m_id: 217 })
            );
            return extractList(response);
        } catch (error) {
            return [];
        }
    }

    const applyPolicyType = (list) => {
        setpolicyTypeList(list);
        if (!list.length) return;
        const firstType = list[0];
        const typeId = getPolicyTypeId(firstType);
        setUserInfo((prev) => ({
            ...prev,
            policy_type_id: typeId,
            claim_type: firstType?.claim_type || prev.claim_type || "DA",
        }));
        setErrorData((prev) => ({ ...prev, policy_type_id: "" }));
    }

    const createDefaultPolicyType = async (policyId, policyName = "General") => {
        const payload = {
            policy_id: policyId,
            policy_type_name: policyName || "General",
            claim_type: "DA",
            cost_per_km: 0,
            from_date: moment(new Date().toISOString()).format("YYYY-MM-DD LTS"),
        };
        const headersToTry = [{ m_id: 218, pass: "pass" }, { pass: "pass" }, { m_id: 218 }];
        for (const extra of headersToTry) {
            try {
                const response = await axios.post(Baseurl + `/db/policy/type`, payload, getAuthHeaders(extra));
                const created = response?.data?.data;
                if (Array.isArray(created) && created.length) return created;
                if (created && typeof created === "object") return [created];
                return fetchPolicyTypes(policyId);
            } catch (error) {
                continue;
            }
        }
        return [];
    }

    const createDefaultPolicyHead = async () => {
        const payload = { policy_name: "General Expense", is_travel: false };
        const headersToTry = [{ m_id: 213, pass: "pass" }, { pass: "pass" }, { m_id: 213 }];
        for (const extra of headersToTry) {
            try {
                const response = await axios.post(Baseurl + `/db/policy`, payload, getAuthHeaders(extra));
                const created = response?.data?.data;
                if (created?.policy_id) return created;
                const list = extractList(response);
                if (list[0]?.policy_id) return list[0];
                break;
            } catch (error) {
                continue;
            }
        }
        try {
            const response = await axios.get(Baseurl + `/db/policy`, getAuthHeaders({ pass: "pass" }));
            const list = extractList(response);
            return list.find((item) => item?.policy_name === "General Expense") || list[0] || null;
        } catch (error) {
            return null;
        }
    }

    const getOnePolicy = async (id) => {
        if (!hasCookie("token") || !id) return;
        try {
            let list = await fetchPolicyTypes(id);
            if (!list.length) {
                const selectedPolicy = (Array.isArray(policyHeadList) ? policyHeadList : [])
                    .find((item) => String(item?.policy_id) === String(id));
                list = await createDefaultPolicyType(id, selectedPolicy?.policy_name || "General");
                if (!list.length) {
                    list = await fetchPolicyTypes(id);
                }
            }
            applyPolicyType(list);
            if (!list.length) {
                toast.warning("Could not create policy type. Please try again.");
            }
        } catch (error) {
            setpolicyTypeList([]);
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Something went wrong!')
            }
        }
    }
    const AddUploadPicture = async (expence_id, fileArr) => {
        if (!hasCookie('token')) return;
        const token = getCookie('token');
        const db_name = getCookie('db_name');
        const formdata = new FormData();
        uploadDocs?.map((item, i)=>{
            formdata.append("file", item);
        })
            
        
        formdata.append('exp_id', expence_id)
        const requestOptions = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                db: db_name,
            },
            body: formdata,
            redirect: 'follow',
        };

        try {
            const response = await fetch(`${Baseurl}/db/expence/upload`, requestOptions);
            const result = await response.text();
            toast.info(result.message);
        } catch (error) {
            console.log('error', error);
        }
    };


    const getLeaveHead = async () => {
        if (!hasCookie('token')) return;
        try {
            let list = [];
            try {
                const response = await axios.get(Baseurl + `/db/policy`, getAuthHeaders({ pass: "pass" }));
                list = extractList(response);
            } catch (error) {
                const response = await axios.get(Baseurl + `/db/policy`, getAuthHeaders({ m_id: 212 }));
                list = extractList(response);
            }
            if (!list.length) {
                const createdHead = await createDefaultPolicyHead();
                try {
                    const response = await axios.get(Baseurl + `/db/policy`, getAuthHeaders({ pass: "pass" }));
                    list = extractList(response);
                } catch (reloadError) {
                    if (createdHead?.policy_id) list = [createdHead];
                }
                if (list[0]?.policy_id) {
                    await createDefaultPolicyType(list[0].policy_id, list[0].policy_name || "General Expense");
                }
            }
            setPolicyHeadList(list);
        } catch (error) {
            setPolicyHeadList([]);
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            }
            else {
                toast.error('Something went wrong!')
            }
        }
    }


    function disTanceTotalCalc(e) {
        let value = e.target.value
        const totalExp = value * policyObj.cost_per_km;
        setUserInfo({ ...userInfo, kms: value, total_expence: totalExp })
    }

    const UploadMultiFile = async (e) =>{
        let arr = []
        let arr2 = []
        Object.entries(e.target.files).map((e) =>{
            arr.push(e[1])
            arr2.push({image: URL.createObjectURL(e[1])})
        }
        );
        setuploadDocs([...uploadDocs , ...arr])
    }

    const submitHandler = async () => {
        if (hasCookie("token")) {
            const policyTypeId = userInfo.policy_type_id ? Number(userInfo.policy_type_id) : null;
            if (!policyTypeId) {
                toast.error("Please choose policy type");
                setErrorData({ ...errorData, policy_type_id: "Please choose policy" });
                return;
            }
            const reportToId = userInfo.report_to || loginUser?.report_to || loginUser?.user_id || getLoginDetails()?.user_id;
            if (!reportToId) {
                toast.error("Please select Submit To");
                setErrorData({ ...errorData, report_to: "Please select Submit To" });
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
                    m_id: 201
                },
            };

            await ensureUserReportTo(reportToId);

            const loginDetails = getLoginDetails();
            let reqOptions = {
                policy_type_id: policyTypeId,
                policy_id: userInfo.policy_id ? userInfo.policy_id : null,
                claim_type: userInfo.claim_type ? userInfo.claim_type : null,
                from_date: userInfo.from_date ? moment(userInfo.from_date).format("YYYY-MM-DD LTS") : null,
                to_date: userInfo.to_date ? moment(userInfo.to_date).format("YYYY-MM-DD LTS") : null,
                from_location: userInfo.from_location ? userInfo.from_location : null,
                to_location: userInfo.to_location ? userInfo.to_location : null,
                kms: userInfo.kms ? userInfo.kms : null,
                total_expence: userInfo.total_expence,
                detail : userInfo.detail,
                report_to: reportToId,
                submitted_to: reportToId,
                user_code: loginUser?.user_code || loginDetails?.user_code || null,
                user_id: loginUser?.user_id || loginDetails?.user_id || null,
            }

            if (reqOptions.kms === null) {
                delete reqOptions.kms
            } if (reqOptions.to_location === null) {
                delete reqOptions.to_location
            }


            try {
                const response = await axios.post(Baseurl + `/db/expence`, reqOptions, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    if (uploadDocs.length > 0) AddUploadPicture(response.data.data.expence_id, uploadDocs)
                    setUserInfo({
                        policy_id: null,
                        policy_type_id: null,
                        claim_type: null,
                        from_date: null,
                        to_date: null,
                        from_location: null,
                        to_location: null,
                        kms: null,
                        total_expence: null,
                        detail:null,
                        report_to: loginUser?.report_to || loginUser?.user_id || null,
                    })
                    setPolicyObj({})
                    console.log('ok');
                    getPolicyHead();
                    console.log('done');
                    setisLoading(false)
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
    };



    function viewRemark(value) {
        console.log(value);
    }

    useEffect(() => {
        getLeaveHead();
        getPolicyHead();
        getUsersList();
        getCurrentUser();
    }, [])

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">APPLY EXPENSE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/crm">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/crm/ManagePolicyHeadScreen">Policy Head Master</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Apply Expense
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
                        <div className="row g-3 align-items-start">
                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className={errorData?.policy_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Expense Type *</label>
                                    <Select
                                        name="policy_id"
                                        classNamePrefix="expense-select"
                                        placeholder="Select Expense Type"
                                        styles={selectStyles}
                                        options={policyOptions}
                                        value={policyOptions.find((option) => String(option.value) === String(userInfo.policy_id)) || null}
                                        onChange={(e) => {
                                            getpolExpFunc(e)
                                            setErrorData({ ...errorData, policy_id: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.policy_id ? errorData.policy_id : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className={errorData?.report_to ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="report_to">Submit To *</label>
                                    <Select
                                        name="report_to"
                                        classNamePrefix="expense-select"
                                        placeholder="Select Manager"
                                        styles={selectStyles}
                                        options={userOptions}
                                        value={userOptions.find((option) => String(option.value) === String(userInfo.report_to)) || null}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, report_to: e.value })
                                            setErrorData({ ...errorData, report_to: '' })
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.report_to ? errorData.report_to : ''}</span>
                                </div>
                            </div>
                                    
                                 
                            {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.policy_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="policy_id">Select Policy *</label>
                                    <select
                                        name="policy_id"
                                        id="policy_id"
                                        className={errorData?.policy_id ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            getpolExpFunc(e)
                                            setErrorData({ ...errorData, policy_id: '' })
                                            setActiveData(e.target.value.is_travel)
                                        }}
                                        value={userInfo.policy_id ? userInfo.policy_id : ''} >
                                        <option value="">Select Policy</option>
                                        {policyHeadList?.map((data) => {
                                            return <option key={data.policy_id} value={data.policy_id}

                                            >{data.policy_name}</option>
                                        })}
                                    </select>
                                    <span className="errorText"> {errorData?.policy_id ? errorData.policy_id : ''}</span>
                                </div>
                            </div> */}

                            {userInfo.policy_id ?
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className={(errorData?.policy_type_id || errorData?.claim_type) ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="claim_type">Policy Type *</label>
                                        <Select
                                            name="policy_type_id"
                                            classNamePrefix="expense-select"
                                            placeholder="Select Policy Type"
                                            styles={selectStyles}
                                            options={policyTypeOptions}
                                            value={policyTypeOptions.find((option) => String(option.value) === String(userInfo.policy_type_id)) || null}
                                            onChange={(e) => {
                                                setUserInfo({
                                                    ...userInfo,
                                                    policy_type_id: e?.value ? Number(e.value) : null,
                                                    claim_type: e?.claim_type || null,
                                                })
                                                setErrorData({ ...errorData, policy_type_id: '', claim_type: '' })
                                            }}
                                        />
                                        <span className="errorText"> {errorData?.policy_type_id || errorData?.claim_type || ''}</span>
                                    </div>
                                </div> : null}



                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className={errorData?.from_date ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="from_date">{isTravel ? "From date" : "Date"}</label>
                                    <input
                                        type="datetime-local"
                                        name="from_date"
                                        placeholder="Enter Date"
                                        id="from_date"
                                        min={minDate}
                                        className={errorData?.from_date ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, from_date: e.target.value })
                                            setErrorData({ ...errorData, from_date: '' })
                                        }}
                                        value={userInfo.from_date ? userInfo.from_date : ""}
                                    />
                                    <span className="errorText"> {errorData?.from_date ? errorData.from_date : ''}</span>
                                </div>
                            </div>
                            {isTravel ?
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className={errorData?.to_date ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="to_date">To date </label>
                                        <input
                                            type="datetime-local"
                                            name="to_date"
                                            placeholder="Enter Date"
                                            id="to_date"
                                            className={errorData?.to_date ? 'form-control is-invalid' : 'form-control'}
                                            onChange={(e) => {
                                                setUserInfo({ ...userInfo, to_date: e.target.value })
                                                setErrorData({ ...errorData, to_date: '' })
                                            }}
                                            value={userInfo.to_date ? userInfo.to_date : ""}
                                        />
                                        <span className="errorText"> {errorData?.to_date ? errorData.to_date : ''}</span>
                                    </div>
                                </div> : null}


                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className={errorData?.from_location ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="from_location">{isTravel ? "Start Location" : "Location"} </label>
                                    <input
                                    type="text"
                                    name="from_location"
                                    placeholder="Start Location"
                                    id="from_location"
                                    className={errorData?.from_location ? 'form-control is-invalid' : 'form-control'}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Only allow alphabets and spaces
                                        const regex = /^[A-Za-z0-9\s]*$/;

                                        if (regex.test(value)) {
                                        setUserInfo({ ...userInfo, from_location: value });
                                        setErrorData({ ...errorData, from_location: '' });
                                        }
                                    }}
                                    value={userInfo.from_location ? userInfo.from_location : ""}
                                    />

                                    <span className="errorText"> {errorData?.from_location ? errorData.from_location : ''}</span>
                                </div>
                            </div>
                            {isTravel ?
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className={errorData?.to_location ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="to_location">End Location </label>
                                            <input
                                            type="text"
                                            name="to_location"
                                            placeholder="End Location"
                                            id="to_location"
                                            className={errorData?.to_location ? 'form-control is-invalid' : 'form-control'}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                // Only allow alphabets and spaces
                                                const regex = /^[A-Za-z0-9\s]*$/;

                                                if (regex.test(value)) {
                                                setUserInfo({ ...userInfo, to_location: value });
                                                setErrorData({ ...errorData, to_location: '' });
                                                }
                                            }}
                                            value={userInfo.to_location ? userInfo.to_location : ""}
                                            />

                                        <span className="errorText"> {errorData?.to_location ? errorData.to_location : ''}</span>
                                    </div>
                                </div> : ""}
                            {isTravel ?
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className={errorData?.kms ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="kms">Enter Distance (in Km.) </label>
                                        <input
                                            type="number"
                                            name="kms"
                                            placeholder="Enter Distance"
                                            id="kms "
                                            className={errorData?.kms ? 'form-control is-invalid' : 'form-control'}
                                            onChange={(e) => {
                                                disTanceTotalCalc(e)
                                                setErrorData({ ...errorData, kms: '', kms: '' })
                                            }}
                                            value={userInfo.kms ? userInfo.kms : ""}
                                        />
                                        <span className="errorText"> {errorData?.kms ? errorData.kms : ''}</span>
                                    </div>
                                </div> : ""}

                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className={errorData?.total_expence ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="total_expence">Total Expense (&#8377;) * </label>
                                    <input
                                        type="number"
                                        name="total_expence"
                                        placeholder="Total Expense"
                                        id="total_expence "
                                        className={errorData?.total_expence ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, total_expence: e.target.value })
                                            setErrorData({ ...errorData, total_expence: '' })
                                        }}
                                        value={userInfo.total_expence ? userInfo.total_expence : ""} />
                                    <span className="errorText"> {errorData?.total_expence ? errorData.total_expence : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                <div className='input_box'>
                                    <label htmlFor="uplDocument">Upload Document</label>
                                    <input
                                        type="file"
                                        name="uplDocument"
                                        disabled={policyViewMode == 'allowance'}
                                        id="uplDocument "
                                        multiple
                                        className='form-control'
                                        onChange= {UploadMultiFile} />
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="input_box">
                                    <label htmlFor="profilelevel">Details</label>
                                    <textarea
                                        name="Exsdetail"
                                        id="Exsdetail"
                                        placeholder="Enter Expense Details"
                                        rows="3"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                detail: e.target.value,
                                            })
                                        }
                                        value={userInfo.detail ? userInfo.detail : ""}
                                    ></textarea>
                                </div>
                            </div>

                        </div>


                        {/* <div className="row">

                            {policyViewMode == 'fixed' ? <>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className="input_box">
                                        <label htmlFor="due_date">Fixed Cost</label>
                                        <input
                                            type="text"
                                            name="From_date "
                                            placeholder="Fixed Cost"
                                            id="From_date "
                                            disabled
                                            className="form-control"
                                            value={policyObj?.fixed ? policyObj.fixed : ''}
                                        />
                                    </div>
                                </div>
                            </> : ''}

                            {policyViewMode == 'allowance' ? <>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className="input_box">
                                        <label htmlFor="due_date">Cost Per Km</label>
                                        <input
                                            type="text"
                                            name="From_date "
                                            placeholder="Cost Per Km"
                                            id="From_date "
                                            disabled
                                            className="form-control"
                                            value={policyObj?.cost_per_km ? policyObj.cost_per_km : ''}
                                        />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 col-12">
                                    <div className="input_box">
                                        <label htmlFor="due_date">Maximum Allowance</label>
                                        <input
                                            type="text"
                                            name="From_date "
                                            placeholder="Maximum Allowance"
                                            id="From_date "
                                            disabled
                                            className="form-control"
                                            value={policyObj?.max_allowance ? policyObj.max_allowance : ''}
                                        />
                                    </div>
                                </div>


                            </> : ''}

                        </div> */}
                    </div>

                    <div className="add_user_form">
                        <div className="text-end">
                            <div className="submit_btn">
                                <button
                                    className="btn btn-primary"
                                    disabled={isLoading}
                                    onClick={submitHandler}>
                                    {isLoading ? 'Loading...' : 'Submit'}

                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="table_screen pt-0">
                        <DynamicTable title='Expenses Applications'
                            policyAppList={Array.isArray(policyAppList) ? policyAppList : []}
                            viewRemark={viewRemark}
                            isTravel={isTravel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeave;