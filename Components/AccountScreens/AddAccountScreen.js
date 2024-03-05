import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { validPhone, validZip } from "../../Utils/regex";
import { useSelector } from "react-redux";
import { fetchData } from "../../Utils/getReq";
import Select from 'react-select';

const AddAccountScreen = () => {
  const router = useRouter();
  const { id } = router.query;

  const sideView = useSelector((state) => state.sideView.value);

  const [countrylist, setcountrylist] = useState([]);
  const [accountsList, setAccountsList] = useState([]);
  const [usersList, setUsersLsit] = useState([]);
  const [industryList, setIndustryList] = useState([]);
  const [accountTypes, setAccountTypes] = useState([])
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [errorData, setErrorData] = useState({})
  const [billStates, setBillStates] = useState([])
  const [shipStates, setShipStates] = useState([]);
  const [shipCities, setShipCities] = useState([])
  const [isLoading, setisLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const [billingCities, setBillingCities] = useState([]);
  const [loginDetails, setloginDetails] = useState({})
  const [iscollapse, setiscollapse] = useState(false);
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });
  const [selected, setSelected] = useState({
    parent_id: '',
    parent_name: ''
  })

  const [userInfo, setUserInfo] = useState({
    "acc_name": "",
    "acc_owner": null,
    "account_type_id": '',
    "parent_id": '0',
    "website": "",
    "contact_no": '',
    "ind_id": null,
    "emp_name": "",
    "desc": "",
    'bill_cont': "",
    'bill_state': "",
    'bill_city': "",
    'bill_pincode': "",
    'ship_cont': "",
    'ship_state': "",
    'ship_city': "",
    'ship_pincode': "",
    'ship_address': "",
    'assigned_to': null,
    'bill_address': "",
    db_acc_fields: []


  });

  const getBillCity = async (id) => {
    await fetchData(`/db/area/city?st_id=${id}`, (data) => setBillingCities(data.cityData), errorToast, setErrorToast);
  };

  const getShipCity = async (id) => {
    await fetchData(`/db/area/city?st_id=${id}`, (data) => setShipCities(data.cityData), errorToast, setErrorToast);
  };

  const getCountryList = async () => {
    await fetchData(`/db/area/country?bill_cont=1`, setcountrylist, errorToast, setErrorToast);
  };

  const getShipState = async (id) => {
    await fetchData(`/db/area/states?cnt_id=${id}`, setShipStates, errorToast, setErrorToast);
  };

  const getBillState = async (id) => {
    await fetchData(`/db/area/states?cnt_id=${id}`, setBillStates, errorToast, setErrorToast);
  };


  async function getAccountType() {
    await fetchData(`/db/account/type`, setAccountTypes, errorToast, setErrorToast);
  }

  async function getParentAccount() {
    await fetchData(`/db/account/tree`, setAccountsList, errorToast, setErrorToast)
  }

  async function getIndustriesList() {
    await fetchData(`/db/industry`, setIndustryList, errorToast, setErrorToast)
  }


  const submitHandler = async () => {

    if (hasCookie('token')) {
      setisLoading(true)
      let token = (getCookie('token'));
      let db_name = (getCookie('db_name'));

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 21
        }
      }

      let oppBody = { ...userInfo }
      oppBody.acc_owner = loginDetails.user_id
      try {
        const response = await axios.post(Baseurl + `/db/account`, oppBody, header);
        if (response.status === 204 || response.status === 200) {
          await postFieldsFunc(response.data.data.acc_id, oppBody.db_acc_fields)
          toast.success(response.data.message)
          setisLoading(false)
          router.push('/Accounts');
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
          m_id: 22,
        },
      };
      try {
        const response = await axios.put(Baseurl + `/db/account`, userInfo, header);
        if (response.status === 204 || response.status === 200) {
          await postFieldsFunc(userInfo.acc_id, userInfo.db_acc_fields)
          toast.success(response.data.message)
          setisLoading(false)
          router.push('/Accounts');
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
        }

        else {
          toast.error('Something went wrong!')
        }
        setisLoading(false)
      }
    }

    else {
      toast.error('Please fill the Mandatory fields')
    }
  }

  const getAccountFieldList = async () => {
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
        const response = await axios.get(Baseurl + `/db/field?nav_type=accounts`, header);
        setUserInfo({ ...userInfo, db_acc_fields: response.data.data });

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
      let arr = JSON.parse(JSON.stringify(userInfo))
      if (arr.db_acc_fields == undefined) arr.db_acc_fields = []
      arr.db_acc_fields.push(newFields)
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
        },

      };
      data?.map(item => {
        item.acc_id = id
      })
      try {
        const response = await axios.post(Baseurl + `/db/account/field`, data, header);
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
    let newData = JSON.parse(JSON.stringify(userInfo))
    newData.db_acc_fields[ind].input_value = e.target.value
    setUserInfo(newData)

  };



  const getSingleData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: 'pass'
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/account?acc_id=${id}`,
          header
        );
        setUserInfo(response.data.data);
        setSelected({ ...selected, parent_id: response?.data?.data?.parent_id, parent_name: response?.data?.data?.parent_name });
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getusersList = async () => {
    if (hasCookie("token")) {
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
        let url;
        if (loginDetails?.isDB == true) {
          url = Baseurl + "/db/users?mode=ul";
        } else {
          url = Baseurl + "/db/users"
        }
        const response = await axios.get(url, header);
        setUsersLsit(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  function SelectparentAcc(e, accountsList, obj = []) {
    let arrData = parentHandlerId(e, accountsList, obj = [])
    const object = arrData.find(net => net.acc_id == e.value);
    if (object) {
      setSelected({ ...selected, parent_id: object.acc_id, parent_name: object.acc_name })
      setUserInfo({ ...userInfo, parent_id: e.value, parent_name: object.acc_name })
    } else {
      setSelected({ ...selected, parent_name: '' })
      setUserInfo({ ...userInfo, parent_id: '0', parent_name: null })
    }
  }


  function parentHandlerId(e, dataList, obj = []) {
    let arr = []
    dataList.map((item) => {

      arr.push({
        acc_id: item.acc_id,
        acc_name: item.acc_name
      })
      if (item.children.length > 0) {
        return parentHandlerId(e, item.children, arr)
      }
    })

    return arr;
  }

  function checkChildrens(data, space = 0, i = 0) {
    space += 1;
    let spaces = '';
    for (let i = 0; i < space; i++) {
      spaces += '\u00A0'
    }
    if (data?.length > 0) {
      return data?.map(({ acc_id, acc_name, children }) => {
        return <> <option key={acc_id} name={acc_name} value={acc_id} >
          {spaces} {acc_name}</option>
          {checkChildrens(children, space)}
        </>
      })
    }
  }


  function checkLogin() {
    if (hasCookie("userInfo")) {
      let token = getCookie("userInfo");
      let data = JSON.parse(token)
      setloginDetails(data)
      setUserInfo({ ...userInfo, opp_owner: data.user_id })

    }
  }


  function copyAddress(e) {
    const value = e.target.checked
    if (value) {
      setUserInfo({
        ...userInfo,
        "ship_cont": userInfo?.bill_cont,
        "ship_state": userInfo?.bill_state,
        "ship_city": userInfo?.bill_city,
        "ship_pincode": userInfo?.bill_pincode,
        "ship_address": userInfo?.bill_address
      })
    } else {
      setUserInfo({
        ...userInfo,
        "ship_cont": "",
        "ship_state": "",
        "ship_city": "",
        "ship_pincode": "",
        "ship_address": "",
      })
    }
    setErrorData({
      ...errorData,
      "ship_cont": "",
      "ship_state": "",
      "ship_city": "",
      "ship_pincode": "",
    })

  }




  useEffect(() => {
    getCountryList();
    getAccountType();
    getParentAccount();
    getusersList()
    checkLogin();
    getIndustriesList()
  }, []);


  useEffect(() => {
    if (!userInfo.bill_cont) {
      return;
    } else {
      getBillState(userInfo.bill_cont);
    }
  }, [userInfo.bill_cont]);

  useEffect(() => {
    if (!userInfo.ship_cont) {
      return;
    } else {
      getShipState(userInfo.ship_cont);
    }
  }, [userInfo.ship_cont]);

  useEffect(() => {
    if (!userInfo.bill_state) {
      return;
    } else {
      getBillCity(userInfo.bill_state);
    }
  }, [userInfo.bill_state]);

  useEffect(() => {
    if (!userInfo.ship_state) {
      return;
    } else {
      getShipCity(userInfo.ship_state);
    }
  }, [userInfo.ship_state]);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    }
    else {
      if (userInfo !== undefined) {
        getAccountFieldList()
      }
    }

    if (router.query.vw) [
      setViewMode(true)
    ]
  }
    , [router.isReady, id]);


  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head">{viewMode ? 'VIEW' : <>
          {editMode ? "EDIT" : "ADD"}
        </>} ACCOUNT</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/Accounts"> Account List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? 'View' : <>
                {editMode ? "Edit" : "Add"}
              </>} Account
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="Add_user_screen">
          <div className="row">
            <div className={viewMode ? `col-xl-9 col-md-9 col-sm-12 col-12` : `col-xl-12 col-md-12 col-sm-12 col-12`}>

              <div className="add_screen_head">
                <span className="text_bold">Fill Details</span> ( * Fields are mandatory)
              </div>
              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.acc_name ? 'input_box errorBox' : 'input_box'}>
                      <div className="input_box">
                        <label htmlFor="acc_name"> Name *</label>
                        <input
                          type="text"
                          placeholder="Enter Account Name"
                          name="name"
                          disabled={viewMode}
                          id="acc_name"
                          className={errorData?.acc_name ? 'form-control is-invalid' : 'form-control'}
                          onChange={(e) => {
                            setUserInfo({ ...userInfo, acc_name: e.target.value })
                            setErrorData({ ...errorData, acc_name: '' })

                          }}
                          value={userInfo.acc_name ? userInfo.acc_name : ''}
                        />
                        <span className="errorText"> {errorData?.acc_name ? errorData.acc_name : ''}</span>
                      </div>

                    </div>
                  </div>
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.acc_owner ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="acc_owner">Owner *</label>
                      {loginDetails?.isDB == true ? (
                        <input
                          type="text"
                          name="opp_owner"
                          disabled
                          placeholder="Contact Owner Name"
                          id="opp_owner"
                          className="form-control"
                          value={loginDetails.user ? loginDetails.user : ""}
                        />
                      ) : (
                        <input
                          type="text"
                          name="opp_owner"
                          disabled
                          placeholder="Contact Owner Name"
                          id="opp_owner"
                          className="form-control"
                          value={loginDetails.user ? loginDetails.user : ""}
                        />

                      )}
                      <span className="errorText"> {errorData?.acc_owner ? errorData.acc_owner : ''}</span>

                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.task_priority_id ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Type *</label>
                      <Select
                        id={userInfo.task_priority_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={accountTypes?.map((data, index) => {
                          return {
                            value: data?.account_type_id,
                            label: data?.account_type_name,

                          }
                        })}
                        value={accountTypes?.map((data, index) => {
                          if (userInfo.account_type_id === data.account_type_id) {
                            return {
                              value: data?.account_type_id,
                              label: data?.account_type_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, account_type_id: e.value })
                          setErrorData({ ...errorData, account_type_id: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.account_type_id ? errorData.account_type_id : ''}</span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.task_priority_id ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Parent Account</label>
                      <Select
                        id={userInfo.task_priority_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={accountsList?.map((data, index) => {
                          return {
                            value: data?.acc_id,
                            label: data?.acc_name,

                          }
                        })}
                        value={accountsList?.map((data, index) => {
                          if (userInfo.parent_id === data.acc_id) {
                            return {
                              value: data?.acc_id,
                              label: data?.acc_name,
                              

                            }
                          }
                        })}
                        onChange={(e) => SelectparentAcc(e, accountsList)}

                      />

                    </div>
                  </div>



                  {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box option_tree">
                      <p className="label_subs">Parent Account</p>
                      <div className="select_wrapper">
                        <label className={viewMode ? 'option_select disabled' : 'option_select'} htmlFor="parent_id">
                          {selected.parent_name ? selected.parent_name : 'Select parent'}
                        </label>
                        <select
                          name="parent_id" id="parent_id"
                          onChange={(e) => SelectparentAcc(e, accountsList)}
                          className='form-control'
                          disabled={viewMode}
                        >
                          <option value="0">Select parent</option>
                          {accountsList?.map(({ children, acc_id, acc_name }, i) => {
                            return (<>
                              <option key={acc_id} name={acc_name} value={acc_id}> {acc_name} </option>
                              {checkChildrens(children, acc_id, i)}
                            </>
                            )
                          })}
                        </select>
                      </div>

                    </div>
                  </div> */}

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Website">Website</label>
                      <input
                        type="text"
                        name="Website"
                        placeholder="Enter Website "
                        id="Website"
                        disabled={viewMode}
                        className='form-control'
                        onChange={(e) => setUserInfo({ ...userInfo, website: e.target.value })}
                        value={userInfo.website ? userInfo.website : ''}
                      />
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.contact_no ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="contact_no">Contact No *</label>
                      <input
                        type="number"
                        name="contact-no"
                        placeholder="Enter Contact No."
                        id="contact_no"
                        disabled={viewMode}
                        className={errorData?.contact_no ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, contact_no: e.target.value })
                          setErrorData({ ...errorData, contact_no: '' })

                        }}
                        value={userInfo.contact_no ? userInfo.contact_no : ''}
                      />
                      <span className="errorText"> {errorData?.contact_no ? errorData.contact_no : ''}</span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.ind_id ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Industry *</label>
                      <Select
                        id={userInfo.ind_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={industryList?.map((data, index) => {
                          return {
                            value: data?.ind_id,
                            label: data?.industry,

                          }
                        })}
                        value={industryList?.map((data, index) => {
                          if (userInfo.ind_id === data.ind_id) {
                            return {
                              value: data?.ind_id,
                              label: data?.industry,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ind_id: e.value })
                          setErrorData({ ...errorData, ind_id: '' })
                        }
                        }
                      />
                      <span className="errorText"> {errorData?.ind_id ? errorData.ind_id : ''}</span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Employee">Employee</label>
                      <input
                        type="text"
                        name="Employee"
                        id="Employee"
                        disabled={viewMode}
                        placeholder="Enter Employee"
                        className='form-control'
                        onChange={(e) => setUserInfo({ ...userInfo, emp_name: e.target.value })}
                        value={userInfo.emp_name ? userInfo.emp_name : ''}
                      />
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

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="acc_desc">Description</label>
                      <textarea
                        name="acc_desc"
                        placeholder="Enter Description"
                        id="acc_desc"
                        rows="2"
                        disabled={viewMode}
                        className='form-control'
                        onChange={(e) => setUserInfo({ ...userInfo, desc: e.target.value })}
                        value={userInfo.desc ? userInfo.desc : ''}
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="add_screen_head">
                <span className="text_bold">Billing & Shipping Address</span>
              </div>

              <div className="add_user_form">
                <div className="row">

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.bill_cont ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Billing Country  *</label>
                      <Select
                        id={userInfo.assigned_to}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={countrylist?.map((data, index) => {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,

                          }
                        })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.bill_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_cont: e.value })
                          setErrorData({ ...errorData, bill_cont: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.bill_cont ? errorData.bill_cont : ''}</span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.bill_city ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Billing State *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billStates?.map((data, index) => {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,

                          }
                        })}
                        value={billStates?.map((data, index) => {
                          if (userInfo.bill_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_state: e.value })
                          setErrorData({ ...errorData, bill_state: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.bill_state ? errorData.bill_state : ''}</span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.bill_city ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Billing City *</label>
                      <Select
                        id={userInfo.state_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={billingCities?.map((data, index) => {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,

                          }
                        })}
                        value={billingCities?.map((data, index) => {
                          if (userInfo.bill_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_city: e.value })
                          setErrorData({ ...errorData, bill_city: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.bill_city ? errorData.bill_city : ''}</span>
                    </div>
                  </div>





                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.bill_pincode ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="offc_no">Zip / Postal Code *</label>
                      <input
                        type="number"
                        placeholder="Zip / Postal Code"
                        name="pin-code"
                        disabled={viewMode}
                        id="offc_no"
                        className={errorData?.bill_pincode ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, bill_pincode: e.target.value })
                          setErrorData({ ...errorData, bill_pincode: '' })
                        }}
                        value={userInfo.bill_pincode ? userInfo.bill_pincode : ""} />
                      <span className="errorText"> {errorData?.bill_pincode ? errorData.bill_pincode : ''}</span>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="bill_address">Billing Address</label>
                      <textarea
                        type=""
                        placeholder="Enter Address"
                        name="bill_address"
                        id="bill_address"
                        disabled={viewMode}
                        className="form-control"
                        onChange={(e) => setUserInfo({ ...userInfo, bill_address: e.target.value })}
                        value={userInfo?.bill_address ? userInfo.bill_address : ''}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-12 col-md-12 col-sm-12 col-12 shift-right ">
                <div className="input_box">
                  <input disabled={viewMode} onChange={(e) => copyAddress(e)} type="checkbox" id="copyAddress" name="copyAddress" className="form-check-input me-2 " />
                  <label htmlFor="copyAddress">Make Shipping Address same as Billing Address</label>
                </div>
              </div>

              <div className="add_user_form">
                <div className="row">
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.ship_cont ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Shipping Country *</label>
                      <Select
                        id={userInfo.ship_cont}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={countrylist?.map((data, index) => {
                          return {
                            value: data?.country_id,
                            label: data?.country_name,

                          }
                        })}
                        value={countrylist?.map((data, index) => {
                          if (userInfo.ship_cont === data.country_id) {
                            return {
                              value: data?.country_id,
                              label: data?.country_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_cont: e.value })
                          setErrorData({ ...errorData, ship_cont: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.ship_cont ? errorData.ship_cont : ''}</span>
                    </div>
                  </div>

                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.ship_state ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Shipping State *</label>
                      <Select
                        id={userInfo.ship_state}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={shipStates?.map((data, index) => {
                          return {
                            value: data?.state_id,
                            label: data?.state_name,

                          }
                        })}
                        value={shipStates?.map((data, index) => {
                          if (userInfo.ship_state === data.state_id) {
                            return {
                              value: data?.state_id,
                              label: data?.state_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_state: e.value })
                          setErrorData({ ...errorData, ship_state: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.ship_state ? errorData.ship_state : ''}</span>
                    </div>
                  </div>


                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.ship_state ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Shipping City *</label>
                      <Select
                        id={userInfo.ship_state}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={shipCities?.map((data, index) => {
                          return {
                            value: data?.city_id,
                            label: data?.city_name,

                          }
                        })}
                        value={shipCities?.map((data, index) => {
                          if (userInfo.ship_city === data.city_id) {
                            return {
                              value: data?.city_id,
                              label: data?.city_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_city: e.value })
                          setErrorData({ ...errorData, ship_city: '' })

                        }}
                      />
                      <span className="errorText"> {errorData?.ship_city ? errorData.ship_city : ''}</span>
                    </div>
                  </div>



                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.ship_address ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="zip_add">Zip / Postal Code *</label>
                      <input
                        type="number"
                        placeholder="Zip / Postal Code"
                        name="pin-code"
                        disabled={viewMode}
                        id="zip_add"
                        className={errorData?.ship_pincode ? 'form-control is-invalid' : 'form-control'}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, ship_pincode: e.target.value })
                          setErrorData({ ...errorData, ship_pincode: '' })

                        }}
                        value={userInfo.ship_pincode ? userInfo.ship_pincode : ""}
                      />
                      <span className="errorText"> {errorData?.ship_pincode ? errorData.ship_pincode : ''}</span>
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                    <div className="input_box">
                      <label htmlFor="Shippingaddress">Shipping Address</label>
                      <textarea
                        name="address"
                        id="Shippingaddress"
                        disabled={viewMode}
                        className="form-control"
                        placeholder="Enter Address"
                        rows="2"
                        onChange={(e) => setUserInfo({ ...userInfo, ship_address: e.target.value })
                        }
                        value={userInfo.ship_address ? userInfo.ship_address : ""}>
                      </textarea>
                      <span className="errorText"> {errorData?.ship_address ? errorData.ship_address : ''}</span>
                    </div>
                  </div>
                  <div className="row">
                    {console.log('userInfo', userInfo)}
                    {userInfo.db_acc_fields?.map(({ option, field_name, field_lable, field_type, input_type, input_value }, ind) => (
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12" key={ind}>
                        <div className="input_box">
                          <label htmlFor={field_name + ind}> {field_lable} </label>
                          {input_type === 'input' ? (
                            <input
                              type={field_type}
                              className={inputClass(field_type)}
                              id={field_name + ind}
                              name={field_name}
                              disabled={viewMode}
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
                              disabled={viewMode}
                              className="form-control"
                              value={input_value}>
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
                        {/* <button onClick={AddFieldsFunc} className="btn btn-light me-3">Cancel</button> */}
                        <button onClick={createInputField} className="btn btn-success">Create Field</button>
                      </div>
                    </div>
                  )}
                </div>


                <div className="text-end">
                  <div className="submit_btn">

                    {viewMode ? null :
                      <div className="add_screen_head">
                        <span className="text_bold"><button className='btn btn-primary ' onClick={AddFieldsFunc}> Add More Fields</button>  </span>
                      </div>}
                    {viewMode ? null : <>
                      <Link href='/Accounts'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
                      {editMode ? (
                        <button disabled={isLoading} className="btn btn-primary " onClick={UpdateHandler}>
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
            {viewMode ? <div className="col-xl-3 col-md-3 col-sm-12 col-12 sideCardAdd">
              <div className="opertunity_box">
                <div className="task_card mb-4">
                  <div className="task_head">Opportunities List</div>
                  <div className="tasks_details">
                    <ul className="tasks_list">

                      {userInfo?.oppList?.map(({ opp_id, opp_name, amount }, i) => {
                        return (
                          <li key={opp_id} className="list-item">
                            <div className="opp_box">
                              <Link href={`/OpportunityView?id=${opp_id}`}>
                                <div className="name">{opp_name} </div>
                              </Link>
                              <div className="price">&#8377; {amount}</div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="card_footer">
                    <Link href='/Opportunity'>
                      <div className="text_more">view more</div>
                    </Link>
                  </div>
                </div>
                <div className="task_card">
                  <div className="task_head">Contacts List</div>
                  <div className="tasks_details">
                    <ul className="tasks_list">
                      {userInfo?.contactList?.map(({ contact_id, first_name }, i) => {
                        return (
                          <li key={contact_id} className="list-item">
                            <div className="opp_box">
                              <Link href={`/AddContact?id=${contact_id}&vw=mds`}>
                                <div className="name">{first_name}</div>
                              </Link>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="card_footer">
                    <Link href='/Contacts'>
                      <div className="text_more">view more</div>
                    </Link>
                  </div>
                </div>

                <div className="task_card">
                  <div className="task_head">Lead List</div>
                  <div className="tasks_details">
                    <ul className="tasks_list">
                      {userInfo?.db_leads?.map(({ lead_id, lead_name }, i) => {
                        return (
                          <li key={lead_id} className="list-item">
                            <div className="opp_box">
                              <Link href={`/LeadsView?id=${lead_id}&vw=mds`}>
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

export default AddAccountScreen;