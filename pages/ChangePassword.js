import React, { useState, useEffect } from 'react'
import LeadShyneIcon from '../Components/Svg/LeadShyneIcon'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { hasCookie, getCookie } from 'cookies-next';
import { toast } from 'react-toastify';
import { Baseurl } from "../Utils/Constants";
import axios from 'axios'

export default function ChangePassword() {
    const router = useRouter()
    const { tkn } = router.query
    const [token, setToken] = useState('')

    const [userInfo, setUserInfo] = useState({ password: "", conf_pass: "" });

    const submitHandler = async () => {

        if (userInfo.password == '') {
            toast.error('Please enter the Password')
        } else if (userInfo.conf_pass !== userInfo.password) {
            toast.error('Password does not match with Confirm Password')
        } else {
            let header = {
                headers: {
                    Accept: "application/json",
                }
            }
            try {
                const response = await axios.put(Baseurl + `/db/users/forget`, {
                    token,
                    password: userInfo.password
                }, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message)
                    router.push('/')
                }
            } catch (error) {
                console.log(error);
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
        if (!router.isReady) return
        const myArray = tkn?.slice(4, tkn.length)
        console.log(typeof (myArray))
        setToken(myArray)
    }, [router.isReady, tkn])


    return (
        <div className="login_wrapper">
            <div className="login_box">
                <div className="img_logo"> <LeadShyneIcon /> </div>
                <div className="header"> Choose a new Password </div>
                <div className="content_box">
                    <div className="login_form">
                        <div className="field_box">
                            <label htmlFor="username">Password</label>
                            <input
                                type="password"
                                name="username"
                                id="password"
                                placeholder='Enter your Password'
                                className='form-control'
                                onChange={(e) =>
                                    setUserInfo({
                                        ...userInfo,
                                        password: e.target.value,
                                    })
                                }
                                value={
                                    userInfo.password ? userInfo.password : ""
                                }
                            />
                        </div>
                        <div className="field_box">
                            <label htmlFor="username">Confirm Password</label>
                            <input
                                type="password"
                                name="username"
                                id="conPassword"
                                placeholder='Confirm your password'
                                className='form-control'
                                onChange={(e) =>
                                    setUserInfo({
                                        ...userInfo,
                                        conf_pass: e.target.value,
                                    })
                                }
                                value={
                                    userInfo.conf_pass ? userInfo.conf_pass : ""
                                }

                            />
                        </div>
                        <div className="reset_btn">
                            <button className="btn btn-primary" onClick={submitHandler} >Submit</button>
                            <Link href='/Signin'> <button className="btn btn-light">Cancel</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

