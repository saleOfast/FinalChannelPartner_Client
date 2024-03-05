import LeaveScreen from '../Components/LeaveApply/LeaveScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function Leave() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'HRProcess')
        dispatch(setIsActive('HRProcess'))
    }, []);
    return (
        <> 
                    <LeaveScreen/>
        </>
    )
})