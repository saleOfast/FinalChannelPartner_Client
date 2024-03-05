import ManageAddProfileScreen from "../Components/ProfilePerManagement/ManageAddProfileScreen";
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

export default withUser (function ProfilePermissionManagement() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ProfilePermissionManagement')
      dispatch(setIsActive('ProfilePermissionManagement'))
  }, []);
  return (

    <>
     
          <ManageAddProfileScreen />
  
    </>
  )
})