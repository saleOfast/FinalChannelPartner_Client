import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import DetailComponent from "./DetailComponent";
import { filesUrl } from "../../Utils/Constants";

export default function ProfileScreen({ setEditMode, userData }) {
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
                                        {userData ? <img src={userData?.profile_img ? `${filesUrl}/adminProfile/images${userData?.profile_img}` : `/images/add_user_avatar.png`} alt="" /> : ''}
                                    </div>
                                    <div className="info_boxes">
                                        <DetailComponent head='Name' value={userData?.user} />
                                        <DetailComponent head='Role' value='Admin' />
                                        <DetailComponent head='Super Code' value={userData?.superCode} />
                                        <DetailComponent head='Contact Number' value={userData?.contact_number} />
                                        <DetailComponent head='Email' value={userData?.email} />
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
    );
}
