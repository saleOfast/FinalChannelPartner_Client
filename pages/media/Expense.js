
import ExpenseScreen from '../../Components/ExpenseScreens/ExpenseScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import WithUserhoc_MEDIA from '../../HOC/WithUserhoc_MEDIA';
import { setIsActive } from '../../store/isActiveSidebarSlice';
import { setCookie } from 'cookies-next';

 function Expense() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'expense')
        dispatch(setIsActive('expense'))
    }, [dispatch]);
    return (
        <>
         
                    <ExpenseScreen />
 
        </>
    )
}
export default WithUserhoc_MEDIA(Expense)
