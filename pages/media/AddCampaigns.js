import { useDispatch } from 'react-redux'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../../store/isActiveSidebarSlice'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { useEffect } from 'react'
import AddCampaignScreen from '../../Components/MEDIA/CampaignScreens/AddCampaignScreen';

function AddCampaigns() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'Campaigns')
        dispatch(setIsActive('Campaigns'))
    }, []);
    return (
        <>
            <AddCampaignScreen />   
        </>
    )
}

export default WithUserhoc_MEDIA(AddCampaigns);