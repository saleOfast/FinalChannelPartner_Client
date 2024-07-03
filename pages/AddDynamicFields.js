
import AddDynamicFieldScreen from '../Components/AddFields/AddDynamicFieldScreen'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { useDispatch } from 'react-redux'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"

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

export default WithUserhoc_COMMON(AddDynamicFields)
