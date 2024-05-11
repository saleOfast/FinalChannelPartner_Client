import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import DashboardRevnueCard from './DashboardRevnueCard'
import DashLeadsCard from './DashLeadsCard'

import TasksCard from './TasksCard';
import OpportunityCard from './OpportunityCard';
import { Baseurl, filesUrl } from '../../../../Utils/Constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Charts from '../../../../pages/Charts';
import RevenueChart from '../../../../pages/RevenueChart';
import ReChart from './ReChart';
import DateRange from '../../../DateRangeCustom/Daterange';
import Datepicker from 'react-tailwindcss-datepicker';
import generatePDF from 'react-to-pdf';
import { setDate } from 'date-fns';
import Top5Bookings from './Top5Bookings';
import Top5Leads from './Top5Leads';
import Top5Visits from './Top5Visits';


const DashboardAdmin = () => {
    const sideView = useSelector((state) => state.sideView.value);
    const clientLogo= getCookie('clientLogo')? JSON.parse(getCookie('clientLogo')) : null;
    const[showLogo,setShowLogo]=useState(false)
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
    const[value,setValue]=useState()


    const getTargetElement = () => document.getElementById("to-be-printed");
    const options = {
      filename: `ChannelPartner-${new Date().getDate()}.pdf`,
      page: {
        margin: 10
      }
    };
    const downloadPdf = () =>{ 
        setTimeout(()=>{
            generatePDF(getTargetElement, options);
        },0)
            
        setTimeout(()=>{
            setShowLogo(false)
        },1)
    }



    const handleValueChange = (newValue) => {
      setValue(newValue);
      setStartDate(startDate)
      setEndDate(endDate)

      getDataList(newValue.startDate, newValue.endDate);
  
    }




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
        setValue({
          ...value,
          startDate: formattedStartOfWeek,
          endDate: formattedEndOfWeek,
        })  
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
                const response = await axios.get(Baseurl + `/db/channel/dashboard/admin?endDate=${end}&&startDate=${start}`, header);
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
      <div className='d-block '>
      <div>
      <div className=' d-flex justify-content-end pe-4 pb-2 pt-2'>
      <img src="/ChannelPartner/download-file-blue.svg" alt style={{height: 17,cursor:"pointer"}} onClick={()=>{
            setShowLogo(true)
            downloadPdf()
        }} />
      </div>
      </div>
          <div className={`main_Box w-100`} >
            <div className="main_content dashboard indxx"id='to-be-printed' >
                <div className="Cards_side w-100">
                    <div className="dashboard_head">
                        <div className="time_filter" style={{marginTop:"-40px",marginBottom:"-10px"}}>
                            {
                                showLogo ? 
                                 (
                                    <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt="" className='pt-3 pb-3'  />
                                    
                                 )
                                    :
                                 (
                                    <Datepicker
                                    value={value}
                                    showFooter={true}
                                    onChange={handleValueChange}
                                    showShortcuts={true}
                                    primaryColor={"blue"}
                                    containerClassName="relative w-64 mt-8 p-1 border rounded-md mb-4 border-black  text-black inline-block" 
                                    />
                                 )
                            }    
                        </div>
                    </div>
                    <div className="cards_Box ">
                        
                    <div className="row leads_row">
                            <div className="col-xl-3 col-md-3 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='TOTAL LEADS'
                                    price={dataList.leads}
                                    date={`${moment(value?.startDate).format("DD-MM-YYYY")} to ${moment(value?.endDate).format("DD-MM-YYYY")}`}
                                    img='/images/groupicon.png' />  
                            </div>
                            <div className="col-xl-3 col-md-3 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='VISITS COMPLETED'
                                    price={dataList.visits}
                                    date={`${moment(value?.startDate).format("DD-MM-YYYY")} to ${moment(value?.endDate).format("DD-MM-YYYY")}`}
                                    img='/images/groupicon.png' />
                            </div>
                            <div className="col-xl-3 col-md-3 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='BOOKINGS COMPLETED'
                                    price={dataList.booking}
                                    date={`${moment(value?.startDate).format("DD-MM-YYYY")} to ${moment(value?.endDate).format("DD-MM-YYYY")}`}
                                    img='/images/usericon.png' />
                            </div>
                            <div className="col-xl-3 col-md-3 col-12 col-sm-12">
                                <DashLeadsCard
                                    head='TAT FOR BROKERS'
                                    price={`${dataList?.averageHours || '0'} ʰʳˢ `} 
                                    date={`${moment(value?.startDate).format("DD-MM-YYYY")} to ${moment(value?.endDate).format("DD-MM-YYYY")}`}
                                    img='/images/usericon.png' 
                                    />
                            </div>
                        </div>
                        

                        
                        <div className='row'>
                        {dataList?.EnrolVsAcceptChart?.length ?
                        <div className="col-xl-6 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                               <div className="">
                                   <div className="dash_card chartSec">
                                       <ReChart
                                           head='Brokers Enrolled Vs Accepted'
                                           keyX='enrolled'
                                           keyY='approved'
                                           dataList={dataList?.EnrolVsAcceptChart}
                                       />
                                   </div>
                               </div> 
                       </div>: 
                        null}
                            {dataList?.RequestedVsCompleteChart?.length ?
                       <div className="col-xl-6 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Site visit requested Vs Site Visit completed'
                                            keyX='Requested'
                                            keyY='Completed'
                                            dataList={dataList?.RequestedVsCompleteChart}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null}
                        </div>
                        
                        <div className='row'>
                        <div className="col-xl-6 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                           {dataList?.rangewiseBrokergaeVsBookingChart?.length ?
                               <div className="">
                                   <div className="dash_card chartSec">
                                       <ReChart
                                           head='Bookings created Vs Brokerage bills created'
                                           keyX='brokerage'
                                           keyY='booking'
                                           dataList={dataList?.rangewiseBrokergaeVsBookingChart}
                                       />
                                   </div>
                               </div> : 
                           null}
                       </div>
                       <div className="col-xl-6 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                            {dataList?.rangewiseVisitVsBookingsCharts?.length ?
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Visits vs Bookings'
                                            keyX='visit'
                                            keyY='booking'
                                            dataList={dataList?.rangewiseVisitVsBookingsCharts}
                                        />
                                    </div>
                                </div> : 
                            null}
                        </div>
                        </div>
                        
                    </div>
                </div>
                <div className="Task_side">
                    {/* <div className="checkInBtns">
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

                    </div> */}

                    {/* <div className="task_Box">
                        <TasksCard
                            dataList={dataList}
                        />
                    </div> */}
                    <div className="opertunity_box">
                        <Top5Bookings
                            dataList={dataList}
                            name="Top 5 Bookings"
                        />

                    </div>
                    <div className="opertunity_box">
                        <Top5Leads
                            dataList={dataList}
                            name="Top 5 Leads"
                        />
                    </div>
                    <div className="opertunity_box">
                        <Top5Visits
                            dataList={dataList}
                            name="Top 5 Visits"
                        />
                    </div>
                </div>
            </div>

        </div>
      </div>
        
    )
}

export default DashboardAdmin