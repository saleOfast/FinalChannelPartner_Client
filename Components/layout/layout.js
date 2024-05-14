import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Topnav from '../Basics/Topnav';
import SideBar from '../Basics/SideBar';
import SidebarDMS from '../DMS/Sidebar/SidebarDMS';
import SideBarChannel from '../Basics/SideBarChannel';
import Loader from '../Loader/Loader';
import SideBarSales from '../Basics/SideBarSales';
import { getCookie, hasCookie } from 'cookies-next';
import Tabs from '../DMS/Tabs/Tabs';
import { setSidebarColor, setTopNavColor, setbuttonColor } from '../../store/themeSlice';

const Layout = ({Component, pageProps}) => {
    const userLogin = useSelector((state) => state.userLogin.value);
    const permission = useSelector((state) => state.permissionMode.value);
    const theme = useSelector((state) => state.themeMode);
    const allowedpermission = useSelector((state) => state.permissionMode.allowedPermissions );
    const isLoading=useSelector((state)=>state.loader.isLoading)
    const dispatch = useDispatch()
    const [showBasic, setShowBasic] = useState(false)
    const [sidebarMode,setSidebarMode]=useState('') 
    const [allowedPermissions,setAllowedPermissions]=useState([])
    const [topnavPermission,setTopnavPermission]=useState("")
    const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
   
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

    const checkColor=()=> {
      if(hasCookie("clientLogo")){
        const data = JSON.parse(getCookie("clientLogo"))
        dispatch(setSidebarColor(data.sidebar_color))
        dispatch(setbuttonColor(data.button_color))
        dispatch(setTopNavColor(data.button_color))
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

      useEffect(()=>{
        checkColor()
      },[])

  return (
    <>
       {
              isLoading ? <Loader /> :
            
              <>
              {showBasic ?
         
              <main className="main_wrapper" 
                style={{
                  marginTop:hasCookie("channel") ? "0px":"-70px"
                }}
              >
                
                <Topnav allowedPermissions={allowedPermissions} topnavPermission={topnavPermission} />
            
                  <div className="content_wrapper">
                      {sidebarMode==="crm" && <SideBar />}
                      {sidebarMode==="dms" && <SidebarDMS/> }
                      {/* {sidebarMode==="channel" && <SideBarChannel    />} */}
                      {sidebarMode==="sales" && <SideBarSales    />}
                      <Component {...pageProps} />
                  </div>
                  </main>

            : 
            <>
           
                <Component {...pageProps} />
             
            </>
            }
      </>
    }
            <style jsx global>{`
                .btn-primary {
                    background-color: ${theme.buttons} !important;
                    border: none;
                }

                .sideWrapper  .bar_icon  {
                  background-color: ${theme.side} !important;
                }

                .sideWrapper  {
                  background-color: ${theme.side} !important;
                }

                .sideWrapper .icon {
                  background-color: ${theme.side} !important;
                }

                .image_sec{
                  background-color: ${theme.side} !important;
                }

                .img_box svg path {
                  fill: ${theme.side} !important;
                }

                .card_wrapper .icons svg path {
                  fill: ${theme.side} !important;
                }

                .card_wrapper {
                  border: 1px solid ${theme.side} !important;
                }

                .main_wrapper .content_wrapper .main_Box .main_content.admin_dashboard .settings_super_admin .settings_cards .card_Wrapper{
                  border: 1px solid ${theme.side} !important;
                }

                .main_wrapper .topNav_Wrapper .top_nav .profile_sec .quick_add_sec .dropdown-menu , .main_wrapper .topNav_Wrapper .top_nav .profile_sec .quick_add_sec .dropdown-menu .quickaddlist::before,
                .main_wrapper .topNav_Wrapper .top_nav .profile_sec .quick_add_sec .dropdown-menu .quickpermissionlist::before{
                  background-color:  ${theme.buttons} !important;
                }

                
                .main_wrapper .content_wrapper .main_Box .main_content.admin_dashboard .admin_setings_lists .card_wrapper .card_lists .settings_list .list_item::before {
                  border-left: 2px solid ${theme.side} !important;
                  border-bottom: 2px solid ${theme.side} !important;
                }

                .top_nav{
                  background-color: ${theme.topnav} !important;
                }

                .channelTable .MuiPaper-root div .MuiTable-root .MuiTableHead-root .MuiTableRow-root .MuiTableCell-root {
                  background-color: ${clientBtnColor} !important;
                  color: white !important;
                  text-wrap: nowrap !important;
                }


            `}</style>
    
    </>
  
  )
}

export default Layout


