import ParentScreen from "../Components/ParentManagement/ParentScreen";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from "../HOC/WithUserhoc";
import { setIsActive } from "../store/isActiveSidebarSlice";

export default withUser( function Parent() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'Parent')
      dispatch(setIsActive('Parent'))
  }, []);
  return (
    <>
      
          <ParentScreen/>
    
    </>
  );
})
