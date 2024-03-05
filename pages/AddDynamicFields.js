
import AddDynamicFieldScreen from '../Components/AddFields/AddDynamicFieldScreen'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

 function AddDynamicFields() {

    const dispatch = useDispatch()
    useEffect(() => {
        setCookie('isActive', 'dynamicFields')
        dispatch(setIsActive('dynamicFields'))
    }, []);
    return (
        <>
            
                    <AddDynamicFieldScreen />
               
        </>
    )
}

export default withUser(AddDynamicFields)
