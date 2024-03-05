import React from 'react'
import RevenueChart from '../../pages/RevenueChart'

const OpportunityCard = ({ head, price, date, img , dataList}) => {
    return (
        <>
            <div className="dash_card opportunity">
                <div className="row pb-0">
                    <div className="col-xl-6 col-md-6 col-sm-6 col-6">
                        <div className="pieChart">
                            <RevenueChart 
                             dataList={dataList}
                            />
                        </div>
                    </div>
                    <div className="col-xl-6 col-md-6 col-sm-6 col-6">
                        <div className="detail_sec">
                            <div className="head_text">{head}</div>
                            {price != '0' ?
                            <div className="price">&#8377; {price}</div> : <></>}
                            <div className="date">{date}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OpportunityCard