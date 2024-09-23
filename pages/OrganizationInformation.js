import ManageOrgInfoScreen from '../Components/ManageOrgInfoScreen/ManageOrgInfoScreen'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { useDispatch } from 'react-redux';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function OrganizationInformation() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'organization')
      dispatch(setIsActive('organization'))
  }, [dispatch]);
  return (
    <>
          <ManageOrgInfoScreen/>
    </>
  )
})
