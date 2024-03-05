import AccountTypeScreen from "../Components/AccountTypePage/AccountTypeScreen";
import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";

export default withUser (function ManageAccountType() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'accountManage')
      dispatch(setIsActive('accountManage'))
  }, []);
  return (
    <>
          <AccountTypeScreen />
    </>
  );
})
