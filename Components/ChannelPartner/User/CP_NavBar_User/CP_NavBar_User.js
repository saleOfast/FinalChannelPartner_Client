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
import { allowpermissions, clearValue } from "../../../../store/permissionSlice";

const CP_NavBar = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showConfirm, setshowConfirm] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [roleId,setRoleId]=useState();
  const dbMode = useSelector((state) => state.dbMode.value);
  const allowedpermission = hasCookie("allowedpermissions")? JSON.parse(getCookie("allowedpermissions")) :"";
  const clientLogo= getCookie('clientLogo')? JSON.parse(getCookie('clientLogo')) : null;
  const activeLink=useSelector(state=>state.cpActiveLink.activeLink)

  const isActive = (pathname) => {
    return  activeLink===pathname ? "active" : "";
  };

  
  
  const logouthandler = () => {
    dispatch(startLoading());
    deleteCookie("clientBtnColor")
    setCookie("activeLink","/partner")
    const isAdminMode = dbMode === "admin";
    const isMasterOrUserMode = dbMode === "master" || dbMode === "user";
    setshowConfirm(!showConfirm);
    dispatch(clearMode());
    if (hasCookie("channel")) {
      router.push(isAdminMode ? "/Admin" : "/partner");
      router.reload()

    } else {
      router.push(isAdminMode ? "/Admin" : "/");
      router.reload()

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

      

      <nav className="navbar navbar-expand-lg navbar-light bg-white">
  <div className="container-fluid">
  <img src={`${filesUrl}/logo/images${clientLogo?.logo}`} alt="normal"  />
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse " id="navbarNavDropdown">
      <ul className="navbar-nav ms-auto">
        {
          roleId===1 && (
            <>
                    {
                      hasCookie("channel") && allowedpermission?.length>1 && (
                        <li className='nav-item cursor-pointer pt-2' onClick={()=>{
                          deleteCookie("channel")
                          dispatch(clearValue()) //for clearing the value (initial state in permission mode)
                          router.push("/")
                        }}><img src='/switch.svg' style={{width:"15px",marginTop:"4px"}}/></li>
                      )
                    }
                <li className="nav-item">
        <Link className={`nav-link ${isActive('/partner')}`} href="/partner"
                  onClick={()=>{
                    dispatch(setActiveLink("/partner"))
                    setCookie("activeLink","/partner")
                  }}
                >Reports & Dashboard</Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Leads"
                    )}`}
                    href="/partner/Leads"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Leads"))
                      setCookie("activeLink","/partner/Leads")
                    }}
                  >
                    Leads
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Bookings"
                    )}`}
                    href="/partner/Bookings"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Bookings"))
                      setCookie("activeLink","/partner/Bookings")
                    }}
                  >
                    Bookings
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Visits"
                    )}`}
                    href="/partner/Visits"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Visits"))
                      setCookie("activeLink","/partner/Visits")
                    }}
                  >
                    Visits
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Brokerage"
                    )}`}
                    href="/partner/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Brokerage"))
                      setCookie("activeLink","/partner/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Campaign"
                    )}`}
                    href="/partner/Campaign"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Campaign"))
                      setCookie("activeLink","/partner/Campaign")
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
        <Link className={`nav-link ${isActive('/partner/ActivePartners')}`} href="/partner/ActivePartners"
                  onClick={()=>{
                    dispatch(setActiveLink("/partner/ActivePartners"))
                    setCookie("activeLink","/partner/ActivePartners")
                  }}
                >Channel Partners</Link>
        </li>
                     <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Leads"
                    )}`}
                    href="/partner/Leads"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Leads"))
                      setCookie("activeLink","/partner/Leads")
                    }}
                  >
                    Leads
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Bookings"
                    )}`}
                    href="/partner/Bookings"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Bookings"))
                      setCookie("activeLink","/partner/Bookings")
                    }}
                  >
                    Bookings
                  </Link>
        </li>
        <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Visits"
                    )}`}
                    href="/partner/Visits"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Visits"))
                      setCookie("activeLink","/partner/Visits")
                    }}
                  >
                    Visits
                  </Link>
        </li>
                        <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive(
                      "/partner/Brokerage"
                    )}`}
                    href="/partner/Brokerage"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Brokerage"))
                      setCookie("activeLink","/partner/Brokerage")
                    }}
                  >
                    Brokerage
                  </Link>
                </li>
                <li className="nav-item">
        <Link
                    className={`nav-link ${isActive(
                      "/partner/Campaign"
                    )}`}
                    href="/partner/Campaign"
                    onClick={()=>{
                      dispatch(setActiveLink("/partner/Campaign"))
                      setCookie("activeLink","/partner/Campaign")
                    }}
                  >
                    Campaign
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
                    
                      <Dropdown.Item className='d-flex align-items-center' onClick={()=>{
                        router.push("/partner/ChannelProfile")
                        dispatch(setActiveLink("/partner/ChannelProfileAdmin"))
                        setCookie("activeLink","/partner/ChannelProfileAdmin")
                      }}>
                        <div style={{width:"15px"}}>
                      <AvatarIcon/>
                        </div>
                      <span className='ms-1 '>Profile</span> 
                      </Dropdown.Item>
                    
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
