import React from 'react'
import BasicRangeShortcuts from '../../DateRangeCustom/Daterange'

const DashBoardScreenCHANNEL = () => {
  return (
    <div className='ps-4 pe-4 w-100' >
        <section className="Reports-Dashboard w-100 "  >
  <div className="container">
    <div className="row">
      <div className="col-12">
        <div className="vh-100 d-flex flex-column justify-content-between">
          <img src="/ChannelPartner/dashboard.PNG" alt className="w-100" />
          <img src="/ChannelPartner/dashboard-bottom.PNG" alt className="w-100" />
        </div>
      </div>
    </div>
  </div>
  <BasicRangeShortcuts />
</section>

    </div>
  )
}

export default DashBoardScreenCHANNEL