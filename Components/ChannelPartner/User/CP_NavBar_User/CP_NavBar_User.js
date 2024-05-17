import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Baseurl, filesUrl } from "../../../../Utils/Constants";
import { deleteCookie, getCookie, hasCookie, removeCookies, setCookie } from "cookies-next";
import { Dropdown } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import LogoutIcon from "../../../Svg/LogoutIcon";
import AvatarIcon from "../../../Svg/AvatarIcon";
import ConfirmBox from "./ConfirmBox";
import { useDispatch, useSelector } from "react-redux";
import { startLoading, stopLoading } from "../../../../store/loaderSlice";
import { clearMode } from "../../../../store/dbModeSlice";
import { LoggedOut } from "../../../../store/adMinLoginSlice";
import { userLogOut } from "../../../../store/ClientLoginSlice";
import { setActiveLink } from "../../../../store/cpActiveLinkSlice";

const CP_NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showConfirm, setshowConfirm] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [roleId,setRoleId]=useState();
  const dbMode = useSelector((state) => state.dbMode.value);

  const clientLogo= getCookie('clientLogo')? JSON.parse(getCookie('clientLogo')) : null;
  const activeLink=useSelector(state=>state.cpActiveLink.activeLink)

  const isActive = (pathname) => {
    return  activeLink===pathname ? "active" : "";
  };

  
  
  const logouthandler = () => {
    dispatch(startLoading());
    deleteCookie("clientBtnColor")
    setCookie("activeLink","/")
    const isAdminMode = dbMode === "admin";
    const isMasterOrUserMode = dbMode === "master" || dbMode === "user";
    setshowConfirm(!showConfirm);
    dispatch(clearMode());
    if (hasCookie("channel")) {
      router.push(isAdminMode ? "/Admin" : "/CHANNEL/Signin");
    } else {
      router.push(isAdminMode ? "/Admin" : "/");
    }
    dispatch(isAdminMode ? LoggedOut() : userLogOut());
    dispatch(stopLoading());
    toast.success("Logged Out Successfully");
  };

  const getUserInfo = async (id) => {
    if (hasCookie("token")) {
      let token = getCookie("token");
      let db_name = getCookie("db_name");

      let header = {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer ".concat(token),
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const response = await axios.get(
          Baseurl + `/db/users?id=${id}`,
          header
        );
        setUserInfo(response.data.data);
      } catch (error) {
        
        if (
          error?.response?.data?.message === "please login again token expired"
        ) {
          toast.error(error.response.data.message);
          dispatch(userLogOut());
          router.push("/");
        } else {
          toast.error("Something went wrong!");
        }
      }
    }
  };

  useEffect(() => {
    if (hasCookie("userInfo")) {
      const userInfoData = JSON.parse(getCookie("userInfo"));
      setRoleId(userInfoData.role_id)
      getUserInfo(userInfoData.user_code);
    }
  }, []);

  useEffect(() => {
    const activeLinkFromCookie = getCookie("activeLink")
    if (activeLinkFromCookie) {
      dispatch(setActiveLink(activeLinkFromCookie));
    }
  }, []);


  useEffect(() => {
    // Dynamically load Bootstrap JavaScript on the client-side
    if (typeof window !== 'undefined') {
      import('bootstrap/dist/js/bootstrap.bundle.min.js')
        .then(() => {
          // Bootstrap JavaScript is loaded, you can use Bootstrap components here
        })
        .catch((error) => {
          console.error('Error loading Bootstrap JavaScript:', error);
        });
    }
  }, []);



  return (
    <>
      <ConfirmBox
        showConfirm={showConfirm}
        setshowConfirm={setshowConfirm}
        actionType={logouthandler}
        title={"Are You Sure you want to Logout ?"}
      />

      {/* <section className="Reports-Dashboard bg-white">
        <nav
          className="navbar navbar-expand-lg navbar-light"
          style={{
            borderTop: "1px solid #F5F5F5",
            borderBottom: "1px solid #F5F5F5",
          }}
        >
          <div className="container-fluid mx-3">
            <div className="navbar-brand">
              <img
                src={`${filesUrl}/logo/images${clientLogo?.logo}`}
                alt=""
              />
            </div>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex gap-2 align-items-baseline">
                {
                  roleId===1 && (
                    <>
                      <li className="nav-item">
                  <Link className={`nav-link ${isActive("/")}`} href="/" 
                    onClick={()=>{
                      dispatch(setActiveLink("/"))
                      setCookie("activeLink","/")
                    }}
                  >
                    Reports & Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Leads"
                    )}`}
                    href="/CHANNEL/Leads"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Leads"))
                      setCookie("activeLink","/CHANNEL/Leads")
                    }}
                  >
                    Leads
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Bookings"
                    )}`}
                    href="/CHANNEL/Bookings"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Bookings"))
                      setCookie("activeLink","/CHANNEL/Bookings")
                    }}
                  >
                    Bookings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Visits"
                    )}`}
                    href="/CHANNEL/Visits"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Visits"))
                      setCookie("activeLink","/CHANNEL/Visits")
                    }}
                  >
                    Visits
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Brokerage"
                    )}`}
                    href="/CHANNEL/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Brokerage"))
                      setCookie("activeLink","/CHANNEL/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Campaign"
                    )}`}
                    href="/CHANNEL/Campaign"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Campaign"))
                      setCookie("activeLink","/CHANNEL/Campaign")
                    }}
                  >
                    Campaign
                  </Link>
                </li>
                    </>
                  )
                }
                {
                  roleId===2 && (
                    <>
                        <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Brokerage"
                    )}`}
                    href="/CHANNEL/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Brokerage"))
                      setCookie("activeLink","/CHANNEL/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
                </li>
                    </>
                  )
                }
                
                <li className="nav-item">
                  <div className="user_profile">
                    <Dropdown className="cp_nav_toggle">
                      <Dropdown.Toggle variant="none" id="profileBtn">
                        <div className="btn_wrapper d-flex align-items-center">
                          <div className="img_sec me-2">
                            <img
                              style={{
                                width: "30px",
                                height: "30px",
                                borderRadius: "50%",
                              }}
                              src={
                                userInfo?.db_user_profile?.user_image_file
                                  ? `${filesUrl}/lsUser/images${userInfo?.db_user_profile?.user_image_file}`
                                  : `/images/profile_picture.png`
                              }
                              alt="Profile"
                            />
                          </div>
                          <div className="name_sec">
                            <div className="name">
                              {userInfo.user ? userInfo.user : "user"}
                            </div>
                          </div>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Link href={"/CHANNEL/ChannelProfile"}>
                          <Dropdown.Item
                            className="d-flex align-items-center "
                            onClick={() => {
                              router.push("/CHANNEL/ChannelProfile");
                              dispatch(setActiveLink("/CHANNEL/ChannelProfile"))
                              setCookie("activeLink","/CHANNEL/ChannelProfile")
                            }}
                          >
                            <div style={{ width: "13px" }}>
                              <AvatarIcon  />
                            </div>
                            <span className="ms-1 ">Profile</span>
                          </Dropdown.Item>
                        </Link>
                        <Dropdown.Item
                          className="d-flex align-items-center"
                          onClick={() => {
                            setshowConfirm(!showConfirm);
                          }}
                        >
                          <div style={{ width: "13px" }}>
                            <LogoutIcon />
                          </div>
                          <span className="ms-1 ">Logout</span>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </section> */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white">
  <div className="container-fluid">
  <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt=""  />
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse " id="navbarNavDropdown">
      <ul className="navbar-nav ms-auto">
        {
          roleId===1 && (
            <>
                <li className="nav-item">
        <Link className={`nav-link ${isActive('/')}`} href="/"
                  onClick={()=>{
                    dispatch(setActiveLink("/"))
                    setCookie("activeLink","/")
                  }}
                >Reports & Dashboard</Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Leads"
                    )}`}
                    href="/CHANNEL/Leads"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Leads"))
                      setCookie("activeLink","/CHANNEL/Leads")
                    }}
                  >
                    Leads
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Bookings"
                    )}`}
                    href="/CHANNEL/Bookings"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Bookings"))
                      setCookie("activeLink","/CHANNEL/Bookings")
                    }}
                  >
                    Bookings
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Visits"
                    )}`}
                    href="/CHANNEL/Visits"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Visits"))
                      setCookie("activeLink","/CHANNEL/Visits")
                    }}
                  >
                    Visits
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Brokerage"
                    )}`}
                    href="/CHANNEL/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Brokerage"))
                      setCookie("activeLink","/CHANNEL/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Campaign"
                    )}`}
                    href="/CHANNEL/Campaign"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Campaign"))
                      setCookie("activeLink","/CHANNEL/Campaign")
                    }}
                  >
                    Campaign
                  </Link>
        </li>
            </>
          )
        }
        
        {
                  roleId===2 && (
                    <>
                        <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/CHANNEL/Brokerage"
                    )}`}
                    href="/CHANNEL/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/CHANNEL/Brokerage"))
                      setCookie("activeLink","/CHANNEL/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
                </li>
                    </>
                  )
                }
        <li className="nav-item">
                    <div className='user_profile'>
                    <Dropdown className='cp_nav_toggle' >
                  <Dropdown.Toggle variant="none" id="profileBtn">
                    <div className="btn_wrapper d-flex align-items-center">
                      <div className="img_sec me-2">
                        <img
                          style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                          src={
                            userInfo?.db_user_profile?.user_image_file
                              ? `${filesUrl}/lsUser/images${userInfo?.db_user_profile?.user_image_file}`
                              : `/images/profile_picture.png`
                          }
                          alt="Profile"
                        />
                      </div>
                      <div className="name_sec">
                        <div className="name">
                          {userInfo.user ? userInfo.user : "user"}
                        </div>
                        
                      </div>
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu  >
                    <Link href={"/CHANNEL/ChannelProfile"}>
                      <Dropdown.Item className='d-flex align-items-center' onClick={()=>{
                        router.push("/CHANNEL/ChannelProfile")
                        dispatch(setActiveLink("/CHANNEL/ChannelProfileAdmin"))
                        setCookie("activeLink","/CHANNEL/ChannelProfileAdmin")
                      }}>
                        <div style={{width:"15px"}}>
                      <AvatarIcon/>
                        </div>
                      <span className='ms-1 '>Profile</span> 
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Item className='d-flex align-items-center' onClick={() => {
                      setshowConfirm(!showConfirm)
                    }}>
                      <div style={{width:"15px"}}>
                      <LogoutIcon  />
                      </div>
                      <span className='ms-1 '>Logout</span>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                    </div>
              
              </li>
      </ul>
    </div>
  </div>
    </nav>

    </>
  );
};

export default CP_NavBar;
