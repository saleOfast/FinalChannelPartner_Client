import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS';
import InventoryManagementScreen from '../../Components/DMS_WEB/InventoryManagement/InventoryManagementScreen';
function InventoryManagement() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'InventoryManagement')
        dispatch(setIsActive('InventoryManagement'))
    }, []);
    return (
        <>
            <InventoryManagementScreen/>
        </>
    )
}

export default WithUserhoc_DMS(InventoryManagement);