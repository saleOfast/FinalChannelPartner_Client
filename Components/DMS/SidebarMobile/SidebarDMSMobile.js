import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import debounce from "lodash.debounce";
import BarsIcon from "../../Svg/BarsIcon";
import CrossIcon from "../../Svg/CrossIcon";
import { masterMode, userMode } from "../../../store/dbModeSlice";
import { closedView, fullView } from "../../../store/sideViewSlice";
import { hasCookie, getCookie, setCookie, deleteCookie } from "cookies-next";
import { LoggedOut } from "../../../store/adMinLoginSlice";
import { userLogOut } from "../../../store/ClientLoginSlice";
import { Baseurl } from "../../../Utils/Constants";

const SidebarDMSMobile = ({}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currActiveLink, setcurrActiveLink] = useState("");
  const dbMode = useSelector((state) => state.dbMode.value);
  const sideView = useSelector((state) => state.sideView.value);
  const isactiveValue = useSelector((state) => state.isActiveSlice.value);
  const [isactive, setIsActive] = useState(
    hasCookie("isActive") ? getCookie("isActive") : "dashboard"
  );
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
    if (hasCookie("token")) {
      const token = getCookie("token");
      const db_name = getCookie("db_name");
      const header = {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          db: db_name,
          pass: "pass",
        },
      };

      try {
        const response = await axios.get(
          `${Baseurl}/db/users?id=${id}`,
          header
        );
        setUserData(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getSidebarInfo = async (navLink) => {
    if (!hasCookie("token")) {
      return;
    }

    const token = getCookie("token");
    const db_name = getCookie("db_name");
    const header = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        db: db_name,
        pass: "pass",
      },
    };

    try {
      const { data } = await axios.get(
        `${Baseurl}/db/permission/${navLink}`,
        header
      );
      setDynamicFields(data.data[0].children);
      setSidebarLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const sideViewFunc = () => {
    dispatch(sideView === "open" ? closedView() : fullView());
  };

  function checkLogin(userData) {
    const isAdminMode = dbMode === "admin";
    const isUserOrMasterMode = dbMode === "user" || dbMode === "master";

    if (
      isAdminMode &&
      (!hasCookie("Admin") || !hasCookie("SaLsUsr") || !hasCookie("saLsTkn"))
    ) {
      router.push("/admin");
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
    if (window.innerWidth >= 500) {
      dispatch(fullView());
    }
    setcurrActiveLink(currActiveLink === value ? "" : value);
  }

  useEffect(() => {
    if (window.innerWidth <= 500) {
      dispatch(closedView());
    }
  }, [dispatch]);

  useEffect(() => {
    const sideUserCookie = hasCookie("sideUser");
    const sideAdminCookie = hasCookie("sideAdmin");
    const userInfoCookie = hasCookie("userInfo");
    const saLsUsrCookie = hasCookie("SaLsUsr");

    if (sideUserCookie) {
      dispatch(userMode());
    } else if (sideAdminCookie) {
      dispatch(masterMode());
    }

    if (userInfoCookie) {
      const userInfo = JSON.parse(getCookie("userInfo"));
      setUserInfo(userInfo);
      getUserInfo(userInfo.user_code);
    } else if (saLsUsrCookie) {
      const userInfo = JSON.parse(getCookie("SaLsUsr"));
      setUserInfo(userInfo);
    }

    checkLogin(userInfo);
  }, []);

  useEffect(() => {
    if (dbMode === "user") {
      getSidebarInfo("nav");
    } else if (dbMode === "master") {
      getSidebarInfo("admin-nav");
    }
  }, [dbMode, sidebarLoaded]);

  useEffect(() => {
    console.log("isactiveValue", isactiveValue);
    setIsActive(hasCookie("isActive") ? getCookie("isActive") : isactiveValue);
  }, [isactiveValue]);
  return (
    <div className={`sideWrapper ${sideView}`}>
      <div className="hamburgerIcon">
        <div className="bar_icon" onClick={sideViewFunc}>
          <div className="webView">
            {sideView === "open" ? <CrossIcon /> : <BarsIcon />}
          </div>
          <div className="mobileView">
            {/* <BarsIcon /> */}
            {sideView === "open" ? <CrossIcon /> : <BarsIcon />}
          </div>
        </div>
      </div>
      {(dbMode === "user" || dbMode === "master") && (
        <section className="sidebar ">
          <div className="container">
            <div className="row">
              <div className="col-9 bg-white vh-100">
                <div>
                  <div
                    className="row pt-3 pb-3"
                    style={{ backgroundColor: "#00498B" }}
                  >
                    <div className="col-12 d-flex">
                      <div className="text-center card-box bg-transparent p-0 mb-0">
                        <div className="member-card d-flex flex-column">
                          <div className="thumb-lg member-thumb text-start">
                            <img
                              src="/DMS_IMAGES/sidebar_profile.png"
                              className
                              alt="profile-image"
                            />
                          </div>
                          <div className="name text-start">
                            <h4 className="mb-0">Hey Nitin</h4>
                            <span>View Profile</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  <ul className="list-unstyled mb-0">
                    <li className="active">
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        My Orders
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        My Payments
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Place Order
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Place Order
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        My Wallet
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Reports and Dashboard
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Samples and Gifts
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Reset Password
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        My Inventory
                      </a>
                    </li>
                    <li className>
                      <a
                        href="#"
                        className="text-decoration-none  py-2 d-block"
                      >
                        Help and Support
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="row">
                  <div className="col-12 d-flex flex-column justify-content-between ">
                    <button className="border-0 bg-transparent text-start">
                      <a
                        href="#"
                        className="text-decoration-none d-flex gap-2 align-items-center"
                      >
                        Sign Out{" "}
                        <i className="fa-solid fa-arrow-right-from-bracket" />
                      </a>
                    </button>
                  </div>
                </div>
                <div className="col-3" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default SidebarDMSMobile;
