import AttendenceScreen from '../../Components/AttendenceScreens/AttendenceScreen'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice';

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
export default WithUserhoc_MEDIA(Attendence)
