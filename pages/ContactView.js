import ContactViewScreen from '../Components/ContactScreens/ContactViewScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import withUser from '../HOC/WithUserhoc';
import { setIsActive } from '../store/isActiveSidebarSlice';

 function ContactView() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'contact')
      dispatch(setIsActive('contact'))
  }, []);
  return (
    <>
     
          <ContactViewScreen/>
  
    </>
  )
}
export default withUser(ContactView)