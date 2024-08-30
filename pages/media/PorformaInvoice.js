import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import PerformaInvoiceScreen from '../../Components/MEDIA/EstimationScreen/PerformaInvoiceScreen';
import PerformaInvoiceScreen1 from '../../Components/MEDIA/EstimationScreen/PerformaInvoiceScreen1';


function PorformaInvoice() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'EstimationManagement')
        dispatch(setIsActive('EstimationManagement'))
    }, []);
    return (
        <>
            <PerformaInvoiceScreen/>
        </>
    )
}

export default WithUserhoc_MEDIA(PorformaInvoice);