import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import TargetVsAchievementScreen from '../Components/TargetVsAchievement/TargetVsAchievementScreen'

export default withUser(function TargetVsAchievement() {
  const dispatch = useDispatch()
  useEffect(() => {
    setCookie('isActive', 'report')
    dispatch(setIsActive('report'))
  }, [dispatch]);
  return (
    <>
      <TargetVsAchievementScreen />
    </>
  )
})
