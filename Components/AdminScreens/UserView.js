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
                    <div className="lead_box">
                        <div className="row">
                            <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                                <div className="lead-info ">

                                    <div className="header">User Information</div>
                                    <div className="profile_pic">
                                        <img src={dataList?.db_user_profile?.user_image_file ? `${filesUrl}/lsUser/images${dataList?.db_user_profile?.user_image_file}` : `/images/add_user_avatar.png`} alt="" />
                                    </div>
                                    <div className="info_boxes">
                                        <UserDetailComponent head='Profile Level' value={dataList?.db_role?.role_name} />
                                        <UserDetailComponent head='Name' value={dataList?.user} />
                                        <UserDetailComponent head='Contact No.' value={dataList?.contact_number} />
                                        <UserDetailComponent head='Division' value={dataList?.db_user_profile?.db_division?.divison} />
                                        <UserDetailComponent head='Department' value={dataList?.db_user_profile?.db_department?.department} />
                                        <UserDetailComponent head='Designation' value={dataList?.db_user_profile?.db_designation?.designation} />
                                        <UserDetailComponent head='User Code' value={dataList?.user_code} />
                                    </div>

                                    <div className="header dashboard_head">Address Information</div>
                                    <div className="info_boxes">
                                        <UserDetailComponent head='City ' value={dataList?.db_city?.city_name} />
                                        <UserDetailComponent head='State' value={dataList?.db_state?.state_name} />
                                        <UserDetailComponent head='Country' value={dataList?.db_country?.country_name} />
                                        <UserDetailComponent head='Zip/Postal Code' value={dataList?.pincode} />
                                        <UserDetailComponent head='Bank Name' value={dataList?.db_user_profile?.bank_name} />
                                        <UserDetailComponent head='Bank Holder Name' value={dataList?.db_user_profile?.account_holder_name} />
                                        <UserDetailComponent head='Account No' value={dataList?.db_user_profile?.account_no} />
                                        <UserDetailComponent head='IFSC Code' value={dataList?.db_user_profile?.bank_ifsc_code} />
                                    </div>
                                    <div className="header dashboard_head">System Information</div>
                                    <div className="info_boxes">
                                        <UserDetailComponent head='Created On' value={moment(dataList?.createdAt).format("DD-MM-YYYY LT")} />
                                        <UserDetailComponent head='Last Modified On' value={moment(dataList?.updatedAt).format("DD-MM-YYYY LT")} />
                                    </div>
                                    <div className="btn-box text-end pb-4 pe-4">
                                        <Link href={`/AddUsers?id=${id}`}>
                                            <button className="btn btn-primary">Edit</button>
                                        </Link>
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
