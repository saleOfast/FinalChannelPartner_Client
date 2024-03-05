import AttendenceScreen from '../Components/AttendenceScreens/AttendenceScreen'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function Attendence() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'HRProcess')
        dispatch(setIsActive('HRProcess'))
    }, []);
    return (
        <>
                    <AttendenceScreen/>
        </>
    )
}
export default withUser(Attendence)
