import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import OpportunitiesByAccountScreen from '../../Components/OpportunitiesByAccount/OpportunitiesByAccountScreen'



export default withUser( function OpportunitiesByAccount() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <OpportunitiesByAccountScreen />
        </>
    )
})
