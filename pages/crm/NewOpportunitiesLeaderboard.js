import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import NewOpportunitiesLeaderboardScreen from '../../Components/NewOpportunitiesLeaderboard/NewOpportunitiesLeaderboardScreen'

export default withUser( function NewOpportunitiesLeaderboard() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <NewOpportunitiesLeaderboardScreen />
        </>
    )
})
