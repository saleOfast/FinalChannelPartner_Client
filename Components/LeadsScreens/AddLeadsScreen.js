import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { validEmail, validPhone } from "../../Utils/regex";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import { fetchData } from "../../Utils/getReq";
import Collapse from "react-bootstrap/Collapse";
import TasksIcon from "../Svg/TasksIcon";
import CrossIcon from "../Svg/CrossIcon";
import Select from 'react-select'

const AddLeadsScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;

  const [show, setShow] = useState(false);
  const [countrylist, setcountrylist] = useState([]);
  const [statelist, setStatelist] = useState([]);
  const [citylist, setCitylist] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [lossLists, setlossLists] = useState([])
  const [taskOpen, setTaskOpen] = useState(false);
  const [accountsList, setAccountsList] = useState([]);
  const [ContactList, setContactList] = useState([]);
  const [oppurtunityList, setOppurtunityList] = useState([]);
  const [errorToast, setErrorToast] = useState(false)
  const [iscollapse, setiscollapse] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [userList, setUsersList] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [logOpen, setLogOpen] = useState(false);
  const [callList, setCallList] = useState([]);
  const [sideTab, setSideTab] = useState("task");
  const [sourcelist, setSourceList] = useState();
  const [editMode, setEditMode] = useState(false);
  const [editAccId, seteditAccId] = useState(null);
  const [editOppId, seteditOppId] = useState(null);
  const [editConId, seteditConId] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [errorData, setErrorData] = useState({});
  const [contError, setContError] = useState({});
  const [loginDetails, setloginDetails] = useState({});
  const [sidetaskToggle, setSidetaskToggle] = useState(true);
  const [userInfo, setUserInfo] = useState({
    lead_name: "",
    lead_src_id: null,
    lead_owner: "",
    company_name: "",
    lead_detail: "",
    email_id: "",
    p_contact_no: null,
    whatsapp_no: null,
    official_no: null,
    created_on: "",
    updated_on: "",
    pincode: null,
    address: "",
    city_id: null,
    lead_status_id: 1,
    country_id: null,
    state_id: null,
    acc_id: null,
    contact_id: null,
    opp_id: null,
    acc_name: null,
    opp_name: null,
    first_name: null,
    acc_id: null,
    db_lead_fields: [],
    related_to: "",
  });
  const [newFields, setNewFields] = useState({
    field_lable: null,
    input_type: null,
    field_type: null,
    field_size: null,
    option: null,
  });
  const [contactInfo, seContactInfo] = useState({
    call_subject: "",
    comments: "",
    relate_to: "",
    contact_person_name: "",
    event_date: "",
  });

  const handleClose = () => {
    if (!userInfo.loss_id || userInfo.loss_id == '') {
      setUserInfo({ ...userInfo, lead_status_id: '1' })
    }
    setShow(false)
  };

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");
  const minDate = new Date().toISOString().slice(0, 16);

  const handleShow = () => setShow(true);

  const getCountryList = async () => {
    await fetchData(`/db/area/country?country_id=1`, setcountrylist, errorToast, setErrorToast);
  };

  const getState = async (id) => {
    await fetchData(`/db/area/states?cnt_id=${id}`, setStatelist, errorToast, setErrorToast);
  };

  const getcity = async (id) => {
    await fetchData(`/db/area/city?st_id=${id}`, (data) => setCitylist(data.cityData), errorToast, setErrorToast);
  };

  const getusersList = async () => {
    await fetchData(`/db/users`, setUsersList, errorToast, setErrorToast);
  };

  const getDataList = async () => {
    await fetchData(`/db/leadsrc`, setDataList, errorToast, setErrorToast);
  };

  const getLossLists = async () => {
    await fetchData(`/db/loss`, setlossLists, errorToast, setErrorToast);
  };

  const getSingleData = async (id) => {
    await fetchData(`/db/leads?l_id=${id}`, setUserInfo, errorToast, setErrorToast);
  };

  const getsource = async () => {
    await fetchData(`/db/leadstatus`, setSourceList, errorToast, setErrorToast);
  };

  const getAccountsList = async () => {
    await fetchData(`/db/account`, setAccountsList, errorToast, setErrorToast);
  }

  const getContactList = async () => {
    await fetchData(`/db/contacts`, setContactList, errorToast, setErrorToast);
  }

  const getOppurtunityList = async () => {
    await fetchData(`/db/opportunity`, setOppurtunityList, errorToast, setErrorToast);
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
          m_id: 3,
        },

      };
      let oppBody = { ...userInfo }
      oppBody.lead_owner = loginDetails.user_id
      try {
        const response = await axios.post(Baseurl + `/db/leads`, oppBody, header);
        if (response.status === 204 || response.status === 200) {
          //make function 
          await postFieldsFunc(response.data.data.lead_id, oppBody.db_lead_fields)
          toast.success(response.data.message);
          setisLoading(false)
          router.push('/ManageLeads')
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

  const getTaskInLead = async (id) => {
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
          Baseurl + `/db/leads/task?l_id=${id}`,
          header
        );
        setTaskList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const addLeadHandler = async () => {

    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }
    if (allEmpty) {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");
        let reqOptions = { ...userInfo, lead_id: router.query.id }
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 13
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/tasks`,
            reqOptions,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success("Leads Created Successfully");
            getTaskInLead(router.query.id);
            setUserInfo({
              task_name: "",
              due_date: "",
              lead_id: "",
              contact_person_name: "",
              related_to: ""
            })
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
        }
      }
    }
    else {
      toast.error('Please fill the Mandatory fields')
    }

  }

  const AccountHandlers = async () => {

    if (userInfo.acc_name == "" || userInfo.acc_name == undefined) {
      if (userInfo.acc_id !== undefined && userInfo.acc_id !== null && userInfo.acc_id !== 0) {
        return toast.error("Account is not selected");

      }
      return toast.error("Please enter the Account Name");
    }

    else {
      if (hasCookie('token') && userInfo.acc_name !== "") {
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
          const response = await axios.post(Baseurl + `/db/account?l_id=${id}`, {
            acc_name: userInfo.acc_name,
          }, header);
          if (response.status === 204 || response.status === 200) {
            setUserInfo({ ...userInfo, acc_id: response.data.data.acc_id, acc_name: "" })
            seteditAccId(response.data.data.acc_id)
            return response.data.data.acc_id
          }
        } catch (error) {



        }
      }
    }
  }

  const ContactHandler = async (ac_ID) => {
    if (userInfo.first_name == '' || userInfo.first_name == undefined) {
      if (userInfo.contact_id !== undefined && userInfo.contact_id !== null && userInfo.contact_id !== 0) {
        return
      }
      toast.error('please enter the first name')
      return
    }
    else {
      if (hasCookie("token") && userInfo.first_name !== '') {
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
          const response = await axios.post(Baseurl + `/db/contacts?l_id=${id}`, {
            first_name: userInfo.first_name,
            account_name: ac_ID
          }, header);
          if (response.status === 204 || response.status === 200) {
            setUserInfo({ ...userInfo, contact_id: response.data.data.contact_id, first_name: "" })
            seteditConId(response.data.data.contact_id)
          }
        } catch (error) {

        }
      }
    }

  }

  const OpportunityHandler = async (ac_ID) => {
    if (userInfo.opp_name === '' || userInfo.opp_name == undefined) {
      if (userInfo.opp_id !== undefined && userInfo.opp_id !== null && userInfo.opp_id !== 0) {
        return
      }
      toast.error('please enter the opportunity name')
    }

    else {
      if (hasCookie("token") && userInfo.opp_name !== "") {
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
          const response = await axios.post(Baseurl + `/db//opportunity?l_id=${id}`, { opp_name: userInfo.opp_name, account_name: ac_ID }, header);
          if (response.status === 204 || response.status === 200) {
            setUserInfo({ ...userInfo, opp_id: response.data.data.opp_id, opp_name: "" })
            seteditOppId(response.data.data.opp_id)
          }
        } catch (error) {

        }
      }
    }
  }

  const lossReasonSubmit = () => {
    if (!userInfo.loss_id || userInfo.loss_id == '') {
      toast.error('Please Select a Reason')
    } else {
      handleClose();
    }
  }

  const ConvertedLead = async () => {
    if (userInfo.lead_status_id == 4) {
      if (userInfo.acc_name == "" || userInfo.acc_name == undefined && userInfo.acc_id == 0 || userInfo.acc_id == null) {
        toast.error('please select acc name')
        return
      }

      if ((userInfo.first_name == "" || userInfo.first_name == undefined) && (userInfo.contact_id == 0 || userInfo.contact_id == null)) {
        toast.error('please select contact name')
        return
      }

      if ((userInfo.opp_name == "" || userInfo.opp_name == undefined) && (userInfo.opp_id == 0 || userInfo.opp_id == null)) {
        toast.error('please select opportunity name')
        return
      }

      if (userInfo.acc_id == 0) {
        var ac_ID = await AccountHandlers();

      }

      setTimeout(() => {
        if (userInfo.contact_id == 0) {
          ContactHandler(ac_ID);
        }

        if (userInfo.opp_id == 0) {
          OpportunityHandler(ac_ID);
        }
      }, 1000);



      setUserInfo({ ...userInfo, lead_status_id: "4" })
      setShow(false)
    } else {
      return handleClose();
    }
  }

  const StatusChangeHandler = (value) => {
    if (value && value === '3') {
      handleShow();
      setUserInfo({ ...userInfo, lead_status_id: value })
    } else if (value && value === '4') {
      handleShow();
      setUserInfo({ ...userInfo, lead_status_id: value })
    }
    else {
      setUserInfo({ ...userInfo, lead_status_id: value })
    }
  }

  async function updateHandler() {


    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 5
        },
      };

      let userInfoBody = { ...userInfo }

      if (editAccId !== null) {
        userInfoBody.acc_id = editAccId
      }

      if (editConId !== null) {
        userInfoBody.contact_id = editConId
      }

      if (editOppId !== null) {
        userInfoBody.opp_id = editOppId
      }


      // if(editConId !== null && editOppId !== null && editAccId !== null){
      //     userInfoBody = {...userInfo, contact_id: editConId, opp_id: editOppId, acc_id: editAccId}
      // }


      try {
        const response = await axios.put(
          Baseurl + `/db/leads`,
          userInfoBody,
          header
        );

        if (response.status === 200 || response.status === 204) {
          await postFieldsFunc(userInfoBody.lead_id, userInfoBody.db_lead_fields)
          toast.success(response.data.message);
          setisLoading(false)
          router.push("/ManageLeads");
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


  const getCallsInLead = async (id) => {
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
          Baseurl + `/db/leads/calls?l_id=${id}`,
          header
        );
        setCallList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  const getLeadFieldList = async () => {
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
        const response = await axios.get(Baseurl + `/db/field?nav_type=lead`, header);
        setUserInfo({ ...userInfo, db_lead_fields: response.data.data, updated_on: DateNow, created_on: DateNow });
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

  function checkLogin() {
    if (hasCookie("userInfo")) {
      let token = getCookie("userInfo");
      let data = JSON.parse(token)
      setloginDetails(data)
      setUserInfo({ ...userInfo, opp_owner: data.user_id })

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
      arr.db_lead_fields.push(newFields)
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
        item.lead = id
      })

      try {
        const response = await axios.post(Baseurl + `/db/leads/field`, data, header);
        if (response.status === 204 || response.status === 200) {
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


  const callLogSubmit = async () => {

    let allEmpty = true;
    for (let key in errorData) {
      if (errorData[key] !== "") {
        allEmpty = false;
        break;
      }
    }
    if (allEmpty) {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");
        let reqOptions = { ...contactInfo, lead_id: router.query.id }
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 13
          },
        };

        try {
          const response = await axios.post(
            Baseurl + `/db/leads/calls`,
            reqOptions,
            header
          );
          if (response.status === 204 || response.status === 200) {
            toast.success("Log Created Successfully");
            getCallsInLead(router.query.id);
            seContactInfo({
              call_subject: "",
              comments: "",
              relate_to: "",
              contact_person_name: "",
            })
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
        }
      }
    } else {
      toast.error('Please fill the Mandatory fileds')
    }

  }

  useEffect(() => {
    if (userInfo.p_contact_no && !validPhone.test(userInfo.p_contact_no)) {
      setContError({ ...contError, p_contact_no: 'invalid contact no.' });
    } else {
      setContError({ ...contError, p_contact_no: '' });
    }

  }, [useDebounce(userInfo.p_contact_no, 1000)]);

  useEffect(() => {
    if (userInfo.whatsapp_no && !validPhone.test(userInfo.whatsapp_no)) {
      setContError({ ...contError, whatsapp_no: 'invalid contact no.' });
    } else {
      setContError({ ...contError, whatsapp_no: '' });

    }

  }, [useDebounce(userInfo.whatsapp_no, 1000)]);

  useEffect(() => {
    if (userInfo.official_no && !validPhone.test(userInfo.official_no)) {
      setContError({ ...contError, official_no: 'invalid contact no.' });
    } else {
      setContError({ ...contError, official_no: '' });

    }

  }, [useDebounce(userInfo.official_no, 1000)]);

  useEffect(() => {
    if (userInfo.email_id && !validEmail.test(userInfo.email_id)) {
      setContError({ ...contError, email_id: 'invalid Email' });
    } else {
      setContError({ ...contError, email_id: '' });
    }
  }, [useDebounce(userInfo.email_id, 1000)]);

  useEffect(() => {
    getDataList();
    getLossLists();
    getsource();
    getAccountsList();
    checkLogin();
    getContactList();
    getOppurtunityList();
    getusersList();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setUserInfo({ ...userInfo, lead_id: router.query.id });
      getTaskInLead(id);
      getCallsInLead(id)
    }
  }, [router.isReady, id]);


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
    newData.db_lead_fields[ind].input_value = e.target.value
    setUserInfo(newData)

  };

  useEffect(() => {
    if (!userInfo.state_id) {
      return;
    } else {
      getcity(userInfo.state_id);
    }
  }, [userInfo.state_id]);

  useEffect(() => {
    if (!userInfo.country_id) {
      return;
    } else {
      getState(userInfo.country_id);
    }
  }, [userInfo.country_id]);

  useEffect(() => {
    getState();
    getCountryList();
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    } else {
      if (userInfo !== undefined) {
        getLeadFieldList()
      }
    }
    if (router.query.vw) {
      setViewMode(true)
    }

  }, [router.isReady, id]);

  return (
    <>
      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">{viewMode ? 'VIEW' : <>
            {editMode ? "EDIT" : "ADD"} </>} LEAD</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/ManageLeads"> Manage Leads </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {viewMode ? 'View' : <>
                  {editMode ? "Edit" : "ADD"} </>} Lead
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="Add_user_screen">
            <div className="row">
              <div className={sidetaskToggle && viewMode ? `col-xl-11 col-md-11 col-sm-12 col-12` : viewMode ? `col-xl-8 col-md-8 col-sm-12 col-12` : `col-xl-12 col-md-12 col-sm-12 col-12`}>
                <div className="add_screen_head">
                  <span className="text_bold">Fill Details</span> ( * Fields are mandatory)
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className={errorData?.lead_owner ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="lead_owner">Owner</label>

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
                          <span className="errorText"> {errorData?.lead_owner ? errorData.lead_owner : ''}</span>
                        </div>
                      </div>


                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className={errorData?.lead_name ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="profilelevel">Name *</label>
                          <input
                            type="text"
                            placeholder="Enter Lead Name"
                            name=""
                            id=""
                            disabled={viewMode}
                            className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                lead_name: e.target.value,
                              })
                              setErrorData({ ...errorData, lead_name: '' })
                            }}
                            value={userInfo.lead_name ? userInfo.lead_name : ""}
                          />
                          <span className="errorText"> {errorData?.lead_name ? errorData.lead_name : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className={errorData?.lead_status_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="profilelevel">Status </label>
                          <select
                            className="form-control"
                            name="profilelevel"
                            id="profilelevel"
                            disabled={viewMode}
                            onChange={(e) => {
                              StatusChangeHandler(e.target.value)
                              setErrorData({ ...errorData, lead_status_id: '' })
                            }}
                            value={userInfo.lead_status_id ? userInfo.lead_status_id : ""} >
                            {editMode ? (
                              <>
                                {sourcelist?.map((data, i) => {
                                  return (
                                    <option
                                      key={i}
                                      value={data.lead_status_id}
                                    >
                                      {data.status_name}
                                    </option>
                                  );
                                })}
                              </>
                            ) : (
                              <option value="1"> open </option>
                            )}
                          </select>



                        </div>
                      </div>
                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className={errorData?.lead_src_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="profilelevel">Source </label>

                          <Select
                            id={userInfo.opportunity_type_id}
                            defaultValue={""}
                            isDisabled={viewMode}
                            options={dataList?.map((data, index) => {
                              return {
                                value: data?.lead_src_id,
                                label: data?.source,

                              }
                            })}
                            value={dataList?.map((data, index) => {
                              if (userInfo.lead_src_id === data.lead_src_id) {
                                return {
                                  value: data?.lead_src_id,
                                  label: data?.source,

                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, lead_src_id: e.value })
                              setErrorData({ ...errorData, lead_src_id: '' })
                            }}
                          />
                          <span className="errorText"> {errorData?.lead_src_id ? errorData.lead_src_id : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                        <div className={errorData?.company_name ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="profilelevel">Organization Name *</label>
                          <input
                            type="text"
                            placeholder="Enter Organization Name"
                            disabled={viewMode}
                            name=""
                            id=""
                            className={errorData?.company_name ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                company_name: e.target.value,
                              })
                              setErrorData({ ...errorData, company_name: '' })
                            }}
                            value={userInfo.company_name ? userInfo.company_name : ""}
                          />
                          <span className="errorText"> {errorData?.company_name ? errorData.company_name : ''}</span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="profilelevel">Details </label>
                          <textarea
                            name=""
                            id=""
                            placeholder="Enter Lead Details"
                            rows="3"
                            className="form-control"
                            disabled={viewMode}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                lead_detail: e.target.value,
                              })
                            }
                            value={userInfo.lead_detail ? userInfo.lead_detail : ""}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="add_screen_head">
                    <span className="text_bold">Contact Information</span>
                  </div>
                  <div className="add_user_form">
                    <div className="row">
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={contError?.email_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="email">Email Id </label>
                          <input
                            type="text"
                            placeholder="Enter Email Id"
                            name="email"
                            id="email"
                            disabled={viewMode}
                            className={contError?.email_id ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                email_id: e.target.value,
                              })
                            }
                            value={userInfo.email_id ? userInfo.email_id : ""}
                          />
                          <span className="errorText"> {contError?.email_id ? contError.email_id : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={contError?.p_contact_no ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="per_cont">Personal Contact No. </label>
                          <input
                            type="text"
                            placeholder="Enter Contact no."
                            name="per_cont"
                            id="per_cont"
                            disabled={viewMode}
                            className={contError?.p_contact_no ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                p_contact_no: e.target.value,
                              })

                            }
                            value={userInfo.p_contact_no ? userInfo.p_contact_no : ""}
                          />
                          <span className="errorText"> {contError?.p_contact_no ? contError.p_contact_no : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={contError?.whatsapp_no ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="wts_no">Whatsapp No.</label>
                          <input
                            type="text"
                            placeholder="Enter whatsapp No."
                            name="wts_no"
                            id="wts_no"
                            disabled={viewMode}
                            className={contError?.whatsapp_no ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                whatsapp_no: e.target.value,
                              })
                            }
                            value={userInfo.whatsapp_no ? userInfo.whatsapp_no : ""}
                          />
                          <span className="errorText"> {contError?.whatsapp_no ? contError.whatsapp_no : ''}</span>

                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={contError?.official_no ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="offc_no">Official No.</label>
                          <input
                            type="text"
                            placeholder="Enter Official No."
                            name="offc_no"
                            disabled={viewMode}
                            id="offc_no"
                            className={contError?.official_no ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                official_no: e.target.value,
                              })
                            }
                            value={userInfo.official_no ? userInfo.official_no : ""}
                          />
                          <span className="errorText"> {contError?.official_no ? contError.official_no : ''}</span>
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
                          <label htmlFor="email">Created On</label>
                          <input
                            type="date"
                            disabled
                            name="date"
                            id="date"
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
                          <label htmlFor="mod_date">Last Modified On</label>
                          <input
                            type="date"
                            disabled
                            placeholder="Enter Contact no."
                            name="mod_date"
                            id="mod_date"
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                updated_on: e.target.value,
                              })
                            }
                            value={userInfo.updated_on ? userInfo.updated_on : ""}
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
                        <div className={errorData?.country_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="email">Country </label>
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
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, country_id: e.value })
                              setErrorData({ ...errorData, country_id: '' })
                            }}
                          />
                          <span className="errorText"> {errorData?.country_id ? errorData.country_id : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={errorData?.state_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="per_cont">State </label>
                          <Select
                            id={userInfo.country_id}
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
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, state_id: e.value })
                              setErrorData({ ...errorData, state_id: '' })
                            }}
                          />
                          <span className="errorText"> {errorData?.state_id ? errorData.state_id : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={errorData?.city_id ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="wts_no">City </label>
                          <Select
                            id={userInfo.city_id}
                            isDisabled={viewMode}
                            defaultValue={""}
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
                            onChange={(e) => {
                              setUserInfo({ ...userInfo, city_id: e.value })
                              setErrorData({ ...errorData, city_id: '' })
                            }}
                          />
                          <span className="errorText"> {errorData?.city_id ? errorData.city_id : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className={errorData?.pincode ? 'input_box errorBox' : 'input_box'}>
                          <label htmlFor="offc_no">Zip / Postal Code </label>
                          <input
                            type="number"
                            placeholder="Zip / Postal Code"
                            name="offc_no"
                            id="offc_no"
                            disabled={viewMode}
                            className={errorData?.pincode ? 'form-control is-invalid' : 'form-control'}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                pincode: e.target.value,
                              })
                              setErrorData({ ...errorData, pincode: '' })
                            }}
                            value={userInfo.pincode ? userInfo.pincode : ""}
                          />
                          <span className="errorText"> {errorData?.pincode ? errorData.pincode : ''}</span>
                        </div>
                      </div>
                      <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="address">Address</label>
                          <textarea
                            className="form-control"
                            name="address"
                            id="address"
                            disabled={viewMode}
                            placeholder="Enter Address"
                            rows="3"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                address: e.target.value,
                              })
                            }
                            value={userInfo.address ? userInfo.address : ""}
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      {userInfo.db_lead_fields?.map(({ option, field_name, field_lable, field_type, input_type, input_value }, ind) => (
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
                                disabled={viewMode}
                                onChange={(e) => updateFieldInfo(e, ind)}
                                //value={userInfo.field_name ? userInfo.field_name : ""}
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
                          {/* <button onClick={"AddFieldsFunc"} className="btn btn-light me-3">Cancel</button> */}
                          <button onClick={createInputField} className="btn btn-success">Create Field</button>
                        </div>
                      </div>
                    )}


                    <div className="text-end">
                      <div className="submit_btn">
                        {viewMode ? null : <>
                          <div className="add_screen_head">
                            <span className="text_bold"><button className='btn btn-primary ' onClick={AddFieldsFunc}> Add More Fields</button>  </span>
                          </div> </>}
                        {viewMode ? null : <>
                          <Link href='/ManageLeads'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
                          {editMode ? (
                            <button disabled={isLoading} className="btn btn-primary" onClick={updateHandler}>
                              {isLoading ? 'Loading...' : 'Update'}
                            </button>
                          ) : (
                            <button
                              disabled={isLoading}
                              className="btn btn-primary"
                              onClick={submitHandler}
                            >
                              {isLoading ? 'Loading...' : 'Save & Submit'}
                            </button>
                          )}
                        </>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {viewMode ?
                <div className={sidetaskToggle ? `col-xl-1 col-md-1 col-sm-12 col-12` : `col-xl-4 col-md-4 col-sm-12 col-12`}>
                  <div className={`task_info${sidetaskToggle ? ' closed' : ' open'}`}>
                    <div className="header dashboard_head">
                      <div className="taskIcon" title={sidetaskToggle ? 'Tasks & Events' : 'Close Menu'} onClick={() => setSidetaskToggle(!sidetaskToggle)}>
                        {sidetaskToggle ? <TasksIcon /> : <CrossIcon />}
                      </div>
                      <span className="text-head">Activity</span>
                    </div>
                    <div className="task_box">
                      <ul className="tgs_btns">
                        <li
                          onClick={() => setSideTab("task")}
                          className={sideTab === "task" ? "list-item active" : "list-item"} >
                          New Task
                        </li>
                        <li
                          onClick={() => setSideTab("log")}
                          className={sideTab === "log" ? "list-item active" : "list-item"} >
                          Event Log
                        </li>
                      </ul>
                      {sideTab === "task" ? (
                        <div className="add_user_form">
                          <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <div className={errorData?.task_name ? 'input_box errorBox' : 'input_box'}>
                                <label htmlFor="task_sub">Subject</label>
                                <input
                                  type="text"
                                  placeholder="Enter Subject"
                                  name="task_sub"
                                  id="task_sub"
                                  className={errorData?.task_name ? 'form-control is-invalid' : 'form-control'}
                                  onChange={(e) => {
                                    setUserInfo({ ...userInfo, task_name: e.target.value })
                                    setErrorData({ ...errorData, task_name: '' })
                                  }}
                                  value={userInfo.task_name ? userInfo.task_name : ""} />
                                <span className="errorText"> {errorData?.task_name ? errorData.task_name : ''}</span>
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className={errorData?.due_date ? 'input_box errorBox' : 'input_box'}>
                                <label htmlFor="due_date">Due Date</label>
                                <input
                                  type="datetime-local"
                                  placeholder="Select Date"
                                  name="due_date"
                                  min={minDate}
                                  id="due_date"
                                  className={errorData?.due_date ? 'form-control is-invalid' : 'form-control'}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      due_date: e.target.value,
                                    })
                                    setErrorData({ ...errorData, due_date: "" })
                                  }}
                                  value={
                                    userInfo.due_date ? userInfo.due_date : ""} />
                                <span className="errorText"> {errorData?.due_date ? errorData.due_date : ''}</span>
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="subject">Assign To</label>
                                <select
                                  name="cont_person"
                                  id="cont_person"
                                  className={errorData?.assigned_to ? 'form-control is-invalid' : 'form-control'}
                                  onChange={(e) => {
                                    setUserInfo({
                                      ...userInfo,
                                      assigned_to: e.target.value,
                                    })
                                    setErrorData({ ...errorData, assigned_to: "" })
                                  }}
                                  value={
                                    userInfo.assigned_to
                                      ? userInfo.assigned_to
                                      : ""
                                  }
                                >
                                  <option value="">Select User</option>
                                  {userList?.map((data, index) => {
                                    return (
                                      <option key={index} value={data.user_id}>
                                        {data.user}
                                      </option>
                                    );
                                  })}
                                </select>
                                <span className="errorText"> {errorData?.assigned_to ? errorData.assigned_to : ''}</span>
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="cont_person">
                                  Contact Person Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter Name"
                                  name="task_sub"
                                  id="task_sub"
                                  className="form-control"
                                  onChange={(e) =>
                                    setUserInfo({
                                      ...userInfo,
                                      contact_person_name: e.target.value,
                                    })
                                  }
                                  value={
                                    userInfo.contact_person_name
                                      ? userInfo.contact_person_name
                                      : ""
                                  }
                                />
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="cont_person">Related To</label>
                                <input
                                  type="text"
                                  placeholder="Enter related to"
                                  name="task_sub"
                                  id="task_sub"
                                  className="form-control"
                                  onChange={(e) =>
                                    setUserInfo({
                                      ...userInfo,
                                      related_to: e.target.value,
                                    })
                                  }
                                  value={
                                    userInfo.related_to ? userInfo.related_to : ""
                                  }
                                />
                              </div>
                            </div>

                            <div className="btn-box text-end">
                              <button
                                className="btn btn-primary"
                                onClick={addLeadHandler}
                              >
                                Save & Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="add_user_form">
                          <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <div className={errorData?.call_subject ? 'input_box errorBox' : 'input_box'}>
                                <label htmlFor="task_sub">Subject</label>
                                <input
                                  type="text"
                                  placeholder="Enter Subject"
                                  name="task_sub"
                                  id="task_sub"
                                  className={errorData?.call_subject ? 'form-control is-invalid' : 'form-control'}
                                  onChange={(e) => {
                                    seContactInfo({
                                      ...contactInfo,
                                      call_subject: e.target.value,
                                    })
                                    setErrorData({ ...errorData, call_subject: "" })
                                  }}
                                  value={contactInfo.call_subject ? contactInfo.call_subject : ''}
                                />
                                <span className="errorText"> {errorData?.call_subject ? errorData.call_subject : ''}</span>
                              </div>
                            </div>
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="call_comments">Comments</label>
                                <textarea
                                  placeholder="Enter Comment"
                                  name="call_comments"
                                  id="call_comments"
                                  rows="2"
                                  className="form-control"
                                  onChange={(e) =>
                                    seContactInfo({
                                      ...contactInfo,
                                      comments: e.target.value,
                                    })
                                  }
                                  value={contactInfo.comments ? contactInfo.comments : ''}
                                ></textarea>
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="contact_person_name">
                                  Contact Person Name
                                </label>
                                <input
                                  type="text"
                                  placeholder="Enter Name"
                                  name="contact_person_name"
                                  id="contact_person_name"
                                  className="form-control"
                                  onChange={(e) =>
                                    seContactInfo({
                                      ...contactInfo,
                                      contact_person_name: e.target.value,
                                    })
                                  }
                                  value={contactInfo.contact_person_name ? contactInfo.contact_person_name : ''}
                                />
                              </div>
                            </div>
                            <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="relate_to">Related To</label>
                                <input
                                  type="text"
                                  placeholder="Related To"
                                  name="relate_to"
                                  id="relate_to"
                                  className="form-control"
                                  onChange={(e) =>
                                    seContactInfo({
                                      ...contactInfo,
                                      relate_to: e.target.value,
                                    })
                                  }
                                  value={contactInfo.relate_to ? contactInfo.relate_to : ''}
                                />
                              </div>
                            </div>

                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="due_date">Event Date</label>
                                <input
                                  type="datetime-local"
                                  placeholder="Select Date"
                                  name="due_date"
                                  min={minDate}
                                  id="due_date"
                                  className={errorData?.event_date ? 'form-control is-invalid' : 'form-control'}
                                  onChange={(e) => {
                                    seContactInfo({
                                      ...contactInfo,
                                      event_date: e.target.value,
                                    })
                                    setErrorData({ ...errorData, event_date: "" })
                                  }}
                                  value={
                                    contactInfo.event_date ? contactInfo.event_date : ""} />
                                <span className="errorText"> {errorData?.event_date ? errorData.event_date : ''}</span>
                              </div>
                            </div>

                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                              <div className="input_box">
                                <label htmlFor="cont_person">CTS No</label>
                                <input
                                  type="text"
                                  placeholder="CTS_001"
                                  disabled
                                  name="task_sub"
                                  id="task_sub"
                                  className="form-control" />
                              </div>
                            </div>
                            <div className="btn-box text-end">
                              <button className="btn btn-primary" onClick={callLogSubmit}>
                                Save & Submit
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="task_log_list">
                      <div className="box-inside tasks">
                        <div
                          className="box-head"
                          onClick={() => setTaskOpen(!taskOpen)}
                          aria-controls="TaskCollapse"
                          aria-expanded={taskOpen}
                        >
                          Task List
                        </div>
                        <Collapse in={taskOpen}>
                          <div>
                            {taskList?.map((item, i) => {
                              return (
                                <div key={i} className="task-dtls box-disc">
                                  <div className="row">
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="head">Task Name:</div>
                                    </div>
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="value">
                                        {item?.task_name}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="head">Assign to:</div>
                                    </div>
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="value">{item?.assignedToUser?.user}</div>
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="head">Due Date:</div>
                                    </div>
                                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                      <div className="value">{moment(item?.due_date).format("DD-MM-YYYY LT")}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </Collapse>
                      </div>
                      <div className="box-inside logs">
                        <div
                          className="box-head"
                          onClick={() => setLogOpen(!logOpen)}
                          aria-controls="CallLogs"
                          aria-expanded={logOpen}
                        >
                          Event Logs
                        </div>

                        <Collapse in={logOpen}>
                          <div>
                            {callList?.map((item, i) => {
                              return <div className="task-dtls box-disc" key={i}>
                                <div className="row">
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="head">Subject:</div>
                                  </div>
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="value">
                                      {item.call_subject}
                                    </div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="head">Comments</div>
                                  </div>
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="value">{item.comments}</div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="head">relate to</div>
                                  </div>
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="value">{item.relate_to}</div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="head">Event Date:</div>
                                  </div>
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="value">{moment(item?.event_date).format("DD-MM-YYYY LT")}</div>
                                  </div>
                                </div>
                                <div className="row">
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="head">CTS to</div>
                                  </div>
                                  <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                                    <div className="value">{item.cts_no}</div>
                                  </div>
                                </div>
                              </div>
                            })}
                          </div>
                        </Collapse>
                      </div>
                    </div>
                  </div>

                </div> : null}
            </div>

          </div>
        </div>
      </div>
      {/*   close not convertd  */}
      <Modal className="commonModal" show={show} onHide={handleClose} >
        <Modal.Header closeButton>
          {userInfo.lead_status_id == 3 ?
            <Modal.Title> Add Loss Reason </Modal.Title> :
            <Modal.Title> converted Lead </Modal.Title>}
        </Modal.Header>
        {userInfo.lead_status_id == 3 ?
          <Modal.Body>

            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="loss_reson">Select Loss Reason</label>
                    <select
                      className="form-control"
                      name="loss_reson" id="loss_reson"
                      onChange={(e) => setUserInfo({ ...userInfo, loss_id: e.target.value })} >
                      <option value="">Select Reason</option>
                      {lossLists?.map((data, i) => {
                        return <option key={i} value={data.loss_id}>{data.loss_reason}</option>
                      })}
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </Modal.Body> : <Modal.Body>

            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="loss_reson">Account</label>
                    <select
                      className="form-control"
                      name="Account" id="Account"
                      onChange={(e) => setUserInfo({ ...userInfo, acc_id: e.target.value })}
                      value={userInfo.acc_id ? userInfo.acc_id : ""}
                    >
                      <option value="">Select Account</option>
                      <option value='0' >
                        Create New Account
                      </option>
                      {accountsList?.map((data, index) => {
                        return <option key={index} value={data.acc_id}>{data.acc_name}</option>
                      })}
                    </select>
                  </div>
                </div>
                {userInfo.acc_id == 0 ?
                  <>
                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                      <div className="input_box">

                        <label htmlFor="loss_reson">Account Name</label>

                        <input
                          type="text"
                          placeholder="Account Name"
                          name="account name"
                          id="account name"
                          className="form-control"
                          onChange={(e) => setUserInfo({ ...userInfo, acc_name: e.target.value })}
                        />
                      </div>
                    </div>

                  </> : null}

                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="loss_reson">Contact</label>
                    <select
                      className="form-control"
                      name="Account" id="Account"
                      onChange={(e) => setUserInfo({ ...userInfo, contact_id: e.target.value })}
                      value={userInfo.contact_id ? userInfo.contact_id : ""}
                    >
                      <option value="">Select Contact</option>
                      <option value='0' >
                        Create New Contact
                      </option>
                      {ContactList?.map((data, index) => {
                        return <option key={index} value={data.contact_id}>{data.first_name}</option>
                      })}
                    </select>
                  </div>
                </div>
                {userInfo.contact_id == 0 ?
                  <>
                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                      <div className="input_box">
                        <label htmlFor="loss_reson">Contact Name</label>
                        <input
                          type="text"
                          placeholder="Contact Name"
                          name="account name"
                          id="account name"
                          className="form-control"
                          onChange={(e) => setUserInfo({ ...userInfo, first_name: e.target.value })}

                        />
                      </div>
                    </div>
                  </> : null}

                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="loss_reson">Opportunity</label>
                    <select
                      className="form-control"
                      name="Account" id="Account"
                      onChange={(e) => setUserInfo({ ...userInfo, opp_id: e.target.value })}
                      value={userInfo.opp_id ? userInfo.opp_id : ""}
                    >
                      <option value="">Select Opportunity</option>
                      <option value='0' >
                        Create New Opportunity
                      </option>
                      {oppurtunityList?.map((data, i) => {
                        return <option key={i} value={data.opp_id}>{data.opp_name}</option>
                      })}
                    </select>
                  </div>
                </div>
                {userInfo.opp_id == 0 ?
                  <>
                    <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                      <div className="input_box">

                        <label htmlFor="loss_reson">Opportunity Name</label>

                        <input
                          type="text"
                          placeholder="Opportunity Name"
                          name="opportunity name"
                          id="opportunity name"
                          className="form-control"
                          onChange={(e) => setUserInfo({ ...userInfo, opp_name: e.target.value })}
                        />
                      </div>
                    </div>
                  </> : null}
              </div>
            </div>
          </Modal.Body>}
        <Modal.Footer>

          {userInfo.lead_status_id == 3 ?

            <Button variant="primary" onClick={lossReasonSubmit} >
              SUBMIT
            </Button> :

            <Button variant="primary" onClick={ConvertedLead} >
              SUBMIT
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </>

  );
};

export default AddLeadsScreen;
