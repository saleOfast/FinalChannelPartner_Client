import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS';
import AddInventoryManagement from '../../Components/DMS_WEB/InventoryManagement/AddInventoryManagement';
function AddInventory() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'InventoryManagement')
        dispatch(setIsActive('InventoryManagement'))
    }, []);
    return (
        <>
            <AddInventoryManagement/>
        </>
    )
}

export default WithUserhoc_DMS(AddInventory);