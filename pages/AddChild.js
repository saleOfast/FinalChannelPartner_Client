import Head from "next/head";

import SideBar from "../Components/Basics/SideBar";
import Topnav from "../Components/Basics/Topnav";
import AddChildScreen from "../Components/ChildManagement/AddChildScreen";
import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { setCookie } from "cookies-next";
import { useEffect } from "react";
import { setIsActive } from '../store/isActiveSidebarSlice'


 function AddChild() {

   const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'Child')
        dispatch(setIsActive('Child'))
    }, []);
  return (
    <>
     
          
          <AddChildScreen/>
        
    </>
  );
}

export default withUser(AddChild);
