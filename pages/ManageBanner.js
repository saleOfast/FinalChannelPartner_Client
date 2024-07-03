import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";
import ManagebannerScreen from "../Components/ManageBanners/Managebannercreen";
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

export default WithUserhoc_COMMON (function Managebanner() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'managebrand')
      dispatch(setIsActive('managebrand'))
  }, [dispatch]);
  return (
    <>
        <ManagebannerScreen />
    </>
  );
})
