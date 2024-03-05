import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import CameraIcon from '../Svg/CameraIcon';
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl, filesUrl } from '../../Utils/Constants';
import { useRouter } from "next/router";
import { useSelector } from 'react-redux';
import { fetchData } from '../../Utils/getReq';
import Select from 'react-select';

const AddUserScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [editMode, setEditMode] = useState(false)
    const [viewMode, setViewMode] = useState(false)
    const [additionalFields, setAdditionalFields] = useState(false)
    const [userroles, setUserroles] = useState([])
    const [divisionList, setDivisionList] = useState([])
    const [departMentList, setDepartMentList] = useState([])
    const [designationList, setDesignationList] = useState([])
    const [countrylist, setcountrylist] = useState([]);
    const [statelist, setStatelist] = useState([]);
    const [errorData, setErrorData] = useState({});
    const [isLoading, setisLoading] = useState(false)
    const [citylist, setCitylist] = useState([]);
    const [errorToast, setErrorToast] = useState(false)
    const [usersList, setUsersList] = useState([]);
    const [userImage, setuserImage] = useState('');
    const [imgMode, setImgMode] = useState('3');
    const [imgFile, setImgFile] = useState('');
    const [oldFiles, setoldFiles] = useState({
        aadhar_card: null,
        pan_card: null,
        driving_license: null
    })
    const [updtUId, setUpdtUId] = useState('')
    const [userInfo, setUserinfo] = useState({})
    const [uploadDocs, setuploadDocs] = useState({
        aadhar_card: null,
        pan_card: null,
        driving_license: null
    })

    async function getRolesList() {
        await fetchData('/db/role', setUserroles, errorToast, setErrorToast);
    }

    async function getDivisionList() {
        await fetchData('/db/divison', setDivisionList, errorToast, setErrorToast);
    }

    async function getDepartments() {
        await fetchData('/db/department', setDepartMentList, errorToast, setErrorToast);
    }

    async function getUsersList() {
        await fetchData('/db/users', setUsersList, errorToast, setErrorToast);
    }

    async function getDesignation() {
        await fetchData('/db/designation', setDesignationList, errorToast, setErrorToast);
    }

    const getCountryList = async () => {
        await fetchData(`/db/area/country?country_id=1`, setcountrylist, errorToast, setErrorToast);
    };

    const getState = async (id) => {
        await fetchData(`/db/area/states?cnt_id=${id}`, setStatelist, errorToast, setErrorToast);
    };

    const getcity = async (id) => {
        await fetchData(`/db/area/city?st_id=${id}`, (data) => setCitylist(data.cityData), errorToast, setErrorToast);
    };

    async function getUserData(id) {
        if (!hasCookie('token')) return;

        const token = getCookie('token');
        const db_name = getCookie('db_name');

        const header = {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
                db: db_name,
                pass: 'pass'
            }
        };

        try {
            const response = await axios.get(`${Baseurl}/db/users?id=${id}`, header);
            const { data: { data: data1 } } = response;
            const { db_user_profile: data2 } = data1;

            setUpdtUId(data1?.user_id);
            setUserinfo({
                user: data1?.user,
                email: data1?.email,
                contact_number: data1?.contact_number,
                db_name: data1?.db_name,
                isDB: data1?.isDB,
                user_status: data1?.user_status,
                user_code: data1?.user_code,
                role_id: data1?.role_id,
                country_id: data1?.country_id,
                state_id: data1?.state_id,
                city_id: data1?.city_id,
                address: data1?.address,
                pincode: data1?.pincode,
                user_profle_id: data1?.user_profle_id,
                div_id: data2?.div_id,
                dep_id: data2?.dep_id,
                des_id: data2?.des_id,
                report_to: data1?.report_to,
                aadhar_no: data2?.aadhar_no,
                pan_no: data2?.pan_no,
                dl_no: data2?.dl_no,
                user_image_file: data2?.user_image_file,
                bank_name: data2?.bank_name,
                account_holder_name: data2?.account_holder_name,
                account_no: data2?.account_no,
                bank_ifsc_code: data2?.bank_ifsc_code,
                branch: data2?.branch,
            });

            setoldFiles({
                aadhar_card: data2?.aadhar_file,
                pan_card: data2?.pan_file,
                driving_license: data2?.dl_file
            });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }

    const addUserHandler = async () => {
        if (!hasCookie('token')) return;
        setisLoading(true);
        const token = getCookie('token');
        const db_name = getCookie('db_name');
        const reqOptions = { ...userInfo, db_name };

        const header = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                db: db_name,
                m_id: 77,
            },
        };

        try {
            const response = await axios.post(`${Baseurl}/db/users`, reqOptions, header);
            const userId = response.data.data.userProfileData.user_id;
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                if (uploadDocs.aadhar_card) AddUploadPicture(userId, 'adh', uploadDocs.aadhar_card[0], 0);
                if (uploadDocs.pan_card) AddUploadPicture(userId, 'pan', uploadDocs.aadhar_card[0], 0);
                if (uploadDocs.driving_license) AddUploadPicture(userId, 'dl', uploadDocs.aadhar_card[0], 0);
                if (userImage) AddUploadPicture(userId, 'lsUser', userImage[0], 0);
                setisLoading(false);
                router.push('/ManageUsers');
            }
        } catch (error) {
            if (error?.response?.data?.status === 422) {
                const taskObject = error.response.data.data.reduce((obj, item) => {
                    const [key, value] = Object.entries(item)[0];
                    obj[key] = value;
                    return obj;
                }, {});
                setErrorData(taskObject);
            }
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong!');
            }
            setisLoading(false);
        }
    };

    const updateUserhandler = async () => {
        if (!hasCookie('token')) return;

        setisLoading(true);
        const token = getCookie('token');
        const db_name = getCookie('db_name');
        const header = {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
                db: db_name,
                m_id: 79
            }
        };

        if (userInfo.user === '') {
            toast.error('Please Enter the Name');
            return;
        }

        try {
            const response = await axios.put(`${Baseurl}/db/users`, userInfo, header);
            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message);
                if (uploadDocs.aadhar_card)
                    AddUploadPicture(updtUId, 'adh', uploadDocs.aadhar_card[0], oldFiles.aadhar_card);
                if (uploadDocs.pan_card)
                    AddUploadPicture(updtUId, 'pan', uploadDocs.aadhar_card[0], oldFiles.pan_card);
                if (uploadDocs.driving_license)
                    AddUploadPicture(updtUId, 'dl', uploadDocs.aadhar_card[0], oldFiles.driving_license);
                if (userImage)
                    AddUploadPicture(updtUId, 'lsUser', userImage[0], userInfo.user_image_file);
                setisLoading(false);
                router.push('/ManageUsers');
            }
        } catch (error) {
            if (error?.response?.data?.status === 422) {
                const taskObject = error.response.data.data.reduce((acc, obj) => {
                    const key = Object.keys(obj)[0];
                    const value = Object.values(obj)[0];
                    acc[key] = value;
                    return acc;
                }, {});
                setErrorData(taskObject);
            }
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Something went wrong!');
            }
            setisLoading(false);
        }
    };


    const AddUploadPicture = async (id, path, file, name) => {
        if (!hasCookie('token')) return;

        const token = getCookie('token');
        const db_name = getCookie('db_name');

        const formdata = new FormData();
        formdata.append('path', path);
        formdata.append('user_id', id);
        formdata.append('file', file);
        formdata.append('_imageName', name || 0);

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
            const response = await fetch(`${Baseurl}/db/users/uploads`, requestOptions);
            const result = await response.text();
            toast.info(result.message);
        } catch (error) {
            console.log('error', error);
        }
    };

    const UploadImgFun = (e) => {
        const ImagesArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        userInfo.client_logo = ImagesArray[0];
        setuserImage(e.target.files);
        setImgFile(ImagesArray);
    };

    const checkCurrentImg = () => {
        if (imgFile) {
            setImgMode('1')
        } else {
            setImgMode('2')
        }
    }

    useEffect(() => {
        checkCurrentImg();
    }, [userInfo.user_image_file, imgFile]);

    useEffect(() => {
        getRolesList();
        getUsersList();
        getDivisionList();
        getDepartments();
        getDesignation();
        getCountryList();

    }, [])


    useEffect(() => {
        if (userInfo.state_id) {
            getcity(userInfo.state_id);
        }
    }, [userInfo.state_id]);

    useEffect(() => {
        if (userInfo.country_id) {
            getState(userInfo.country_id);
        }
    }, [userInfo.country_id]);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            if (router.query.mode == 'edit') {
                setEditMode(true)
            } else {
                setEditMode(false)
                setViewMode(true)
            }
            getUserData(id)
        }
    }, [router.isReady, id])


    return (
        <div className={`main_Box  ${sideView}`}>

            <div className="bread_head">
                <h3 className="content_head"> {editMode ? 'EDIT' : viewMode ? 'VIEW' : 'ADD'} USER</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link href='/'>Dashboard   </Link></li>
                        <li className="breadcrumb-item" ><Link href='/ManageUsers'> Manage User</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{editMode ? 'EDIT' : (viewMode ? 'View' : 'Add')}  User</li>
                    </ol>
                </nav>
            </div>

            <div className="main_content">
                <div className="Add_user_screen">
                    {viewMode ? null :
                        <div className="add_screen_head">
                            <span className="text_bold"> Fill Details</span>  ( * Fields are mandatory) </div>}
                    <div className="add_user_form addUserPage">
                        <div className="row profilePic">
                            <div className="col-xl-10 col-md-10 col-sm-12 col-12">
                                <div className="row">
                                    
                                    <div className="col-xl-5 col-md-5 col-sm-12 col-12">
                                        <div className={errorData?.role_id ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="profilelevel">User Profile *</label>
                                            <select
                                                className={errorData?.role_id ? 'form-control is-invalid' : 'form-control'}
                                                name="profilelevel"
                                                id="profilelevel"
                                                disabled={viewMode}
                                                onChange={(e) => {
                                                    setUserinfo({ ...userInfo, role_id: e.target.value })
                                                    setErrorData({ ...errorData, role_id: '' })
                                                }}
                                                value={userInfo.role_id ? userInfo.role_id : ''}>
                                                <option value="">Select User Profile </option>
                                                {userroles?.map(({ role_id, role_name }) => {
                                                    return <option key={role_id} value={role_id}>{role_name}</option>
                                                })}
                                            </select>
                                            <span className="errorText"> {errorData?.role_id ? errorData.role_id : ''}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.user ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="firstName">Name *</label>
                                            <input
                                                type="text"
                                                placeholder='Enter User Name'
                                                name="name" id="firstName"
                                                className={errorData?.user ? 'form-control is-invalid' : 'form-control'}
                                                onChange={(e) => {
                                                    setUserinfo({ ...userInfo, user: e.target.value })
                                                    setErrorData({ ...errorData, user: '' })
                                                }}
                                                disabled={viewMode}
                                                value={userInfo.user ? userInfo.user : ''} />
                                            <span className="errorText"> {errorData?.user ? errorData.user : ''}</span>
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.contact_number ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="contact_no">Contact No </label>
                                            <input
                                                type="number"
                                                placeholder='Enter Contact No.'
                                                name="contact-no" id="contact_no"
                                                className={errorData?.contact_number ? 'form-control is-invalid' : 'form-control'}
                                                disabled={viewMode}
                                                onChange={(e) => {
                                                    setUserinfo({ ...userInfo, contact_number: e.target.value })
                                                    setErrorData({ ...errorData, contact_number: '' })
                                                }}
                                                value={userInfo.contact_number ? userInfo.contact_number : ''} />
                                            <span className="errorText"> {errorData?.contact_number ? errorData.contact_number : ''}</span>

                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className={errorData?.email ? 'input_box errorBox' : 'input_box'}>
                                            <label htmlFor="contact_no">Email * </label>
                                            <input
                                                type="email"
                                                placeholder='Enter Email Id.'
                                                name="email" id="email"
                                                className={errorData?.email ? 'form-control is-invalid' : 'form-control'}
                                                disabled={viewMode}
                                                onChange={(e) => {
                                                    setUserinfo({ ...userInfo, email: e.target.value })
                                                    setErrorData({ ...errorData, email: '' })
                                                }}
                                                value={userInfo.email ? userInfo.email : ''} />
                                            <span className="errorText"> {errorData?.email ? errorData.email : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-2 col-md-2 col-sm-12 col-12">
                                <div className="img_sec">
                                    <label htmlFor="uploadImg" title='Upload Logo'>
                                        {imgMode === '1' ? <img src={imgFile} alt="logo" width='100%' /> : null}
                                        {imgMode === '2' ? <> {userInfo.user_image_file ?
                                            <img src={`${filesUrl}/lsUser/images${userInfo.user_image_file}`} alt="logo" width='100%' /> :
                                            <>
                                                <div className="img_holder">
                                                    <img src="/images/add_user_avatar.png" alt="" />
                                                    <div className="icon">
                                                        <CameraIcon />
                                                    </div>
                                                </div></>}</> : null}

                                    </label>
                                    <input type="file" id='uploadImg' accept="image/png, image/gif, image/jpeg" onChange={UploadImgFun}
                                        disabled={viewMode} />
                                </div>

                            </div>
                        </div>
                        <div className="row">

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.lead_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name"> Division</label>
                                    <Select
                                        // id={contactInfo.lead_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={divisionList?.map((data, index) => {
                                            return {
                                                value: data?.div_id,
                                                label: data?.divison,

                                            }
                                        })}
                                        value={divisionList?.map((data, index) => {
                                            if (userInfo.div_id === data.div_id) {
                                                return {
                                                    value: data?.div_id,
                                                    label: data?.divison,

                                                }
                                            }
                                        })}
                                        onChange={(e) => setUserinfo({ ...userInfo, div_id: e.value })}
                                    />
                                    <span className="errorText"> {errorData?.div_id ? errorData.div_id : ''}</span>
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.lead_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Department</label>
                                    <Select
                                        id={userInfo.dep_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={departMentList?.map((data, index) => {
                                            return {
                                                value: data?.dep_id,
                                                label: data?.department,

                                            }
                                        })}
                                        value={departMentList?.map((data, index) => {
                                            if (userInfo.dep_id === data.dep_id) {
                                                return {
                                                    value: data?.dep_id,
                                                    label: data?.department,

                                                }
                                            }
                                        })}
                                        onChange={(e) => setUserinfo({ ...userInfo, dep_id: e.value })}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.des_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Designation</label>
                                    <Select
                                        id={userInfo.des_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={designationList?.map((data, index) => {
                                            return {
                                                value: data?.des_id,
                                                label: data?.designation,

                                            }
                                        })}
                                        value={designationList?.map((data, index) => {
                                            if (userInfo.des_id === data.des_id) {
                                                return {
                                                    value: data?.des_id,
                                                    label: data?.designation,

                                                }
                                            }
                                        })}
                                        onChange={(e) => setUserinfo({ ...userInfo, des_id: e.value })}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.report_to ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name">Report To *</label>
                                    <Select
                                        id={userInfo.des_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={usersList?.map((data, index) => {
                                            return {
                                                value: data?.user_id,
                                                label: data?.user,

                                            }
                                        })}
                                        value={usersList?.map((data, index) => {
                                            if (userInfo.report_to=== data.user_id) {
                                                return {
                                                    value: data?.user_id,
                                                    label: data?.user,

                                                }
                                            }
                                        })}
                                        onChange={(e) => {
                                            setUserinfo({ ...userInfo, report_to: e.value })
                                            setErrorData({ ...errorData, report_to: '' })
                                        }}
                                    />
                                     <span className="errorText"> {errorData?.report_to ? errorData.report_to : ''}</span>

                                </div>
                            </div>

                        </div>
                        <div className="other_details_info">
                            <div className="other_details">
                                <input type="checkbox" name="opt_dtls" id="opt_dtls" onChange={(e) => setAdditionalFields(e.target.checked)} />
                                <label className='text-blue head' htmlFor="opt_dtls">Optional Detail</label>
                            </div>

                        </div>
                        {additionalFields ? <div className="row">
                            <div>
                                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="address">Address </label>
                                        <textarea
                                            name="address" id="address"
                                            rows="3" className='form-control'
                                            disabled={viewMode}
                                            onChange={(e) => setUserinfo({ ...userInfo, address: e.target.value })}
                                            value={userInfo.address ? userInfo.address : ''}>
                                        </textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.mailing_cont ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name"> Country</label>
                                    <Select
                                        id={userInfo.country_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={countrylist?.map((data, index) => {
                                            return {
                                                value: data?.country_id,
                                                label: data?.country_name,

                                            }
                                        })}
                                        value={countrylist?.map((data, index) => {
                                            if (userInfo.country_id === data.country_id) {
                                                return {
                                                    value: data?.country_id,
                                                    label: data?.country_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) =>
                                            setUserinfo({ ...userInfo, country_id: e.value })}
                                    />
                                    <span className="errorText"> {errorData?.country_id ? errorData.country_id : ''}</span>
                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.state_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name"> State</label>
                                    <Select
                                        id={userInfo.state_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={statelist?.map((data, index) => {
                                            return {
                                                value: data?.state_id,
                                                label: data?.state_name,

                                            }
                                        })}
                                        value={statelist?.map((data, index) => {
                                            if (userInfo.state_id === data.state_id) {
                                                return {
                                                    value: data?.state_id,
                                                    label: data?.state_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) =>
                                            setUserinfo({ ...userInfo, state_id: e.value })}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className={errorData?.state_id ? 'input_box errorBox' : 'input_box'}>
                                    <label htmlFor="task_name"> City </label>
                                    <Select
                                        id={userInfo.city_id}
                                        defaultValue={""}
                                        isDisabled={viewMode}
                                        options={citylist?.map((data, index) => {
                                            return {
                                                value: data?.city_id,
                                                label: data?.city_name,

                                            }
                                        })}
                                        value={citylist?.map((data, index) => {
                                            if (userInfo.city_id === data.city_id) {
                                                return {
                                                    value: data?.city_id,
                                                    label: data?.city_name,

                                                }
                                            }
                                        })}
                                        onChange={(e) =>
                                            setUserinfo({ ...userInfo, city_id: e.value })}
                                    />

                                </div>
                            </div>

                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="offc_no">Zip / Postal Code</label>
                                    <input
                                        type="number"
                                        placeholder="Zip / Postal Code"
                                        name="pin-code"
                                        disabled={viewMode}
                                        id="offc_no"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserinfo({
                                                ...userInfo,
                                                pincode: e.target.value,
                                            })
                                        }
                                        value={userInfo.pincode ? userInfo.pincode : ""}
                                    />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="aadhar_card">Aadhar Card </label>
                                    <input
                                        type="number"
                                        placeholder="Enter Aadhar No."
                                        name="aadhar_card"
                                        disabled={viewMode}
                                        id="aadhar_card"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserinfo({
                                                ...userInfo,
                                                aadhar_no: e.target.value,
                                            })
                                        }
                                        value={userInfo.aadhar_no ? userInfo.aadhar_no : ""} />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="aadhar_upload">Upload Aadhar Card </label>
                                    <input
                                        type="file"
                                        placeholder="Enter Aadhar No."
                                        name="aadhar_upload"
                                        disabled={viewMode}
                                        id="aadhar_upload"
                                        className="form-control"
                                        onChange={(e) => setuploadDocs({ ...uploadDocs, aadhar_card: e.target.files })} />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="pan_card">Pan Card </label>
                                    <input
                                        type="text"
                                        placeholder="Enter Pan No."
                                        name="pan_card"
                                        id="pan_card"
                                        disabled={viewMode}
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserinfo({
                                                ...userInfo,
                                                pan_no: e.target.value,
                                            })
                                        }
                                        value={userInfo.pan_no ? userInfo.pan_no : ""} />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="pan_uploads">Upload Pan Card </label>
                                    <input
                                        type="file"
                                        name="pan_uploads"
                                        disabled={viewMode}
                                        id="pan_uploads"
                                        className="form-control"
                                        onChange={(e) => setuploadDocs({ ...uploadDocs, pan_card: e.target.files })} />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="driving_license">Driving License *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter License No."
                                        name="driving_license"
                                        disabled={viewMode}
                                        id="driving_license"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserinfo({
                                                ...userInfo,
                                                dl_no: e.target.value,
                                            })
                                        }
                                        value={userInfo.dl_no ? userInfo.dl_no : ""} />
                                </div>
                            </div>
                            <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="pan_uploads">Upload Driving License </label>
                                    <input
                                        type="file"
                                        name="pan_uploads"
                                        id="pan_uploads"
                                        disabled={viewMode}
                                        className="form-control"
                                        onChange={(e) => setuploadDocs({ ...uploadDocs, driving_license: e.target.files })} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="bank_name">Bank Name </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Bank Name"
                                            name="bank_name"
                                            id="bank_name"
                                            disabled={viewMode}
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserinfo({
                                                    ...userInfo,
                                                    bank_name: e.target.value,
                                                })
                                            }
                                            value={userInfo.bank_name ? userInfo.bank_name : ""} />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="account_holder_name">Account Holder Name </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Account Holder Name"
                                            name="account_holder_name"
                                            id="account_holder_name"
                                            disabled={viewMode}
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserinfo({
                                                    ...userInfo,
                                                    account_holder_name: e.target.value,
                                                })
                                            }
                                            value={userInfo.account_holder_name ? userInfo.account_holder_name : ""} />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="account_no">Account Number </label>
                                        <input
                                            type="number"
                                            placeholder="Enter Account Number"
                                            name="account_no"
                                            id="account_no"
                                            disabled={viewMode}
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserinfo({
                                                    ...userInfo,
                                                    account_no: e.target.value,
                                                })
                                            }
                                            value={userInfo.account_no ? userInfo.account_no : ""} />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="bank_ifsc_code">Bank IFSC Code </label>
                                        <input
                                            type="text"
                                            placeholder="Enter IFSC Code"
                                            name="bank_ifsc_code"
                                            id="bank_ifsc_code"
                                            disabled={viewMode}
                                            className="form-control"
                                            onChange={(e) =>
                                                setUserinfo({
                                                    ...userInfo,
                                                    bank_ifsc_code: e.target.value,
                                                })
                                            }
                                            value={userInfo.bank_ifsc_code ? userInfo.bank_ifsc_code : ""} />
                                    </div>
                                </div>
                                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                    <div className="input_box">
                                        <label htmlFor="branch">Branch </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Branch Name"
                                            name="branch"
                                            id="branch"
                                            className="form-control"
                                            disabled={viewMode}
                                            onChange={(e) =>
                                                setUserinfo({
                                                    ...userInfo,
                                                    branch: e.target.value,
                                                })
                                            }
                                            value={userInfo.branch ? userInfo.branch : ""} />
                                    </div>
                                </div>
                            </div>

                        </div> : null}

                        <div className="text-end">
                            <div className="submit_btn">
                                <Link href="/ManageUsers"><button className='btn btn-cancel me-2 '>Cancel</button></Link>
                                {editMode ? <button disabled={isLoading} className="btn btn-primary" onClick={updateUserhandler}>
                                    {isLoading ? 'Loading...' : 'Update'}</button> : (viewMode ? null :
                                        <button disabled={isLoading} className="btn btn-primary" onClick={addUserHandler}>
                                            {isLoading ? 'Loading...' : 'Save & Submit'}</button>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddUserScreen