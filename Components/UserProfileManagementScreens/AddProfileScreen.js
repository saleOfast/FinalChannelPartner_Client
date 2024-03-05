import React, { useEffect, useState } from 'react'
import Link from "next/link";
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants';
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux';

const AddProfileScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter()
    const { id } = router.query;

    const [editMode, setEditMode] = useState(false)
    const [userInfo, setUserInfo] = useState({
        role_name: ''
    })

    const getSingleData = async (id) => {

        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id:58
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/role/one?id=${id}`, header);
                setUserInfo(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }

    const addUserhandler = async () => {
        if (userInfo.role_name == '') {
            toast.error('Please enter the Profile Name')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:56
                    }
                }

                try {
                    const response = await axios.post(Baseurl + `/db/role`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        router.push('/UserProfileManagement');
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
                    }
                }
            }
        }

    }

    const updateUserhandler = async () => {
        if (userInfo.role_name == '') {
            toast.error('Please enter the Profile Name')
        } else {
            if (hasCookie('token')) {
                let token = (getCookie('token'));
                let db_name = (getCookie('db_name'));

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id:58
                    }
                }

                try {
                    const response = await axios.put(Baseurl + `/db/role`, userInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message)
                        router.push('/UserProfileManagement')
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    }
                    else {
                        toast.error('Something went wrong!')
                    }
                }
            }
        }

    }


    useEffect(() => {
        if (!router.isReady) return;
        if (router.query.id) {
            setEditMode(true)
            getSingleData(id)
        }
    }, [router.isReady, id])
    return (
         <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">{editMode ? 'EDIT' : 'ADD'} PROFILE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"> <Link href='/UserProfileManagement'>Profile Management   </Link></li>
                        <li className="breadcrumb-item active" aria-current="page">{editMode ? 'Edit' : 'Add'} Profile</li>
                    </ol>
                </nav>
            </div>

            <div className="main_content">
                <div className="Add_user_screen">
                    <div className="add_screen_head">
                        <span className="text_bold">Enter Details</span> </div>
                    <div className="add_user_form">
                        <div className="row">
                            <div className="col-xl-4 col-md-4 col-sm-12 col-12">
                                <div className="row">
                                    <div className="col-xl-12 col-md-12 col-sm-12 col-12">
                                        <div className="input_box">
                                            <label htmlFor="profileName">Profile  Name</label>
                                            <input
                                                type="text"
                                                name="profileName"
                                                placeholder='Enter Profile Name'
                                                id="profileName"
                                                className="form-control"
                                                onChange={(e) => setUserInfo({ ...userInfo, role_name: e.target.value })}
                                                value={userInfo.role_name ? userInfo.role_name : ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-end">
                                    <div className="submit_btn">
                                    <Link href="/UserProfileManagement"><button className="btn btn-cancel me-2">Cancel</button></Link>
                                        {editMode ? <button className="btn btn-primary" onClick={updateUserhandler}>Update</button> :
                                            <button className="btn btn-primary" onClick={addUserhandler}>Save & Submit</button>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddProfileScreen