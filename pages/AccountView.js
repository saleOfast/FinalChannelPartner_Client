import AccountViewScreen from '../Components/AccountScreens/AccountViewScreen'
import withUser from '../HOC/WithUserhoc'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'

function AccountView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'account')
      dispatch(setIsActive('account'))
  }, []);
  return (
    <>
          <AccountViewScreen/>
    </>
  )
}

export default withUser(AccountView);
