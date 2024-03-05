import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { validEmail, validPhone, validZip } from "../../Utils/regex";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchData } from "../../Utils/getReq";
import Select from 'react-select';

const AddContactScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [countrylist, setcountrylist] = useState([]);
    const [statelist, setStatelist] = useState([]);
    const [citylist, setCitylist] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [accountsList, setAccountsList] = useState([]);
    const [singleAccount, setSingleAccount] = useState([]);
    const [isLoading, setisLoading] = useState(false)
    const [addInfo, setAddInfo] = useState([])
    const [viewMode, setViewMode] = useState(false);
    const [usersList, setUsersLsit] = useState([]);
    const [iscollapse, setiscollapse] = useState(false);
    const [errorData, setErrorData] = useState({})
    const [contError, setContError] = useState({})
    const [errorToast, setErrorToast] = useState(false)
    const [loginDetails, setloginDetails] = useState({})
    const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");
    const [newFields, setNewFields] = useState({
        field_lable: null,
        input_type: null,
        field_type: null,
        field_size: null,
        option: null,
    });

    const [userInfo, setUserInfo] = useState({

        contact_owner: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        saluation: "",
        account_name: null,
        report_to: null,
        designation: "",
        contact_no: null,
        email_id: "",
        fax: "",
        created_on: "",
        updated_on: "",
        mailing_cont: null,
        mailing_state: null,
        mailing_city: null,
        mailing_pincode: null,
        mailing_address: null,
        assigned_to: null,
        db_contact_fields: []

    });

    async function getAccountsList() {
        await fetchData(`/db/account`, setAccountsList, errorToast, setErrorToast)
    }

    async function getCountryList() {
        await fetchData(`/db/area/country?bill_cont=1`, setcountrylist, errorToast, setErrorToast)
    }

    async function getState() {
        await fetchData(`/db/area/states?cnt_id=${userInfo.mailing_cont}`, setStatelist, errorToast, setErrorToast)
    }

    const getcity = async (id) => {
        await fetchData(`/db/area/city?st_id=${id}`, (data) => setCitylist(data.cityData), errorToast, setErrorToast);
    };

    const getusersList = async (data) => {
        let url;
        if (data?.isDB == true) {
            url = "/db/users?mode=ul";
        } else {
            url = "/db/users"
        }
        await fetchData(url, setUsersLsit, errorToast, setErrorToast);
    };


    function checkLogin() {
        if (hasCookie("userInfo")) {
            let token = getCookie("userInfo");
            let data = JSON.parse(token)
            setloginDetails(data)
            getusersList(data)
            setUserInfo({ ...userInfo, contact_owner: data.user_id })
        }
    }

    const getSingleAccountsList = async (acc_id) => {
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
                const response = await axios.get(Baseurl + `/db/account?acc_id=${acc_id}`, header);
                setSingleAccount(response.data.data)
                setUserInfo({
                    ...userInfo,
                    mailing_cont: response.data.data.ship_cont,
                    mailing_state: response.data.data.ship_state,
                    mailing_city: response.data.data.ship_city,
                    mailing_address: response.data.data.ship_address,
                    mailing_pincode: response.data.data.ship_pincode

                })
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


    const getSingleData = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 29
                },
            };

            try {
                const response = await axios.get(
                    Baseurl + `/db/contacts?c_id=${id}`,
                    header
                );
                setUserInfo(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
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
                    m_id: 27
                },
            };

            let oppBody = { ...userInfo }
            oppBody.contact_owner = loginDetails.user_id
            try {
                const response = await axios.post(Baseurl + `/db/contacts`, oppBody, header);
                if (response.status === 204 || response.status === 200) {
                    await postFieldsFunc(response.data.data.contact_id, userInfo.db_contact_fields)
                    toast.success(response.data.message);
                    setisLoading(false)
                    router.push('/Contacts')
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
            toast.error('Please fill the Mandatory fileds')
        }

    }

    const UpdateHandler = async () => {

        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 29
                },
            };

            let newData = JSON.parse(JSON.stringify(userInfo))

            try {
                const response = await axios.put(
                    Baseurl + `/db/contacts`,
                    newData,
                    header
                );

                if (response.status === 200 || response.status === 204) {
                    await postFieldsFunc(newData.contact_id, newData.db_contact_fields)
                    toast.success(response.data.message);
                    setisLoading(false)
                    router.push("/Contacts");
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
            toast.error('Please fill the Mandatory fileds')
        }
    }

    const createInputField = (e) => {
        e.preventDefault();
        const { field_lable, input_type, field_type, option } = newFields;

        const showError = (errorMessage) => {
            toast.error(errorMessage);
        };

        const validateField = () => {
            if (!field_lable) {
                showError('Please enter the Field Name');
                return false;
            } else if (!input_type) {
                showError('Please select the Input Type');
                return false;
            }
            else if (input_type === 'input' && !field_type) {
                showError('Please select the Field Type');
                return false;
            }
            else if (input_type === 'input' && !field_size) {
                showError('Please Enyer Field Size');
                return false;
            }
            else if (input_type === 'select' && !option) {
                showError('Please select input Options');
                return false;
            }
            return true;
        };

        if (validateField()) {
            const inputReq = {
                ...newFields,
                field_name: field_lable.replaceAll(' ', '_'),
                navigate_type: userInfo.navigate_type,
                // field_order: inputsData.length + 1
            };
            let arr = userInfo
            arr.db_contact_fields.push(newFields)
            setUserInfo(arr)
            setiscollapse(!iscollapse);
            setNewFields({
                field_lable: null,
                input_type: null,
                field_type: null,
                option: null,
                field_size: null,
            })
        }
    };


    async function postFieldsFunc(id, data) {
        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: "pass"
                },
            };
            data?.map(item => {
                item.contact_id = id
            })

            try {
                const response = await axios.post(Baseurl + `/db/contacts/field`, data, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
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
    }

    const AddFieldsFunc = (e) => {
        e.preventDefault();
        setiscollapse(true)
    };

    const inputClass = (value) => {
        const inputClasses = {
            text: 'form-control',
            date: 'form-control',
            email: 'form-control',
            number: 'form-control',
            checkbox: 'form-check-input ms-3',
        };
        return inputClasses[value] || '';
    };


    const updateFieldInfo = (e, ind) => {

        let newData = JSON.parse(JSON.stringify(userInfo));
        newData.db_contact_fields[ind].input_value = e.target.value
        setUserInfo(newData)
        console.log('here', e.target.value);
    };

    const getContactFieldList = async () => {
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
                const response = await axios.get(Baseurl + `/db/field?nav_type=contact`, header);
                setUserInfo({ ...userInfo, db_contact_fields: response.data.data, updated_on: DateNow, created_on: DateNow });
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



    function useDebounce(value, delay) {

        const [debouncedValue, setDebouncedValue] = useState(value);

        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => {
                clearTimeout(timer);
            };
        }, [value, delay]);

        return debouncedValue;
    }

    useEffect(() => {
        if (userInfo.contact_no && !validPhone.test(userInfo.contact_no)) {
            setContError({ ...contError, contact_no: 'invalid contact no.' });
        } else {
            setContError({ ...contError, contact_no: '' });
        }

    }, [useDebounce(userInfo.contact_no, 1000)]);

    useEffect(() => {
        if (userInfo.email_id && !validEmail.test(userInfo.email_id)) {
            setContError({ ...contError, email_id: 'invalid Email' });
        } else {
            setContError({ ...contError, email_id: '' });
        }
    }, [useDebounce(userInfo.email_id, 1000)]);


    useEffect(() => {
        getCountryList();
        getState();
        getAccountsList();
        checkLogin();
        getusersList();
        setUserInfo({
            ...userInfo,
            created_on: DateNow,
            updated_on: DateNow,
        })
    }, []);

    useEffect(() => {
        if (!userInfo.mailing_state) {
            return;
        } else {
            getcity(userInfo.mailing_state);
        }
    }, [userInfo.mailing_state]);

    useEffect(() => {
        if (!userInfo.mailing_cont) {
            return;
        } else {
            getState(userInfo.mailing_cont);
        }
    }, [userInfo.mailing_cont]);



    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
        }
        else {
            if (userInfo !== undefined) {
                getContactFieldList()
            }
        }
        if (router.query.vw) [
            setViewMode(true)
        ]
    },
        [router.isReady, id]);




    useEffect(() => {

        if (userInfo.account_name !== null && !editMode) {
            // call the api with this acoount name 
            getSingleAccountsList(userInfo.account_name);
        }

    }, [userInfo.account_name]);

    useEffect(() => {
        // Accessing the accountName object when data changes
        if (userInfo) {
            const accountName = userInfo;
            // Access and use the properties of the accountName object as needed

        }
    }, [userInfo]);



    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head"> {viewMode ? 'VIEW' : <>
                    {editMode ? "EDIT" : "ADD"}
                </>} CONTACT</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link href="/Contacts"> Contact List </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {viewMode ? 'View' : <>
                                {editMode ? "Edit" : "Add"}
                            </>} Contact
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="main_content">
                <div className="Add_user_screen">
                    <div className="row">
                        <div className={viewMode ? `col-xl-9 col-md-9 col-sm-12 col-12` : `col-xl-12 col-md-12 col-sm-12 col-12`}>
                            <div className="add_screen_head">
                                <span className="text_bold">Fill Details</span> ( * Fields are
                                mandatory)
                            </div>
                            <div className="add_user_form">
                                <div className="row">

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.contact_owner ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="contact_owner">Owner *</label>
                                            {loginDetails?.isDB == true ? (
                                                <input
                                                    type="text"
                                                    name="contact_owner"
                                                    disabled
                                                    placeholder="Contact Owner Name"
                                                    id="contact_owner"
                                                    className="form-control"
                                                    value={loginDetails.user ? loginDetails.user : ""}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name="contact_owner"
                                                    disabled
                                                    placeholder="Contact Owner Name"
                                                    id="contact_owner"
                                                    className="form-control"
                                                    value={loginDetails.user ? loginDetails.user : ""}
                                                />)}
                                            <span className="errorText"> {errorData?.contact_owner ? errorData.contact_owner : ''}</span>
                                        </div>
                                    </div>


                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.account_name ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="task_name">Account Name *</label>
                                            <Select
                                                id={userInfo.task_status_id}
                                                defaultValue={""}
                                                isDisabled={viewMode}
                                                options={accountsList?.map((data, index) => {
                                                    return {
                                                        value: data?.acc_id,
                                                        label: data?.acc_name,

                                                    }
                                                })}
                                                value={accountsList?.map((data, index) => {
                                                    if (userInfo.account_name === data.acc_id) {
                                                        return {
                                                            value: data?.acc_id,
                                                            label: data?.acc_name,

                                                        }
                                                    }
                                                })}
                                                onChange={(e) => {
                                                    setUserInfo({ ...userInfo, account_name: e.value })
                                                    setErrorData({ ...errorData, account_name: '' })
                                                }}
                                            />
                                            <span className="errorText"> {errorData?.account_name ? errorData.account_name : ''}</span>
                                        </div>
                                    </div>


                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="Saluation">Saluation</label>
                                            <select
                                                name="selectInter"
                                                id="selectInter"
                                                className="form-control"
                                                disabled={viewMode}
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        saluation: e.target.value,
                                                    })
                                                }
                                                value={userInfo.saluation ? userInfo.saluation : ""}
                                            >
                                                <option value="">Select Saluation Type </option>
                                                <option value="Mr">Mr.</option>
                                                <option value="Mrs">Ms.</option>
                                            </select>
                                        </div>
                                    </div>


                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.first_name ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="first_name">First Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter First Name"
                                                name="first_name"
                                                id="first_name"
                                                disabled={viewMode}
                                                className={errorData?.first_name ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    setUserInfo({ ...userInfo, first_name: e.target.value })
                                                    setErrorData({ ...errorData, first_name: '' })
                                                }}
                                                value={userInfo.first_name ? userInfo.first_name : ""}
                                            />
                                            <span className="errorText"> {errorData?.first_name ? errorData.first_name : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="task_name">Middle Name </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Middle Name "
                                                name="task_name"
                                                disabled={viewMode}
                                                id="task_name"
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUserInfo({ ...userInfo, middle_name: e.target.value })
                                                }
                                                value={userInfo.middle_name ? userInfo.middle_name : ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.last_name ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="last_name">Last Name * </label>
                                            <input
                                                type="text"
                                                placeholder="Enter Last Name "
                                                name="last_name"
                                                id="last_name"
                                                disabled={viewMode}
                                                className={errorData?.last_name ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    setUserInfo({ ...userInfo, last_name: e.target.value })
                                                    setErrorData({ ...errorData, last_name: '' })
                                                }}
                                                value={userInfo.last_name ? userInfo.last_name : ""}
                                            />
                                            <span className="errorText"> {errorData?.last_name ? errorData.last_name : ''}</span>
                                        </div>
                                    </div>

                                    {editMode ?
                                       <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                       <div className={errorData?.assigned_to ? 'input_box errorBox' : 'input_box'}>
                                         <label htmlFor="task_name">Assign To </label>
                                         <Select
                                           id={userInfo.assigned_to}
                                           defaultValue={""}
                                           isDisabled={viewMode}
                                           options={usersList?.map((data, index) => {
                                             return {
                                               value: data?.user_id,
                                               label: data?.user,
                 
                                             }
                                           })}
                                           value={usersList?.map((data, index) => {
                                             if (userInfo.assigned_to === data.user_id) {
                                               return {
                                                 value: data?.user_id,
                                                 label: data?.user,
                 
                                               }
                                             }
                                           })}
                                           onChange={(e) => {
                                             setUserInfo({ ...userInfo, assigned_to: e.value })
                                             setErrorData({ ...errorData, assigned_to: '' })
                                           }}
                                         />
                                         <span className="errorText"> {errorData?.assigned_to ? errorData.assigned_to : ''}</span>
                                       </div>
                                     </div>
                                     : null}
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="task_name">Designation</label>
                                            <input
                                                type="text"
                                                placeholder="Enter Designation "
                                                name="Designation"
                                                id="Designation"
                                                disabled={viewMode}
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUserInfo({ ...userInfo, designation: e.target.value })
                                                }
                                                value={userInfo.designation ? userInfo.designation : ""}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={contError?.contact_no ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="Contact">Contact No</label>
                                            <input
                                                type="number"
                                                name="contact"
                                                placeholder="Enter Contact No. "
                                                id="Contact"
                                                disabled={viewMode}
                                                className={contError?.contact_no ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    setUserInfo({ ...userInfo, contact_no: e.target.value })
                                                }}
                                                value={userInfo.contact_no ? userInfo.contact_no : ""}
                                            />
                                            <span className="errorText"> {contError?.contact_no ? contError.contact_no : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={contError?.email_id ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="Email">Email Id</label>
                                            <input
                                                type="email"
                                                name="email"
                                                disabled={viewMode}
                                                placeholder="Enter Email Id"
                                                id="Email"
                                                className={contError?.email_id ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) =>
                                                    setUserInfo({ ...userInfo, email_id: e.target.value })
                                                }
                                                value={userInfo.email_id ? userInfo.email_id : ""}
                                            />
                                            <span className="errorText"> {contError?.email_id ? contError.email_id : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="Fax">Fax</label>
                                            <input
                                                type="number"
                                                name="Fax"
                                                disabled={viewMode}
                                                id="Fax"
                                                placeholder="Enter Fax"
                                                className="form-control"
                                                onChange={(e) => setUserInfo({ ...userInfo, fax: e.target.value })}
                                                value={userInfo.fax ? userInfo.fax : ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="add_screen_head">
                                <span className="text_bold">System Information </span>
                            </div>

                            <div className="add_user_form">
                                <div className="row">
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="created_on">Created On</label>
                                            <input
                                                type="date"
                                                name="per_cont"
                                                id="per_cont"
                                                disabled
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        created_on: e.target.value,
                                                    })
                                                }
                                                value={moment(userInfo?.created_on).format("YYYY-MM-DD")}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="last_modified">Last Modified On</label>
                                            <input
                                                type="date"
                                                name="per_cont"
                                                id="per_cont"
                                                disabled
                                                className="form-control"
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        updated_on: e.target.value,
                                                    })
                                                }
                                                value={moment(userInfo?.updated_on).format("YYYY-MM-DD")}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="add_screen_head">
                                <span className="text_bold">Address Information </span>
                            </div>

                            <div className="add_user_form">
                                <div className="row">

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.mailing_cont ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="task_name">Mailing Country</label>
                                            <Select
                                                id={userInfo.mailing_cont}
                                                defaultValue={""}
                                                isDisabled={viewMode}
                                                options={countrylist?.map((data, index) => {
                                                    return {
                                                        value: data?.country_id,
                                                        label: data?.country_name,

                                                    }
                                                })}
                                                value={countrylist?.map((data, index) => {
                                                    if (userInfo.mailing_cont === data.country_id) {
                                                        return {
                                                            value: data?.country_id,
                                                            label: data?.country_name,

                                                        }
                                                    }
                                                })}
                                                onChange={(e) =>
                                                    setUserInfo({ ...userInfo, mailing_cont: e.value })
                                                }
                                            />
                                            <span className="errorText"> {errorData?.mailing_cont ? errorData.mailing_cont : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.mailing_state ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="task_name">Mailing State</label>
                                            <Select
                                                id={userInfo.mailing_state}
                                                isDisabled={viewMode}
                                                defaultValue={""}
                                                options={statelist?.map((data, index) => {
                                                    return {
                                                        value: data?.state_id,
                                                        label: data?.state_name,

                                                    }
                                                })}
                                                value={statelist?.map((data, index) => {
                                                    if (userInfo.mailing_state === data.state_id) {
                                                        return {
                                                            value: data?.state_id,
                                                            label: data?.state_name,

                                                        }
                                                    }
                                                })}
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        mailing_state: e.value
                                                    })
                                                }
                                            />
                                            <span className="errorText"> {errorData?.mailing_state ? errorData.mailing_state : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.mailing_city ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="task_name">Mailing City</label>
                                            <Select
                                                id={userInfo.mailing_state}
                                                defaultValue={""}
                                                isDisabled={viewMode}
                                                options={citylist?.map((data, index) => {
                                                    return {
                                                        value: data?.city_id,
                                                        label: data?.city_name,

                                                    }
                                                })}
                                                value={citylist?.map((data, index) => {
                                                    if (userInfo.mailing_city === data.city_id) {
                                                        return {
                                                            value: data?.city_id,
                                                            label: data?.city_name,

                                                        }
                                                    }
                                                })}
                                                onChange={(e) =>
                                                    setUserInfo({
                                                        ...userInfo,
                                                        mailing_city: e.value
                                                    })
                                                }
                                            />
                                            <span className="errorText"> {errorData?.mailing_city ? errorData.mailing_city : ''}</span>
                                        </div>
                                    </div>

                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="zip_add">Zip / Postal Code</label>
                                            <input
                                                type="number"
                                                placeholder="Zip / Postal Code"
                                                name="zip_add"
                                                id="zip_add"
                                                disabled={viewMode}
                                                className="form-control"
                                                onChange={(e) => setUserInfo({ ...userInfo, mailing_pincode: e.target.value })}
                                                value={userInfo.mailing_pincode ? userInfo.mailing_pincode : ""}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="Shippingaddress">Mailing Full Address</label>
                                            <textarea
                                                name="Shippingaddress"
                                                id="Shippingaddress"
                                                className="form-control"
                                                placeholder="Enter Address"
                                                rows="2"
                                                disabled={viewMode}
                                                onChange={(e) => setUserInfo({ ...userInfo, mailing_address: e.target.value })}
                                                value={userInfo.mailing_address ? userInfo.mailing_address : ""}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    {userInfo.db_contact_fields?.map(({ option, field_name, field_lable, field_type, input_type, input_value }, ind) => (
                                        <div className="col-xl-3 col-md-3 col-sm-12 col-12" key={ind}>
                                            <div className="input_box">
                                                <label htmlFor={field_name + ind}> {field_lable} </label>
                                                {input_type === 'input' ? (
                                                    <input
                                                        type={field_type}
                                                        className={inputClass(field_type)}
                                                        id={field_name + ind}
                                                        disabled={viewMode}
                                                        name={field_name}
                                                        placeholder={field_lable}
                                                        onChange={(e) => updateFieldInfo(e, ind)}
                                                        value={input_value}
                                                    />
                                                ) : null}
                                                {input_type === 'select' ? (
                                                    <select
                                                        onChange={(e) => updateFieldInfo(e, ind)}
                                                        name={field_name}
                                                        id={field_name + ind}
                                                        className="form-control"
                                                        value={input_value}
                                                        disabled={viewMode}
                                                    >
                                                        <option value="">Select {field_lable}</option>
                                                        {option?.split(",").map((data, i) => (
                                                            <option value={data} key={i}>{data}</option>
                                                        ))}
                                                    </select>
                                                ) : null}
                                            </div>
                                        </div>
                                    ))}

                                    {/* <div className="btn-box">
                                <button
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    onClick={postFieldsFunc} 
                                    >
                                    {isLoading ? 'Loading...' : 'Save & Submit'}
                                </button>
                            </div> */}


                                    {iscollapse && (
                                        <div className="addFieldsForm py-5">
                                            <div className="row">
                                                <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                    <div className="input_box">
                                                        <label htmlFor='newFieldName'>Field Name</label>
                                                        <input
                                                            type='text'
                                                            className='form-control'
                                                            id='newFieldName'
                                                            disabled={viewMode}
                                                            placeholder='Field Name'
                                                            onChange={(e) => setNewFields({ ...newFields, field_lable: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                    <div className="input_box">
                                                        <label htmlFor='newFieldType'>Field Type</label>
                                                        <select
                                                            name="newFieldType"
                                                            className='form-control'
                                                            disabled={viewMode}
                                                            id="newFieldType"
                                                            onChange={(e) => setNewFields({ ...newFields, input_type: e.target.value })}
                                                        >
                                                            <option>Select Field Type</option>
                                                            <option value='input'>Input Box</option>
                                                            <option value='select'>Select Box</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {newFields.input_type === 'input' && (
                                                    <>
                                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                            <div className="input_box">
                                                                <label htmlFor='newInputType'>Input Type</label>
                                                                <select
                                                                    name="newInputType"
                                                                    className='form-control'
                                                                    disabled={viewMode}
                                                                    onChange={(e) => setNewFields({ ...newFields, field_type: e.target.value })}
                                                                    id="newInputType">
                                                                    <option>Select Input Type</option>
                                                                    <option value='text'>Text</option>
                                                                    <option value='email'>Email</option>
                                                                    <option value='checkbox'>Checkbox</option>
                                                                    <option value='number'>Number</option>
                                                                    <option value='date'>Date</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                            <div className="input_box">
                                                                <label htmlFor='field_size'>Field Size</label>
                                                                <input
                                                                    type='number'
                                                                    name="field_size"
                                                                    disabled={viewMode}
                                                                    className='form-control'
                                                                    placeholder='Enter field size'
                                                                    id="field_size"
                                                                    onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}

                                                {newFields.input_type === 'select' && (
                                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                                        <div className="input_box">
                                                            <label htmlFor='newKeywords'>Select Keywords</label>
                                                            <input
                                                                type='text'
                                                                name="newKeywords"
                                                                disabled={viewMode}
                                                                className='form-control'
                                                                placeholder='e.g. Name, age, gender'
                                                                id="newKeywords"
                                                                onChange={(e) => setNewFields({ ...newFields, option: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="btn-row my-4">
                                                {/* <button onClick={"AddFieldsFunc"} className="btn btn-light me-3">Cancel</button> */}
                                                <button onClick={createInputField} className="btn btn-success">Create Field</button>
                                            </div>
                                        </div>

                                    )}
                                    <div className="text-end">
                                        <div className="submit_btn">
                                            {viewMode ? null :
                                                <div className="add_screen_head">
                                                    <span className="text_bold"><button className='btn btn-primary ' onClick={AddFieldsFunc}> Add More Fields</button>  </span>
                                                </div>}
                                            {viewMode ? null : <>
                                                <Link href='/Contacts'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
                                                {editMode ? (
                                                    <button disabled={isLoading} className="btn btn-primary" onClick={UpdateHandler}>
                                                        {isLoading ? 'Loading...' : 'Update'}
                                                    </button>
                                                ) : (
                                                    <button disabled={isLoading} className="btn btn-primary" onClick={submitHandler}>
                                                        {isLoading ? 'Loading...' : 'Save & Submit'}
                                                    </button>
                                                )}

                                            </>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {viewMode ? <div className="col-xl-3 col-md-3 col-sm-12 col-12 sideCardAdd">
                            <div className="opertunity_box">
                                <div className="task_card mb-4">
                                    <div className="task_head">Lead List</div>
                                    <div className="tasks_details">
                                        <ul className="tasks_list">
                                            {userInfo?.db_leads?.map(({ lead_id, lead_name }, i) => {
                                                return (
                                                    <li key={lead_id} className="list-item">
                                                        <div className="opp_box">
                                                            <Link href={`/LeadsView?id=${lead_id}`}>
                                                                <div className="name">{lead_name}</div>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="card_footer">
                                        <Link href='/ManageLeads'>
                                            <div className="text_more">view more</div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                            : null}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddContactScreen;
