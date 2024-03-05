
import ManageTaskStatusScreen from '../Components/TaskStatus/ManageTaskStatusScreen'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import withUser from '../HOC/WithUserhoc'
import { setIsActive } from '../store/isActiveSidebarSlice'

export default withUser (function ManageTaskStatus() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'taskManage')
      dispatch(setIsActive('taskManage'))
  }, []);
  return (
    <>
          <ManageTaskStatusScreen/>
    </>
  )
})
