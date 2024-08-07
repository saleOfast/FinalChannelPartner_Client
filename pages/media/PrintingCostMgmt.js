import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA.js';
import { setIsActive } from '../../store/isActiveSidebarSlice.js'
import PrintingCostMgmtScreen from '../../Components/MEDIA/PrintingCostManagementScreens/PrintingCostMgmtScreen.js';

 function PrintingCostMgmt() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'PrintingCostMgmt')
        dispatch(setIsActive('PrintingCostMgmt'))
    }, []);
    return (
        <>
                    <PrintingCostMgmtScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(PrintingCostMgmt)
