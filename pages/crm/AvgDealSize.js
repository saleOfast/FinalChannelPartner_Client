import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../../HOC/WithUserhoc'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import AvgDealSizeScreen from '../../Components/AvgDealSize/AvgDealSizeScreen'

export default withUser( function AvgDealSize() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'report')
      dispatch(setIsActive('report'))
  }, [dispatch]);
    return (
        <>
                    <AvgDealSizeScreen />
        </>
    )
})
