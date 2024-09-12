import { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_DMS from '../../HOC/WithUserhoc_DMS';
import PendingApprovalInfoScreen from '../../Components/DMS_WEB/PendingApprovalManagement/PendingApprovalInfoScreen';
function PendingApprovals() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'DistributorManagement')
        dispatch(setIsActive('DistributorManagement'))
    }, []);
    return (
        <>
            <PendingApprovalInfoScreen/>
        </>
    )
}

export default WithUserhoc_DMS(PendingApprovals);