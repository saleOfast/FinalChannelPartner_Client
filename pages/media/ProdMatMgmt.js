import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'
import ProdMatMgmtScreen from '../../Components/MEDIA/ProductMaterialManagementScreens/ProdMatMgmtScreen.js';

 function ProdMatMgmt() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'ProdMatMgmtScreen')
        dispatch(setIsActive('ProdMatMgmtScreen'))
    }, []);
    return (
        <>
                    <ProdMatMgmtScreen />
        </>
    )
}

export default WithUserhoc_MEDIA(ProdMatMgmt)
