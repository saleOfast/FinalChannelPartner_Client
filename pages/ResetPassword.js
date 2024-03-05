
import React, { useState } from "react";
import LeadShyneIcon from '../Components/Svg/LeadShyneIcon'
import Link from 'next/link'
import axios from "axios";
import { Baseurl } from "../Utils/Constants";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const ResetPassword = () => {

    const router = useRouter();
    const [userInfo, setUserInfo] = useState({ email: "" });

    const submitHandler = async () => {

        if (userInfo.email == '') {
            toast.error('Please enter the Email')
        } else {

            let header = {
                headers: {
                    Accept: "application/json",

                }
            }
            try {
                const response = await axios.post(Baseurl + `/db/users/forget`, userInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    router.push('/Signin')

                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                }
                else {
                    console.log(error);
                    toast.error('Something went wrong!')
                }
            }
        }

    }

    return (
        <div className="login_wrapper">
            <div className="login_box">
                <div className="img_logo"> <LeadShyneIcon /> </div>
                <div className="header"> Please Enter Your mail </div>
                <div className="content_box">
                    <div className="login_form">
                        <div className="field_box">
                            <label htmlFor="username">Email</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder='please enter your email'
                                className='form-control'
                                onChange={(e) =>
                                    setUserInfo({
                                        ...userInfo,
                                        email: e.target.value,
                                    })
                                }
                                value={
                                    userInfo.email ? userInfo.email : ""
                                }
                            />
                        </div>
                        <div className="reset_btn">
                            <button className="btn btn-primary" onClick={() => { submitHandler() }} >Submit</button>
                            <Link href='/Signin'> <button className="btn btn-light">Cancel</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword