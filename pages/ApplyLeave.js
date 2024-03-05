import AddLeave from '../Components/LeaveApply/AddLeave'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

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
export default withUser(ApplyLeave)
