import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import ClosedWonOpportunitiesByOwnerScreen from '../../Components/ClosedWonOpportunitiesByOwner/ClosedWonOpportunitiesByOwnerScreen'



export default withUser( function ClosedWonOpportunitiesByRep() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <ClosedWonOpportunitiesByOwnerScreen />
        </>
    )
})
