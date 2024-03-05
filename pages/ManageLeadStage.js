import { useDispatch } from 'react-redux';
import ManageLeadStageScreen from '../Components/ManageLeadStage/ManageLeadStageScreen'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';
import withUser from '../HOC/WithUserhoc';

export default withUser (function ManageLeadStage() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, []);
  return (
    <>
        <ManageLeadStageScreen/> 
    </>
  )
})
