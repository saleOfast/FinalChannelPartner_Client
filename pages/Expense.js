
import ExpenseScreen from '../Components/ExpenseScreens/ExpenseScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';
import { setCookie } from 'cookies-next';

 function Expense() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'expense')
        dispatch(setIsActive('expense'))
    }, []);
    return (
        <>
         
                    <ExpenseScreen />
 
        </>
    )
}
export default withUser(Expense)
