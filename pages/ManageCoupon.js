import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";
import ManageCouponScreen from "../Components/ManageCoupon/ManageCouponScreen";

export default withUser (function ManageCoupon() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'managebrand')
      dispatch(setIsActive('managebrand'))
  }, [dispatch]);
  return (
    <>
        <ManageCouponScreen />
    </>
  );
})
