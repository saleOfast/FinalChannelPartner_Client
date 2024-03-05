import React, { useState } from 'react';
import LeadShyneIcon from '../Svg/LeadShyneIcon';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { setCookie } from 'cookies-next';
import { useSelector, useDispatch } from 'react-redux';
import { userMode } from '../../store/dbModeSlice';
import { UserLogIN } from '../../store/ClientLoginSlice';
import { Baseurl } from '../../Utils/Constants';
import axios from 'axios';
import { validEmail } from '../../Utils/regex';

export default function SignInScreen({ setLoggedIn }) {
    const router = useRouter()
    const dispatch = useDispatch()
    const dbMode = useSelector((state) => state.dbMode.value)

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

                const res = await axios.post(Baseurl + "/db/login", {
                    "email": userForm.email.toLowerCase(),
                    "password": userForm.password
                })

                if (res.status === 200) {
                    dispatch(userMode())
                    dispatch(UserLogIN())
                    setCookie('user', 'true');
                    setCookie('sideUser', 'true');
                    setCookie('token', res.data.token);
                    setCookie('userInfo', res.data.userData);
                    setCookie('db_name', res.data.userData.db_name);
                    toast.success('Logged in SuccessFully')
                    router.push('/')
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
                                placeholder='Please enter your email'
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
                                placeholder='Please enter your password'
                                className='form-control'
                                onChange={(e) => { setUserForm({ ...userForm, password: e.target.value }) }}
                            />
                        </div>
                        <div className="btn_box">
                            <button className="btn btn-primary" type='submit'>Submit</button>
                        </div>
                        <div className="forget_links">
                            <Link href='/ResetPassword'> Forgot Password? </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
