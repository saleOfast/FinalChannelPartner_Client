import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS';
import AddDistributorManagement from '../../Components/DMS_WEB/DistributorManagement/AddDistributorManagement';
function AddDistributor() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'DistributorManagement')
        dispatch(setIsActive('DistributorManagement'))
    }, []);
    return (
        <>
            <AddDistributorManagement/>
        </>
    )
}

export default WithUserhoc_DMS(AddDistributor);