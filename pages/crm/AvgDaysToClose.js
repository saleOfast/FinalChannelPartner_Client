import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import AvgDaysToCloseScreen from '../../Components/AvgDaysToClose/AvgDaysToCloseScreen'

export default withUser( function AvgDaysToClose() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <AvgDaysToCloseScreen />
        </>
    )
})
