import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageCampaignStatusScreen from '../Components/ManageCampaignStatus/ManageCampaignStatusScreen'



export default WithUserhoc_COMMON (function CampaignStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'CampaignStatus')
      dispatch(setIsActive('CampaignStatus'))
  }, [dispatch]);
  return (
    <>

          <ManageCampaignStatusScreen/>
     
    </>
  )
})
