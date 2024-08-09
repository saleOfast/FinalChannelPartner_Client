import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { setCookie } from 'cookies-next'
import { setIsActive } from '../store/isActiveSidebarSlice'
import WithUserhoc_COMMON from "../HOC/WithUserhoc_COMMON"
import ManageProofOfConfirmationScreen from '../Components/ManageProofOfConfirmation/ManageProofOfConfirmationScreen'



export default WithUserhoc_COMMON (function ProofOfConfirmation() {
  const dispatch = useDispatch()
  useEffect(() => {
      setCookie('isActive', 'ProofOfConfirmation')
      dispatch(setIsActive('ProofOfConfirmation'))
  }, [dispatch]);
  return (
    <>

          <ManageProofOfConfirmationScreen/>
     
    </>
  )
})
