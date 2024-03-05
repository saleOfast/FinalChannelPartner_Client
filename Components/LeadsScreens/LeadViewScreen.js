import React, { useEffect, useState } from "react";
import ManageLeadTable from "./ManageLeadTable";
import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import LeadDetailComponent from "./LeadDetailComponent";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import moment from "moment";
import { useSelector } from "react-redux";

const LeadViewScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [taskOpen, setTaskOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [dataList, setDataList] = useState({});
  const [taskList, setTaskList] = useState([]);
  const [callList, setCallList] = useState([]);
  const [sideTab, setSideTab] = useState("task");
  const [userList, setUserList] = useState([]);
  const [errorData, setErrorData] = useState({})
  const [userInfo, setUserInfo] = useState({
    task_name: "",
    due_date: "",
    lead_id: "",
    contact_person_name: "",
    related_to: "",
  });

  const [contactInfo, seContactInfo] = useState({
    call_subject: "",
    comments: "",
    relate_to: "",
    contact_person_name: "",
    event_date: "",
  });

  const getDataList = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 4
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/leads?l_id=${id}`,
          header
        );
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

  const minDate = new Date().toISOString().slice(0, 16);

  const getUserList = async () => {
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
        const response = await axios.get(Baseurl + `/db/users`, header);
        setUserList(response.data.data);
      } catch (error) {
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };


  // ----------------- get task in lead page ---------------------//

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
    if (!router.isReady) return;
    if (router.query.id) {
      setUserInfo({ ...userInfo, lead_id: router.query.id });
      getDataList(id);
      getTaskInLead(id);
      getCallsInLead(id)
    }
  }, [router.isReady, id]);

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <>
      {/*  <ConfirmBox
                showConfirm={disableShowConfirm}
                setshowConfirm={setdisableShowConfirm}
                actionType={disableHandler}
                title={"Are You Sure you want to Disable ?"}
            /> */}

      <div className={`main_Box  ${sideView}`}>
        <div className="bread_head">
          <h3 className="content_head">Leads View</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link href="/">Home </Link>
              </li>
              <li className="breadcrumb-item">
                <Link href="/ManageLeads">Manage Leads </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Leads
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="lead_box">
            <div className="row">
              <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                <div className="lead-info ">
                  <div className="header">Lead Information</div>
                  <div className="main_content">
                    <div className="Add_user_screen">
                      <div className="add_user_form">
                        <div className="row">
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Name *</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.lead_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Status *</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.db_lead_status?.status_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Source</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.db_lead_source?.source}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Owner</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.leadOwner?.user}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Organization Name </label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.company_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Details </label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.lead_detail}
                                disabled
                              />
                            </div>
                          </div>

                           <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Email</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.email_id}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Personal Contact NO.</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.p_contact_no}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Whatsapp No.</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.whatsapp_no}
                                disabled
                              />
                            </div>
                          </div>
                          
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Official No.</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.official_no}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Created On</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={moment(dataList?.createdAt).format("DD-MM-YYYY LT")}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Last Modified On</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={moment(dataList?.updatedAt).format("DD-MM-YYYY LT")}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Country </label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.db_country?.country_name}
                                disabled
                              />
                            </div>
                          </div>
                          {console.log(dataList)}

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">State </label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.db_state?.state_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">City</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.db_city?.city_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Zip / Postal Code </label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.pincode}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                            <label htmlFor="profilelevel">Address</label>
                              <input
                                className={errorData?.lead_name ? 'form-control is-invalid' : 'form-control'}
                                value={dataList?.address}
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="btn-box text-end pb-4 pe-4">
                    <Link href={`/AddLeads?id=${id}`}>
                      <button className="btn btn-primary">Edit</button>
                    </Link>
                  </div> */}
                </div>
              </div>
              <div
                className="col-xl-4 col-md-4 col-sm-12 col-12"
                style={{ backgroundColor: "#F7F5F5" }}
              >
                <div className="task_info">
                  <div className="header dashboard_head">Activity</div>
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
                                <option value="">Select Leads</option>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadViewScreen;