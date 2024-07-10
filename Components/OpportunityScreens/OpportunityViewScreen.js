
import React, { useEffect, useState } from "react";

import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import moment from "moment";
import OpportunityDetailComponent from "./OpportunityDetailComponent";
import { useSelector } from "react-redux";
import { fetchData } from "../../Utils/getReq";
import Select from 'react-select';


const OpportunityViewScreen = () => {
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
  const [productList, setProductList] = useState([])
  const [errorToast, setErrorToast] = useState(false)
  const [userInfo, setUserInfo] = useState({
    task_name: "",
    due_date: "",
    lead_id: "",
    contact_person_name: "",
    related_to: "",
  });
  const [formValues, setFormValues] = useState(
    [{ p_id: null, qty: 0, price: 0 }])

  const [contactInfo, seContactInfo] = useState({
    call_subject: "",
    comments: "",
    relate_to: "",
    contact_person_name: "",
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
          m_id: 28
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/opportunity?o_id=${id}`,
          header,
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

  console.log(dataList)

  const getCallsInLead = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
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
    if (userInfo.task_name == "") {
      toast.error("Please enter the Task Name");
    } else if (userInfo.due_date == "") {
      toast.error("Please enter the due date");
    } else if (userInfo.assigned_to == "") {
      toast.error("Please select the user");
    } else if (userInfo.contact_person_name == "") {
      toast.error("Please enter the contact Person Name");
    } else if (userInfo.related_to == "") {
      toast.error("Please enter the related person Name ");
    } else {
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
            toast.success("Task Created Successfully");
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
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  };

  const callLogSubmit = async () => {
    if (contactInfo.call_subject == "") {
      toast.error("Please enter the subject");
    } else if (contactInfo.comments == "") {
      toast.error("Please enter the Comments");
    } else if (contactInfo.relate_to == "") {
      toast.error("Please enter related person");
    } else {
      if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");
        let reqOptions = { ...contactInfo, lead_id: router.query.id }
        let header = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer ".concat(token),
            db: db_name,
            m_id: 236
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
          if (error?.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Something went wrong!");
          }
        }
      }
    }
  };

  const getProductData = async (id) => {
    if (hasCookie("token")) {
        let token = getCookie("token");
        let db_name = getCookie("db_name");

        let header = {
            headers: {
                Accept: "application/json",
                Authorization: "Bearer ".concat(token),
                db: db_name,
                m_id: 36,
            },
        };

        try {
            const response = await axios.get(
                Baseurl + `/db/oppro?opp_id=${id}`,
                header
            );
            setFormValues(response.data.data);
        } catch (error) {
            if (error?.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Something went wrong!");
            }
        }
    }
};

const getProductList = async () => {
  await fetchData(`/db/product`, setProductList, errorToast, setErrorToast)
}

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.id) {
      setUserInfo({ ...userInfo, lead_id: router.query.id });
      getDataList(id);
      getTaskInLead(id);
      getCallsInLead(id)
      getProductData(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, id]);

  useEffect(() => {
    getUserList();
    getProductList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <h3 className="content_head">View Opportunity</h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item fw-bolder">
                <Link href="/crm">Home </Link>
              </li>
              <li className="breadcrumb-item fw-bolder">
                <Link href="/crm/Opportunity">Manage Opportunity </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Opportunity
              </li>
            </ol>
          </nav>
        </div>
        <div className="main_content">
          <div className="lead_box">
            <div className="row">
              <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                <div className="lead-info ">
                  <div className="header">Opportunity Information</div>
                  <div className="main_content">
                    <div className="Add_user_screen">
                      <div className="add_user_form">
                        <div className="row">
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel"> Name</label>
                              <input
                                className='form-control'
                                value={dataList?.opp_name}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Owner</label>
                              <input
                                className='form-control'
                                value={dataList?.oppOwner?.user}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Account Name</label>
                              <input
                                className='form-control'
                                value={dataList?.accName?.acc_name}
                                disabled
                              />
                            </div>
                          </div>


                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Close Date </label>
                              <input
                                className='form-control'
                                value={moment(dataList?.close_date).format("DD-MM-YYYY LT")}
                                disabled
                              />
                            </div>
                          </div>


                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Stage </label>
                              <input
                                className='form-control'
                                value={dataList?.db_opportunity_stg?.opportunity_stg_name}
                                disabled
                              />
                            </div>
                          </div>

                          {
                                dataList?.close_lost_reason && dataList?.db_opportunity_stg?.opportunity_stg_name==="Closed Lost" && (
                                  <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                  <div className='input_box'>
                                    <label htmlFor="profilelevel">Closed Lost Reason </label>
                                    <input
                                      className='form-control'
                                      value={dataList?.close_lost_reason}
                                      disabled
                                    />
                                  </div>
                                </div>
                                )
                            }

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Type</label>
                              <input
                                className='form-control'
                                value={dataList?.db_opportunity_type?.opportunity_type_name}
                                disabled
                              />
                            </div>
                          </div>


                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Amount </label>
                              <input
                                className='form-control'
                                value={dataList?.amount}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Assign To </label>
                              <input
                                className='form-control'
                                value={dataList?.assignedOpp?.user}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Lead Source</label>
                              <input
                                className='form-control'
                                value={dataList?.db_lead_source?.source}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Description</label>
                              <input
                                className='form-control'
                                value={dataList?.desc}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Created On</label>
                              <input
                                className='form-control'
                                type="datetime-local"
                                value={moment(dataList?.created_on).format("YYYY-MM-DDTHH:mm")}
                                disabled
                              />
                            </div>
                          </div>
                          <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                            <div className='input_box'>
                              <label htmlFor="profilelevel">Last Modified On</label>
                              <input
                                className='form-control'
                                type="datetime-local"
                                value={moment(dataList?.updated_on).format("YYYY-MM-DDTHH:mm")}
                                disabled
                              />
                            </div>
                            
                           
                          </div>
                          
                          {
                            formValues?.length>0 ?
                            (
                              <div className="mt-2"  >
                           <span className="text_bold cursor-pointer">Product Or Services</span>
                          </div>
                            ) : ""
                          }
                          
                          {formValues?.map((data, index) => {
                                return <div className="row mt-2" key={index} >

                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <div className={'input_box'}>
                                            <label htmlFor="task_name">Product of Services </label>
                                            <Select
                                                name="p_id"
                                                isDisabled={true}
                                                id={userInfo.p_id}
                                                defaultValue={""}
                                                options={productList?.map((data, i) => {
                                                    return {
                                                        value: data?.p_id,
                                                        label: data?.p_name,
                                                        name: "p_id"
                                                    }
                                                })}
                                                value={productList?.map((pData, i) => {
                                                    if (pData.p_id === data.p_id)  {
                                                        return {
                                                            value: pData?.p_id,
                                                            label: pData?.p_name,
                                                            name: "p_id"
                                                            
                                                        }
                                                    }
                                                })}
                                                onChange={(e) => {handleChange(e, index, 1, "p_id")}}
                                            />
                                            
                                        </div>
                                    </div>
                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="qty">Quantity </label>
                                            <input
                                                disabled
                                                type="number"
                                                placeholder="Enter Quantity"
                                                name="qty"
                                                min="1"
                                                id="qty"
                                                className="form-control"
                                                onChange={e => handleChange(e, index, 2,  "qty")}
                                                value={data?.qty ? data.qty : ''}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="price">Price </label>
                                            <input
                                                type="number"
                                                disabled
                                                placeholder="Enter price"
                                                name="price"
                                                id="price"
                                                className="form-control"
                                                onChange={e => handleChange(e, index,"price")}
                                                value={data?.price ? data.price : ''}
                                            />
                                        </div>
                                    </div>

                                    
                                </div>
                            })}


                            

        {/* <div className="row"> */}
                      {dataList?.db_opportunity_fields?.map(({ option, field_name, field_lable, field_type, input_type, input_value }, ind) => (
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
                                 disabled
                                onChange={(e) => updateFieldInfo(e, ind)}
                                //value={userInfo.field_name ? userInfo.field_name : ""}
                                checked={input_value == "1" ? true: false}
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
                                disabled
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
                    {/* </div> */}



                          
                        </div>
                      </div>
                    </div>
                  </div>
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
                        Log a Call
                      </li>
                    </ul>
                    {sideTab === "task" ? (
                      <div className="add_user_form">
                        <div className="row">
                          <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor="task_sub">Subject</label>
                              <input
                                type="text"
                                placeholder="Enter Subject"
                                name="task_sub"
                                id="task_sub"
                                className="form-control"
                                onChange={(e) =>
                                  setUserInfo({ ...userInfo, task_name: e.target.value })}
                                value={userInfo.task_name ? userInfo.task_name : ""} />
                            </div>
                          </div>
                          <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor="due_date">Due Date</label>
                              <input
                                type="datetime-local"
                                placeholder="Select Date"
                                name="due_date"
                                min={minDate}
                                id="due_date"
                                className="form-control"
                                onChange={(e) =>
                                  setUserInfo({
                                    ...userInfo,
                                    due_date: e.target.value,
                                  })
                                }
                                value={
                                  userInfo.due_date ? userInfo.due_date : ""} />
                            </div>
                          </div>
                          <div className="col-xl-6 col-md-6 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor="subject">Assign To</label>
                              <select
                                name="cont_person"
                                id="cont_person"
                                className="form-control"
                                onChange={(e) =>
                                  setUserInfo({
                                    ...userInfo,
                                    assigned_to: e.target.value,
                                  })
                                }
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
                            <div className="input_box">
                              <label htmlFor="task_sub">Subject</label>
                              <input
                                type="text"
                                placeholder="Enter Subject"
                                name="task_sub"
                                id="task_sub"
                                className="form-control"
                                onChange={(e) =>
                                  seContactInfo({
                                    ...contactInfo,
                                    call_subject: e.target.value,
                                  })
                                }
                                value={contactInfo.call_subject ? contactInfo.call_subject : ''}
                              />
                            </div>
                          </div>
                          <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                            <div className="input_box">
                              <label htmlFor="call_comments">Comments</label>
                              <textarea
                                placeholder="Enter Subject"
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
                              <label htmlFor="subject">Assign To</label>
                              <select
                                name="cont_person"
                                id="cont_person"
                                className="form-control"
                                onChange={(e) =>
                                  setUserInfo({
                                    ...userInfo,
                                    assigned_to: e.target.value,
                                  })
                                }
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
                        Call Logs
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

                  <div className="col-xl-12 col-md-12 col-sm-12 col-12 sideCardAdd">
                            <div className="opertunity_box">
                                <div className="task_card mb-4">
                                    <div className="task_head">Quotations List</div>
                                    <div className="tasks_details">
                                        <ul className="tasks_list">
                                            {dataList?.quatOpportunityList?.map(({ quat_mast_id, quat_code  }, i) => {
                                                return (
                                                    <li key={quat_mast_id} className="list-item">
                                                        <div className="opp_box">
                                                            <Link href={`/crm/QuotationView?id=${quat_mast_id}`}>
                                                                <div className="name">{quat_code}</div>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="card_footer">
                                        <Link href='/crm/Quotations'>
                                            <div className="text_more">view more</div>
                                        </Link>
                                    </div>
                                </div>
                                </div>
                                </div>
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12 sideCardAdd">
                            <div className="opertunity_box">
                                <div className="task_card mb-4">
                                    <div className="task_head">Lead List</div>
                                    <div className="tasks_details">
                                        <ul className="tasks_list">
                                            {dataList?.db_leads?.map(({ lead_id, lead_name  }, i) => {
                                                return (
                                                    <li key={lead_id} className="list-item">
                                                        <div className="opp_box">
                                                            <Link href={`/crm/LeadsView?id=${lead_id}`}>
                                                                <div className="name">{lead_name}</div>
                                                            </Link>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                    <div className="card_footer">
                                        <Link href='/crm/ManageLeads'>
                                            <div className="text_more">view more</div>
                                        </Link>
                                    </div>
                                </div>
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

export default OpportunityViewScreen;