import ManageTaxScreen from "../Components/TaxScreen/ManageTaxScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

export default withUser (function TaxScreen() {
  const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'taxManage')
        dispatch(setIsActive('taxManage'))
    }, []);
  return (
    <>
      
           <ManageTaxScreen />
      
    </>
  );
})
