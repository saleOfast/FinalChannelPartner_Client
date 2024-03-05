import React, { useEffect, useState } from "react";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from 'next/router'
import { Baseurl, filesUrl } from "../../Utils/Constants";
import UserDetailComponent from "./UserDetailComponent";
import moment from "moment";
import { useSelector } from "react-redux";

const ViewUserScreens = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter()
    const { id } = router.query;
    const [dataList, setDataList] = useState([]);

    const getDataList = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:78
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/users?id=${id}`, header);
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

    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            getDataList(id)
        }
    }, [router.isReady, id])

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
                    <h3 className="content_head">View Details</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/">Home </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/ManageUsers">Manage Users </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                User Details
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                <div className="Add_user_screen">
                    <div className="add_screen_head">
                        <span className="text_bold">View Details</span> </div>
                    <div className="add_user_form addUserPage">
                        <div className="row profilePic">
                            <div className="col-xl-10 col-md-10 col-sm-12 col-12">
                                <div className="row">
                                    <div className="col-xl-5 col-md-5 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="profilelevel">Profile  Level *</label>
                                            <input
                                                className='form-control'
                                                name="profilelevel"
                                                disabled
                                                id="profilelevel"
                                                value={dataList?.db_role?.role_name}/>
                                            
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="firstName">Name *</label>
                                            <input
                                                type="text"
                                                disabled
                                                placeholder='Enter User Name'
                                                name="name" id="firstName"
                                                className="form-control"
                                                value={dataList?.user}
                                                 />
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="contact_no">Contact No *</label>
                                            <input
                                                type="number"
                                                disabled
                                                name="contact-no" id="contact_no"
                                                className="form-control"
                                                value={dataList?.contact_number}
                                                 />
                                        </div>
                                    </div>
                                    <div className="col-xl-3 col-md-3 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="email">Email *</label>
                                            <input
                                                type="email"
                                                placeholder='Enter Email Id.'
                                                name="email" id="email"
                                                className="form-control"
                                                
                                                />
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

export default ViewUserScreens;
