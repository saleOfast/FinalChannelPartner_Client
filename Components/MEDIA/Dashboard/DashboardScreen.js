import React, { useState, useEffect } from 'react'
import Link from "next/link";
import { hasCookie, getCookie } from "cookies-next";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/router";
import { Baseurl } from '../../../Utils/Constants';
import moment from 'moment';
import { useSelector } from 'react-redux';
import ReChart from './ReChart';
import Loader from '../../Loader/Loader';
import Datepicker from 'react-tailwindcss-datepicker'
import RevenueChart from './RevenueChart';
import { Row, Col, Container } from 'react-bootstrap';
import Select from "react-select";
import ReChart1 from './ReChart1';
import OpportunityCard from './OpportunityCard';
import OpportunityCard1 from './OpportunityCard1';





const DashBoardScreen = () => {
    const sideView = useSelector((state) => state.sideView.value);

    const router = useRouter();
    const { id } = router.query;
    
    const [timeFilter, settimeFilter] = useState('weekly');
    const [salesOrderAssetBusiness, setSalesOrderAssetBusiness] = useState({})
    const [salesOrderAgencyBusiness, setSalesOrderAgencyBusiness] = useState({})
    const [purchaseOrderAssetBusiness, setPurchaseOrderAssetBusiness] = useState({})
    const [purchaseOrderAgencyBusiness, setPurchaseOrderAgencyBusiness] = useState({})
    const [salesOrderByCreator, setSalesOrderByCreator] = useState({})
    const [siteAvailabilityReport, setSiteAvailabilityReport] = useState({})
    const [siteCategoryReport, setSiteCategoryReport] = useState({})
    const [dataList, setDataList] = useState({})
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setisLoading] = useState(true)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [checkInInfo, setCheckInInfo] = useState({})
    const [checkInState, setCheckInState] = useState('')
    const [userDetails, setUserDetails] = useState({})
    const [loader,setLoader]=useState(false)
    const[value,setValue]=useState()
  const [financialYear, setFinancialYear] = useState("");


    const generateFinancialYearOptions = () => {
        const options = [];
        const startYear = 2023; 
        const endYear = new Date().getFullYear() + 1; 
    
        for (let i = startYear; i <= endYear; i++) {
          options.push({
            value: `${i}-${i + 1}`,
            label: `${i}-${i + 1}`,
          });
        }
        return options;
      };

    const financialYearOptions = generateFinancialYearOptions();
    
   

      const getCurrentFinancialYear = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1; // getMonth() is zero-indexed
        return month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
      };


    //   useEffect(() => {
    //     setFinancialYear(getCurrentFinancialYear())
    //     getSalesOrderAsset();
    //     getSalesOrderAgency();
    //     getPurchaeOrderAsset()
    //     getPurchaseOrderAgency()
    //     getSalesOrderByCretor()
    //     getSiteAvailabilityReport()
    //     getSiteCategoryReport()
    //   }, []);

      useEffect(() => {
        setFinancialYear(getCurrentFinancialYear());
        fetchData();
    }, []);

    // Fetch data when financial year changes
    useEffect(() => {
        if (financialYear) {
            fetchData();
        }
    }, [financialYear]);

    const fetchData = async () => {
        setLoader(true);
        if (hasCookie("token")) {
            let token = getCookie("token");
            let db_name = getCookie("db_name");
            let header = {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    db: db_name,
                },
            };

            try {
                await Promise.all([
                    getSalesOrderAsset(header),
                    getSalesOrderAgency(header),
                    getPurchaeOrderAsset(header),
                    getPurchaseOrderAgency(header),
                    getSalesOrderByCretor(header),
                    getSiteAvailabilityReport(header),
                    getSiteCategoryReport(header)
                ]);
            } catch (error) {
                toast.error(error?.response?.data?.message || "Something went wrong!");
            } finally {
                setLoader(false);
            }
        }
    };

      


      const getSalesOrderAsset = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
          query.type=1
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getSalesOrder?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setSalesOrderAssetBusiness(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      }; 

      const getSalesOrderAgency = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
          query.type=2
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getSalesOrder?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setSalesOrderAgencyBusiness(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

      const getPurchaeOrderAsset = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
          query.type=1
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getPurchaseOrder?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setPurchaseOrderAssetBusiness(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

      const getPurchaseOrderAgency = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
          query.type=2
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getPurchaseOrder?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setPurchaseOrderAgencyBusiness(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

      const getSalesOrderByCretor = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
        //   query.type=2
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getSalesOrderByCreater?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setSalesOrderByCreator(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

      const getSiteAvailabilityReport = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
        //   query.type=2
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getSitesByAvailabiltyStatus?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setSiteAvailabilityReport(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };

      const getSiteCategoryReport = async () => {
        setLoader(true);
        if (hasCookie("token")) {
          let token = getCookie("token");
          let db_name = getCookie("db_name");
    
          let header = {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer ".concat(token),
              db: db_name,
              m_id: 35,
            },
          };
    
          let query = {};
          if (financialYear)
            {
            query.financialYear = financialYear.slice(0,4)
            }
            else{
              query.financialYear = getCurrentFinancialYear().slice(0,4)
          }
        //   query.type=2
    
          const queryString = new URLSearchParams(query).toString();
    
          try {
            const response = await axios.get(
              Baseurl + `/db/media/dashboard/getSitesByCategory?${queryString} `,
              header
            );
            if (response?.status == 200 || response?.status == 201) {
              setLoader(false);
              setSiteCategoryReport(response.data.data);
            }
          } catch (error) {
            setLoader(false);
            if (error?.response?.data?.message) {
              toast.error(error.response.data.message);
            } else {
              toast.error("Something went wrong!");
            }
          }
        }
      };
   

    return (
        
       <>
                 {
            loader ?<div className={`main_Box  ${sideView}`}><Loader/></div>  :(
                <div className={`main_Box  ${sideView}`}>
            <div className="bread_head">
                <h3 className="content_head">DASHBOARD MEDIA</h3>
            </div>
            <div className="main_content dashboard indxx">
                <div className="">
                    <div className="dashboard_head">
                        <div className="time_filter">
                        <Col xs={12} sm={6} md={4} lg={2}>
          <label>Financial Year</label>
          <Select
            name="financialYear"
            options={financialYearOptions}
            value={financialYearOptions.find(option => option.value === financialYear)}
            onChange={(e) =>{ 
                setFinancialYear(e?.value || "")
                getSalesOrderAsset();
                getSalesOrderAgency();
                getPurchaeOrderAsset()
                getPurchaseOrderAgency()
                getSalesOrderByCretor()
                getSiteAvailabilityReport()
                getSiteCategoryReport()
            }}
            placeholder="Financial Year"
          />
        </Col>
                        </div>
                    </div>
                    <div className="cards_Box">
                       
                        

                    <div className='row'>
                            {salesOrderAssetBusiness?.length ?
                       <div className="col-xl-12 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Sales Order Asset Business'
                                            keyX='month'
                                            keyY='total'
                                            dataList={salesOrderAssetBusiness}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null} 

                             {salesOrderAgencyBusiness?.length ?
                       <div className="col-xl-12 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Sales Order Agency Business'
                                            keyX='month'
                                            keyY='total'
                                            dataList={salesOrderAgencyBusiness}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null}

                            {purchaseOrderAssetBusiness?.length ?
                       <div className="col-xl-12 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Puchase Order Asset Business'
                                            keyX='month'
                                            keyY='total'
                                            dataList={purchaseOrderAssetBusiness}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null}   

                            {purchaseOrderAgencyBusiness?.length ?
                       <div className="col-xl-12 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart
                                            head='Puchase Order Agency Business'
                                            keyX='month'
                                            keyY='total'
                                            dataList={purchaseOrderAgencyBusiness}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null}     

                            {salesOrderByCreator?.length ?
                       <div className="col-xl-12 col-md-12 col-lg-6 col-sm-12 mt-2"> 
                                <div className="">
                                    <div className="dash_card chartSec">
                                        <ReChart1
                                            head='Employee Performance Report'
                                            keyX='created_by'
                                            keyY='total'
                                            dataList={salesOrderByCreator}
                                        />
                                    </div>
                        </div>
                                </div> : 
                            null}  

                             {siteAvailabilityReport?.data?.length ?
                                // {dataList?.piechartOpp?.length ?
                            <div className="col-xl-12 col-md-6 col-12 col-sm-12">

                                <OpportunityCard
                                    head='Site Availability Report '
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    dataList={siteAvailabilityReport?.data}>
                                </OpportunityCard>
                            </div> : null}      

                            {siteCategoryReport?.data?.length ?
                                // {dataList?.piechartOpp?.length ?
                            <div className="col-xl-12 col-md-6 col-12 col-sm-12">

                                <OpportunityCard1
                                    head='Site Category Report '
                                    price='0'
                                    date={`${moment(startDate).format("DD-MM-YYYY")} to ${moment(endDate).format("DD-MM-YYYY")}`}
                                    dataList={siteCategoryReport?.data}>
                                </OpportunityCard1>
                            </div> : null}                         
                        </div>
                        
                    </div>
                </div>
            </div>

        </div>
            )
        }
       </>
    )
}

export default DashBoardScreen