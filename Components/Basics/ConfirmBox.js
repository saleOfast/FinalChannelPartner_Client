import React, { useState } from 'react'

const ConfirmBox = ({ title, setshowConfirm, showConfirm, actionType, }) => {
    return (

        <>
            {showConfirm ? <div className="confirmBox">
                <div className="main-box-inside">
                    <div className="text-head">{title}</div>
                    <div className="btn-row">
                        <button className="btn btn-grey me-3" onClick={() => setshowConfirm(!showConfirm)}> Cancel </button>
                        <button className="btn btn-primary" onClick={actionType}> Confirm </button>
                    </div>
                </div>
            </div> : null}
        </>
    )
}

export default ConfirmBox
