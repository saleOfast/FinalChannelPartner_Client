import { useDispatch } from 'react-redux';
import AddSitesScreen from '../../Components/MEDIA/SiteManagementScreen/AddSitesScreen';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';

 function AddSites() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'sites')
        dispatch(setIsActive('sites'))
    }, []);
    return (
        <>
            <AddSitesScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(AddSites)
