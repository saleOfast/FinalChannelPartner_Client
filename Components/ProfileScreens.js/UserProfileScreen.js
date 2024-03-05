import React from 'react'
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import DetailComponent from "./DetailComponent";
import { filesUrl } from "../../Utils/Constants";

export default function UserProfileScreen({ setEditMode, userData }) {
    const sideView = useSelector((state) => state.sideView.value);
    const dbMode = useSelector((state) => state.dbMode.value);

    return (
        <>
            <div className={`main_Box  ${sideView}`}>
                <div className="bread_head">
                    <h1 className="content_head">PROFILE</h1>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <Link href={dbMode == 'admin' ? '/Admin' : '/'}>Home</Link>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page">
                                Profile
                            </li>
                        </ol>
                    </nav>
                </div>
                <div className="main_content">
                    <div className="lead_box">
                        <div className="row">
                            <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                <div className="lead-info ">

                                    <div className="header">Profile Information</div>
                                    <div className="profile_pic">
                                        {userData ? <img src={userData?.db_user_profile?.user_image_file ? `${filesUrl}/lsUser/images${userData?.db_user_profile?.user_image_file}` : `/images/add_user_avatar.png`} alt="" /> : ''}
                                    </div>
                                    <div className="info_boxes">
                                        <DetailComponent head='Name' value={userData?.user} />
                                        <DetailComponent head='User Code' value={userData?.user_code} />
                                        <DetailComponent head='Contact Number' value={userData?.contact_number} />
                                        <DetailComponent head='Email' value={userData?.email} />
                                        <DetailComponent head='Country' value={userData?.db_country?.country_name} />
                                        <DetailComponent head='State' value={userData?.db_state?.state_name} />
                                        <DetailComponent head='City' value={userData?.db_city?.city_name} />
                                    </div>
                                    <div className="btn-box text-end pb-4 pe-4">
                                        <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
