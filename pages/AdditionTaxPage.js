import { useDispatch } from 'react-redux';
import AddTaxPage from '../Components/TaxScreen/AddTaxPage'
import withUser from '../HOC/WithUserhoc'
import { useEffect } from 'react';
import { setCookie } from 'cookies-next';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function AdditionTaxPage() {
    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'tasks')
        dispatch(setIsActive('tasks'))
    }, []);
    return (
        <>  
                    <AddTaxPage/>
        </>
    )
}

export default withUser(AdditionTaxPage)
