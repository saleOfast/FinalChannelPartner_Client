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

const AddTaskScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [priorityList, setPriorityList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [usersList, setusersList] = useState([]);
  const [opportunityList, setOpportunityList] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false)
  const [errorData, setErrorData] = useState({})
  const [userInfo, setUserInfo] = useState({
    task_priority_id: null,
    task_status_id: null,
    lead_id: null,
    link_with_opportunity: null,
  });

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");

  async function fetchData(url, setData) {
    const token = getCookie('token');
    const db_name = getCookie('db_name');

    const header = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        db: db_name,
        pass: 'pass',
      },
    };
    try {
      const response = await axios.get(Baseurl + url, header);
      if (response.status === 204 || response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      toast.error(error.response.data.message || 'Something went wrong!');
    }
  }
  async function getPriorityList() {
    await fetchData('/db/subtask/priority', setPriorityList)
  }


  async function getStatusList() {
    await fetchData('/db/subtask/status', setStatusList)
  }

  async function getUsersList() {
    await fetchData('/db/users', setusersList)

  }

  
  async function getLeadsList() {
    await fetchData('/db/leads', setLeadsList)
  }

  async function getOpportunityList() {
    await fetchData('/db/opportunity', setOpportunityList)
  }


  const minDate = new Date().toISOString().slice(0, 10);

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
          m_id: 13,
        },
      };

      if (userInfo.lead_id !== null) {
        delete userInfo.link_with_opportunity;
      } else if (userInfo.link_with_opportunity !== null) {
        delete userInfo.lead_id;
      }


      try {
        const response = await axios.post(Baseurl + `/db/tasks`, userInfo, header);
        if (response.status === 204 || response.status === 200) {
          toast.success("Task Created Successfully");
          setisLoading(false)
          router.push('/TaskScreen')
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

  const updateHandler = async () => {
    if (hasCookie("token")) {
      setisLoading(true)
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

      if (userInfo.lead_id !== null) {
        delete userInfo.link_with_opportunity;
      } else if (userInfo.link_with_opportunity !== null) {
        delete userInfo.lead_id;
      }
      try {
        const response = await axios.put(
          Baseurl + `/db/tasks`,
          userInfo,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push("/TaskScreen");

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

  const getSingleData = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 15
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/tasks?t_id=${id}`,
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


  useEffect(() => {

    getPriorityList();
    getStatusList();
    getLeadsList();
    getUsersList();
    getOpportunityList();
    setUserInfo({
      ...userInfo,
      createdAt: DateNow,
      updatedAt: DateNow,
      task_type: "lead task",
    })
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      getSingleData(id);
    }
    if (router.query.vw) [
      setViewMode(true)
    ]
  }, [router.isReady, id]);

  return (
    <div className={`main_Box  ${sideView}`}>
      <div className="bread_head">
        <h3 className="content_head"> {viewMode ? 'VIEW' : <>{editMode ? "EDIT" : "ADD"}</>} TASK</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/TaskScreen"> Tasks List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? 'View' : <>{editMode ? "Edit" : "Add"}</>} Task
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="row">
          <div className="Add_user_screen">
            <div className="add_screen_head">
              <span className="text_bold">Fill Details</span> ( * Fields are mandatory)
            </div>
            <div className="add_user_form">
              <div className="row">
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.task_name ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Name *</label>
                    <input
                      type="text"
                      placeholder="Enter Task Name"
                      name="task_name"
                      disabled={viewMode}
                      id="task_name"
                      className={errorData?.task_name ? 'form-control is-invalid' : 'form-control'}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, task_name: e.target.value })
                        setErrorData({ ...errorData, task_name: '' })
                      }}
                      value={userInfo.task_name ? userInfo.task_name : ""} />
                    <span className="errorText"> {errorData?.task_name ? errorData.task_name : ''}</span>
                  </div>
                </div>
                {/* <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.task_status_id ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_status">Status *</label>
                    <select
                      
                      
                      className={errorData?.task_status_id ? 'form-control is-invalid' : 'form-control'}
                      name="task_status"
                      id="task_status"
                      disabled={viewMode}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, task_status_id: e.target.value })
                        setErrorData({ ...errorData, task_status_id: '' })
                      }}
                      value={userInfo.task_status_id ? userInfo.task_status_id : ""}  >
                      <option value="">Select Task Status</option>
                      {statusList?.map((data, index) => {
                        return (
                          <option key={index} value={data.task_status_id}>
                            {data.task_status_name}
                          </option>
                        );
                      })}
                    </select>
                    <span className="errorText"> {errorData?.task_status_id ? errorData.task_status_id : ''}</span>
                  </div>
                </div> */}




                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.task_status_id ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Status *</label>
                    <Select
                      id={userInfo.task_status_id}
                      defaultValue={""}
                      isDisabled={viewMode}
                      options={statusList?.map((data, index) => {
                        return {
                          value: data?.task_status_id,
                          label: data?.task_status_name,

                        }
                      })}
                      value={statusList?.map((data, index) => {
                        if (userInfo.task_status_id === data.task_status_id) {
                          return {
                            value: data?.task_status_id,
                            label: data?.task_status_name,

                          }
                        }
                      })}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, task_status_id: e.value })
                        setErrorData({ ...errorData, task_status_id: '' })
                      }}
                    />
                    <span className="errorText"> {errorData?.task_status_id ? errorData.task_status_id : ''}</span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.task_priority_id ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Priority *</label>
                    <Select
                      id={userInfo.task_priority_id}
                      defaultValue={""}
                      isDisabled={viewMode}
                      options={priorityList?.map((data, index) => {
                        return {
                          value: data?.task_priority_id,
                          label: data?.task_priority_name,

                        }
                      })}
                      value={priorityList?.map((data, index) => {
                        if (userInfo.task_priority_id === data.task_priority_id) {
                          return {
                            value: data?.task_priority_id,
                            label: data?.task_priority_name,

                          }
                        }
                      })}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, task_priority_id: e.value })
                        setErrorData({ ...errorData, task_priority_id: '' })
                      }}
                    />
                    <span className="errorText"> {errorData?.task_priority_id ? errorData.task_priority_id : ''}</span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.due_date ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="due_date">Due date *</label>
                    <input
                      type="date"
                      name="due_date"
                      id="due_date"
                      disabled={viewMode}
                      min={minDate}
                      className={errorData?.due_date ? 'form-control is-invalid' : 'form-control'}
                      onChange={(e) => {
                        setUserInfo({ ...userInfo, due_date: e.target.value })
                        setErrorData({ ...errorData, due_date: '' })
                      }}
                      value={userInfo.due_date ? moment(userInfo.due_date).format("YYYY-MM-DD") : ""}
                    />
                    <span className="errorText"> {errorData?.due_date ? errorData.due_date : ''}</span>
                  </div>
                </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="Saluation">Task Type</label>
                    <select
                      name="selectInter"
                      id="selectInter"
                      className="form-control"
                      disabled={viewMode}
                      onChange={(e) => setUserInfo({ ...userInfo, task_type: e.target.value })
                      }
                      value={userInfo.task_type ? userInfo.task_type : ""} >
                      <option>Select Task Type </option>
                      <option value='lead task'>Lead Task</option>
                      <option value='opportunity task'>Opportunity Task</option>
                    </select>
                  </div>
                </div>

                {userInfo.task_type == 'lead task' ?
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.lead_id ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name">Link with Leads *</label>
                      <Select
                        id={userInfo.lead_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={leadsList?.map((data, index) => {
                          return {
                            value: data?.lead_id,
                            label: data?.lead_name,

                          }
                        })}
                        value={leadsList?.map((data, index) => {
                          if (userInfo.lead_id === data.lead_id) {
                            return {
                              value: data?.lead_id,
                              label: data?.lead_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, lead_id: e.value, link_with_opportunity: null })
                          setErrorData({ ...errorData, lead_id: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.lead_id ? errorData.lead_id : ''}</span>
                    </div>
                  </div>
                  :
                  <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                    <div className={errorData?.opp_id ? 'input_box errorBox' : 'input_box'}>
                      <label htmlFor="task_name"> Link with Opportunity *</label>
                      <Select
                        id={userInfo.opp_id}
                        defaultValue={""}
                        isDisabled={viewMode}
                        options={opportunityList?.map((data, index) => {
                          return {
                            value: data?.opp_id,
                            label: data?.opp_name,

                          }
                        })}
                        value={opportunityList?.map((data, index) => {
                          if (userInfo.link_with_opportunity === data.opp_id) {
                            return {
                              value: data?.opp_id,
                              label: data?.opp_name,

                            }
                          }
                        })}
                        onChange={(e) => {
                          setUserInfo({ ...userInfo, link_with_opportunity: e.value, lead_id: null })
                          setErrorData({ ...errorData, link_with_opportunity: '' })
                        }}
                      />
                      <span className="errorText"> {errorData?.link_with_opportunity ? errorData.link_with_opportunity : ''}</span>
                    </div>
                  </div>

                }



                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className={errorData?.assigned_to ? 'input_box errorBox' : 'input_box'}>
                    <label htmlFor="task_name">Assign to *</label>
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


                
              </div>
              <div className="row">
                <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="task_desc">Description</label>
                    <textarea
                      name="task_desc"
                      id="task_desc"
                      placeholder="Enter Description...."
                      rows="3"
                      disabled={viewMode}
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          description: e.target.value,
                        })
                      }
                      value={userInfo.description ? userInfo.description : ""}
                    ></textarea>
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
                      placeholder="Enter Email Id"
                      name="email"
                      disabled
                      id="email"
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          createdAt: e.target.value,
                        })
                      }
                      value={userInfo.createdAt ? moment(userInfo.createdAt).format("YYYY-MM-DD") : ""}
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="per_cont">Last Modified On</label>
                    <input
                      type="date"
                      placeholder="Enter Contact no."
                      name="per_cont"
                      id="per_cont"
                      disabled
                      className="form-control"
                      onChange={(e) =>
                        setUserInfo({
                          ...userInfo,
                          updatedAt: e.target.value,
                        })
                      }

                      value={userInfo.updatedAt ? moment(userInfo.updatedAt).format("YYYY-MM-DD") : ""}
                    />
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="submit_btn">
                  {viewMode ? null : <>
                    <Link href='/TaskScreen'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
                    {editMode ? (
                      <button disabled={isLoading} className="btn btn-primary" onClick={updateHandler}>
                        {isLoading ? 'Loading...' : 'Update'} </button>
                    ) : (
                      <button
                        disabled={isLoading}
                        className="btn btn-primary"
                        onClick={submitHandler}
                      >
                        {isLoading ? 'Loading...' : 'Save & Submit'}
                      </button>
                    )}</>}


                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddTaskScreen;
