import ViewUserScreens from '../Components/AdminScreens/ViewUserScreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


export default withUser( function ViewUsers() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'leads')
        dispatch(setIsActive('leads'))
    }, []);
    return (
        <>
                    <ViewUserScreens />
        </>
    )
})
