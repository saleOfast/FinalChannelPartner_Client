import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import AddEstimationScreen from '../../Components/MEDIA/EstimationScreen/AddEstimationScreen';


function AddEstimations() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'EstimationManagement')
        dispatch(setIsActive('EstimationManagement'))
    }, []);
    return (
        <>
            <AddEstimationScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(AddEstimations);