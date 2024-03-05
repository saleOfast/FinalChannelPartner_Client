import React, { useEffect, useState } from "react";

import PlusIcon from "../Svg/PlusIcon";
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from "../../Utils/Constants";
import ConfirmBox from "../Basics/ConfirmBox";
import AccountDetailComponent from "./AccountDetailComponent";
import Button from "react-bootstrap/Button";
import moment from "moment";
import { useSelector } from "react-redux";

const AccountViewScreen = () => {
    const router = useRouter();
    const { id } = router.query;
    const sideView = useSelector((state) => state.sideView.value);

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
                    m_id: 21
                },
            };

            try {
                const response = await axios.get(
                    Baseurl + `/db/account?acc_id=${id}`,
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
                    <h3 className="content_head">View Account</h3>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href="/TaskScreen">Home </Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link href="/TaskScreen">View Account </Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Account
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="lead_box">
                        <div className="row">
                            <div className="col-xl-8 col-md-8 col-sm-12 col-12">
                                <div className="lead-info ">
                                    <div className="header">View Account</div>
                                    <div className="info_boxes">
                                        <AccountDetailComponent
                                            head="Account Name"
                                            value={dataList?.acc_name}
                                        />
                                        <AccountDetailComponent
                                            head="Account Owner"
                                            value={dataList?.account_owner?.user}
                                        />

                                        {/* <AccountDetailComponent
                                            head="Assigned To"
                                            value={dataList?.assignedAcc?.user}
                                        /> */}


                                        <AccountDetailComponent
                                            head="Account Code"
                                            value={dataList?.acc_code}
                                        />
                                        <AccountDetailComponent
                                            head="Due Date"
                                            value={moment(dataList?.due_date).format("DD-MM-YYYY ")}

                                        />
                                        <AccountDetailComponent
                                            head="Website"
                                            value={dataList?.website}
                                        />
                                        <AccountDetailComponent
                                            head="Industry"
                                            value={dataList?.db_industry?.industry}
                                        />

                                        <AccountDetailComponent
                                            head="Shiping Adress"
                                            value={dataList?.shipState?.state_name}
                                        />

                                        <AccountDetailComponent
                                            head="Billing Adress"
                                            value={dataList?.billState?.state_name}
                                        />

                                    </div>

                                    <div className="header dashboard_head">
                                        System Information
                                    </div>
                                    <div className="info_boxes">
                                        <AccountDetailComponent
                                            head="Created On"
                                            value={moment(dataList?.createdAt).format("DD-MM-YYYY LT")}
                                        />
                                        <AccountDetailComponent
                                            head="Last Modified On"
                                            value={moment(dataList?.updateon).format("DD-MM-YYYY LT")}
                                        />
                                        <div className="btn-box text-end pb-4 pt-2">
                                            <Link href={`/AddAccount?id=${id}`}>
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

export default AccountViewScreen;
