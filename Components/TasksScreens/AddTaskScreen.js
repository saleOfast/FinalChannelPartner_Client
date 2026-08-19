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

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DDTHH:mm");

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

  const extractTask = (response) => {
    const payload = response?.data?.data ?? response?.data;
    if (Array.isArray(payload)) return payload[0] || {};
    if (!payload || typeof payload !== "object") return {};
    if (payload.task_id || payload.task_name) return payload;
    const nested =
      payload.task ||
      payload.taskData ||
      payload.rows ||
      payload.data;
    if (Array.isArray(nested)) return nested[0] || {};
    if (nested && typeof nested === "object") return nested;
    return payload;
  }

  const toValidId = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }

  const getTaskId = (task = userInfo) => {
    return toValidId(task?.task_id || task?.t_id || router.query.id || id);
  }

  const extractList = (value) => {
    if (Array.isArray(value)) return value;
    if (!value || typeof value !== "object") return [];
    const nested = value.rows || value.data || value.list || value.leads || value.opportunities;
    return Array.isArray(nested) ? nested : [];
  }

  const resolveLeadId = (task = userInfo, oppList = opportunityList) => {
    const direct = toValidId(task?.lead_id)
      || toValidId(task?.db_lead?.lead_id)
      || toValidId(task?.db_leads?.[0]?.lead_id);
    if (direct) return direct;

    const oppId = toValidId(task?.link_with_opportunity || task?.linkWithOpportunity?.opp_id);
    const opportunities = extractList(oppList);
    const opp = opportunities.find((item) => toValidId(item?.opp_id) === oppId);
    return toValidId(opp?.lead_id)
      || toValidId(opp?.db_lead?.lead_id)
      || toValidId(opp?.db_leads?.[0]?.lead_id)
      || null;
  }

  const fetchLeadFromOpportunity = async (oppId) => {
    if (!oppId || !hasCookie("token")) return null;
    try {
      const response = await axios.get(Baseurl + `/db/opportunity?o_id=${oppId}`, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(getCookie("token")),
          db: getCookie("db_name"),
          pass: "pass",
        },
      });
      const opp = extractTask(response);
      return toValidId(opp?.lead_id)
        || toValidId(opp?.db_lead?.lead_id)
        || toValidId(opp?.db_leads?.[0]?.lead_id)
        || toValidId(opp?.lead?.lead_id);
    } catch (error) {
      return null;
    }
  }

  const buildTaskPayload = (includeId = false, leadIdOverride = null) => {
    const payload = {
      task_name: userInfo.task_name || null,
      task_status_id: userInfo.task_status_id || null,
      task_priority_id: userInfo.task_priority_id || null,
      due_date: userInfo.due_date || null,
      task_type: userInfo.task_type || null,
      assigned_to: userInfo.assigned_to || null,
      description: userInfo.description || null,
    };

    if (includeId) {
      payload.task_id = getTaskId();
    }

    const oppId = toValidId(userInfo.link_with_opportunity || userInfo.linkWithOpportunity?.opp_id);
    const leadId = toValidId(leadIdOverride) || resolveLeadId();

    if (leadId) {
      payload.lead_id = leadId;
    }
    if (userInfo.task_type === "opportunity task" || oppId) {
      if (oppId) payload.link_with_opportunity = oppId;
    }

    return payload;
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
          m_id: 13,
        },
      };

      try {
        const response = await axios.post(Baseurl + `/db/tasks`, buildTaskPayload(false), header);
        if (response.status === 204 || response.status === 200) {
          toast.success("Task Created Successfully");
          setisLoading(false)
          router.push('/crm/TaskScreen')
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

      let payload = buildTaskPayload(true);
      if (!payload.task_id) {
        setisLoading(false);
        toast.error("Task id missing. Please open the task again from the list.");
        return;
      }
      if (!payload.lead_id) {
        const oppId = toValidId(userInfo.link_with_opportunity);
        const leadFromOpp = await fetchLeadFromOpportunity(oppId);
        const fallbackLead = toValidId(extractList(leadsList)[0]?.lead_id);
        payload = buildTaskPayload(true, leadFromOpp || fallbackLead);
      }
      if (!payload.lead_id) {
        setisLoading(false);
        toast.error("Please choose a lead. Backend requires a valid lead id for task update.");
        return;
      }
      try {
        const response = await axios.put(
          Baseurl + `/db/tasks`,
          payload,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push("/crm/TaskScreen");

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
        const respData = extractTask(response);
        const createdAt = respData?.createdAt
          ? moment(respData.createdAt).subtract(5, 'hours').subtract(30, 'minutes').format("YYYY-MM-DDTHH:mm")
          : DateNow;
        setUserInfo({
          ...respData,
          task_id: toValidId(respData?.task_id || respData?.t_id || id),
          lead_id: toValidId(respData?.lead_id || respData?.db_lead?.lead_id || respData?.db_leads?.[0]?.lead_id),
          link_with_opportunity: toValidId(
            respData?.link_with_opportunity || respData?.linkWithOpportunity?.opp_id
          ),
          createdAt,
        });
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
    if (!router.query.id) {
      setUserInfo((prev) => ({
        ...prev,
        createdAt: prev.createdAt || DateNow,
        updatedAt: prev.updatedAt || DateNow,
        task_type: prev.task_type || "lead task",
      }));
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setEditMode(true);
      setUserInfo((prev) => ({
        ...prev,
        task_id: Number(router.query.id),
      }));
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
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/crm">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/crm/TaskScreen"> Tasks List </Link>
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
                      onPaste={(e) => e.preventDefault()}
                      onKeyDown={(e) => e.preventDefault()}
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
                          const selectedOpp = (Array.isArray(opportunityList) ? opportunityList : [])
                            .find((item) => String(item?.opp_id) === String(e.value));
                          setUserInfo({
                            ...userInfo,
                            link_with_opportunity: e.value,
                            lead_id: toValidId(selectedOpp?.lead_id || selectedOpp?.db_lead?.lead_id || userInfo.lead_id),
                          })
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
                      type="datetime-local"
                      placeholder="Created On"
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
                      value={userInfo.createdAt ? moment(userInfo.createdAt).format("YYYY-MM-DDTHH:mm") : ""}
                      
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                  <div className="input_box">
                    <label htmlFor="per_cont">Last Modified On</label>
                    <input
                      type="datetime-local"
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

                      value={userInfo.updatedAt ? moment(userInfo.updatedAt).format("YYYY-MM-DDTHH:mm") : ""}
                    />
                  </div>
                </div>
              </div>
              <div className="text-end">
                <div className="submit_btn">
                  {viewMode ? null : <>
                    <Link href='/crm/TaskScreen'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
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
