import Head from 'next/head';
import { useEffect, useState } from 'react'
import SideBar from '../Components/Basics/SideBar';
import Topnav from '../Components/Basics/Topnav';
import { useDispatch } from 'react-redux'
import { getCookie, hasCookie, setCookie } from 'cookies-next';
import { Baseurl } from '../Utils/Constants';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserProfileScreen from '../Components/ProfileScreens.js/UserProfileScreen';
import UserEditProfile from '../Components/ProfileScreens.js/UserEditProfile';
import { setIsActive } from '../store/isActiveSidebarSlice';
import withUser from '../HOC/WithUserhoc';


 function UserProfile() {
     
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'taxManage')
        dispatch(setIsActive('taxManage'))
    }, []);
    const [editMode, setEditMode] = useState(false)
    const [userData, setUserData] = useState({})

    const getSingleData = async (id) => {
        if (hasCookie('token')) {
            let token = (getCookie('token'));
            let db_name = (getCookie('db_name'));

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass:'pass'
                }
            }
            try {
                const response = await axios.get(Baseurl + `/db/users?id=${id}`, header);
                setUserData(response.data.data);
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

    useEffect(() => {
        if (hasCookie('userInfo')) {
            const userInfo = JSON.parse(getCookie('userInfo'));
            getSingleData(userInfo.user_code);
        }
    }, [])

    return (
        <>
                    {editMode ? <UserEditProfile userData={userData} setEditMode={setEditMode} />
                        : <UserProfileScreen userData={userData} setEditMode={setEditMode} />}
        </>
    )
}

export default withUser(UserProfile)