import AccountTypeScreen from "../Components/AccountTypePage/AccountTypeScreen";
import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function ManageAccountType() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'accountManage')
      dispatch(setIsActive('accountManage'))
  }, [dispatch]);
  return (
    <>
          <AccountTypeScreen />
    </>
  );
})
