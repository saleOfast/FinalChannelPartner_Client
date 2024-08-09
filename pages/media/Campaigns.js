import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import CampaignScreen from '../../Components/MEDIA/CampaignScreens/CampaignScreen';

function Campaigns() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'Campaigns')
        dispatch(setIsActive('Campaigns'))
    }, []);
    return (
        <>
            <CampaignScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(Campaigns);