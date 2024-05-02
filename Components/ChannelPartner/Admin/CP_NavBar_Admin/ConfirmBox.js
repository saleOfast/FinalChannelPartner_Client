import { getCookie, hasCookie } from 'cookies-next'
import React, { useState } from 'react'

const ConfirmBox = ({ title, setshowConfirm, showConfirm, actionType, }) => {
  const clientBtnColor=hasCookie("clientBtnColor") ? getCookie("clientBtnColor") : "#293790"
    return (

        <>
            {showConfirm ? <div className="confirmBox">
                <div className="main-box-inside">
                    <div className="text-head">{title}</div>
                    <div className="btn-row">
                    <button className="btn btn-danger rounded-3 me-3" onClick={() => setshowConfirm(!showConfirm)}> Cancel </button>
                        <button className="btn text-white"  style={{background:clientBtnColor}} onClick={actionType}> Confirm </button>
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ConfirmBox
