;
import { useDispatch } from "react-redux";
import AddPolicyType from "../Components/PolicyHead/AddPolicyType";
import withUser from "../HOC/WithUserhoc";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import { setIsActive } from "../store/isActiveSidebarSlice";

 function AddPolicyTypeScreen() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'product')
      dispatch(setIsActive('product'))
  }, []);
  return (
    <>
          <AddPolicyType/>
    </>
  );
}
export default withUser(AddPolicyTypeScreen)