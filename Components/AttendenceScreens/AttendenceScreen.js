import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Baseurl } from "../../Utils/Constants";
import { hasCookie, getCookie } from "cookies-next";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import moment from "moment";
import { useSelector } from "react-redux";
import ClockComponent from "./ClockComponent";


const AttendenceScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();

    const [userDetails, setUserDetails] = useState({})
    const [checkInState, setCheckInState] = useState('')
    const [checkInInfo, setCheckInInfo] = useState({})

    /*  const nowTime = new Date();
     const currDate = `${nowTime.getFullYear()}-${nowTime.getMonth() + 1}-${nowTime.getDate()} 00:00:00`
     const nextDay = `${nowTime.getFullYear()}-${nowTime.getMonth() + 1}-${nowTime.getDate().add(1, 'day')} 00:00:00` */

    const currDate = moment().format('YYYY-MM-DD LTS');
    const startDay = moment().format('YYYY-MM-DD 00:00:00');
    const nextDay = moment().add(1, 'day').format('YYYY-MM-DD 00:00:00');

    async function getAttndncData() {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    pass: 'pass'
                },
            };

            try {
                const response = await axios.get(Baseurl + `/db/checkin?start_date=${startDay}&end_date=${nextDay}`, header);
                setCheckInInfo(response.data.data)
                if (response.status === 204 || response.status === 200) {
                    setCheckInState('2');
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    if (error.response.data.message == "not logged In") {
                        setCheckInState('1');
                    }
                }
            }
        }
    }

    async function checkInFunc() {
        const reqInfo = {
            ...userDetails,
            "check_in": currDate,
            "start_date": startDay,
            "end_date": nextDay,
        }
        if (!userDetails.lat) {
            toast.error('Please Allow Location Permissions')
        } else {
            if (hasCookie("token")) {
                let token = getCookie("token");
                let db_name = getCookie("db_name");

                let header = {
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer ".concat(token),
                        db: db_name,
                        m_id: 194
                    },
                };

                try {
                    const response = await axios.post(Baseurl + `/db/checkin`, reqInfo, header);
                    if (response.status === 204 || response.status === 200) {
                        toast.success(response.data.message);
                        getAttndncData();
                    }
                } catch (error) {
                    if (error?.response?.data?.message) {
                        toast.error(error.response.data.message);
                    } else {
                        toast.error("Something went wrong!");
                    }
                }
            }
        }
    }

    async function checkoutFunc() {
        const reqInfo = {
            "check_out": currDate,
            "start_date": startDay,
            "end_date": nextDay,
        }
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                    m_id: 194
                },
            };

            try {
                const response = await axios.put(Baseurl + `/db/checkin`, reqInfo, header);
                if (response.status === 204 || response.status === 200) {
                    toast.success(response.data.message);
                    getAttndncData();
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error("Something went wrong!");
                }
            }
        }
    }

    useEffect(() => {
        const location = window.navigator && window.navigator.geolocation
        if (location) {
            location.getCurrentPosition((position) => {
                setUserDetails({
                    ...userDetails,
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                })
            }, (error) => {
                setUserDetails({ ...userDetails, lat: null, lon: null })
            })
        }
        getAttndncData();
    }, [])

    return (
        <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">ATTENDENCE</h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link href="/">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Attendence
                        </li>
                    </ol>
                </nav>
            </div>
            <div className="main_content">
                <div className="checkinCheckout">

                    <div className="clockComponent">
                        <ClockComponent />
                    </div>
                    <div className="checkInBtns">
                        <div className="checkinBtn btnBox">
                            <div className="btn-box">
                                {checkInInfo?.check_in ? null : <button className="btn btn-primary" onClick={checkInFunc}>Check In</button>}
                            </div>
                            <div className="time">
                                <span className="head">{checkInInfo?.check_in ? <> Check In time :</> : ''} </span>
                                <span className="value">{checkInInfo?.check_in ? moment(checkInInfo?.check_in).format("DD-MM-YYYY LT") : ''} </span>
                            </div>
                        </div>
                        <div className="checkoutBtn btnBox">
                            <div className="btn-box">
                                {checkInInfo?.check_out || checkInState == '1' ? null : <button className="btn btn-primary" onClick={checkoutFunc}>Check Out</button>}
                            </div>

                            <div className="time">
                                <span className="head">{checkInInfo?.check_out ? <> Check Out time : </> : ''}</span>
                                <span className="value"> {checkInInfo?.check_out ? moment(checkInInfo?.check_out).format("DD-MM-YYYY LT") : ''}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendenceScreen;