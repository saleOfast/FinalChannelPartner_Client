import { useEffect, useState } from "react";
import { getCookie, hasCookie, setCookie } from "cookies-next";
import { useSelector, useDispatch } from "react-redux";
import SignInScreen from "../Components/Basics/SignInScreen";
import { UserLogIN, userLogOut } from "../store/ClientLoginSlice";
import { useRouter } from "next/router";
import Loader from "../Components/Loader/Loader";
import Link from "next/link";
import { crm, dms, sales, channel, clearValue } from "../store/permissionSlice";
import { Baseurl, filesUrl } from "../Utils/Constants";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import mainIndexHOC from "../HOC/mainIndexHOC ";

export default mainIndexHOC(
  function Home() {
    const router = useRouter();
    const dbMode = useSelector((state) => state.dbMode.value);
    const loggedIn = useSelector((state) => state.userLogin.value);
    const permission = useSelector((state) => state.permissionMode.value);
    const isLoading = useSelector((state) => state.loader.isLoading);
    const [clientData, setClientData] = useState();
    const [dashbarMode, setDashboardMode] = useState();
    const dispatch = useDispatch();
    const allowedpermission = hasCookie("allowedpermissions")
      ? JSON.parse(getCookie("allowedpermissions"))
      : "";
  
    // useEffect(() => {
    //   if (hasCookie("Admin")) {
    //     router.push("/admin");
    //   }
    //   if (!hasCookie("token")) {
    //     dispatch(userLogOut());
    //   } else {
    //     dispatch(UserLogIN());
    //   }
    // }, []);
    const subscriptionInfo = hasCookie("subscriptionInfo")
      ? JSON.parse(getCookie("subscriptionInfo"))
      : null;
  
    const checkDashboard = () => {
      if (hasCookie("crm")) {
        setDashboardMode("crm");
      } else if (hasCookie("dms")) {
        setDashboardMode("dms");
      } else if (hasCookie("sales")) {
        setDashboardMode("sales");
      } else {
        setDashboardMode("channel");
      }
    };
  
    useEffect(() => {
      checkDashboard();
    }, [permission]);
  
  
    const handleClick = (permission) => {
      if (permission === "crm") {
        if (
          subscriptionInfo?.subscription_end_date <
          moment(Date.now()).format("YYYY-MM-DD")
        ) {
          return toast("Your CRM Subscription Has Ended");
        } else {
          router.push("/crm");
          dispatch(crm());
        }
      } else if (permission === "channel") {
        if (
          subscriptionInfo?.subscription_end_date_channel <
          moment(Date.now()).format("YYYY-MM-DD")
        ) {
          return toast("Your Channel Partner Subscription Has Ended");
        } else {
          dispatch(channel());
          router.push("/partner");
        }
      } else if (permission === "dms") {
        if (
          subscriptionInfo?.subscription_end_date_dms <
          moment(Date.now()).format("YYYY-MM-DD")
        ) {
          return toast("Your DMS Subscription Has Ended");
        } else {
          // dispatch(dms())
          // router.push("/dms")
        }
      } else if (permission === "sales") {
        if (
          subscriptionInfo?.subscription_end_date_sales <
          moment(Date.now()).format("YYYY-MM-DD")
        ) {
          return toast("Your Sales App Subscription Has Ended");
        } else {
          // dispatch(sales())
          // router.push("/sales")
        }
      }
    };
  
    useEffect(() => {
      const getSignInData = async () => {
        try {
          let baseUrl = window.location.origin;
          if (baseUrl === "http://localhost:3000") {
            baseUrl = "https://crm.saleofast.com";
          }
          const { data } = await axios.post(Baseurl + "/db/admin/url", {
            client_url: `${baseUrl}`,
          });
          setClientData(data?.data);
        } catch (error) {
          console.log(error);
        }
      };
      getSignInData();
    }, []);
    
    const user=hasCookie("user") ? true :false;

    const platformImage = [
      '/images/platform/CRM.png',
      '/images/platform/COMMON.png',
      '/images/platform/CHANNEL.png',
      '/images/platform/DMS.png',
    ]

    const getPlatformFunc = (key = 'crm') => {
      let fileSRc = platformImage[0]
      switch (key) {
        case 'crm':
          fileSRc = platformImage[0]
          break;
        case 'channel':
          fileSRc = platformImage[2]
          break;

        case 'dms':
          fileSRc = platformImage[3]
          break;

        case 'sales':
          fileSRc = platformImage[1]
          break;
        default:
          break;
      }
      return fileSRc;
    }


    return (
      <>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {user ? (
              <div className="NewLoginScreen bg-white w-100 overflow-auto">
                <div className="row m-0 login">
                  <div className="col-12 col-lg-6 m-0 p-0">
                    <div className="form-left d-flex flex-column justify-content-between">
                      <img
                        src="/images/Ellipse26.png"
                        alt="Background One"
                        className="image-one"
                      />
                      <img
                        src={
                          clientData?.logo &&
                          `${filesUrl}` + `/logo/images${clientData?.logo}`
                        }
                        alt="Logo"
                        className="logo mx-auto"
                      />
                      <img
                        src="/images/Ellipse27.png"
                        alt="Background Two"
                        className="image-two d-none d-lg-block"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center">
                    <div className="row">
                      {allowedpermission?.map((permission, i) => (
                        <div
                          key={i}
                          className="col-3 col-md-3 p-3 d-flex flex-column gap-2 align-items-center justify-content-end"
                          onClick={() => {
                            handleClick(permission);
                          }}
                        >
                              <img
                                src={getPlatformFunc(permission)}
                                alt="Background Two"
                                className="w-50 h-50"
                              />
                              <b className="fw-3 text-center">  {permission.toUpperCase()} </b>
                          {/* <div
                            className="text-center text-white fw-bold rounded-lg p-3 fs-5 cursor-pointer"
                            style={{
                              backgroundColor: clientData?.button_color
                                ? clientData?.button_color
                                : "#0460E7",
                            }}
                          >
                            {permission.toUpperCase()}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <SignInScreen />
            )}
          </>
        )}
      </>
    );
  }
  
)