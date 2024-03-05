import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";

const AddPolicyType = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const [userInfo, setUserInfo] = useState({
        claim_type: "",
        cost_per_km: "",
        max_allowance: "",
        fixed:""
    });


    console.log(userInfo)

    const { id } = router.query;
    const [updateList, setUpdateList] = useState([]);
    const [editMode, setEditMode] = useState(false);


    const submitHandler = async () => {

        if (userInfo.task_name == "") {
            toast.error("Please enter the task Name");
        } else if (
            userInfo.task_status_id == "" ||
            userInfo.task_status_id == null
        ) {
            toast.error("Please select the task status");
        } else if (
            userInfo.task_priority_id == "" ||
            userInfo.task_priority_id == null
        ) {
            toast.error("Please select the task priority");
        } else if (userInfo.due_date == "") {
            toast.error("Please enter the due date");
        } else if (userInfo.lead_id == "") {
            toast.error("Please enter the lead");
        } else if (userInfo.oppertunity_id == "") {
            toast.error("Please enter the oppertunity");
        } else if (userInfo.lead_detail == "") {
            toast.error("Please enter the lead detail");
        } else if (userInfo.description == "") {
            toast.error("Please enter the description ");
        } else if (userInfo.createdAt == "") {
            toast.error("Please enter the create date");
        } else if (userInfo.updatedAt == "") {
            toast.error("Please enter the modified date");
        } else {
            if (hasCookie("token")) {
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
                    const response = await axios.post(
                        Baseurl + `/db/tasks`,
                        userInfo,
                        header
                    );
                    if (response.status === 204 || response.status === 200) {
                        toast.success("Task Created Successfully");
                        router.push('/TaskScreen')
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

    const updateHandler = async () => {
        if (userInfo.task_name == "") {
            toast.error("Please enter the task Name");
        } else if (
            userInfo.task_status_id == "" ||
            userInfo.task_status_id == null
        ) {
            toast.error("Please enter the task Status");
        } else if (
            userInfo.task_priority_id == "" ||
            userInfo.task_priority_id == null
        ) {
            toast.error("Please enter the task priority");
        } else if (userInfo.due_date == "") {
            toast.error("Please enter the due date");
        } else if (userInfo.lead_id == "") {
            toast.error("Please enter the lead");
        } else if (userInfo.oppertunity_id == "") {
            toast.error("Please enter the oppertunity");
        } else if (userInfo.lead_detail == "") {
            toast.error("Please enter the lead detail");
        } else if (userInfo.description == "") {
            toast.error("Please enter the description ");
        } else if (userInfo.createdAt == "") {
            toast.error("Please enter the create date");
        } else if (userInfo.updatedAt == "") {
            toast.error("Please enter the modified date");
        } else {
            if (hasCookie("token")) {
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

                try {
                    const response = await axios.put(
                        Baseurl + `/db/tasks`,
                        userInfo,
                        header
                    );
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        router.push("/TaskScreen");
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

    

    // useEffect(() => {
       
        
       
    // }, []);

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true);
            getSingleData(id);
        }
    }, [router.isReady, id]);

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">{editMode ? "EDIT" : "ADD"} POLICY </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            {" "}
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item"> <Link href='/ManagePolicyHeadScreen'>Policy Head</Link></li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {editMode ? "Edit" : "Add"} Policy
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
                    <div className="add_user_form">
                        <div className="row">
                        <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="task_name">Claim Type *</label>

                                    <select
                                        name="selectInter"
                                        id="selectInter"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                claim_type: e.target.value,
                                            })
                                        }
                                        value={userInfo.claim_type ? userInfo.claim_type : ""}
                                    >
                                        <option value="">Select Claim Type </option>
                                        <option value="TA">TA</option>
                                        <option value="DA">DA</option>
                                    </select>
                                </div>
                            </div>
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="task_status">Cost Per Km</label>
                                    <input
                                        type="number"
                                        placeholder="Cost"
                                        name="cost_per_km"
                                        id="cost_per_km"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                cost_per_km: e.target.value,
                                            })
                                        }
                                        value={userInfo.cost_per_km ? userInfo.cost_per_km : ""}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="task_priority">Allowance</label>
                                    <input
                                        type="number"
                                        placeholder="Allowance"
                                        name="max_allowance"
                                        id="max_allowance"
                                        className="form-control"
                                        onChange={(e) =>
                                            setUserInfo({
                                                ...userInfo,
                                                max_allowance: e.target.value,
                                            })
                                        }
                                        value={userInfo.max_allowance ? userInfo.max_allowance : ""}
                                    />
                                </div>
                            </div>

                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="input_box">
                                    <label htmlFor="fixed">Fixed </label>
                                    <input
                                        type="number"
                                        name="fixed"
                                        id="fixed"
                                        className="form-control"
                                        onChange={(e) => setUserInfo({ ...userInfo, fixed: e.target.value })}
                                       value = {userInfo.fixed? userInfo.fixed:""}
                                    />
                                </div>
                            </div>
                           
                        </div>
                    
                        <div className="text-end">
                            <div className="submit_btn">
                                {editMode ? (
                                    <button className="btn btn-primary" onClick={updateHandler}>
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        className="btn btn-primary"
                                        onClick={submitHandler}
                                    >
                                        Save & Submit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddPolicyType;
