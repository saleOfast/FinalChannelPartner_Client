import withUser from "../HOC/WithUserhoc";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";
import ManagebrandScreen from "../Components/Managebrand/ManagebrandScreen";
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function Managebrand() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'managebrand')
      dispatch(setIsActive('managebrand'))
  }, [dispatch]);
  return (
    <>
        <ManagebrandScreen />
    </>
  );
})
