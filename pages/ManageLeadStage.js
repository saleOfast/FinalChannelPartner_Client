import { useDispatch } from 'react-redux';
import ManageLeadStageScreen from '../Components/ManageLeadStage/ManageLeadStageScreen'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';
import withUser from '../HOC/WithUserhoc';
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"


export default WithUserhoc_COMMON (function ManageLeadStage() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, [dispatch]);
  return (
    <>
        <ManageLeadStageScreen/> 
    </>
  )
})
