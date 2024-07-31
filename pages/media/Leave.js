import LeaveScreen from '../../Components/LeaveApply/LeaveScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

export default WithUserhoc_MEDIA (function Leave() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'HRProcess')
        dispatch(setIsActive('HRProcess'))
    }, [dispatch]);
    return (
        <> 
                    <LeaveScreen/>
        </>
    )
})