import ManageLeadIndustryScreen from '../Components/ManageLeadIndustry/ManageLeadIndustryScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function ManageLeadIndustry() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'leadManage')
      dispatch(setIsActive('leadManage'))
  }, []);
  return (
    <>
    
          <ManageLeadIndustryScreen/>
     
    </>
  )
})
