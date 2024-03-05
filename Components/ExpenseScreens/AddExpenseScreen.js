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
        detail:""
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

    const minDate = new Date().toISOString().slice(0, 10);

    async function getPolicyHead() {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 200
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/expence`, header);
                setPolicyAppList(response.data.data);
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
        let obj = { ...userInfo }
        const currId = e.value
        obj['policy_id'] = currId;
        setUserInfo(obj);
        const filteredObjects = policyHeadList.filter(obj => obj.policy_id == currId);
        const currObj = filteredObjects[0];
        if (currObj.is_travel) {
            setIsTravel(true)
            getOnePolicy(obj.policy_id)
        } else {
            setIsTravel(false)

        }
       // let obj = { ...userInfo }
        // obj[e.target.name] = e.target.value;
        // setUserInfo(obj);
        // if (obj.policy_id && obj.from_date && obj.claim_type) {
        //     getOnePolicy(obj.policy_id, moment(obj.from_date).format("YYYY-MM-DD LT"), obj.claim_type)
        // }
    }

    const getOnePolicy = async (id) => {

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
                const response = await axios.get(Baseurl + `/db/policy/type?ph_id=${id}`, header);
                setpolicyTypeList(response.data.data);
                // if (response.data.status === 200) {
                //     if (response?.data?.data[0]?.fixed) {
                //         setPolicyViewMode('fixed')
                //     } else if (response?.data?.data[0]?.max_allowance) {
                //         setPolicyViewMode('allowance')
                //     } else {
                //         setPolicyViewMode('')
                //         toast.error('No Policies Found')
                //     }
                // }
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
                const response = await axios.get(Baseurl + `/db/policy`, header);
                setPolicyHeadList(response.data.data);
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

    console.log(policyHeadList);

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

            let reqOptions = {
                // policy_type_id: policyObj.policy_type_id ? policyObj.policy_type_id : null,
                policy_id: userInfo.policy_id ? userInfo.policy_id : null,
                claim_type: userInfo.claim_type ? userInfo.claim_type : null,
                from_date: userInfo.from_date ? moment(userInfo.from_date).format("YYYY-MM-DD LTS") : null,
                to_date: userInfo.to_date ? moment(userInfo.to_date).format("YYYY-MM-DD LTS") : null,
                from_location: userInfo.from_location ? userInfo.from_location : null,
                to_location: userInfo.to_location ? userInfo.to_location : null,
                kms: userInfo.kms ? userInfo.kms : null,
                total_expence: userInfo.total_expence,
                detail : userInfo.detail,

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
                        detail:null
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
    }, [])

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">APPLY EXPENSE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/">Home</Link>
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
                        <div className="row">
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.policy_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Select Policy *</label>
                                    <Select
                                        name="policy_id"
                                        defaultValue={''}
                                        options={policyHeadList?.map((data, i) => {
                                            return {
                                                value: data?.policy_id,
                                                label: data?.policy_name,
                                                
                                            }
                                        })}
                                        onChange={(e) => {
                                            getpolExpFunc(e)
                                            setErrorData({ ...errorData, policy_id: '' })
                                             setActiveData(e.value.is_travel)
                                        }}
                                    />
                                    <span className="errorText"> {errorData?.policy_id ? errorData.policy_id : ''}</span>
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

                            {isTravel ?
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className={errorData?.claim_type ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="claim_type">Expense Type *</label>
                                        <select
                                            name="exp_id"
                                            id="exp_id"
                                            className='form-control'
                                            onChange={(e) => setUserInfo({ ...userInfo, policy_type_id: e.target.value })}
                                            value={userInfo.policy_type_id ? userInfo.policy_type_id : ''} >
                                            <option value="">Select Policy</option>
                                            {policyTypeList?.map(({ policy_type_id, policy_type_name }) => {
                                                return <option key={policy_type_id} value={policy_type_id}>{policy_type_name}</option>
                                            })}
                                        </select>
                                        <span className="errorText"> {errorData?.claim_type ? errorData.claim_type : ''}</span>
                                    </div>
                                </div> : null}



                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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


                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.from_location ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="from_location">{isTravel ? "Start Location" : "Location"} </label>
                                    <input
                                        type="text"
                                        name="from_location"
                                        placeholder="Start Location"
                                        id="from_location "
                                        className={errorData?.from_location ? 'form-control is-invalid' : 'form-control'}
                                        onChange={(e) => {
                                            setUserInfo({ ...userInfo, from_location: e.target.value })
                                            setErrorData({ ...errorData, from_location: '' })
                                        }}
                                        value={userInfo.from_location ? userInfo.from_location : ""}
                                    />
                                    <span className="errorText"> {errorData?.from_location ? errorData.from_location : ''}</span>
                                </div>
                            </div>
                            {isTravel ?
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className={errorData?.to_location ? 'input_box errorBox' : 'input_box'}>
                                        <label htmlFor="to_location">End Location </label>
                                        <input
                                            type="text"
                                            name="to_location"
                                            placeholder="End Location"
                                            id="to_location "
                                            className={errorData?.to_location ? 'form-control is-invalid' : 'form-control'}
                                            onChange={(e) => {
                                                setUserInfo({ ...userInfo, to_location: e.target.value })
                                                setErrorData({ ...errorData, to_location: '' })
                                            }}
                                            value={userInfo.to_location ? userInfo.to_location : ""} />
                                        <span className="errorText"> {errorData?.to_location ? errorData.to_location : ''}</span>
                                    </div>
                                </div> : ""}
                            {isTravel ?
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="profilelevel">Details </label>
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
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
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

                    <div className="row">
                        <DynamicTable title='Expenses Applications'
                            policyAppList={policyAppList}
                            viewRemark={viewRemark}
                            isTravel= {isTravel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLeave;