import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import TempMgmtScreen from "../Components/TemplateManagement/TempMgmtScreen";

export default WithUserhoc_COMMON (function TemplateManagement() 
{
  const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'TemplateManagement')
        dispatch(setIsActive('TemplateManagement'))
    }, [dispatch]);
  return (
    <>
        <TempMgmtScreen/>
    </>
  );
})
