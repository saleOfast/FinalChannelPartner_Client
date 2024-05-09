import React, { useEffect, useState } from 'react'
import BasicRangeShortcuts from '../../DateRangeCustom/Daterange'
import { getCookie, hasCookie } from 'cookies-next';
import DashboardAdmin from '../Admin/DashboardAdmin/DashboardAdmin';
import DashboardUser from '../User/DashboardUser/DashboardUser';
const DashBoardScreenCHANNEL = () => {

  const[roleId,setRoleId]=useState()

  useEffect(() => {
    if (hasCookie("userInfo")) {
      const userInfoData = JSON.parse(getCookie("userInfo"));
      setRoleId(userInfoData.role_id)
    }
  }, []);

  return (
    <>
    {roleId === 1 &&  <DashboardUser />} 
    {roleId === null && <DashboardAdmin /> }
    </>
   
  )
}

export default DashBoardScreenCHANNEL