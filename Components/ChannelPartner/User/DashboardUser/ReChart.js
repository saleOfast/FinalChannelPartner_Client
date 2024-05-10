import React from 'react'
import Charts from './Charts'


const ReChart = ({ head, dataList}) => {
    return (
        <>
                <div className="row pb-0">
                    <div className="col-xl-8 col-md-8 col-sm-6 col-6">
                        <div className='fw-bold fs-5'>
                        {head}
                        </div>
                        <div className="pieChart pt-5">
                            <Charts 
                             dataList={dataList}
                            />
                        </div>
                    </div>
                    <div className="col-xl-4 col-md-4 col-sm-6 col-6">
                        <div className="detail_sec">
                            <div className="head_text opacity-0" style={{fontSize:"20px"}}>{head}</div>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ReChart