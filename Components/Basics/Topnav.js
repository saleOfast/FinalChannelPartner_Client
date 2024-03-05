import React, { useEffect, useState } from 'react'
import LeadShyneIcon from '../Svg/LeadShyneIcon'
import Dropdown from 'react-bootstrap/Dropdown';
import PlusIcon from '../Svg/PlusIcon';
import ChevroletLeftIcon from '../Svg/ChevroletLeftIcon';
import LogoutIcon from '../Svg/LogoutIcon';
import AvatarIcon from '../Svg/AvatarIcon';
import ConfirmBox from './ConfirmBox';
import { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { hasCookie, getCookie } from 'cookies-next';
import { useSelector, useDispatch } from 'react-redux'
import { LoggedOut } from '../../store/adMinLoginSlice'
import { userLogOut } from '../../store/ClientLoginSlice'
import Link from 'next/link';
import { Baseurl, filesUrl } from '../../Utils/Constants';
import axios from 'axios';
import { clearMode } from '../../store/dbModeSlice';

const Topnav = () => {
    const router = useRouter()
    const dbMode = useSelector((state) => state.dbMode.value)
    const dispatch = useDispatch()
    const [userInfo, setuserInfo] = useState({})
    const [showConfirm, setshowConfirm] = useState(false);

    const logouthandler = () => {
        const isAdminMode = dbMode === 'admin';
        const isMasterOrUserMode = dbMode === 'master' || dbMode === 'user';

    
        setshowConfirm(!showConfirm);
        dispatch(clearMode())
        dispatch(isAdminMode ? LoggedOut() : userLogOut());
        router.push(isAdminMode ? '/Admin' : '/');
        toast.success('Logged Out Successfully');
    };


    useEffect(() => {
        if (hasCookie('userInfo')) {
            let userInfo = JSON.parse(getCookie('userInfo'));
            setuserInfo(userInfo);
        }
        if (hasCookie('SaLsUsr')) {
            let userInfo = JSON.parse(getCookie('SaLsUsr'));
            setuserInfo(userInfo);
        }
    }, [])

    const getUserInfo = async (id) => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: 'pass'
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/users?id=${id}`, header);
                setuserInfo(response.data.data);
            } catch (error) {
                if (error?.response?.data?.message === 'please login again token expired') {
                    toast.error(error.response.data.message);
                    dispatch(userLogOut());
                    router.push('/');
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }

    const getAdminInfo = async () => {
        if (hasCookie('saLsTkn')) {
            const token = getCookie('saLsTkn');
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/admin/profile`, header);
                setuserInfo(response.data.data);
            } catch (error) {
                if (error?.response?.data?.mesage === 'token not valid') {
                    toast.error(error.response.data.mesage);
                    dispatch(LoggedOut());
                    router.push('/Admin');
                }
                else {
                    toast.error('Something went wrong!')
                }
            }
        }
    }

    useEffect(() => {
        if (hasCookie('userInfo')) {
            const userInfo = JSON.parse(getCookie('userInfo'));
            getUserInfo(userInfo.user_code);
        } else { getAdminInfo() }
    }, [])

    return (
        <>
            <ConfirmBox
                showConfirm={showConfirm}
                setshowConfirm={setshowConfirm}
                actionType={logouthandler}
                title={"Are You Sure you want to Logout ?"} />
            <div className="topNav_Wrapper">
                <div className="top_nav">
                    <div className="brand_icon">
                        <LeadShyneIcon />
                    </div>
                    <div className="profile_sec">
                        {dbMode !== 'admin' ?
                            <div className="quick_add_sec">
                                <Dropdown>
                                    <Dropdown.Toggle variant="primary" id="quickAdd">
                                        <div className="plusicon"><PlusIcon /> </div>
                                        <div className="btn_text"> Quick Add </div>
                                        <div className="chevrolet"><ChevroletLeftIcon /> </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <ul className="quickaddlist">
                                            <Link href='/AddLeads'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Lead  </div>
                                                </li>
                                            </Link>
                                            <Link href='/AddAccount'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Account  </div>
                                                </li>
                                            </Link>
                                            <Link href='/AddContact'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Contact  </div>
                                                </li>
                                            </Link>
                                            <Link href='/AddOpportunity'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Opportunity  </div>
                                                </li>
                                            </Link>
                                            <Link href='/AddQuotations'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Quotation  </div>
                                                </li>
                                            </Link>
                                            <Link href='/AddTask'>
                                                <li className="list-item">
                                                    <div className="plus_icon"> <PlusIcon /> </div>
                                                    <div className="text">  Task  </div>
                                                </li>
                                            </Link>
                                        </ul>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div> : null}

                        <div className="user_profile">
                            <Dropdown>
                                <Dropdown.Toggle variant="none" id="profileBtn">
                                    <div className="btn_wrapper">
                                        <div className="img_sec">
                                            {dbMode == 'admin' ?
                                                <img src={userInfo.profile_img ? `${filesUrl}/adminProfile/images${userInfo.profile_img}` : `/images/profile_picture.png`} alt="" />
                                                :
                                                <img src={userInfo?.db_user_profile?.user_image_file ? `${filesUrl}/lsUser/images${userInfo?.db_user_profile?.user_image_file}` : `/images/profile_picture.png`} alt="" />
                                            }
                                        </div>
                                        <div className="name_sec">
                                            <div className="name"> {userInfo.user ? userInfo.user : 'user'} </div>
                                            <div className="role"> { } </div>
                                        </div>

                                    </div>
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <ul className="profile_list">

                                        <Link href={dbMode == 'admin' ? '/Profile' : '/UserProfile'}>
                                            <li className="list-item">
                                                <div className="icon"> <AvatarIcon /> </div>
                                                <div className="text">  Profile  </div>
                                            </li>
                                        </Link>

                                        <li className="list-item">
                                            <div className="icon"> <LogoutIcon /> </div>
                                            <div className="text" onClick={() => setshowConfirm(!showConfirm)}>  logout  </div>
                                        </li>
                                    </ul>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Topnav