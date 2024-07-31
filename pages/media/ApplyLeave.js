import AddLeave from '../../Components/LeaveApply/AddLeave'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

 function ApplyLeave() {
        const dispatch = useDispatch()
        useEffect(() => {
            setCookie('isActive', 'HRProcess')
            dispatch(setIsActive('HRProcess'))
        }, []);
    return (
        <>
                    <AddLeave/>  
        </>
    )
}
export default WithUserhoc_MEDIA(ApplyLeave)
