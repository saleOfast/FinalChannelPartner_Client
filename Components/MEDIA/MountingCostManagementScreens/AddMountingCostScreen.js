import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import Select from 'react-select';

const AddMountingCostScreen = () => {
  const sideView = useSelector((state) => state.sideView.value);

  const router = useRouter();
  const { id } = router.query;
  const [accountList,setAccountList]=useState([]);
  const [priorityList, setPriorityList] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [usersList, setusersList] = useState([]);
  const [opportunityList, setOpportunityList] = useState([]);
  const [isLoading, setisLoading] = useState(false)
  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [errorToast, setErrorToast] = useState(false);
  const [mediaTypes,setMediaTypes]=useState([])
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
      toast.error(error?.response?.data?.message || 'Something went wrong!');
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


  const getAccountList = async () => {
    await fetchData(
      `/db/account`,
      setAccountList,
      errorToast,
      setErrorData
    );
  };

  const getMediaTypes = async () => {
    await fetchData(
      `/db/media/mediaType/getMediaType`,
      setMediaTypes,
      errorToast,
      setErrorData
    );
  };
  
  async function getLeadsList() {
    await fetchData('/db/media/mountingCost/getMountingCost', setLeadsList)
  }

  async function getOpportunityList() {
    await fetchData('/db/opportunity', setOpportunityList)
  }


  const minDate = new Date().toISOString().slice(0, 10);


  const validateFields = () => {
    let isValid = true;
    const newErrorData = {};

    if (!userInfo.acc_id) {
      newErrorData.acc_id = "Account Name is required";
      isValid = false;
    }
    if (!userInfo.m_t_id) {
      newErrorData.m_t_id = "Media Type is required";
      isValid = false;
    }
    if (!userInfo.mo_c_cost) {
      newErrorData.mo_c_cost = "Mounting Cost/Sq. Ft. is required";
      isValid = false;
    }

    setErrorData(newErrorData);
    return isValid;
  };
  const submitHandler = async () => {
    if (hasCookie("token")) {
      if (!validateFields()) return;
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 383,
        },
      };

      // if (userInfo.lead_id !== null) {
      //   delete userInfo.link_with_opportunity;
      // } else if (userInfo.link_with_opportunity !== null) {
      //   delete userInfo.lead_id;
      // }


      try {
        const response = await axios.post(Baseurl + `/db/media/mountingCost/addMountingCost`, userInfo, header);
        if (response.status === 204 || response.status === 200) {
          toast.success("Mounting Cost Created Successfully");
          setisLoading(false)
          router.push('MountingCostManagement/')
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
      if (!validateFields()) return;
      setisLoading(true)
      let token = getCookie("token");
      let db_name = getCookie("db_name");
      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          m_id: 385,
        },
      };
      let userInfoCopy = { ...userInfo };
      delete userInfoCopy.status;

      if (userInfo.lead_id !== null) {
        delete userInfoCopy.link_with_opportunity;
      } else if (userInfo.link_with_opportunity !== null) {
        delete userInfoCopy.lead_id;
      }
   
      try {
        const response = await axios.put(
          Baseurl + `/db/media/mountingCost/updateMountingCost`,
          userInfoCopy,
          header
        );
        if (response.status === 204 || response.status === 200) {
          toast.success(response.data.message);
          setisLoading(false)
          router.push("MountingCostManagement/");

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
          m_id: 384
        },
      };
      try {
        const response = await axios.get(
          Baseurl + `/db/media/mountingCost/getMountingCost/?mo_c_id=${id}`,
          header
        );
        let respData={...response.data.data}
        respData={...respData,createdAt:moment(respData.createdAt).subtract(5, 'hours').subtract(30, 'minutes').format("YYYY-MM-DDTHH:mm")}
        setUserInfo(respData);
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
    getAccountList();
    getMediaTypes();
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
        <h3 className="content_head"> {viewMode ? 'VIEW' : <>{editMode ? "EDIT" : "ADD"}</>} Mounting Cost</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item fw-bolder">
              {" "}
              <Link href="/media">Home</Link>
            </li>
            <li className="breadcrumb-item fw-bolder">
              <Link href="/media/MountingCostManagement"> Mounting Cost List </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {viewMode ? 'View' : <>{editMode ? "Edit" : "Add"}</>} Mounting Cost
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
                        <div
                          className={
                            errorData?.acc_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_owner">Account Name *</label>
                          <Select
                            id="media_owner"
                            isDisabled={viewMode}
                            options={
                              accountList?.filter((item)=>(item?.db_account_type?.platform_id==5 && item?.db_account_type?.account_type_name==
                                "Mounting Vendors"))?.map((item)=>{
                                return{
                                  value:item.acc_id,
                                  label:item.acc_name
                                }
                              })
                            }
                            value={accountList?.map((item)=>{
                              if(item?.acc_id==userInfo?.acc_id){
                                return{
                                  value:item.acc_id,
                                  label:item.acc_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                acc_id: e.value,
                                acc_name:e.label
                              
                            
                              });
                              setErrorData({ ...errorData, acc_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {" "}
                            {errorData?.acc_id
                              ? errorData.acc_id
                              : ""}
                          </span>
                        </div>
                      </div>

                      {
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Account ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={accountList?.find(item=>item?.acc_id==userInfo?.acc_id)?.acc_code}
                          />
                        </div>
                      </div>
                  )
                }

{
                  id && (
                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="accountId">
                            Mounting Cost ID
                          </label>
                          <input
                            type="text"
                            name="accountId"
                            placeholder="Account ID"
                            id="accountId"
                            disabled={true}
                            className="form-control"
                            value={userInfo?.mo_c_code}
                          />
                        </div>
                      </div>
                  )
                }
                
                      <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div
                          className={
                            errorData?.m_t_id
                              ? "input_box errorBox"
                              : "input_box"
                          }
                        >
                          <label htmlFor="media_type">Media Type *</label>
                          <Select
                            id="media_type"
                            isDisabled={viewMode}
                            defaultValue={""}
                            options={mediaTypes?.map((item)=>{
                              return {
                                value:item.m_t_id,
                                label:item.m_t_name
                              }
                            })}
                            value={mediaTypes?.map((item)=>{
                              if(userInfo?.m_t_id==item?.m_t_id){
                                return {
                                  value:item.m_t_id,
                                  label:item.m_t_name
                                }
                              }
                            })}
                            onChange={(e) => {
                              setUserInfo({
                                ...userInfo,
                                m_t_id: e.value,
                              });
                              setErrorData({ ...errorData, m_t_id: "" });
                            }}
                          />
                          <span className="errorText">
                            {errorData?.m_t_id
                              ? errorData.m_t_id
                              : ""}
                          </span>
                        </div>
                      </div>

                <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="mo_c_cost">
                            Mounting Cost/Sq. Ft. *
                          </label>
                          <input
                            type="number"
                            name="mo_c_cost"
                            placeholder="Enter Mounting Cost/Sq. Ft."
                            id="mo_c_cost"
                            disabled={viewMode}
                            className="form-control"
                            onChange={(e) =>
                              setUserInfo({
                                ...userInfo,
                                mo_c_cost: e.target.value,
                              })
                            }
                            value={
                              userInfo.mo_c_cost
                                ? userInfo.mo_c_cost
                                : ""
                            }
                          />
                            <span className="errorText">
                            {errorData?.mo_c_cost
                              ? errorData.mo_c_cost
                              : ""}
                          </span>
                        </div>
                      </div>

                    {
                      id && (
                        <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                        <div className="input_box">
                          <label htmlFor="mo_c_cost">
                            Status
                          </label>
                          <input
                            type="text"
                            name="status"
                            placeholder="Status"
                            id="status"
                            disabled={true}
                            className="form-control"
                            value={userInfo.status}
                          />
                            <span className="errorText">
                            {errorData?.status
                              ? errorData.status
                              : ""}
                          </span>
                        </div>
                      </div>
                      )
                    }
                      
                
              </div>
             
            </div>
            
            <div className="add_user_form">
              <div className="row">
       
              </div>
              <div className="text-end">
                <div className="submit_btn">
                  {viewMode ? null : <>
                    <Link href='MountingCostManagement/'><button className="btn btn-cancel m-3 ">Cancel</button></Link>
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

export default AddMountingCostScreen;
