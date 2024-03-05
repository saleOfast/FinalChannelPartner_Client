import AddParentScreen from "../Components/ParentManagement/AddParentScreen";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setCookie } from "cookies-next";
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

 function AddParent() {
  const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'product')
        dispatch(setIsActive('product'))
    }, []);
  return (
    <>
          <AddParentScreen />
    </>
  );
}

export default withUser(AddParent)