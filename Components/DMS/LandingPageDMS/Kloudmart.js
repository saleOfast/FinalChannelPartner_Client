import React,{useEffect, useState} from 'react'
import { Baseurl, filesUrl } from '../../../Utils/Constants';
import axios from 'axios';
import { deleteCookie, getCookie, hasCookie } from 'cookies-next';
import { clearValue } from '../../../store/permissionSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

const Kloudmart = () => {
  const router=useRouter()
  const dispatch=useDispatch()
  const clientLogo=hasCookie("clientLogo") ? JSON.parse( getCookie("clientLogo")) : null;

  return (  
    <section className="kloudmart">
    <div className="container">
      <div className="d-flex align-items-center gap-2">
        <button className="toggle_btn"><i className="fa-solid fa-bars" /></button>
        {
                      clientLogo?.logo ? <img
                        src={
                          clientLogo?.logo &&
                          `${filesUrl}` + `/logo/images${clientLogo?.logo}`
                        }
                        alt="Logo"
                        className=" mx-auto"
                      /> : ""
                      }
      </div>
      <div className="d-flex gap-3">
      {
                      // hasCookie("channel") && allowedpermission?.length>1 && (
                      hasCookie("dms") &&  (
                       <img src='/switch.svg' style={{width:"15px",marginTop:"4px"}} onClick={()=>{
                        deleteCookie("dms")
                        dispatch(clearValue()) //for clearing the value (initial state in permission mode)
                        router.push("/")
                      }}/>
                      )
                    }
        <img src="/DMS_IMAGES/notification.png"  />
        <img src="/DMS_IMAGES/Profile.png"  />
      </div>
    </div>
  </section>
  )
}

export default Kloudmart