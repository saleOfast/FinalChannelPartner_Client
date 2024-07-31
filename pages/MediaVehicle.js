import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageMediaVehicleScreen from '../Components/ManageMediaVehicle/ManageMediaVehicleScreen'


export default WithUserhoc_COMMON (function MediaVehicle() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'MediaVehicle')
      dispatch(setIsActive('MediaVehicle'))
  }, [dispatch]);
  return (
    <>
    
          <ManageMediaVehicleScreen/>
     
    </>
  )
})
