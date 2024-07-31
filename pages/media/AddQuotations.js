import AddQuotationScreen from '../../Components/QuotationScreens/AddQuotationScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'


 function AddQuotations() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'quotation')
        dispatch(setIsActive('quotation'))
    }, []);
    return (
        <>
                    <AddQuotationScreen/>
        </>
    )
}

export default WithUserhoc_MEDIA(AddQuotations)
