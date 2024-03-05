import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchData } from '../../Utils/getReq';
import { useRouter } from "next/router";
import { getCookie, hasCookie } from 'cookies-next';
import { Baseurl } from '../../Utils/Constants';
import axios from 'axios';
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./AdditionalFieldsMui'),
    { ssr: false }
)
export default function AddDynamicFieldScreen() {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { md, id } = router.query
    const [inputsData, setInputsData] = useState([]);
    const [dataList, setDataList] = useState([])
    const [iscollapse, setiscollapse] = useState(false);
    const [userInfo, setUserInfo] = useState({})
    const [isLoading, setisLoading] = useState(false)
    const [errorData, setErrorData] = useState({})
    const [errorToast, setErrorToast] = useState(false)
    const [editMode, setEditMode] = useState(false);
    const [singleData, setSingleData] = useState({});
    const [ newFields, setNewFields] = useState({
        field_lable: null,
        input_type: null,
        field_type: null,
        field_size: null,
        option: null,
    }); 

    /*     async function fieldTypeChangeHandler(e) {
            const selvalue = e.target.value;
            setUserInfo({ ...userInfo, navigate_type: selvalue })
    
            if (selvalue) {
                await fetchData(`/db/field?nav_type=${selvalue}`, setDataList, errorToast, setErrorToast);
            }
        } */


    async function postFieldsFunc(data) {
        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: 'pass',
                },

            };
            try {
                const response = await axios.post(Baseurl + `/db/field?nav=${md}`, data, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    router.push(`/AdditionalFields?md=${md}`)
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


    async function updateHandler(e) {
        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:233
                }
            }
            try {
                const response = await axios.post(Baseurl + `/db/field`, [newFields], header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    router.push(`/AdditionalFields?md=${md}`)
                    setDataList();
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
    const getSingleList = async (id) => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass:"pass"

                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/field?id=${id}`, header);
                setNewFields(response.data.data);
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

    /*   const AddFieldsFunc = (e) => {
          e.preventDefault();
          if (md) {
              setiscollapse(!iscollapse);
          } else {
              toast.error('Please Select Section to Add Fields')
          }
      }; */

    /*  const inputClass = (value) => {
         const inputClasses = {
             text: 'form-control',
             date: 'form-control',
             email: 'form-control',
             number: 'form-control',
             checkbox: 'form-check-input ms-3',
         };
         return inputClasses[value] || '';
     }; */

    /*     const updateFieldInfo = (e, ind) => {
    
            const newData = [...inputsData];
            newData[ind].input_value = e.target.value;
            setInputsData(newData);
        }; */

    const createInputField = async (e) => {
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
                navigate_type: md,
                field_order: inputsData.length + 1
            };
            const reqOptions = [inputReq]
            await postFieldsFunc(reqOptions);

        }
    };

    async function postFieldsFunc(data) {
        if (hasCookie("token")) {
            setisLoading(true)
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 232 ,
                },
            };
            try {
                const response = await axios.post(Baseurl + `/db/field?nav=${md}`, data, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    router.push(`/AdditionalFields?md=${md}`)
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


    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleList(id);
        }
    }, [router.isReady, id , md ]);


    return (
        <>
            <div className={`main_Box  ${sideView}`}>

                <div className="bread_head">
                    <h3 className="content_head">{editMode ? "EDIT" : "ADD"} {editMode ? (newFields.navigate_type): md }</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Dashboard </Link></li>
                            <li className="breadcrumb-item"> <Link href='/AdditionalFields/?md=lead'>Dynamic List </Link></li>
                            <li className="breadcrumb-item" > {editMode ? "Edit" : "Add"} Dynamic Fiels</li>
                        </ol>
                    </nav>
                </div>

                <div className="main_content">
                    <div className="Add_user_screen">
                        <div className="add_screen_head">
                            <span className="text_bold"> Fill Details</span>  ( * Fields are mandatory)
                        </div>
                        <div className="add_user_form">
                            <div className="addFieldsForm py-5">
                                <div className="row">
                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor='newFieldName'>Field Name</label>
                                            <input
                                                type='text'
                                                className='form-control'
                                                id='newFieldName'
                                                placeholder='Field Name'
                                                onChange={(e) => setNewFields({ ...newFields, field_lable: e.target.value })}
                                                value={newFields.field_lable ? newFields.field_lable : ''}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor='newFieldType'>Field Type</label>
                                            <select
                                                name="newFieldType"
                                                className='form-control'
                                                onChange={(e) => setNewFields({ ...newFields, input_type: e.target.value  })}
                                                value={newFields.input_type ? newFields.input_type : ''}
                                                id="newFieldType" >
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
                                                        onChange={(e) => setNewFields({ ...newFields, field_type: e.target.value })}
                                                        value={newFields.field_type ? newFields.field_type : ''}
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
                                                        className='form-control'
                                                        placeholder='Enter field size'
                                                        value={newFields.field_size ? newFields.field_size : ''}
                                                        id="field_size"
                                                        onChange={(e) => setNewFields({ ...newFields, field_size: e.target.value, option: null })}
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
                                                    className='form-control'
                                                    placeholder='e.g. Name, age, gender'
                                                    value={newFields.option ? newFields.option : ''}
                                                    id="newKeywords"
                                                    onChange={(e) => setNewFields({ ...newFields, option: e.target.value , field_size:null , field_type:null ,  })}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="btn-row my-4">
                                    {/* <button className="btn btn-light me-3">Cancel</button> */}
                                    {editMode ? (
                                        <button disabled={isLoading} className="btn btn-primary" onClick={updateHandler}>
                                            {isLoading ? 'Loading...' : 'Update'}
                                        </button>
                                    ) : (
                                        < button
                                            disabled={isLoading}
                                            className="btn btn-primary"
                                            onClick={createInputField} >
                                            {isLoading ? 'Loading...' : 'Save & Submit'}
                                        </button>)
                                /* <button onClick={createInputField} className="btn btn-success">Create Field</button> */}
                                </div>
                            </div>
                            {/*  <div className="row">
                                {inputsData?.map(({ option, field_name, field_lable, field_type, input_type }, ind) => (
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12" key={ind}>
                                        <div className="input_box">
                                            <label htmlFor={field_name + ind}> {field_lable} </label>
                                            {input_type === 'input' ? (
                                                <input
                                                    type={field_type}
                                                    className={inputClass(field_type)}
                                                    id={field_name + ind}
                                                    name={field_name}
                                                    placeholder={field_lable}
                                                    onChange={(e) => updateFieldInfo(e, ind)}
                                                />
                                            ) : null}
                                            {input_type === 'select' ? (
                                                <select
                                                    onChange={(e) => updateFieldInfo(e, ind)}
                                                    name={field_name}
                                                    id={field_name + ind}
                                                    className="form-control">
                                                    <option value="">Select {field_lable}</option>
                                                    {option?.split(",").map((data, i) => (
                                                        <option value={data} key={i}>{data}</option>
                                                    ))}
                                                </select>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="btn-box">
                                <button
                                    disabled={isLoading}
                                    className="btn btn-primary"
                                    onClick={postFieldsFunc} >
                                    {isLoading ? 'Loading...' : 'Save & Submit'}
                                </button>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
