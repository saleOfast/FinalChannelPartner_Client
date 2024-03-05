import AddProfileScreen from '../Components/UserProfileManagementScreens/AddProfileScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

 function AddProfileManage() {
    const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'adminuser')
      dispatch(setIsActive('adminuser'))
  }, []);
    return (
        <>
                    <AddProfileScreen />
        </>
    )
}

export default withUser(AddProfileManage)
