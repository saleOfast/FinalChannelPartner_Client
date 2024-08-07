import AddPrintingCostScreen from '../../Components/MEDIA/PrintingCostManagementScreens/AddPrintingCostScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

 function AddContact() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'PrintingCostMgmt')
        dispatch(setIsActive('PrintingCostMgmt'))
    }, []);
    return (
        <>
                    <AddPrintingCostScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(AddContact)