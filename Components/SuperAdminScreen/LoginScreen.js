import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import LeadShyneIcon from '../Svg/LeadShyneIcon'
import { toast } from 'react-toastify'
import { setCookie } from 'cookies-next';
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { adminMode, clearMode } from '../../store/dbModeSlice'
import { LoggedIn, LoggedOut } from '../../store/adMinLoginSlice'
import axios from 'axios';
import { Baseurl, filesUrl } from '../../Utils/Constants'
import { validEmail } from '../../Utils/regex'
import PersonIcon from "@mui/icons-material/Person";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";

const LoginScreen = ({ isLoggedIn, setisLoggedIn }) => {
    const dispatch = useDispatch()
    const [userForm, setUserForm] = useState({
        email: "",
        password: ""
    })
  const [showPassword, setShowPassword] = useState(false);


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
                    "password": userForm.password,
                    "type":"superadmin"
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
        <div className="NewLoginScreen bg-white">
        <div className="row m-0  login">
          <div className="col-12 col-lg-6 m-0 p-0">
            <div className="form-left d-flex flex-column justify-content-between">
              <img src="/images/Ellipse26.png" alt="normal"className="image-one" />
              <img
                src="/sale-o-fast.png"
                alt
                className=" mx-auto w-auto"
              />
              <img
                src="/images/Ellipse27.png"
                alt
                className="image-two d-none d-lg-block"
              />
            </div>
          </div>
          <div className=" col-12 col-lg-6 d-flex align-items-center justify-content-center pt-5">
            <div className="form-right  d-flex justify-content-center align-items-center ">
              <form action className="row g-4" onSubmit={submitHandler}>
                <div className="col-12">
                  <div className="d-flex flex-column">
                    <b className="fs-3 mb-2 text-center text-md-start">Login</b>
                    <span
                      className="fs-6 d-none d-md-block"
                      style={{ color: "#CFCFCF" }}
                    >
                      Welcome Back! Please login to your account
                    </span>
                  </div>
                </div>
                <div className="col-12">
                  <label className="fs-5 pb-2" style={{ color: "#A7A7A7" }}>
                    Username
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      required
                      className="form-control position-relative"
                      placeholder="Enter Username"
                      onChange={(e) => { setUserForm({ ...userForm, email: e.target.value.trim() }) }}
                    />
                    <div
                      className
                      style={{ position: "absolute", right: 10, top: 5 }}
                    >
                      <PersonIcon />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <label className="fs-5 pb-2" style={{ color: "#A7A7A7" }}>
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      className="form-control position-relative"
                      placeholder="Enter Password"
                      onChange={(e) => { setUserForm({ ...userForm, password: e.target.value }) }}
                    />      
                    <div
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 6,
                        cursor: "pointer",
                      }}
                    >
                      {showPassword ? (
                        <VisibilityIcon />
                      ) : (
                        <VisibilityOffIcon />
                      )}
                    </div>
                  </div>
                </div>
                {/* <div className>
                  <Link
                    href="/ResetPassword"
                    className="float-end fw-semibold text-decoration-none"
                    style={{ color: "#549EF5" }}
                  >
                    Forgot Password?
                  </Link>
                </div> */}
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary fs-4 fw-semibold px-4 float-end w-100 rounded-4"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
}

export default LoginScreen