import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchData } from '../../Utils/getReq';
import { getCookie, hasCookie } from 'cookies-next';
import { Baseurl } from '../../Utils/Constants';
import { useRouter } from "next/router";
import ConfirmBox from "../Basics/ConfirmBox";
import axios from 'axios';
import dynamic from 'next/dynamic'
const DynamicTable = dynamic(
    () => import('./AdditionalFieldsMui'),
    { ssr: false }
)
export default function AddfieldScreens() {
    const sideView = useSelector((state) => state.sideView.value);
    const router = useRouter();
    const { md } = router.query

    const [inputsData, setInputsData] = useState([]);
    const [dataList, setDataList] = useState([])
    const [iscollapse, setiscollapse] = useState(false);
    const [userInfo, setUserInfo] = useState({})
    const [isLoading, setisLoading] = useState(false)
    const [errorData, setErrorData] = useState({})
    const [errorToast, setErrorToast] = useState(false)
    const [currObj, setcurrObj] = useState(null);
    const [deleteshowConfirm, setdeleteshowConfirm] = useState(false);
    const [show, setShow] = useState(false);
    const [newFields, setNewFields] = useState({
        field_lable: null,
        input_type: null,
        field_type: null,
        field_size: null,
        option: null,
    });

    async function fieldTypeChangeHandler(e) {
        const selvalue = e.target.value;    
        setUserInfo({ ...userInfo, navigate_type: selvalue  })

        if (selvalue) {
            getDataList(e.target.value)
         //   await fetchData(`/db/field?nav_type=${selvalue}`, setDataList, errorToast, setErrorToast );
        }
    }   



    const getDataList = async (val) => {
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 231,
            },
          };
    
          try {
            const response = await axios.get(Baseurl + `/db/field?nav_type=${val}`, header);
            setDataList(response.data.data);
          } catch (error) {
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

    function deleteConfirm(value) {
        setcurrObj(value);
        setdeleteshowConfirm(true);
      
    }

    const AddFieldsFunc = (e) => {
        e.preventDefault();
        if (userInfo.navigate_type) {
            router.push(`/AddDynamicFields?md=${userInfo.navigate_type}`)
        } else {
            toast.error('Please Select Menu to Add Fields')
        }
    };

    async function deleteHandler(e) {
        e.preventDefault();
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id:234
            },
          };
    
          try {
            const response = await axios.delete(
              Baseurl + `/db/field?id=${currObj}`,
              header
            );
            if (response.status === 204 || response.status === 200) {
              toast.success(response.data.message);
              setdeleteshowConfirm(false);
            //   setNewFields();
              setcurrObj(null);
              getDataList(router.query.md);
              
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

    //   async function onLoadHandler(id) {
    //     await fetchData(`/db/field?nav_type=${id}`, setDataList, errorToast, setErrorToast);
    //   }



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
                field_order: inputsData.length + 1
            };
            setInputsData([...inputsData, inputReq]);
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

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.md) {
            setUserInfo({...userInfo, navigate_type:router.query.md})
            getDataList(router.query.md)
        }
    }, [router.isReady, md]);

  

    return (
        <>
        <ConfirmBox
        showConfirm={deleteshowConfirm}
        setshowConfirm={setdeleteshowConfirm}
        actionType={deleteHandler}
        title={"Are You Sure you want to Delete ?"}
      />
            <div className={`main_Box  ${sideView}`}>

                <div className="bread_head">
                    <h3 className="content_head"> {userInfo.navigate_type ? userInfo.navigate_type: "Dynamic Fields"}</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"> <Link href='/'>Dashboard  </Link></li>
                            <li className="breadcrumb-item" > Manage {userInfo.navigate_type ? userInfo.navigate_type : "Dynamic Fields"}</li>
                        </ol>
                    </nav>
                </div>

                <div className="main_content">
                    <div className="Add_user_screen">
                        <div className="add_user_form">
                            <div className="row">
                                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                    <div className="row">
                                        <div className="col-xl-3 col-md-3 col-sm-6 col-6">
                                            <div className="input_box">
                                                <label htmlFor='navigate_type'> Fields For: </label>
                                                <select
                                                    name='navigate_type'
                                                    id='navigate_type'
                                                    value={userInfo.navigate_type ? userInfo.navigate_type: '' }
                                                    onChange={(e) => fieldTypeChangeHandler(e)}
                                                    className="form-control" >
                                                    <option value="">Select Fields For</option>
                                                    <option value="lead">Lead</option>
                                                    <option value="contact">Contact</option>
                                                    <option value="accounts">Account</option>
                                                   {/*  <option value="event">Event</option>
                                                    <option value="task">Task</option>
                                                    <option value="user">User</option>
                                                    <option value="quotation">Quotation</option>
                                                    <option value="opportunity">Opportunity</option> */}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-xl-9 col-md-9 col-sm-6 col-6">
                                            <div className="btn-box text-end">
                                                <button className='btn btn-primary me-3' onClick={AddFieldsFunc}> Add More Fields</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                                        <button onClick={AddFieldsFunc} className="btn btn-light me-3">Cancel</button>
                                        <button onClick={createInputField} className="btn btn-success">Create Field</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="table_screen">
                        {dataList ?
                            <DynamicTable
                                title="Dynamic Fields"
                                dataList={dataList}
                                deleteConfirm={deleteConfirm}
                            /> : <p className="text-center p-5">No Leads Found..!</p>}
                    </div>
                </div>
            </div>
        </>
    )
}
