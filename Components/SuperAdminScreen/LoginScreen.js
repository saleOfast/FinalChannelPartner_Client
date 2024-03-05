import Link from 'next/link'
import React, { useState } from 'react'
import LeadShyneIcon from '../Svg/LeadShyneIcon'
import { toast } from 'react-toastify'
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { adminMode, clearMode } from '../../store/dbModeSlice'
import { LoggedIn, LoggedOut } from '../../store/adMinLoginSlice'
import axios from 'axios';
import { Baseurl } from '../../Utils/Constants'
import { validEmail } from '../../Utils/regex'

const LoginScreen = ({ isLoggedIn, setisLoggedIn }) => {
    const dispatch = useDispatch()

    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })

    const submitHandler = async (e) => {
        e.preventDefault();
        if (userForm.email === "" || userForm.email.length < 1) {
            toast.error('Email is Empty');
        }
        else if (!validEmail.test(userForm.email.toLowerCase().trim())) {
            toast.error('Email is not Valid');
        }
        else if (userForm.password === "" || userForm.password.length < 1) {
            toast.error('password is Empty');
        }
        else {
            try {

                const res = await axios.post(Baseurl + "/db/admin", {
                    "email": userForm.email.toLowerCase(),
                    "password": userForm.password
                })
                if (res.status === 200) {
                    dispatch(clearMode())
                    dispatch(adminMode())
                    dispatch(LoggedIn())
                    setCookie('Admin', 'true');
                    setCookie('SaLsUsr', res.data.userData);
                    setCookie('saLsTkn', res.data.token);
                    toast.success('Logged in SuccessFully')
                }

            } catch (error) {
                toast.error(error?.response?.data?.data ? error?.response?.data?.data : 'Something Went wrong');
            }
        }
    }

    return (
        <div className="login_wrapper">
            <div className="login_box">
                <div className="img_logo"> <LeadShyneIcon /> </div>
                <div className="header"> Please Login to Continue </div>
                <div className="content_box">
                    <form className='login_form' onSubmit={submitHandler}>
                        <div className="field_box">
                            <label htmlFor="username">Email</label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                placeholder='please enter your email'
                                className='form-control'
                                onChange={(e) => { setUserForm({ ...userForm, email: e.target.value.trim() }) }}
                            />

                        </div>
                        <div className="field_box">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                placeholder='please enter your password'
                                className='form-control'
                                onChange={(e) => { setUserForm({ ...userForm, password: e.target.value }) }}
                            />
                        </div>
                        <div className="btn_box">
                            <button className="btn btn-primary" type='submit'>Submit</button>
                        </div>
                        {/* <div className="forget_links">
                            <Link href='/ResetPassword'> Forgot Password? </Link>
                        </div> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen