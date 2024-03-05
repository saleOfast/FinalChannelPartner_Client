import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import { fetchData } from "../../Utils/getReq";
import Select from "react-select";

const AddEventScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [priorityList, setPriorityList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [viewMode, setViewMode] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [errorData, setErrorData] = useState({})
  const [opportunityList, setOpportunityList] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  const [errorToast, setErrorToast] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    call_subject: "",
    comments: "",
    relate_to: "",
    contact_person_name: "",
    event_date: "",
    event_type: ""
  });

  const DateNow = moment(new Date().toISOString()).format("YYYY-MM-DD");

  async function getOpportunityList() {
    await fetchData('/db/opportunity', setOpportunityList, errorToast, setErrorToast)
  }

  async function getLeadsList() {
    await fetchData('/db/leads', setLeadsList, errorToast, setErrorToast)
  }

  const minDate = new Date().toISOString().slice(0, 10);

  const callLogSubmit = async () => {

    if (hasCookie("token")) {
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 13
        },
      };

      if (contactInfo.lead_id !== null) {
        delete contactInfo.link_with_opportunity;
      } else if (contactInfo.link_with_opportunity !== null) {
        delete contactInfo.lead_id;
      }

      let reqOptions = { ...contactInfo }



      try {
        const response = await axios.post(Baseurl + `/db/leads/calls`, reqOptions, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setisLoading(false)
          router.push('/EventScreen')
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
          m_id: 13
        },
      };

      if (contactInfo.lead_id !== null) {
        delete contactInfo.link_with_opportunity;
      } else if (contactInfo.link_with_opportunity !== null) {
        delete contactInfo.lead_id;
      }
      let reqOptions = { ...contactInfo }

      try {
        const response = await axios.put(Baseurl + `/db/leads/single?event_id=${router.query.id}`, reqOptions, header);
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message)
          setisLoading(false)
          router.push('/EventScreen')
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
          Baseurl + `/db/leads/single?event_id=${id}`,
          header
        );
        setContactInfo(response.data.data)
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
    getLeadsList();
    getOpportunityList();
    setContactInfo({
      ...contactInfo,
      createdAt: DateNow,
      updatedAt: DateNow,
      event_type: "lead event"
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
        <h3 className="content_head">
          {viewMode ? 'VIEW' : <>
            {editMode ? "EDIT" : "ADD"}
          </>} EVENT</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              {" "}
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/EventScreen"> Event List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? 'View' : <> {editMode ? "Edit" : "Add"}</>}  Event
            </li>
          </ol>
        </nav>
      </div>
      <div className="main_content">
        <div className="Add_user_screen">
          <div className="add_screen_head">
            <span className="text_bold">Fill Details</span> ( * Fields are
            mandatory)
          </div>
          <div className="row add_user_form" >

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                <label htmlFor="Saluation">Event Type</label>
                <select
                  name="selectInter"
                  id="selectInter"
                  className="form-control"
                  disabled={viewMode}
                  onChange={(e) => setContactInfo({ ...contactInfo, event_type: e.target.value })
                  }
                  value={contactInfo.event_type ? contactInfo.event_type : ""} >
                  <option>Select Event Type </option>
                  <option value='lead event'>Lead Type </option>
                  <option value='opportunity event'>Opportunity Type</option>
                </select>
              </div>
            </div>

            {contactInfo.event_type == "lead event" ?

              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.lead_id ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="task_name">Select Leads</label>
                  <Select
                    id={contactInfo.lead_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                    options={leadsList?.map((data, index) => {
                      return {
                        value: data?.lead_id,
                        label: data?.lead_name,

                      }
                    })}
                    value={leadsList?.map((data, index) => {
                      if (contactInfo.lead_id === data.lead_id) {
                        return {
                          value: data?.lead_id,
                          label: data?.lead_name,

                        }
                      }
                    })}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, lead_id: e.value , link_with_opportunity: null })
                      setErrorData({ ...errorData, lead_id: "" })
                    }}
                  />
                  <span className="errorText"> {errorData?.lead_id ? errorData.lead_id : ''}</span>
                </div>
              </div>
              :
              <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                <div className={errorData?.lead_id ? 'input_box errorBox' : 'input_box'}>
                  <label htmlFor="task_name">Select Opportunity</label>
                  <Select
                    id={contactInfo.lead_id}
                    defaultValue={""}
                    isDisabled={viewMode}
                    options={opportunityList?.map((data, index) => {
                      return {
                        value: data?.opp_id,
                        label: data?.opp_name,

                      }
                    })}
                    value={opportunityList?.map((data, index) => {
                      if (contactInfo.link_with_opportunity === data.opp_id) {
                        return {
                          value: data?.opp_id,
                          label: data?.opp_name,

                        }
                      }
                    })}
                    onChange={(e) => {
                      setContactInfo({ ...contactInfo, link_with_opportunity: e.value , lead_id: null })
                      setErrorData({ ...errorData, link_with_opportunity: '' })
                    }}
                  />
                  <span className="errorText"> {errorData?.link_with_opportunity ? errorData.link_with_opportunity : ''}</span>
                </div>
              </div>


            }

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className={errorData?.call_subject ? 'input_box errorBox' : 'input_box'}>
                <label htmlFor="task_sub">Subject *</label>
                <input
                  type="text"
                  placeholder="Enter Subject"
                  name="task_sub"
                  id="task_sub"
                  disabled={viewMode}
                  className={errorData?.call_subject ? 'form-control is-invalid' : 'form-control'}
                  onChange={(e) => {
                    setContactInfo({
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

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                <label htmlFor="contact_person_name">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Name"
                  disabled={viewMode}
                  name="contact_person_name"
                  id="contact_person_name"
                  className="form-control"
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      contact_person_name: e.target.value,
                    })
                  }
                  value={contactInfo.contact_person_name ? contactInfo.contact_person_name : ''}
                />
              </div>
            </div>
            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                <label htmlFor="relate_to">Related To</label>
                <input
                  type="text"
                  placeholder="Related To"
                  name="relate_to"
                  disabled={viewMode}
                  id="relate_to"
                  className="form-control"
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      relate_to: e.target.value,
                    })
                  }
                  value={contactInfo.relate_to ? contactInfo.relate_to : ''}
                />
              </div>
            </div>

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                <label htmlFor="due_date">Event Date *</label>
                <input
                  type="date"
                  placeholder="Select Date"
                  name="due_date"
                  disabled={viewMode}
                  min={minDate}
                  id="due_date"
                  className={errorData?.event_date ? 'form-control is-invalid' : 'form-control'}
                  onChange={(e) => {
                    setContactInfo({
                      ...contactInfo,
                      event_date: e.target.value,
                    })
                    setErrorData({ ...errorData, event_date: "" })
                  }}
                  value={contactInfo?.event_date ? moment(contactInfo?.event_date).format("YYYY-MM-DD") : ''}
                />
                <span className="errorText"> {errorData?.event_date ? errorData.event_date : ''}</span>
              </div>
            </div>

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
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

            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
              <div className="input_box">
                <label htmlFor="call_comments">Comments</label>
                <textarea
                  placeholder="Enter Comment"
                  name="call_comments"
                  id="call_comments"
                  disabled={viewMode}
                  rows="2"
                  className="form-control"
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      comments: e.target.value,
                    })
                  }
                  value={contactInfo.comments ? contactInfo.comments : ''}
                ></textarea>
              </div>
            </div>

            <div className="btn-box text-end mt-4">
              {/*  <Link href='/EventScreen'>
                <button className="btn btn-cancel me-3"> Back   </button>
              </Link> */}

              {viewMode ? <>
                <Link href={`/AddEvent/?id=${router.query.id}`}>
                  <button className="btn btn-primary" onClick={() => setViewMode(!viewMode)}>
                    Edit Event
                  </button>
                </Link>
              </> : <>
                <Link href='/EventScreen'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
                {editMode ? <button disabled={isLoading} className="btn btn-primary" onClick={updateHandler}>
                  {isLoading ? 'Loading...' : 'Update'}
                </button> : <button disabled={isLoading} className="btn btn-primary" onClick={callLogSubmit}>
                  {isLoading ? 'Loading...' : 'Save & Submit'}
                </button>}
              </>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventScreen;
