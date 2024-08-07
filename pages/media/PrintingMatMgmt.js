import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA.js';
import { setIsActive } from '../../store/isActiveSidebarSlice.js'
import PrintingMatMgmtScreen from '../../Components/MEDIA/PrintingMaterialManagementScreens/PrintingMatMgmtScreen.js';

 function PrintingMatMgmt() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'PrintingMatMgmt')
        dispatch(setIsActive('PrintingMatMgmt'))
    }, []);
    return (
        <>
                    <PrintingMatMgmtScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(PrintingMatMgmt)
