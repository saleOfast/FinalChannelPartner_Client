import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import EstimationScreen from '../../Components/MEDIA/EstimationScreen/EstimationScreen';

function EstimationManagement() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'EstimationManagement')
        dispatch(setIsActive('EstimationManagement'))
    }, []);
    return (
        <>
            <EstimationScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(EstimationScreen);