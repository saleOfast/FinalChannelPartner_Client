import React from 'react'
import DmsHOC from "../../HOC/DmsHOC";
import OnboradingProcessScreen from '../../Components/DMS_WEB/OnboradingProcessScreen/OnboradingProcessScreen';

const DistributorOnboardingProcess = () => {
  return (
    <>
        <OnboradingProcessScreen/>
    </>
  )
}

export default DmsHOC(DistributorOnboardingProcess) 