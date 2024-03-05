import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import DashbardIcon from "../Svg/DashbardIcon";
import ChevroletLeftIcon from "../Svg/ChevroletLeftIcon";
import SettingsIcon from "../Svg/SettingsIcon";
import BarsIcon from "../Svg/BarsIcon";
import CrossIcon from "../Svg/CrossIcon";
import TermsIcon from "../Svg/TermsIcon";
import SidebarSkelton from "./SidebarSkelton";
import { masterMode, userMode } from "../../store/dbModeSlice";
import { fullView, closedView } from "../../store/sideViewSlice";
import { LoggedOut } from "../../store/adMinLoginSlice";
import { userLogOut } from "../../store/ClientLoginSlice";
import { hasCookie, getCookie, setCookie, deleteCookie } from "cookies-next";
import { Baseurl, filesUrl } from "../../Utils/Constants";

const SideBar = ({ }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currActiveLink, setcurrActiveLink] = useState('');
  const dbMode = useSelector((state) => state.dbMode.value);
  const sideView = useSelector((state) => state.sideView.value);
  const isactiveValue = useSelector((state) => state.isActiveSlice.value);
  const [isactive, setIsActive] = useState(hasCookie("isActive")? getCookie("isActive"): 'dashboard')
  const [userInfo, setUserInfo] = useState({});
  const [userData, setUserData] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [sidebarLoaded, setSidebarLoaded] = useState(false);

  const sideToggle = () => {
    const isAdmin = hasCookie("sideUser");
    const mode = isAdmin ? "Admin" : "User";
    setCookie(`side${mode}`, "true");
    deleteCookie(`side${isAdmin ? "User" : "Admin"}`);
    dispatch(isAdmin ? masterMode() : userMode());
    toast.info(`Switched to ${mode} Mode`);
    router.push("/");
  };

  const handleClick = debounce(sideToggle, 500);

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

  const getSidebarInfo = async (navLink) => {
    if (!hasCookie('token')) {
      return;
    }

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
      const { data } = await axios.get(`${Baseurl}/db/permission/${navLink}`, header);
      setDynamicFields(data.data[0].children);
      setSidebarLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const sideViewFunc = () => {
    dispatch(sideView === 'open' ? closedView() : fullView());
  };

  function checkLogin(userData) {
    const isAdminMode = dbMode === "admin";
    const isUserOrMasterMode = dbMode === "user" || dbMode === "master";

    if (isAdminMode && (!hasCookie("Admin") || !hasCookie("SaLsUsr") || !hasCookie("saLsTkn"))) {
      router.push("/Admin");
      dispatch(LoggedOut());
      toast.error("Please Login To Continue");
    } else if (isUserOrMasterMode) {
      if (!(hasCookie("user") && hasCookie("userInfo") && hasCookie("token"))) {
        router.push("/");
        toast.error("Please Login To Continue ");
        dispatch(userLogOut());
      }
      deleteCookie("Admin");
      deleteCookie("saLsTkn");
    } else if (!(hasCookie("token") || hasCookie("saLsTkn"))) {
      toast.error("Please Login To Continue ");
      router.push("/");
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
      setUserInfo(userInfo);
      getUserInfo(userInfo.user_code);
    } else if (saLsUsrCookie) {
      const userInfo = JSON.parse(getCookie('SaLsUsr'));
      setUserInfo(userInfo);
    }

    checkLogin(userInfo);
  }, []);

  useEffect(() => {
    if (dbMode === 'user') {
      getSidebarInfo('nav')
    } else if (dbMode === 'master') {
      getSidebarInfo('admin-nav')
    }
  }, [dbMode, sidebarLoaded])

  useEffect(()=>{
    console.log("isactiveValue", isactiveValue)
    setIsActive(hasCookie("isActive")? getCookie("isActive"): isactiveValue)
  },[isactiveValue])
  return (
    <div className={`sideWrapper ${sideView}`}>
      <div className="hamburgerIcon">
        <div className="bar_icon" onClick={sideViewFunc}>
          <div className="webView">
            {sideView === 'open' ? <CrossIcon /> : <BarsIcon />}
          </div>
          <div className="mobileView">
            <BarsIcon />
          </div>
        </div>
      </div>
      {(dbMode === "user" || dbMode === "master") && (
        <ul className="sidebar-list">
          <Link href="/">
            <li title="Dashboard" className={`list-item ${isactive === "dashboard" ? "active" : ""}`}>
              <div className="linkBox">
                <div className="svg_icon">
                  <DashbardIcon />
                </div>
                <div className="link_name">
                  <div className="header"> Dashboard </div>
                </div>
              </div>
            </li>
          </Link>
          {sidebarLoaded && dynamicFields?.map(({ icon_path, allais_menu, menu_id, children }) => (
            <li onClick={() => openSideOpt(allais_menu)} key={menu_id} className={`list-item ${isactive === allais_menu ? "active" : ""}`}>
              <div className={`sideMenuBox ${currActiveLink === allais_menu ? "open" : "closed"}`}>
                <div className="header">
                  <div className="icon" title={allais_menu}>
                    {/* <img src={`${filesUrl}/sidebarIcons/${icon_path ? icon_path : `shield.svg`}`} alt="logo" width="100%" /> */}
                    <img src={`${filesUrl}/sidebarIcons/shield.svg`} alt="logo" width="100%" />
                  </div>
                  <div className="name">
                    {allais_menu}
                  </div>
                  <div className="rightIcon">
                    <ChevroletLeftIcon />
                  </div>
                </div>
                <div className="sidebar-sublist">
                  <ul className="sublists">
                    {children?.map((item) => (
                      <Link href={`/${item.link}`} key={item.menu_id}>
                        <li className="sub-list-item"> {item.allais_menu} </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
          {sidebarLoaded || (
            <li className="isloaderItem">
              <ul className="skeltonEffc">
                {[...Array(7)].map((_, index) => (
                  <SidebarSkelton key={index} />
                ))}
              </ul>
            </li>
          )}
        </ul>
      )}

      {dbMode === "admin" && (
        <ul className="sidebar-list">
          <Link href="/Admin">
            <li title="Dashboard" className={`list-item ${isactive === "dashboard" ? "active" : ""}`}>
              <div className="linkBox">
                <div className="svg_icon">
                  <DashbardIcon />
                </div>
                <div className="link_name">
                  <div className="header"> Dashboard </div>
                </div>
              </div>
            </li>
          </Link>
        </ul>
      )}

      {dbMode !== "admin" && userData?.hasMaster && (
        <div className="setting_btn">
          <div className="icon" onClick={handleClick}>
            <SettingsIcon />
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
