import React from 'react'
import Charts1 from './Charts1'


const ReChart1 = ({ head, dataList, keyX='lead', keyY='booking'}) => {
    return (
        <>
                 <div className="row pb-0">
                 <div className=' fw-bold fs-5'  >
                        {head}
                        </div>
                    <div className="col-xl-8 col-md-8 col-sm-6 col-6">
                   
                        <div className="pieChart pt-5">
                            
                            <Charts1 
                                keyX={keyX}
                                keyY={keyY}
                                dataList={dataList}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-4 col-sm-6 col-6 w-0 " style={{maxWidth:"150px"}}>
                        <div className="detail_sec">
                            <div className="head_text opacity-0 " style={{fontSize:"20px"}}>{head}</div>
                        </div>
                    </div>
            </div>
        </>
    )
}

export default ReChart1


