import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import DashboardRevnueCard from './DashboardRevnueCard'
import DashLeadsCard from './DashLeadsCard'
import TopOpportunityCard from './TopOpportunityCard';
import TasksCard from './TasksCard';
import OpportunityCard from './OpportunityCard';
import { Baseurl } from '../../Utils/Constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Charts from '../../pages/Charts';
import RevenueChart from '../../pages/RevenueChart';
import ReChart from './ReChart';


const DashBoardScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;

    const [timeFilter, settimeFilter] = useState('weekly');
    const [dataList, setDataList] = useState({})
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setisLoading] = useState(true)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [checkInInfo, setCheckInInfo] = useState({})
    const [checkInState, setCheckInState] = useState('')
    const [userDetails, setUserDetails] = useState({})




    // Get the start of the week
    function currentWeak() {
        let today = new Date();
        let startOfWeek = new Date(today);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday

        // Get the end of the week
        let endOfWeek = new Date(currentDate);
        endOfWeek.setDate(currentDate.getDate() + (7 - currentDate.getDay())); // Sunday

        // Format the dates
        let formattedStartOfWeek = startOfWeek.toISOString().substr(0, 10);
        let formattedEndOfWeek = endOfWeek.toISOString().substr(0, 10);
        settimeFilter('weekly')
        setEndDate(formattedEndOfWeek)
        setStartDate(formattedStartOfWeek)

    }

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
                    setisLoading(false);
                }
            } catch (error) {
                if (error?.response?.data?.message) {
                    if (error.response.data.message == "not logged In") {
                        setCheckInState('1');
                        setisLoading(false);
                    }
                } else {
                    toast.error("Something went wrong!");
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
    }


    function currentMonth() {
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1; // Month starts from 0
        let daysInMonth = new Date(year, month, 0).getDate(); // Get total number of days in current month
        let startDate = new Date(year, month - 1, 1); // First day of current month
        let endDate = new Date(year, month - 1, daysInMonth); // Last day of current month
        // Format the dates as strings in "yyyy-mm-dd" format
        let startDateString = moment(startDate).format("YYYY-MM-DD");
        let endDateString = moment(endDate).format("YYYY-MM-DD")
        settimeFilter('monthly')
        setEndDate(endDateString)
        setStartDate(startDateString)

    }
    function AllData() {
        let today = new Date()
        let currentDate = today.toISOString().slice(0, 10);
        settimeFilter('all')
        setEndDate(currentDate)
        setStartDate('2023-02-01')

    }

    const getDataList = async (start, end, type) => {
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");

            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer ".concat(token),
                    db: db_name,
                },
            };
            try {
                const response = await axios.get(Baseurl + `/db/dashboard?endDate=${end}&&startDate=${start}&&type=${timeFilter}`, header);
                setDataList(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }
    };
    useEffect(() => {
        currentWeak();
    }, []);


    useEffect(() => {
        if (startDate !== null && endDate !== null) {
            getDataList(startDate, endDate);
        }
    }, [router.isReady, id, startDate]);

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
                <h3 className="content_head">DASHBOARD</h3>
            </div>
            <div className="main_content dashboard indxx">
                <div className="Cards_side">
                    <div className="dashboard_head">
                        <div className="time_filter">
                            <div
                                className={timeFilter == 'weekly' ? "links active" : 'links'}
                                onClick={() => currentWeak()}>
                                Weekly
                            </div>
                            <div
                                className={timeFilter == 'monthly' ? "links active" : 'links'}
                                onClick={(e) => currentMonth()}  >
                                Monthly
                            </div>
                            <div
                                className={timeFilter == 'all' ? "links active" : 'links'}
                                onClick={() => AllData()}>
                                All
                            </div>
                        </div>
                    </div>
                    <div className="cards_Box">
                        <div className="row">
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12">
                                <DashboardRevnueCard
                                    head='Total Revenue Generate'
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/business-card-trading.png' />
                            </div>
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12">
                                <DashboardRevnueCard
                                    head='TOTAL PIPELINE DEAL VALUE'
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/expenses.png' />
                            </div>
                        </div>
                        <div className="row leads_row">
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='TOTAL LEADS'
                                    price={dataList.leads}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/groupicon.png' />
                            </div>
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='NEW LEADS'
                                    price={dataList.openLead}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/groupicon.png' />
                            </div>
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='ACCOUNTS'
                                    price={dataList.accounts}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/usericon.png' />
                            </div>
                        </div>
                        <div className="row leads_row">
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='OPPORTUNITY'
                                    price={dataList.opportunities}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/opportunity.png' />
                            </div>
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='NEW OPPORTUNITY'
                                    price={dataList.opportunities}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/opportunity.png' />
                            </div>
                            <div className="col-xl-4 col-md-4 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='OPEN TASK'
                                    price={dataList.task}
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/clipboard.png' />
                            </div>
                        </div>

                        <div className="row"> {dataList?.piechart?.length ?
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12">

                                <OpportunityCard
                                    head='Lead Statistics '
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    dataList={dataList?.piechart}>
                                </OpportunityCard>
                            </div> : null}
                            {dataList?.barchart?.length ?
                                <div className="col-xl-6 col-md-6 col-12 col-sm-12 mt-2">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Lead Opportunity Statistics '
                                            dataList={dataList?.barchart}
                                        />
                                    </div>
                                </div> : null}


                            {/* <div className="col-xl-6 col-md-6 col-12 col-sm-12">
                                <OpportunityCard
                                    head='TOTAL PIPELINE DEAL VALUE'
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    img='/images/donut-chart.png' />
                            </div> */}


                        </div>
                        {/* <div className="row">
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12 mt-2">
                                <div className="dash_card chartSec">
                                     <Charts 
                                  />
                                 </div> 
                             </div>  
                            <div className="col-xl-6 col-md-6 col-12 col-sm-12 mt-2">
                                <div className="dash_card chartSec">
                                    <Charts 
                                    dataList = {dataList?.barchart}
                                    />
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="Task_side">
                    <div className="checkInBtns">
                        <div className="Box_head">Attendence</div>

                        {isLoading ? <div className='loading'>Loading...</div> : <div className="checkinBtn btnBox">
                            <div className="btn-box">
                                {!checkInInfo?.check_in && <button className="btn checkin btn-primary" onClick={checkInFunc}>Check In</button>}
                            </div>
                            {checkInInfo?.check_in && (
                                <div className="time">
                                    <span className="head">Check In time :</span>
                                    <span className="value">{moment(checkInInfo?.check_in).format("DD-MM-YYYY LT")}</span>
                                </div>
                            )}

                            <div className="btn-box">
                                {!checkInInfo?.check_out && checkInState !== '1' && <button className="btn btn-primary" onClick={checkoutFunc}>Check Out</button>}
                            </div>

                            {checkInInfo?.check_out && (
                                <div className="time mb-0">
                                    <span className="head">Check Out time :</span>
                                    <span className="value">{moment(checkInInfo?.check_out).format("DD-MM-YYYY LT")}</span>
                                </div>)}
                        </div>}

                    </div>

                    <div className="task_Box">
                        <TasksCard
                            dataList={dataList}
                        />
                    </div>
                    <div className="opertunity_box">
                        <TopOpportunityCard
                            dataList={dataList}
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default DashBoardScreen