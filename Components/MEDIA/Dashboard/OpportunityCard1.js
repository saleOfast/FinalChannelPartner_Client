import React from 'react'
import RevenueChart1 from './RevenueChart1'


const OpportunityCard1 = ({ head, price, date, img , dataList}) => {
    return (
        <>
            <div className="dash_card opportunity">
                <div className="row pb-0">
                <div className="detail_sec">
                            <div className="head_text">{head}</div>
                            
                        </div>
                    <div className="col-xl-12 col-md-12 col-sm-6 col-6">
                        <div className="pieChart">
                            <RevenueChart1 
                             dataList={dataList}
                            />
                        </div>
                    </div>
                    {/* <div className="col-xl-4 col-md-4 col-sm-6 col-6">
                        <div className="detail_sec">
                            <div className="head_text">{head}</div>
                            {price != '0' ?
                            <div className="price">&#8377; {price}</div> : <></>}
                            <div className="date">{date}</div>
                        </div>
                    </div> */}
                </div>
                <div>
                    
                </div>
            </div>
        </>
    )
}

export default OpportunityCard1