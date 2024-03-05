import AddExpenseScreen from '../Components/ExpenseScreens/AddExpenseScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

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

export default withUser(ApplyExpense)
