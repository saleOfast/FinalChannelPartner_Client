import React, { useEffect, useState } from "react";
import ContactIcon from "../Svg/ContactIcon";
import DashbardIcon from "../Svg/DashbardIcon";
import LeadsIcon from "../Svg/LeadsIcon";
import OpportunityIcon from "../Svg/OpportunityIcon";
import ProductIcon from "../Svg/ProductIcon";
import QuationIcon from "../Svg/QuationIcon";
import Dropdown from "react-bootstrap/Dropdown";
import TasksIcon from "../Svg/TasksIcon";
import UserIcon from "../Svg/UserIcon";
import ChevroletLeftIcon from "../Svg/ChevroletLeftIcon";
import Link from "next/link";
import SettingsIcon from "../Svg/SettingsIcon";
import { useSelector, useDispatch } from "react-redux";
import { masterMode, userMode } from "../../store/dbModeSlice";
import { fullView, closedView } from "../../store/sideViewSlice";
import { useRouter } from "next/router";
import SettingSuperadminIcon from "../Svg/SettingSuperadminIcon";
import OrganisationIcon from "../Svg/OrganisationIcon";
import LeadManageIcon from "../Svg/LeadManageIcon";
import ProductManageIcon from "../Svg/ProductManageIcon";
import { hasCookie, getCookie, setCookie, deleteCookie } from "cookies-next";
import { toast } from "react-toastify";
import { LoggedOut } from "../../store/adMinLoginSlice";
import { userLogOut } from "../../store/ClientLoginSlice";
import BarsIcon from '../Svg/BarsIcon';
import CrossIcon from '../Svg/CrossIcon';
import ClipBoardIcon from '../Svg/ClipBoardIcon';
import AttendenceIcon from "../Svg/AttendenceIcon";
import TermsIcon from "../Svg/TermsIcon";
import ExpenseIcon from "../Svg/ExpenseIcon";
import axios from "axios";
import { Baseurl } from "../../Utils/Constants";
import CloneIcon from "../Svg/CloneIcon";

const SidebarCopy= ({ isactive, mode }) => {
  const router = useRouter();
  const dbMode = useSelector((state) => state.dbMode.value);
  const sideView = useSelector((state) => state.sideView.value);
  const dispatch = useDispatch();
  const [currActiveLink, setcurrActiveLink] = useState('')
  const [userInfo, setuserInfo] = useState({})
  const [userData, setUserData] = useState({})

  const sideToggle = () => {
    const isAdmin = hasCookie("sideUser");
    const mode = isAdmin ? "Admin" : "User";
    setCookie(`side${mode}`, "true");
    deleteCookie(`side${isAdmin ? "User" : "Admin"}`);
    dispatch(isAdmin ? masterMode() : userMode());
    toast.info(`Switched to ${mode} Mode`);
    router.push("/");
  };

  const handleClick = () => debouncedSideToggle();

  const debouncedSideToggle = debounce(sideToggle, 500);

  function debounce(func, delay) {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }

  const getUserInfo = async (id) => {
    if (hasCookie('token')) {
      const token = getCookie('token');
      const db_name = getCookie('db_name');
      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          pass: 'pass'
        }
      };
      try {
        const response = await axios.get(`${Baseurl}/db/users?id=${id}`, header);
        setUserData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const sideViewFunc = () => {
    if (sideView === 'open') {
      dispatch(closedView());
    } else {
      dispatch(fullView());
    }
  };

  function checkLogin(userData) {
    const isAdminMode = dbMode === "admin";
    const isUserOrMasterMode = dbMode === "user" || dbMode === "master";

    if (isAdminMode) {
      const adminCookieMissing = !hasCookie("Admin") || !hasCookie("SaLsUsr") || !hasCookie("saLsTkn");
      if (adminCookieMissing) {
        router.push("/Admin");
        dispatch(LoggedOut());
        toast.error("Please Login To Continue");
      }
    } else {
      if (isUserOrMasterMode) {
        const userCookieMissing = !hasCookie("user") || !hasCookie("userInfo") || !hasCookie("token");
        if (userCookieMissing) {
          router.push("/");
          toast.error("Please Login To Continue");
          dispatch(userLogOut());
        }
        if (hasCookie("Admin")) {
          deleteCookie('Admin');
        }
        if (hasCookie("saLsTkn")) {
          deleteCookie('saLsTkn');
        }
      } else {
        const tokenAndSaLsTknMissing = !hasCookie("token") && !hasCookie("saLsTkn");
        if (tokenAndSaLsTknMissing) {
          toast.error("Please Login To Continue");
          router.push("/");
        }
      }
    }
  }


  function openSideOpt(value) {
    dispatch(fullView());
    setcurrActiveLink(currActiveLink === value ? '' : value);
  }

  useEffect(() => {
    if (window.innerWidth <= 500) {
      dispatch(closedView());
    }
  }, []);

  useEffect(() => {
    const sideUserCookie = hasCookie('sideUser');
    const sideAdminCookie = hasCookie('sideAdmin');
    const userInfoCookie = hasCookie('userInfo');
    const saLsUsrCookie = hasCookie('SaLsUsr');

    if (sideUserCookie) {
      dispatch(userMode());
    } else if (sideAdminCookie) {
      dispatch(masterMode());
    }

    if (userInfoCookie) {
      const userInfo = JSON.parse(getCookie('userInfo'));
      setuserInfo(userInfo);
      getUserInfo(userInfo.user_code);
    } else if (saLsUsrCookie) {
      const userInfo = JSON.parse(getCookie('SaLsUsr'));
      setuserInfo(userInfo);
    }

    checkLogin(userInfo);
  }, []);


  useEffect(() => {
    if (hasCookie("sideAdmin")) {
      dispatch(masterMode());
    }
  }, []);


  return (
    <>
      <div className={`sideWrapper ${sideView}`}  >
        <div className="hamburgerIcon">
          <div className="bar_icon" onClick={sideViewFunc}>
            <div className="webView"> {sideView == 'open' ? <CrossIcon /> : <BarsIcon />} </div>
            <div className="mobileView"><BarsIcon /></div>

          </div>
        </div>
        {dbMode === "user" ? (
          <ul className="sidebar-list">

            <Link href="/">
              <li title="Dashboard" className={isactive === "dashboard" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <DashbardIcon />
                  </div>
                  <div className="link_name">

                    <div className="header"> Dashboard </div>
                  </div>
                </div>
              </li>
            </Link>

            <li title="Leads" onClick={() => openSideOpt('Leads')} className={isactive === "leads" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Leads' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <LeadsIcon />
                  </div>
                  <div className="name">
                    Leads
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/ManageLeads">
                      <li className="sub-list-item"> Manage leads </li>
                    </Link>
                    <Link href='/AssignLeads'>
                      <li className="sub-list-item"> Manual Assign Leads</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <li onClick={() => openSideOpt('tasks')} className={isactive === "tasks" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'tasks' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon" title="Tasks & Events">
                    <TasksIcon />
                  </div>
                  <div className="name">
                    Tasks & Events
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/TaskScreen">
                      <li className="sub-list-item"> Tasks </li>
                    </Link>
                    <Link href='/EventScreen'>
                      <li className="sub-list-item"> Events </li>
                    </Link>
                  </ul>
                </div>
              </div>
            </li>

            <Link href="/Accounts">
              <li title="Account" onClick={() => openSideOpt('Account')} className={isactive === "account" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <UserIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Account </div>
                  </div>
                </div>
              </li>
            </Link>

            <Link href="/Contacts">
              <li title="Contact" onClick={() => openSideOpt('Contact')} className={isactive === "contact" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <ContactIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Contacts </div>
                  </div>
                </div>
              </li>
            </Link>

            <Link href="/Opportunity">
              <li title="Opportunity" onClick={() => openSideOpt('Opportunity')} className={isactive === "opportunity" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <OpportunityIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Opportunity </div>
                  </div>
                </div>
              </li>
            </Link>



            <Link href="/Quotations">
              <li title="Quotations" onClick={() => openSideOpt('Quotations')} className={isactive === "quotation" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <QuationIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Quotations </div>
                  </div>
                </div>
              </li>
            </Link>


            {/*   <li title="Leave" onClick={() => openSideOpt('Leave')} className={isactive === "leave" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Leave' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <ClipBoardIcon />
                  </div>
                  <div className="name">
                    Leave Application
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/Leave">
                      <li className="sub-list-item"> Leave Aproval </li>
                    </Link>
                    <Link href='/ApplyLeave'>
                      <li className="sub-list-item"> Leave Application</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li> */}

            <li title="HR Process" onClick={() => openSideOpt('HRProcess')} className={isactive === "HRProcess" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'HRProcess' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <AttendenceIcon />
                  </div>
                  <div className="name">
                    HR Process
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/Leave">
                      <li className="sub-list-item"> Leave Aproval </li>
                    </Link>
                    <Link href='/ApplyLeave'>
                      <li className="sub-list-item"> Leave Application</li>
                    </Link>
                    <Link href="/AttendenceList">
                      <li className="sub-list-item"> Attendence List </li>
                    </Link>
                    <Link href='/Attendence'>
                      <li className="sub-list-item"> Mark Attendence</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>


            <li title="Expense" onClick={() => openSideOpt('Expense')} className={isactive === "expense" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Expense' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <ExpenseIcon />
                  </div>
                  <div className="name">
                    Expenses
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/Expense">
                      <li className="sub-list-item"> Expenses </li>
                    </Link>
                    <Link href='/ApplyExpense'>
                      <li className="sub-list-item"> Apply Expense</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

          </ul>
        ) : null}

        {dbMode === "master" ? (
          <ul className="sidebar-list">
            <Link href="/">
              <li title="adminDash" className={isactive === "dashboard" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <DashbardIcon />
                  </div>
                  <div className="link_name">

                    <div className="header"> Dashboard </div>
                  </div>
                </div>
              </li>
            </Link>

            <Link href="/UserProfileManagement">
              <li title="User Profile Master" onClick={() => openSideOpt('User Profile Management')} className={isactive === "userProfile" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <SettingSuperadminIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> User Profile Master </div>
                  </div>
                </div>
              </li>
            </Link>

            <li title="Task Master" onClick={() => openSideOpt('Task Management')} className={isactive === "taskManage" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Task Management' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <TasksIcon />
                  </div>
                  <div className="name">
                    Task Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/ManageTaskStatus">
                      <li className="sub-list-item"> Tasks Status Master</li>
                    </Link>
                    <Link href="/ManageTaskPriority">
                      <li className="sub-list-item"> Tasks Priority Master</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <Link href="/ManageUsers">
              <li title="User Master" onClick={() => openSideOpt('Manage User')} className={isactive === "userManage" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <UserIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> User Master </div>
                  </div>
                </div>
              </li>
            </Link>

            <li title="Organization Master" onClick={() => openSideOpt('Organization')} className={isactive === "organization" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Organization' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <OrganisationIcon />
                  </div>
                  <div className="name">
                    Organization Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/Managedivision">
                      <li className="sub-list-item"> Division Master</li>
                    </Link>
                    <Link href="/ManageDepartment">
                      <li className="sub-list-item"> Department Master</li>
                    </Link>
                    <Link href="/ManageDesignation">
                      <li className="sub-list-item"> Designation Master</li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <li title="Lead Master" onClick={() => openSideOpt('Lead Management')} className={isactive === "leadManage" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Lead Management' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <LeadManageIcon />
                  </div>
                  <div className="name">
                    Lead Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/ManageLeadIndustry">
                      <li className="sub-list-item">
                        Lead Industry Master
                      </li>
                    </Link>
                    <Link href="/ManageLeadRating">
                      <li className="sub-list-item">Lead Rating Master </li>
                    </Link>
                    <Link href="/ManageLeadSource">
                      <li className="sub-list-item">Lead Source Master </li>
                    </Link>
                    <Link href="/ManageLeadStage">
                      <li className="sub-list-item"> Lead Stage Master </li>
                    </Link>
                    <Link href="/ManageLeadStatus">
                      <li className="sub-list-item"> Lead Status Master</li>
                    </Link>
                    <Link href="/ManageLeadType">
                      <li className="sub-list-item"> Lead Type Master </li>
                    </Link>
                    <Link href="/ManageLossReason">
                      <li className="sub-list-item"> Loss Reason Master </li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <Link href="/ManageAccountType">
              <li title="Account Type Master" onClick={() => openSideOpt('Account Type')} className={isactive === "accountManage" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <UserIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Account Type Master </div>
                  </div>
                </div>
              </li>
            </Link>

            <Link href="/TaxScreen">
              <li title="Taxes Master" onClick={() => openSideOpt('Manage taxes')} className={isactive === "taxManage" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <img className="side_link" src="/images/taxIcon.png" alt="" />
                  </div>
                  <div className="link_name">
                    <div className="header"> Taxes Master </div>
                  </div>
                </div>
              </li>
            </Link>


            <li title="Leave" onClick={() => openSideOpt('Opportunity')} className={isactive === "opportunity" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Opportunity' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <OpportunityIcon />
                  </div>
                  <div className="name">
                    Opportunity Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/OpportunityManagement">
                      <li className="sub-list-item"> Opportunity Stage Master  </li>
                    </Link>
                    <Link href='/ManageOpportunityTypeMaster'>
                      <li className="sub-list-item"> Opportunity Type Master </li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <li title="Leave" onClick={() => openSideOpt('Product')} className={isactive === "product" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'Product' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <ProductIcon />
                  </div>
                  <div className="name">
                    Product Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/Products">
                      <li className="sub-list-item"> Product </li>
                    </Link>
                    <Link href='/ManageProductCategory'>
                      <li className="sub-list-item"> Product Category Master </li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>

            <Link href="/ManageQuotationStatus">
              <li title="Quatation Status Master" onClick={() => openSideOpt('Quatation Status')} className={isactive === "QuotationsManage" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <QuationIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Quatation Status Master </div>
                  </div>
                </div>
              </li>
            </Link>

            <li title="HR Process" onClick={() => openSideOpt('HRProcessMaster')} className={isactive === "HRProcess" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'HRProcessMaster' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <TermsIcon />
                  </div>
                  <div className="name">
                    HR Process Masters
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>

                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href='/ManageLeaveHeadScreen'>
                      <li className="sub-list-item"> Leave Head Master </li>
                    </Link>
                    <Link href='/ManagePolicyHeadScreen'>
                      <li className="sub-list-item"> Policy Head Master </li>
                    </Link>
                  </ul>
                </div>

              </div>
            </li>
            <Link href="/AdditionalFields">
              <li title="Dynamic Fields" onClick={() => openSideOpt('dynamicFields')} className={isactive === "dynamicFields" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <CloneIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Dynamic Field </div>
                  </div>
                </div>
              </li>
            </Link>
            {/* <li title="Task Master" onClick={() => openSideOpt('dynamicFields')} className={isactive === "dynamicFields" ? "list-item active" : "list-item"}>
              <div className={currActiveLink == 'dynamicFields' ? "sideMenuBox open" : 'sideMenuBox closed'}>
                <div className="header">
                  <div className="icon">
                    <TasksIcon />
                  </div>
                  <div className="name">
                     Field Master
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>
                <div className="sidebar-sublist">
                  <ul className="sublists">
                    <Link href="/AdditionalFields">
                      <li className="sub-list-item"> Dynamic Field</li>
                    </Link>
                  </ul>
                </div>
              </div>
            </li> */}
             {/*  <Link href="/ManageLeaveHeadScreen">
              <li title="Leave Head Master" onClick={() => openSideOpt('Leave Type')} className={isactive === "leaveType" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon x2">
                    <ClipBoardIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Leave Head Master </div>
                  </div>
                </div>
              </li>
            </Link>

            <Link href="/ManagePolicyHeadScreen">
              <li title="Leave Type Master" onClick={() => openSideOpt('Leave Type')} className={isactive === "policy" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon x2">
                    <TermsIcon />
                  </div>
                  <div className="link_name">
                    <div className="header"> Policy Head Master </div>
                  </div>
                </div>
              </li>
            </Link> */}
          </ul>
        ) : null}

        {dbMode === "admin" ? (
          <ul className="sidebar-list">
            <Link href="/Admin">
              <li title="Dashboard" className={isactive === "dashboard" ? "list-item active" : "list-item"} >
                <div className="linkBox ">
                  <div className="svg_icon">
                    <DashbardIcon />
                  </div>
                  <div className="link_name">

                    <div className="header"> Dashboard </div>
                  </div>
                </div>
              </li></Link>
          </ul>
        ) : null}

        {dbMode === "admin" ? null : <>
          {userData?.hasMaster ?
            <div className="setting_btn">
              <div className="icon" onClick={handleClick}>
                <SettingsIcon />
              </div>
            </div> : null} </>
        }
      </div>
    </>
  );
};

export default SidebarCopy;
