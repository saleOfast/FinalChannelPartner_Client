import { getCookie, hasCookie } from "cookies-next";
import UserEditProfile from "../../Components/ChannelPartner/UserEdit/UserEditProfile";
import WithUserhoc_CP from "../../HOC/WithUserhoc_CP";
import React, { useEffect, useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";

const UserEdit = () => {

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
                setUserData(response?.data?.data);
            } catch (error) {
                console.log(error)
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
            getSingleData(userInfo?.user_code);
        }
    }, [])
  return (
    <><UserEditProfile userData={userData} /></>
  )
}

export default WithUserhoc_CP(UserEdit) 
