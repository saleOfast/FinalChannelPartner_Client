import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import DailyActivityScreen from '../../Components/DailyActivity/DailyActivityScreen'

export default withUser(function DailyActivity() {
  const dispatch = useDispatch()
  useEffect(() => {
    setCookie('isActive', 'report')
    dispatch(setIsActive('report'))
  }, [dispatch]);
  return (
    <>
      <DailyActivityScreen />
    </>
  )
})
