import { useDispatch } from 'react-redux';
import ManageLeadSourceScreen from '../Components/ManageLeadSource/ManageLeadSourceScreen'
import withUser from '../HOC/WithUserhoc';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function ManageLeadSource() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, [dispatch]);
  return (
    <>
          <ManageLeadSourceScreen/>
    </>
  )
})
