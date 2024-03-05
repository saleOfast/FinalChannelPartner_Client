import AddQuotationScreen from '../Components/QuotationScreens/AddQuotationScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


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

export default withUser(AddQuotations)
