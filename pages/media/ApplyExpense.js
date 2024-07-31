import AddExpenseScreen from '../../Components/ExpenseScreens/AddExpenseScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice'

 function ApplyExpense() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'expense')
        dispatch(setIsActive('expense'))
    }, []);
    return (
        <>
                    <AddExpenseScreen />
              
        </>
    )
}

export default WithUserhoc_MEDIA(ApplyExpense)
