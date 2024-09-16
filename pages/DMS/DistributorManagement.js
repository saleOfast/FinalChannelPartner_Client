import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS';
import DistributorManagementScreen from '../../Components/DMS_WEB/DistributorManagement/DistributorManagementScreen';
function DistributorManagement() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'DistributorManagement')
        dispatch(setIsActive('DistributorManagement'))
    }, []);
    return (
        <>
            <DistributorManagementScreen/>
        </>
    )
}

export default WithUserhoc_DMS(DistributorManagement);