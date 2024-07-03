// import { useEffect, useState } from "react";
// import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
// import { useSelector, useDispatch } from "react-redux";
// import SignInScreen from "../Components/Basics/SignInScreen";
// import { UserLogIN, userLogOut } from "../store/ClientLoginSlice";
// import { useRouter } from "next/router";
// import Loader from "../Components/Loader/Loader";
// import Link from "next/link";
// import { crm, dms, sales, channel, clearValue } from "../store/permissionSlice";
// import { Baseurl, filesUrl } from "../Utils/Constants";
// import { toast } from "react-toastify";
// import axios from "axios";
// import moment from "moment";
// import mainIndexHOC from "../HOC/mainIndexHOC ";
// import { masterMode, userMode } from "../store/dbModeSlice";

// export default mainIndexHOC(function Home() {
//   const router = useRouter();
//   const dbMode = useSelector((state) => state.dbMode.value);
//   const loggedIn = useSelector((state) => state.userLogin.value);
//   const permission = useSelector((state) => state.permissionMode.value);
//   const isLoading = useSelector((state) => state.loader.isLoading);
//   const [clientData, setClientData] = useState();
//   const [dashbarMode, setDashboardMode] = useState();
//   const dispatch = useDispatch();
//   const allowedpermission = hasCookie("allowedpermissions")
//     ? JSON.parse(getCookie("allowedpermissions"))
//     : "";

//   // useEffect(() => {
//   //   if (hasCookie("Admin")) {
//   //     router.push("/admin");
//   //   }
//   //   if (!hasCookie("token")) {
//   //     dispatch(userLogOut());
//   //   } else {
//   //     dispatch(UserLogIN());
//   //   }
//   // }, []);

//   const onClickCommon = () => {
//     dispatch(crm());
//     const isAdmin = hasCookie("sideUser");
//     const mode = isAdmin ? "Admin" : "User";
//     setCookie(`side${mode}`, "true");
//     deleteCookie(`side${isAdmin ? "User" : "Admin"}`);
//     dispatch(isAdmin ? masterMode() : userMode());
//     // toast.info(`Switched to ${mode} Mode`);
//     router.push("/crm");
//   };

//   const subscriptionInfo = hasCookie("subscriptionInfo")
//     ? JSON.parse(getCookie("subscriptionInfo"))
//     : null;

//   const checkDashboard = () => {
//     if (hasCookie("crm")) {
//       setDashboardMode("crm");
//     } else if (hasCookie("dms")) {
//       setDashboardMode("dms");
//     } else if (hasCookie("sales")) {
//       setDashboardMode("sales");
//     } else {
//       setDashboardMode("channel");
//     }
//   };

//   useEffect(() => {
//     checkDashboard();
//   }, [permission]);

//   const handleClick = (permission) => {
//     if (permission === "crm") {
//       if (
//         subscriptionInfo?.subscription_end_date <
//         moment(Date.now()).format("YYYY-MM-DD")
//       ) {
//         return toast("Your CRM Subscription Has Ended");
//       } else {
//         router.push("/crm");
//         dispatch(crm());
//       }
//     } else if (permission === "channel") {
//       if (
//         subscriptionInfo?.subscription_end_date_channel <
//         moment(Date.now()).format("YYYY-MM-DD")
//       ) {
//         return toast("Your Channel Partner Subscription Has Ended");
//       } else {
//         dispatch(channel());
//         router.push("/partner");
//       }
//     } else if (permission === "dms") {
//       if (
//         subscriptionInfo?.subscription_end_date_dms <
//         moment(Date.now()).format("YYYY-MM-DD")
//       ) {
//         return toast("Your DMS Subscription Has Ended");
//       } else {
//         // dispatch(dms())
//         // router.push("/dms")
//       }
//     } else if (permission === "sales") {
//       if (
//         subscriptionInfo?.subscription_end_date_sales <
//         moment(Date.now()).format("YYYY-MM-DD")
//       ) {
//         return toast("Your Sales App Subscription Has Ended");
//       } else {
//         // dispatch(sales())
//         // router.push("/sales")
//       }
//     }
//   };

//   useEffect(() => {
//     const getSignInData = async () => {
//       try {
//         let baseUrl = window.location.origin;
//         if (baseUrl === "http://localhost:3000") {
//           baseUrl = "https://crm.saleofast.com";
//         }
//         const { data } = await axios.post(Baseurl + "/db/admin/url", {
//           client_url: `${baseUrl}`,
//         });
//         setClientData(data?.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     getSignInData();
//   }, []);

//   const user = hasCookie("user") ? true : false;

//   const platformImage = [
//     "/images/platform/CRM.png",
//     "/images/platform/COMMON.png",
//     "/images/platform/CHANNEL.png",
//     "/images/platform/DMS.png",
//   ];

//   const getPlatformFunc = (key = "crm") => {
//     let fileSRc = platformImage[0];
//     switch (key) {
//       case "crm":
//         fileSRc = platformImage[0];
//         break;
//       case "channel":
//         fileSRc = platformImage[2];
//         break;

//       case "dms":
//         fileSRc = platformImage[3];
//         break;

//       case "sales":
//         fileSRc = platformImage[1];
//         break;
//       default:
//         break;
//     }
//     return fileSRc;
//   };

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
//       ) : (
//         <>
//           {user ? (
//             <div className="NewLoginScreen bg-white w-100 overflow-auto">
//               <div className="row m-0 login">
//                 <div className="col-12 col-lg-6 m-0 p-0">
//                   <div className="form-left d-flex flex-column justify-content-between">
//                     <img
//                       src="/images/Ellipse26.png"
//                       alt="Background One"
//                       className="image-one"
//                     />
//                     <img
//                       src={
//                         clientData?.logo &&
//                         `${filesUrl}` + `/logo/images${clientData?.logo}`
//                       }
//                       alt="Logo"
//                       className=" mx-auto"
//                     />
//                     <img
//                       src="/images/Ellipse27.png"
//                       alt="Background Two"
//                       className="image-two d-none d-lg-block"
//                     />
//                   </div>
//                 </div>
//                 <div
//                   className="col-12 col-lg-6 d-flex align-items-center mt-5 justify-content-center"
//                   style={{ marginTop: "0%" }}
//                 >
//                   <div className="row w-100 d-flex justify-content-center">
//                     <div className="col-md-6 col-12 ">
//                       <div className="row">
//                         {allowedpermission?.map((permission, i) => (
//                           <div
//                             key={i}
//                             className="col-12 col-md-6 p-3 d-flex flex-column gap-2 align-items-center justify-content-end"
//                             onClick={() => {
//                               handleClick(permission);
//                             }}
//                           >
//                             <img
//                               src={getPlatformFunc(permission)}
//                               alt={permission}
//                               style={{ width: "100px" }}
//                             />
//                             <b className="fw-3 text-center">
//                               {permission.toUpperCase()}
//                             </b>
//                           </div>
//                         ))}
//                         <div
//                           className="col-12 col-md-6 p-3 d-flex flex-column gap-2 align-items-center justify-content-end"
//                           onClick={() => {
//                             onClickCommon();
//                           }}
//                         >
//                           <img
//                             src="/images/platform/COMMON.png"
//                             alt="COMMON"
//                             style={{ width: "100px" }}
//                           />
//                           <b className="fw-3 text-center">COMMON</b>
//                         </div>
//                       </div>
//                     </div>
//                     {/* If the number of icons is odd, add an empty div to balance the last row */}
//                     {/* {(allowedpermission.length + 1) % 2 !== 0 && (
//                       <div
//                         className="col-12 col-md-6 p-3"
//                         style={{ visibility: "hidden" }}
//                       />
//                     )} */}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <SignInScreen />
//           )}
//         </>
//       )}
//     </>
//   );
// });

import { useEffect, useState } from "react";
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next";
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
import { masterMode, userMode } from "../store/dbModeSlice";

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
  
    

    const onClickCommon = () => {
      dispatch(crm())
      const isAdmin = hasCookie("sideUser");
      const mode = isAdmin ? "Admin" : "User";
      setCookie(`side${mode}`, "true");
      deleteCookie(`side${isAdmin ? "User" : "Admin"}`);
      dispatch(isAdmin ? masterMode() : userMode());
      // toast.info(`Switched to ${mode} Mode`);
      router.push("/crm");  
    };

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
          dispatch(dms())
          router.push("/dms")
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
            baseUrl = "http://crm.cybermatrixsolutions.com";
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
    const userInfo=hasCookie("userInfo") ? JSON.parse(getCookie("userInfo")) :null

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
      <div className="h-100 w-100" >
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {user ? (
              <div className="NewLoginScreen bg-white w-100  overflow-auto">
                <div className="row m-0 login">
                  <div className="col-12 col-lg-6 m-0 p-0">
                    <div className="form-left d-flex flex-column justify-content-between">
                      <img
                        src="/images/Ellipse26.png"
                        alt="Background One"
                        className="image-one"
                      />{
                      clientData?.logo ? <img
                        src={
                          clientData?.logo &&
                          `${filesUrl}` + `/logo/images${clientData?.logo}`
                        }
                        alt="Logo"
                        className=" mx-auto"
                      /> : ""
                      }
                      <img
                        src="/images/Ellipse27.png"
                        alt="Background Two"
                        className="image-two d-none d-lg-block"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-lg-6 d-flex align-items-center mt-5 mt-md-0 justify-content-center" style={{ marginTop: '0%' }}>
                  <div className="row w-100 pb-5">
                    {allowedpermission?.map((permission, i) => (
                      <div
                        key={i}
                        className="col-12 col-md-6 p-3  d-flex flex-column gap-2 align-items-center justify-content-end "
                        onClick={() => {
                          handleClick(permission);
                        }}
                      >
                        <img
                          src={getPlatformFunc(permission)}
                          alt={permission}
                          style={{ width: '30%' }}
                          className=" cursor-pointer"
                        />
                        <b className="fw-3 text-center cursor-pointer ">{permission.toUpperCase()}</b>
                      </div>
                    ))}

                    {
                      userInfo && userInfo?.role_id ==null && userInfo?.isDB==true && (
                        <div
                        className="col-12 col-md-6 p-3 d-flex flex-column gap-2 align-items-center justify-content-end "
                        onClick={() => {
                          onClickCommon();
                        }}
                      >
                        <img
                          src="/images/platform/COMMON.png"
                          alt="COMMON"
                          style={{ width: '30%' }}
                          className=" cursor-pointer"
                        />
                        <b className="fw-3 text-center cursor-pointer">COMMON</b>
                      </div>
                      )
                    }

                    
                    {/* If the number of icons is odd, add an empty div to balance the last row */}
                    {((allowedpermission.length + 1) % 2 !== 0) && (
                      <div
                        className="col-12 col-md-6 p-3"
                        style={{ visibility: 'hidden' }}
                      />
                    )}
                  </div>
                </div>
                </div>
              </div>
            ) : (
              <SignInScreen />
            )}
          </>
        )}
      </div>
    );
  }
  
)