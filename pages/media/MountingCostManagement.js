
import Taskscreens from '../../Components/TasksScreens/Taskscreens'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'
import MountingCostManagementScreens from '../../Components/MEDIA/MountingCostManagementScreens/MountingCostManagementScreen';

export default WithUserhoc_MEDIA( function MountingCostManagementScreen() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'MountingCostManagement')
        dispatch(setIsActive('MountingCostManagement'))
    }, [dispatch]);
    return (
        <>
                    <MountingCostManagementScreens />

        </>
    )
}
)