import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Topnav from '../Basics/Topnav';
import SideBar from '../Basics/SideBar';
import SidebarDMS from '../DMS/Sidebar/SidebarDMS';
import SideBarChannel from '../Basics/SideBarChannel';
import SideBarSales from '../Basics/SideBarSales';
import { getCookie, hasCookie } from 'cookies-next';
import Tabs from '../DMS/Tabs/Tabs';

const Layout = ({Component, pageProps}) => {
    const userLogin = useSelector((state) => state.userLogin.value);
    const permission = useSelector((state) => state.permissionMode.value);
    const allowedpermission = useSelector((state) => state.permissionMode.allowedPermissions );
    
    const [showBasic, setShowBasic] = useState(false)
    const [sidebarMode,setSidebarMode]=useState('')
    const [allowedPermissions,setAllowedPermissions]=useState([])
    const [topnavPermission,setTopnavPermission]=useState("")
   
    const checkUSer = () => {
   
      if(hasCookie("user")){
        setShowBasic(true)
      }else if(hasCookie("Admin")){
        setShowBasic(false)
      }else{
        setShowBasic(false)
      }
    }
  
  
    const checkSidebar=()=> {
      if(hasCookie("crm")){
        setSidebarMode("crm")
        setTopnavPermission("crm")
      }else if(hasCookie("dms")){
        setSidebarMode("dms")
        setTopnavPermission("dms")
      }else if(hasCookie("sales")){
        setSidebarMode("sales")
        setTopnavPermission("sales")
      } else{
        setSidebarMode("channel")
        setTopnavPermission("channel")
      }
    }

    const checkAllowedPermissions=()=>{
      if(hasCookie("allowedPermissions")){
        setAllowedPermissions(JSON.parse(getCookie("allowedPermissions")))
      }
    }
  
    useEffect(() => {
      checkSidebar()
    }, [ permission]);
    
    useEffect(() => {
        checkUSer()
      }, [userLogin]);

      useEffect(() => {
        checkAllowedPermissions()
      }, [allowedpermission]);

  return (
    <>
    
            {showBasic ?
                <main className="main_wrapper">
                  
            <Topnav allowedPermissions={allowedPermissions} topnavPermission={topnavPermission} />
         
          <div className="content_wrapper">
             
              {sidebarMode==="crm" && <SideBar />}
              {sidebarMode==="dms" && <SidebarDMS/> }
              {sidebarMode==="channel" && <SideBarChannel    />}
              {sidebarMode==="sales" && <SideBarSales    />}
              <Component {...pageProps} />
            
                </div>
        </main>
      : 
      <Component {...pageProps} />
    }
    </>
  
  )
}

export default Layout