import ChildScreen from "../Components/ChildManagement/ChildScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

 function ChildManagement() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ChildScreen')
      dispatch(setIsActive('ChildScreen'))
  }, []);
  return (
    <>
          <ChildScreen />
    </>
  );
}

export default withUser(ChildManagement)
