import React from 'react'
import DmsHOC from '../../HOC/DmsHOC'
import DistributorRegister_NextScreen from '../../Components/DMS_WEB/DistributorRegister/DistributorRegister_NextScreen'

const DistributorRegister_Next = () => {
  return (
    <>
        <DistributorRegister_NextScreen/>
    </>
  )
}

export default DmsHOC(DistributorRegister_Next)