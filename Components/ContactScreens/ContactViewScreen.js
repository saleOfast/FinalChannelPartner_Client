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
import moment from "moment";
import ContactDetailComponent from "./ContactDetailComponent";
import { useSelector } from "react-redux";

const ContactViewScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [dataList, setDataList] = useState({});
    const [disableShowConfirm, setdisableShowConfirm] = useState(false);

    const getDataList = async (id) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:28
                },
            };

            try {
                const response = await axios.get(
                    Baseurl + `/db/contacts?c_id=${id}`,
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
    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            getDataList(id);
        }
    }, [router.isReady, id]);

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
                    <h3 className="content_head">View Contact</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/TaskScreen">Home </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/TaskScreen">View Contact </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Contact
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="lead_box">
                        <div className="row">
                            <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                                <div className="lead-info ">
                                    <div className="header">Contact Information</div>
                                    <div className="info_boxes">
                                        {/* <ContactDetailComponent
                                            head="Contact Owner"
                                            value={dataList?.acc_name}
                                        /> */}
                                        <ContactDetailComponent
                                            head="Name"
                                            value={dataList?.first_name}
                                        />
                                        <ContactDetailComponent
                                            head="Salutation"
                                            value={dataList?.saluation}
                                        />
                                        <ContactDetailComponent
                                            head="Account Name"
                                            value={dataList?.accountName?.acc_name}
                                        />
                                        <ContactDetailComponent
                                            head="Report To"
                                            value={dataList?.reportTo?.designation}
                                        />
                                        <ContactDetailComponent
                                            head="Department"
                                            value={dataList?.db_department?.department}
                                        />
                                        <ContactDetailComponent
                                            head="Contact No"
                                            value={dataList?.contact_no}
                                        />
                                        <ContactDetailComponent
                                            head="Email Id"
                                            value={dataList?.email_id}
                                        />
                                        <ContactDetailComponent
                                            head="Fax"
                                            value={dataList?.fax}
                                        />
                                    

                                    </div>

                                    <div className="header dashboard_head">
                                        System Information
                                    </div>
                                    <div className="info_boxes">
                                        <ContactDetailComponent
                                            head="Created On"
                                            value={moment(dataList?.created_on).format("DD-MM-YYYY LT")}
                                        />
                                        <ContactDetailComponent
                                            head="Last Modified On"
                                            value={moment(dataList?.update_on).format("DD-MM-YYYY LT")}
                                        />
                                        <div className="btn-box text-end pb-4 pt-2">
                                            <Link href={`/AddContact?id=${id}`}>
                                                <button className="btn btn-primary">Edit</button>
                                            </Link>
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

export default ContactViewScreen;
