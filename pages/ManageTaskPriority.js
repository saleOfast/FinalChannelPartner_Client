
import ManageTaskPriorityScreen from '../Components/TaskPriority/ManageTaskPriorityScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'


export default withUser (function ManageTaskPriority() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'taskManage')
      dispatch(setIsActive('taskManage'))
  }, []);
  return (
    <>
     
         
          <ManageTaskPriorityScreen/>
    
    </>
  )
})