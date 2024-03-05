import ManageDesignationScreen from '../Components/ManageDesignationScreen/ManageDesignationScreen'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { useDispatch } from 'react-redux';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

export default withUser (function ManageDesignation() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'organization')
      dispatch(setIsActive('organization'))
  }, []);
  return (
    <>
          <ManageDesignationScreen/>
    </>
  )
})
